import { euclidianDistance } from "./functions/euclidianDistance.js";

// Define a class for the wire object
class Wire {
    constructor(start, end, nodeRadius, nodeColor) {
        this.id = lastWireId + 1
        this.start = start;
        this.end = end;
        this.nodeRadius = nodeRadius;
        this.nodeColor = nodeColor;
        this.nodeConnected = {
            start: false,
            end: false,
            startId: null,
            endId: null
        }
        this.draggingNode = {
            start: false,
            end: false
        };
        this.isDraggingWire = false;
        this.threshold = 3;
        this.offset = {
            x: 0,
            y: 0
        };
        lastWireId = this.id
    }

    draw(ctx) {
        // Set the line color and width
        ctx.strokeStyle = this.nodeColor;
        ctx.lineWidth = 2;

        // Start drawing the wire
        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.stroke();

        // Draw the nodes
        ctx.beginPath();
        ctx.arc(this.start.x, this.start.y, this.nodeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = this.nodeColor;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.end.x, this.end.y, this.nodeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = this.nodeColor;
        ctx.fill();
    }

    // Check if a node is being dragged
    checkDraggingNode(mousePosition) {
        const startDist = euclidianDistance(mousePosition, this.start);
        const endDist = euclidianDistance(mousePosition, this.end);

        if (startDist <= this.nodeRadius) {
            this.draggingNode.start = true;
        } else if (endDist <= this.nodeRadius) {
            this.draggingNode.end = true;
        }
    }

    // Check if the wire is being dragged
    checkDraggingWire(mousePosition) {
        const dx = this.end.x - this.start.x;
        const dy = this.end.y - this.start.y;
        const distance = Math.abs(dy * mousePosition.x - dx * mousePosition.y + this.end.x * this.start.y - this.end.y * this.start.x) / Math.sqrt(dy * dy + dx * dx);
        if (distance <= this.nodeRadius) {
            this.isDraggingWire = true;
            this.offset.x = mousePosition.x - this.start.x;
            this.offset.y = mousePosition.y - this.start.y;
        }
    }

    // Update the wire position while dragging
    updatePosition(mousePosition) {
        if (this.draggingNode.start) {
            this.start.x = mousePosition.x;
            this.start.y = mousePosition.y;

            // Check if the start node is close to a terminal
            if (this.isNodeCloseToTerminal(this.start)) {
                if (!this.nodeConnected.start) {
                    this.connectToTerminal(this.start, 'start');
                } else {
                    this.disconnectFromTerminal();
                }
            }

            // Check if the start node is close to the switch
            if (this.isNodeCloseLightSwitch(this.start)) {
                if (!this.nodeConnected.start) {
                    this.connectToLightSwitch(this.start, 'start');
                } else {
                    this.disconnectFromLightSwitch(this.start);
                }

                // Check if the start node is close to the lamp
            } else if (this.isNodeCloseToLamp(this.start)) {
                if (!this.nodeConnected.start) {
                    this.connectToLamp(this.start, 'start');
                } else {
                    this.disconnectFromLamp(this.start);
                }

            }
        } else if (this.draggingNode.end) {
            this.end.x = mousePosition.x;
            this.end.y = mousePosition.y;

            // Check if the end node is close to a terminal
            if (this.isNodeCloseToTerminal(this.end)) {
                if (!this.nodeConnected.end) {
                    this.connectToTerminal(this.end, 'end');
                } else {
                    this.disconnectFromTerminal();
                }
            }

            if (this.isNodeCloseLightSwitch(this.end)) {
                if (!this.nodeConnected.end) {
                    this.connectToLightSwitch(this.end, 'end');
                } else {
                    this.disconnectFromLightSwitch(this.end);
                }
            }

            // Check if the end node is close to the lamp
            if (this.isNodeCloseToLamp(this.end)) {
                if (!this.nodeConnected.end) {
                    this.connectToLamp(this.end, 'end');
                } else {
                    this.disconnectFromLamp(this.end);
                }
            }
        } else if (this.isDraggingWire && !(this.nodeConnected.start || this.nodeConnected.end)) {
            const dx = mousePosition.x - this.offset.x - this.start.x;
            const dy = mousePosition.y - this.offset.y - this.start.y;
            this.start.x += dx;
            this.start.y += dy;
            this.end.x += dx;
            this.end.y += dy;
            this.offset.x = mousePosition.x - this.start.x;
            this.offset.y = mousePosition.y - this.start.y;
        }
    }

    // Check if a node is close to a terminal
    isNodeCloseToTerminal(nodePosition) {
        // Calculate the distance between the node and each terminal
        const phaseDist = euclidianDistance(nodePosition, phaseTerminal);
        const neutralDist = euclidianDistance(nodePosition, neutralTerminal);
        const groundDist = euclidianDistance(nodePosition, groundTerminal);

        // Check if any distance is below the threshold
        return phaseDist <= this.threshold || neutralDist <= this.threshold || groundDist <= this.threshold;
    }

    // Connect a node to a terminal
    connectToTerminal(nodePosition, nodeType) {
        // Check if the node is close to the phase terminal
        const phaseDist = euclidianDistance(nodePosition, phaseTerminal);
        if (!phaseTerminal.connected && phaseDist <= this.threshold && this.nodeColor === phaseTerminal.color) {
            phaseTerminal.connected = true;
            if (nodeType === 'start') {
                this.start.x = phaseTerminal.x;
                this.start.y = phaseTerminal.y;
                this.nodeConnected.start = true;
                this.nodeConnected.startId = phaseTerminal.id;
            } else if (nodeType === 'end') {
                this.end.x = phaseTerminal.x;
                this.end.y = phaseTerminal.y;
                this.nodeConnected.end = true;
                this.nodeConnected.endId = phaseTerminal.id;

            }
            this.resetDraggingNode();
        }
        // Check if the node is close to the neutral terminal
        const neutralDist = euclidianDistance(nodePosition, neutralTerminal);
        if (!neutralTerminal.connected && neutralDist <= this.threshold && this.nodeColor === neutralTerminal.color) {
            neutralTerminal.connected = true;
            if (nodeType === 'start') {
                this.start.x = neutralTerminal.x;
                this.start.y = neutralTerminal.y;
                this.nodeConnected.start = true;
                this.nodeConnected.startId = neutralTerminal.id;

            } else if (nodeType === 'end') {
                this.end.x = neutralTerminal.x;
                this.end.y = neutralTerminal.y;
                this.nodeConnected.end = true;
                this.nodeConnected.endId = neutralTerminal.id;

            }
            this.resetDraggingNode();
        }

        // Check if the node is close to the ground terminal
        const groundDist = euclidianDistance(nodePosition, groundTerminal);
        if (!groundTerminal.connected && groundDist <= this.threshold && this.nodeColor === groundTerminal.color) {
            groundTerminal.connected = true;
            if (nodeType === 'start') {
                this.start.x = groundTerminal.x;
                this.start.y = groundTerminal.y;
                this.nodeConnected.start = true;
                this.nodeConnected.startId = groundTerminal.id;

            } else if (nodeType === 'end') {
                this.end.x = groundTerminal.x;
                this.end.y = groundTerminal.y;
                this.nodeConnected.end = true;
                this.nodeConnected.endId = groundTerminal.id;

            }
            this.resetDraggingNode();
        }
                    console.log(this)

    }

    // Disconnect a node from a terminal
    disconnectFromTerminal() {
        if (this.draggingNode.start && this.nodeConnected.start) {
            this.nodeConnected.start = false;
            if (this.nodeColor === phaseTerminal.color) {
                phaseTerminal.connected = false;
            } else if (this.nodeColor === neutralTerminal.color) {
                neutralTerminal.connected = false;
            } else if (this.nodeColor === groundTerminal.color) {
                groundTerminal.connected = false;
            }

        }
        if (this.draggingNode.end && this.nodeConnected.end) {
            this.nodeConnected.end = false;
            if (this.nodeColor === phaseTerminal.color) {
                phaseTerminal.connected = false;
            } else if (this.nodeColor === neutralTerminal.color) {
                neutralTerminal.connected = false;
            } else if (this.nodeColor === groundTerminal.color) {
                groundTerminal.connected = false;
            }
        }
    }

    isNodeCloseLightSwitch(nodePosition) {
        // Calculate the distance between the node and each terminal
        const topDist = euclidianDistance(nodePosition, switchTerminal);
        const bottomDist = euclidianDistance(nodePosition, switchTerminal, 0, 150);

        // Check if any distance is below the threshold
        return topDist <= this.threshold || bottomDist <= this.threshold;
    }

    // Connect a node to a terminal
    connectToLightSwitch(nodePosition, nodeType) {
        // Check if the node is close to the phase terminal
        const topDist = euclidianDistance(nodePosition, switchTerminal);

        if (!switchTerminal.TopTerminalConnected && topDist <= this.threshold) {
            switchTerminal.TopTerminalConnected = true;
            if (nodeType === 'start') {
                this.start.x = switchTerminal.x;
                this.start.y = switchTerminal.y;
                this.nodeConnected.start = true;
            } else if (nodeType === 'end') {
                this.end.x = switchTerminal.x;
                this.end.y = switchTerminal.y;
                this.nodeConnected.end = true;
            }
            this.resetDraggingNode();
        }
        // Check if the node is close to the neutral terminal
        const bottomDist = euclidianDistance(nodePosition, switchTerminal, 0, 150);
        if (!switchTerminal.BottomTerminalConnected && bottomDist <= this.threshold) {
            switchTerminal.BottomTerminalConnected = true;
            if (nodeType === 'start') {
                this.start.x = switchTerminal.x;
                this.start.y = switchTerminal.y + 150;
                this.nodeConnected.start = true;
            } else if (nodeType === 'end') {
                this.end.x = switchTerminal.x;
                this.end.y = switchTerminal.y + 150;
                this.nodeConnected.end = true;
            }
            this.resetDraggingNode();
        }
    }

    // Disconnect a node from a terminal
    disconnectFromLightSwitch(nodePosition) {
        const topDist = euclidianDistance(nodePosition, switchTerminal);
        const bottomDist = euclidianDistance(nodePosition, switchTerminal, 0, 150);
        if (this.draggingNode.start && this.nodeConnected.start) {
            this.nodeConnected.start = false;
            if (switchTerminal.TopTerminalConnected && topDist <= this.threshold) {
                switchTerminal.TopTerminalConnected = false;
            } else if (switchTerminal.BottomTerminalConnected && bottomDist <= this.threshold) {
                switchTerminal.BottomTerminalConnected = false;
            }
        }
        if (this.draggingNode.end && this.nodeConnected.end) {
            this.nodeConnected.end = false;
            if (switchTerminal.TopTerminalConnected && topDist <= this.threshold) {
                switchTerminal.TopTerminalConnected = false;
            } else if (switchTerminal.BottomTerminalConnected && bottomDist <= this.threshold) {
                switchTerminal.BottomTerminalConnected = false;
            }
        }
    }

    isNodeCloseToLamp(nodePosition) {
        // Calculate the distance between the node and each terminal
        const leftDist = euclidianDistance(nodePosition, lampTerminal);
        const rightDist = euclidianDistance(nodePosition, lampTerminal, 100, 0);

        // Check if any distance is below the threshold
        return leftDist <= this.threshold || rightDist <= this.threshold;
    }

    // Connect a node to a terminal
    connectToLamp(nodePosition, nodeType) {
        const leftDist = euclidianDistance(nodePosition, lampTerminal);
        if (!lampTerminal.LeftTerminalConnected && leftDist <= this.threshold) {
            lampTerminal.LeftTerminalConnected = true;
            if (nodeType === 'start') {
                this.start.x = lampTerminal.x;
                this.start.y = lampTerminal.y;
                this.nodeConnected.start = true;
            } else if (nodeType === 'end') {
                this.end.x = lampTerminal.x;
                this.end.y = lampTerminal.y;
                this.nodeConnected.end = true;
            }
            this.resetDraggingNode();
        }

        const rightDist = euclidianDistance(nodePosition, lampTerminal, 100, 0);
        if (!lampTerminal.RightTerminalConnected && rightDist <= this.threshold) {
            lampTerminal.RightTerminalConnected = true;
            if (nodeType === 'start') {
                this.start.x = lampTerminal.x + 100;
                this.start.y = lampTerminal.y;
                this.nodeConnected.start = true;
            } else if (nodeType === 'end') {
                this.end.x = lampTerminal.x + 100;
                this.end.y = lampTerminal.y;
                this.nodeConnected.end = true;
            }
            this.resetDraggingNode();
        }
    }

    // Disconnect a node from a terminal
    disconnectFromLamp(nodePosition) {
        const leftDist = euclidianDistance(nodePosition, lampTerminal);
        const rightDist = euclidianDistance(nodePosition, lampTerminal, 100, 0);

        if (this.draggingNode.start && this.nodeConnected.start) {
            this.nodeConnected.start = false;
            if (lampTerminal.LeftTerminalConnected && leftDist <= this.threshold) {
                lampTerminal.LeftTerminalConnected = false;
            } else if (lampTerminal.RightTerminalConnected && rightDist <= this.threshold) {
                lampTerminal.RightTerminalConnected = false;
            }
        }
        if (this.draggingNode.end && this.nodeConnected.end) {
            this.nodeConnected.end = false;
            if (lampTerminal.LeftTerminalConnected && leftDist <= this.threshold) {
                lampTerminal.LeftTerminalConnected = false;
            } else if (lampTerminal.RightTerminalConnected && rightDist <= this.threshold) {
                lampTerminal.RightTerminalConnected = false;
            }
        }
    }

    // Reset dragging state
    resetDraggingNode() {
        this.draggingNode.start = false;
        this.draggingNode.end = false;
    }

    resetDraggingWire() {
        this.isDraggingWire = false;
    }

}


class Terminal {
    constructor(x, y, outerRadius, innerRadius, color, id) {
        this.id = lastTerminalId + 1 ;
        this.x = x;
        this.y = y;
        this.outerRadius = outerRadius;
        this.innerRadius = innerRadius;
        this.color = color;
        this.connected = false;
        lastTerminalId = this.id
    }

