import { createCanvas } from './functions/createCanvas.js';
import { createTerminals } from './functions/createTerminals.js';
import { redrawCanvas } from './functions/redrawCanvas.js';
import { firstChallenge } from './challenges/challenges.js';


function main() {
    let canvas, ctx = createCanvas();
    terminals = createTerminals(canvas);
    firstChallengeElements = firstChallenge(canvas);
    terminals.push(...firstChallengeElements);

    // Array to store the wires
    let wires = [];

    // Variables to track the mouse position
    let mouseX = 0;
    let mouseY = 0;
    let mousePosition = {
        x: mouseX,
        y: mouseY
    };

    // Event listener for neutral wire button
    const neutralWireButton = document.getElementById('neutralWireButton');
    neutralWireButton.addEventListener('click', () => {
        createWire('blue', wires);
    });

    // Event listener for phase wire button
    const phaseWireButton = document.getElementById('phaseWireButton');
    phaseWireButton.addEventListener('click', () => {
        createWire('red', wires);
    });

    // Event listener for ground wire button
    const groundWireButton = document.getElementById('groundWireButton');
    groundWireButton.addEventListener('click', () => {
        createWire('green', wires);
    });

    // Event listener for return wire button
    const returnWireButton = document.getElementById('returnWireButton');
    returnWireButton.addEventListener('click', () => {
        createWire('grey', wires);
    });

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
    const expectedTerminalConnections = [
        [1, 4],
        [2, 7],
        [5, 6]
    ];

    const checkButton = document.getElementById('check-solution');
    checkButton.addEventListener('click', () => {
        let correct = false
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
      const threshold = 10; // Adjust as needed

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
      console.log(terminals)

      wires.splice(index, 1); // Remove the line from the array
      redrawCanvas()
    }
  }
});

};

main();