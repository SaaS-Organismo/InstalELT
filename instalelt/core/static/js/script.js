import {
    euclidianDistance
} from "./functions/euclidianDistance.js";

// Define a class for the wire object
class Wire {
    constructor(start, end, nodeRadius, nodeColor) {
        this.id = lastWireId + 1
        this.start = start;
        this.end = end;
        this.nodeRadius = nodeRadius;
        this.nodeColor = nodeColor;
        this.nodeConnected = {
            start: null,
            end: null
        }
        this.draggingNode = {
            start: false,
            end: false
        };
        this.isDraggingWire = false;
        this.threshold = 2;
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
        for (let terminal of terminals) {
            if (this.draggingNode.start) {
                this.start.x = mousePosition.x;
                this.start.y = mousePosition.y;

                // Check if the start node is close to a terminal
                if (this.isNodeCloseToTerminal(this.start, terminal) && !this.nodeConnected.start) {
                    this.connectToTerminal(this.start, 'start', terminal);
                }
                if (this.draggingNode.start && this.nodeConnected.start) {
                    this.disconnectFromTerminal('start');
                }

            } else if (this.draggingNode.end) {
                this.end.x = mousePosition.x;
                this.end.y = mousePosition.y;

                // Check if the end node is close to a terminal
                if (this.isNodeCloseToTerminal(this.end, terminal) && !this.nodeConnected.end) {
                    this.connectToTerminal(this.end, 'end', terminal);
                }
                if (this.draggingNode.end && this.nodeConnected.end) {
                    this.disconnectFromTerminal('end');
                }
            }
        }
        if (this.isDraggingWire && !(this.nodeConnected.start || this.nodeConnected.end)) {
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
    isNodeCloseToTerminal(nodePosition, terminal) {
        // Calculate the distance between the node and each terminal
        const nodeDistToTerminal = euclidianDistance(nodePosition, terminal);

        // Check if any distance is below the threshold
        return nodeDistToTerminal <= this.threshold
    }

    // Connect a node to a terminal
    connectToTerminal(nodePosition, nodeType, terminal) {
        // Check if the node is close to the terminal
        const terminalDist = euclidianDistance(nodePosition, terminal);
        if (terminalDist <= this.threshold) {
            terminal.connections.push(this)
            if (nodeType === 'start') {
                this.start.x = terminal.x;
                this.start.y = terminal.y;
                this.nodeConnected.start = terminal;
            } else if (nodeType === 'end') {
                this.end.x = terminal.x;
                this.end.y = terminal.y;
                this.nodeConnected.end = terminal;
            }
            this.resetDraggingNode();
        }
    }

    // Disconnect a node from a terminal
    disconnectFromTerminal(type) {
        console.log(this)
        if (type == "start") {
            let connectedTerminal = this.nodeConnected.start
            connectedTerminal.connections = connectedTerminal.connections.filter((connection) => connection.id != this.id)
            this.nodeConnected.start = null;

        }
        if (type == "end") {
            let connectedTerminal = this.nodeConnected.end
            connectedTerminal.connections = connectedTerminal.connections.filter((connection) => connection.id != this.id)
            this.nodeConnected.end = null;
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
        this.id = lastTerminalId + 1;
        this.x = x;
        this.y = y;
        this.outerRadius = outerRadius;
        this.innerRadius = innerRadius;
        this.color = color;
        this.connections = []
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

class Switch {
    constructor(x, y, color) {
        this.x = x
        this.y = y
        this.connected = true;
        this.image = new Image();
        this.image.src = '../static/images/light_switch.png';
        this.image.onload = () => {
            this.draw(ctx)
        }
        this.topTerminal = new Terminal(x, y, 15, 5, color);
        this.bottomTerminal = new Terminal(x, y + 150, 15, 5, color);
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x - 65, this.y, 130, 150);
    }
}

class Lamp {
    constructor(x, y, color) {
        this.x = x
        this.y = y
        this.connected = true;
        this.image = new Image();
        this.image.src = '../static/images/lamp_off.png';
        this.image.onload = () => {
            this.draw(ctx)
        }
        this.leftTerminal = new Terminal(x, y, 15, 5, color);
        this.rightTerminal = new Terminal(x + 95, y, 15, 5, color);
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y - 130, 100, 150);
    }
}


class Outlet {
    constructor(x, y, color) {
        this.x = x
        this.y = y
        this.connected = true;
        this.image = new Image();
        this.image.src = '../static/images/outlet.png';
        this.image.onload = () => {
            this.draw(ctx)
        }
        this.leftTerminal = new Terminal(x - 25, y - 70, 15, 5, color);
        this.rightTerminal = new Terminal(x + 125, y - 70, 15, 5, color);
        this.bottomTerminal = new Terminal(x + 50, y, 15, 5, color);
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y - 130, 100, 100);
    }
}

let lastWireId = 0
let lastTerminalId = 0
let terminals = []
let wires = [];
let switches = [];
let lamps = [];
let outlets = [];

// challenges 

// Challenge 1
let terminals1 = []
let switches1 = []
let lamps1 = []

// Challenge 2
let terminals2 = []
let outlets2 = []

// Get the canvas element and its 2D rendering context
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Create the terminals
const phaseTerminal = new Terminal(0.05 * canvas.width, 0.4 * canvas.height, 15, 5, 'red');
const neutralTerminal = new Terminal(0.05 * canvas.width, 0.5 * canvas.height, 15, 5, 'blue');
const groundTerminal = new Terminal(0.05 * canvas.width, 0.6 * canvas.height, 15, 5, 'green');

terminals = [phaseTerminal, neutralTerminal, groundTerminal]

// Challenge 1
terminals1.push(...terminals)

const lightSwitch = new Switch(0.3 * canvas.width, 0.325 * canvas.height, 'grey');
switches1.push(lightSwitch)
terminals1.push(lightSwitch.topTerminal, lightSwitch.bottomTerminal)

const lamp = new Lamp(0.5 * canvas.width, 0.57 * canvas.height, 'grey');
lamps1.push(lamp)
terminals1.push(lamp.leftTerminal, lamp.rightTerminal)

// Challenge 2

// Create the outlet
terminals2.push(...terminals)

const outlet = new Outlet(0.4 * canvas.width, 0.6 * canvas.height, 'grey');
outlets2.push(outlet)
terminals2.push(outlet.leftTerminal, outlet.rightTerminal, outlet.bottomTerminal)


// Create wires by color
$(".wire-dropdown-item").click((e)=> {
    let btn = e.target
    let color = $(btn).data("color")
    createWire(color)
})

// Variables to track the mouse position
let mouseX = 0;
let mouseY = 0;
let mousePosition = {
    x: mouseX,
    y: mouseY
};

// Function to create a new wire of a specific color
function createWire(color) {
    const lineStart = {
        x: 0.1 * canvas.width,
        y: 0.1 * canvas.height
    };
    const lineEnd = {
        x: 0.2 * canvas.width,
        y: 0.1 * canvas.height
    };
    const nodeRadius = 5;

    const newWire = new Wire(lineStart, lineEnd, nodeRadius, color);
    console.log(newWire.id)
    wires.push(newWire);
    newWire.draw(ctx);
}

function redrawCanvas() {
    // Clear the canvas and redraw all wires and nodes
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const terminal of terminals) {
        terminal.draw(ctx);
    }

    for (const wire of wires) {
        wire.draw(ctx);
    }

    for (const lightSwitch of switches) {
        lightSwitch.draw(ctx);
    }

    for (const lamp of lamps) {
        lamp.draw(ctx);
    }

    for (const outlet of outlets) {
        outlet.draw(ctx);
    }
}



// Event listener for mouse down
canvas.addEventListener('mousedown', (event) => {
    mouseX = event.clientX - canvas.getBoundingClientRect().left;
    mouseY = event.clientY - canvas.getBoundingClientRect().top;
    mousePosition = {
        x: mouseX,
        y: mouseY
    };

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
        mousePosition = {
            x: mouseX,
            y: mouseY
        };

        if (draggingNode) {
            draggingNode.updatePosition(mousePosition);
        } else if (draggingWire) {
            draggingWire.updatePosition(mousePosition);
        }
        redrawCanvas()

    }
});