    draw(ctx) {
        // Draw the outer circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.outerRadius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Draw the inner circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.innerRadius, 0, Math.PI * 2, true);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
}

class Switch extends Terminal {
    constructor(x, y, outerRadius, innerRadius, color) {
        super(x, y, outerRadius, innerRadius, color);
        this.connected = true;
        this.image = new Image();
        this.image.src = '../static/images/light_switch.png';
        this.image.onload = () => {
            this.draw(ctx);
        };
        this.TopTerminalConnected = false;
        this.BottomTerminalConnected = false;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x - 65, this.y, 130, 150);
        this.TopTerminal = this.drawTopTerminal(ctx);
        this.BottomTerminal = this.drawBottomTerminal(ctx);
    }

    drawTopTerminal(ctx) {
        // Draw the outer circle top
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.outerRadius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Draw the inner circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.innerRadius, 0, Math.PI * 2, true);
        ctx.fillStyle = 'white';
        ctx.fill();
    }

    drawBottomTerminal(ctx) {
        // Draw the outer circle bottom
        ctx.beginPath();
        ctx.arc(this.x, this.y + 150, this.outerRadius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Draw the inner circle
        ctx.beginPath();
        ctx.arc(this.x, this.y + 150, this.innerRadius, 0, Math.PI * 2, true);
        ctx.fillStyle = 'white';
        ctx.fill();
    }

}

class Lamp extends Terminal {
    constructor(x, y, outerRadius, innerRadius, color) {
        super(x, y, outerRadius, innerRadius, color);
        this.connected = true;
        this.image = new Image();
        this.image.src = '../static/images/lamp_bulb.png';
        this.image.onload = () => {
            this.draw(ctx);
        }
        this.RightTerminalConnected = false;
        this.LeftTerminalConnected = false;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y - 130, 100, 150);
        this.RightTerminal = this.drawRightTerminal(ctx);
        this.LeftTerminal = this.drawLeftTerminal(ctx);
    }