// Event listener for mouse up
canvas.addEventListener('mouseup', () => {
    for (const wire of wires) {
        wire.resetDraggingNode();
        wire.resetDraggingWire();
    }
});
// 1-phase 2-neutral 3-ground 4-switchTop 5-switchBottom 6-lampTop 7-lampBottom
var expectedTerminalConnections = [
    [1, 4],
    [2, 7],
    [5, 6]
]

const checkButton = document.getElementById('check-solution');
checkButton.addEventListener('click', () => {
    var correct = false
    console.log(terminals)
    for (let connection of expectedTerminalConnections) {
        let startTerminal = terminals.filter((terminal) => terminal.id == connection[0])[0]
        let endTerminal = terminals.filter((terminal) => terminal.id == connection[1])[0]
        if (startTerminal.connected && endTerminal.connected) {
            if (startTerminal.connectedTo == endTerminal.connectedTo) {
                correct = true
            } else {
                correct = false
                break
            }
        } else {
            correct = false
            Swal.fire(
                'Errado',
                'Ligações incompletas',
                'warning'
            )
            return
        }

    }
    if (correct) {
        Swal.fire(
            'Correto',
            'Você acertou!',
            'success'
        )
        lamp.image.src = '../static/images/lamp_on.png';
        redrawCanvas()

    } else {
        Swal.fire(
            'Errado',
            'Você errou!',
            'error'
        )
    }
});