    drawLeftTerminal(ctx) {

        // Draw the outer circle top
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.outerRadius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Draw the inner circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.innerRadius, 0, Math.PI * 2, true);
        ctx.fillStyle = 'white';
        ctx.fill();
    }

    drawRightTerminal(ctx) {
        // Draw the outer circle bottom
        ctx.beginPath();
        ctx.arc(this.x + 100, this.y, this.outerRadius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Draw the inner circle
        ctx.beginPath();
        ctx.arc(this.x + 100, this.y, this.innerRadius, 0, Math.PI * 2, true);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
}

var lastWireId = 0
var lastTerminalId = 0


// Get the canvas element and its 2D rendering context
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Create the terminals
const phaseTerminal = new Terminal(0.05 * canvas.width, 0.4 * canvas.height, 15, 5, 'red');
const neutralTerminal = new Terminal(0.05 * canvas.width, 0.5 * canvas.height, 15, 5, 'blue');
const groundTerminal = new Terminal(0.05 * canvas.width, 0.6 * canvas.height, 15, 5, 'green');

// Draw the terminals on the canvas
phaseTerminal.draw(ctx);
neutralTerminal.draw(ctx);
groundTerminal.draw(ctx);

// Create the switch
const switchTerminal = new Switch(0.3 * canvas.width, 0.325 * canvas.height, 15, 5, 'grey');

// Draw the switch on the canvas
switchTerminal.draw(ctx);

// Create the lamp
const lampTerminal = new Lamp(0.5 * canvas.width, 0.57 * canvas.height, 15, 5, 'grey');

// Draw the lamp on the canvas
lampTerminal.draw(ctx);

// Array to store the wires
const wires = [];

// Event listener for neutral wire button
const neutralWireButton = document.getElementById('neutralWireButton');
neutralWireButton.addEventListener('click', () => {
    createWire('blue');
});

// Event listener for phase wire button
const phaseWireButton = document.getElementById('phaseWireButton');
phaseWireButton.addEventListener('click', () => {
    createWire('red');
});

// Event listener for ground wire button
const groundWireButton = document.getElementById('groundWireButton');
groundWireButton.addEventListener('click', () => {
    createWire('green');
});

// Event listener for return wire button
const returnWireButton = document.getElementById('returnWireButton');
returnWireButton.addEventListener('click', () => {
    createWire('grey');
});

// Variables to track the mouse position
let mouseX = 0;
let mouseY = 0;
let mousePosition = { x: mouseX, y: mouseY };

// Function to create a new wire of a specific color
function createWire(color) {
    const lineSstart = { x: 0.1 * canvas.width, y: 0.1 * canvas.height };
    const lineEnd = { x: 0.2 * canvas.width, y: 0.1 * canvas.height };
    const nodeRadius = 5;

    const newWire = new Wire(lineSstart, lineEnd, nodeRadius, color);
    console.log(newWire.id)
    wires.push(newWire);
    newWire.draw(ctx);
}

// Event listener for mouse down
canvas.addEventListener('mousedown', (event) => {
    mouseX = event.clientX - canvas.getBoundingClientRect().left;
    mouseY = event.clientY - canvas.getBoundingClientRect().top;
    mousePosition = { x: mouseX, y: mouseY };

    // Check if any wire node is being dragged
    for (const wire of wires) {
        wire.checkDraggingNode(mousePosition);
        if (!wire.draggingNode.start && !wire.draggingNode.end) {
            wire.checkDraggingWire(mousePosition);
        }
    }
});

// Event listener for mouse move
canvas.addEventListener('mousemove', (event) => {
    let draggingNode = null;
    let draggingWire = null;

    for (const wire of wires) {
        if (wire.draggingNode.start || wire.draggingNode.end) {
            draggingNode = wire;
            break;
        } else if (wire.isDraggingWire) {
            draggingWire = wire;
            break;
        }
    }

    if (draggingNode || draggingWire) {
        mouseX = event.clientX - canvas.getBoundingClientRect().left;
        mouseY = event.clientY - canvas.getBoundingClientRect().top;
        mousePosition = { x: mouseX, y: mouseY };

        if (draggingNode) {
            draggingNode.updatePosition(mousePosition);
        } else if (draggingWire) {
            draggingWire.updatePosition(mousePosition);
        }

        // Clear the canvas and redraw all wires and nodes
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Create the terminals
        phaseTerminal.draw(ctx);
        neutralTerminal.draw(ctx);
        groundTerminal.draw(ctx);

        // Draw the switch on the canvas
        switchTerminal.draw(ctx);

        // Draw the lamp on the canvas
        lampTerminal.draw(ctx);

        for (const wire of wires) {
            wire.draw(ctx);
        }
    }
});

// Event listener for mouse up
canvas.addEventListener('mouseup', () => {
    for (const wire of wires) {
        wire.resetDraggingNode();
        wire.resetDraggingWire();
    }
});