const reloadButton = document.getElementById('reload-btn');
reloadButton.addEventListener('click', () => {
    wires = []
    for (let terminal of terminals) {
        terminal.connected = false;
        terminal.connectedTo = null;
    }
    lamp.image.src = '../static/images/lamp_off.png';
    redrawCanvas()
})
redrawCanvas()

const eraserButton = document.getElementById("eraser-btn");
let isErasing = false; // Flag to track whether the eraser is active

eraserButton.addEventListener("click", () => {
  isErasing = !isErasing; // Toggle the eraser state
  eraserButton.classList.toggle("active-btn", isErasing); // Add/remove an "active" class for styling purposes
  $("canvas").toggleClass("custom-cursor")
});

canvas.addEventListener("click", (event) => {
  if (isErasing) {
    const clickX = event.clientX - canvas.getBoundingClientRect().left;
    const clickY = event.clientY - canvas.getBoundingClientRect().top;
    console.log(clickX, clickY)
    console.log(wires)

    // Find the line that intersects with the click coordinates (if any)
    const index = wires.findIndex((wire) => {
      const threshold = 15; // Adjust as needed

      const startDist = euclidianDistance({x:0, y:0}, wire.start);
      const endDist = euclidianDistance({x:0, y:0}, wire.end);
      let startNode = wire.start
      let endNode = wire.end

        if (endDist < startDist) {
            startNode = wire.end
            endNode = wire.start
        }

      let angularCoefficient = (endNode.y - startNode.y) / (endNode.x - startNode.x)
      let distance1 = angularCoefficient * (clickX - startNode.x) + startNode.y
      console.log({m:angularCoefficient, y:distance1,yo:-wire.start.y, x:clickX, xo:wire.start.x})

      return (
        Math.abs(distance1 - clickY) < threshold
      );
    });

    if (index !== -1) {
      let wire = wires[index]
      if(wire.nodeConnected.start){
            wire.nodeConnected.start.connections = wire.nodeConnected.start.connections.filter((connected) => connected.id != wire.id)
      }
      if(wire.nodeConnected.end){
            wire.nodeConnected.end.connections = wire.nodeConnected.end.connections.filter((connected) => connected.id != wire.id)
      }

      wires.splice(index, 1); // Remove the line from the array
      redrawCanvas()
    }
  }
});

let challengesSchema = [
    {id: 1, terminals:  [...terminals1], wires: [], switches: [...switches1], lamps:  [...lamps1], outlets: []},
    {id: 2, terminals:  [...terminals2], wires: [], switches: [], lamps:  [], outlets: [...outlets2]}

]
let challenge = {}
let currentChallenge = 0

function setChallenge(){
    console.log("here")

    challenge = challengesSchema[currentChallenge]
    wires = challenge.wires
    terminals = challenge.terminals
    switches = challenge.switches
    lamps = challenge.lamps
    outlets = challenge.outlets
    redrawCanvas()
    console.log(challengesSchema)
        console.log(currentChallenge)

}

$("#current-question-id").val(0)

$("#previous-challenge").click(() => {
            if(currentChallenge > 0){
            saveChallenge()

                currentChallenge -= 1
                $("#current-question-id").val(currentChallenge)
setChallenge()

            }

        })
$("#next-challenge").click(() => {
            if(currentChallenge < 10){
            saveChallenge()

                currentChallenge += 1
                $("#current-question-id").val(currentChallenge)
setChallenge()

            }

        })

function saveChallenge(){
    challenge = challengesSchema[currentChallenge]
    challenge.wires = wires
    challenge.terminals = terminals
    challenge.switches = switches
    challenge.lamps = lamps
    challenge.outlets = outlets
    console.log(currentChallenge)
}

setChallenge()