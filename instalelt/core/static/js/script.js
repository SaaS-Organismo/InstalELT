import { euclidianDistance } from "./functions/euclidianDistance.js";
import {challengesSchema} from "./challenges.js";
let challenges = [];
let challenge = {"terminals": [],
"wires": [],
"switches": [],
"lamps": [],
"outlets": [],
"is_correct": false}
let lastWireId = 0;
let lastTerminalId = 0;
let currentChallenge = 0;

// Variables to track the mouse position
let mouseX = 0;
let mouseY = 0;
let mousePosition = {
  x: mouseX,
  y: mouseY,
};



// Define a class for the wire object
class Wire {
  constructor(start, end, nodeRadius, nodeColor) {
    this.id = lastWireId + 1;
    this.start = start;
    this.end = end;
    this.nodeRadius = nodeRadius;
    this.nodeColor = nodeColor;
    this.nodeConnected = {
      start: null,
      end: null,
    };
    this.draggingNode = {
      start: false,
      end: false,
    };
    this.isDraggingWire = false;
    this.threshold = 2;
    this.offset = {
      x: 0,
      y: 0,
    };
    lastWireId = this.id;
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
    const distance =
      Math.abs(
        dy * mousePosition.x -
          dx * mousePosition.y +
          this.end.x * this.start.y -
          this.end.y * this.start.x
      ) / Math.sqrt(dy * dy + dx * dx);
    if (distance <= this.nodeRadius) {
      this.isDraggingWire = true;
      this.offset.x = mousePosition.x - this.start.x;
      this.offset.y = mousePosition.y - this.start.y;
    }
  }

  // Update the wire position while dragging
  updatePosition(mousePosition) {
    for (let terminal of challenge.terminals) {
      if (this.draggingNode.start) {
        this.start.x = mousePosition.x;
        this.start.y = mousePosition.y;

        // Check if the start node is close to a terminal
        if (
          this.isNodeCloseToTerminal(this.start, terminal) &&
          !this.nodeConnected.start
        ) {
          this.connectToTerminal(this.start, "start", terminal);
        }
        if (this.draggingNode.start && this.nodeConnected.start) {
          this.disconnectFromTerminal("start");
        }
      } else if (this.draggingNode.end) {
        this.end.x = mousePosition.x;
        this.end.y = mousePosition.y;

        // Check if the end node is close to a terminal
        if (
          this.isNodeCloseToTerminal(this.end, terminal) &&
          !this.nodeConnected.end
        ) {
          this.connectToTerminal(this.end, "end", terminal);
        }
        if (this.draggingNode.end && this.nodeConnected.end) {
          this.disconnectFromTerminal("end");
        }
      }
    }
    if (
      this.isDraggingWire &&
      !(this.nodeConnected.start || this.nodeConnected.end)
    ) {
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
    return nodeDistToTerminal <= this.threshold;
  }

  // Connect a node to a terminal
  connectToTerminal(nodePosition, nodeType, terminal) {
    // Check if the node is close to the terminal
    const terminalDist = euclidianDistance(nodePosition, terminal);
    if (terminalDist <= this.threshold) {
      terminal.connections.push(this);
      console.log(terminal.connections, this);
      if (nodeType === "start") {
        this.start.x = terminal.x;
        this.start.y = terminal.y;
        this.nodeConnected.start = terminal;
      } else if (nodeType === "end") {
        this.end.x = terminal.x;
        this.end.y = terminal.y;
        this.nodeConnected.end = terminal;
      }
      this.resetDraggingNode();
    }
  }

  // Disconnect a node from a terminal
  disconnectFromTerminal(type) {
    console.log(this);
    if (type == "start") {
      let connectedTerminal = this.nodeConnected.start;
      connectedTerminal.connections = connectedTerminal.connections.filter(
        (connection) => connection.id != this.id
      );
      this.nodeConnected.start = null;
    }
    if (type == "end") {
      let connectedTerminal = this.nodeConnected.end;
      connectedTerminal.connections = connectedTerminal.connections.filter(
        (connection) => connection.id != this.id
      );
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
  constructor(x, y, outerRadius, innerRadius, color="grey") {
    this.id = lastTerminalId + 1;
    this.x = x;
    this.y = y;
    this.outerRadius = outerRadius;
    this.innerRadius = innerRadius;
    this.color = color;
    this.connections = [];
    lastTerminalId = this.id;
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
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.font = "20px serif";
    ctx.fillStyle = "black";
    ctx.fillText(this.id, this.x-30, this.y);
  }
}

class Switch {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.connected = true;
    this.image = new Image();
    this.image.src = "../static/images/light_switch.png";
    this.image.onload = () => {
    }
    this.topTerminal = new Terminal(x, y, 15, 5);
    this.bottomTerminal = new Terminal(x, y + 150, 15, 5);
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x - 65, this.y, 130, 150);
    this.topTerminal.draw(ctx)
    this.bottomTerminal.draw(ctx)
  }
}

class Lamp {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.connected = true;
    this.imageOff = new Image();
    this.imageOff.src = "../static/images/lamp_off.png";
    this.imageOn = new Image();
    this.imageOn.src = "../static/images/lamp_on.png";
    this.leftTerminal = new Terminal(x, y, 15, 5);
    this.rightTerminal = new Terminal(x + 95, y, 15, 5);
  }

  draw(ctx) {
    if(challenge.is_correct){
      ctx.drawImage(this.imageOn, this.x, this.y-130, 100, 150);
    }
    else {
      ctx.drawImage(this.imageOff, this.x, this.y-130, 100, 150);
    }
    this.leftTerminal.draw(ctx)
    this.rightTerminal.draw(ctx)
  }
}

class Outlet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.connected = true;
    this.image = new Image();
    this.image.src = "../static/images/outlet.png";
    this.image.onload = () => {
      
    }
    this.leftTerminal = new Terminal(x - 25, y - 70, 15, 5);
    this.rightTerminal = new Terminal(x + 125, y - 70, 15, 5);
    this.bottomTerminal = new Terminal(x + 50, y, 15, 5);
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y-130, 100, 100);
    this.leftTerminal.draw(ctx)
    this.rightTerminal.draw(ctx)
    this.bottomTerminal.draw(ctx)
  }
}

class ThreeWaySwitch {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.connected = true;
    this.image = new Image();
    this.image.src = "../static/images/light_switch.png";
    this.image.onload = () => {
    }
    this.topTerminal = new Terminal(x, y, 15, 5);
    this.leftTerminal = new Terminal(x-60, y + 80, 15, 5);
    this.bottomTerminal = new Terminal(x, y + 150, 15, 5);
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x - 65, this.y, 130, 150);
    this.topTerminal.draw(ctx)
    this.bottomTerminal.draw(ctx)
  }
}

class FourWaySwitch {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.connected = true;
    this.image = new Image();
    this.image.src = "../static/images/light_switch.png";
    this.image.onload = () => {
    }
    this.topLeftTerminal = new Terminal(x + 10, y, 15, 5);
    this.topRightTerminal = new Terminal(x + 120, y, 15, 5);
    this.bottomLeftTerminal = new Terminal(x + 10, y + 150, 15, 5);
    this.bottomRightTerminal = new Terminal(x + 120, y + 150, 15, 5);
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, 130, 150);
    this.topLeftTerminal.draw(ctx)
    this.topRightTerminal.draw(ctx)
    this.bottomLeftTerminal.draw(ctx)
    this.bottomRightTerminal.draw(ctx)
  }
}


// Get the canvas element and its 2D rendering context
$("#canvas-container").append(`<canvas id="myCanvas" width="${window.innerWidth * 0.8}" height="${window.innerHeight * 0.75}"></canvas>`)


const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

function createBaseTerminals() {
  // Create the terminals
  const phaseTerminal = new Terminal(
    0.05 * canvas.width,
    0.4 * canvas.height,
    15,
    5,
    "red"
  );
  const neutralTerminal = new Terminal(
    0.05 * canvas.width ,
    0.5 * canvas.height,
    15,
    5,
    "blue"
  );
  const groundTerminal = new Terminal(
    0.05 * canvas.width ,
    0.6 * canvas.height,
    15,
    5,
    "green"
  );
  return [phaseTerminal, neutralTerminal, groundTerminal];
}


// Create wires by color
$("li.wire-dropdown-item").click((e) => {
  let btn = e.target;
  let color = $(btn).data("color");
  console.log(btn, color)
  createWire(color);
});


// Function to create a new wire of a specific color
function createWire(color) {
  const lineStart = {
    x: 0.1 * canvas.width,
    y: 0.1 * canvas.height,
  };
  const lineEnd = {
    x: 0.2 * canvas.width,
    y: 0.1 * canvas.height,
  };
  const nodeRadius = 5;

  const newWire = new Wire(lineStart, lineEnd, nodeRadius, color);
  challenge.wires.push(newWire);
  newWire.draw(ctx);
}

function redrawCanvas() {
  // Clear the canvas and redraw all wires and nodes
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const terminal of challenge.terminals) {
    terminal.draw(ctx);
  }

  for (const lightSwitch of challenge.switches) {
    lightSwitch.draw(ctx);
  }

  for (const lamp of challenge.lamps) {
    lamp.draw(ctx);
  }

  for (const outlet of challenge.outlets) {
    outlet.draw(ctx);
  }

  for (const threeWay of challenge.threeWaySwitches) {
    threeWay.draw(ctx);
  }

  for (const fourWay of challenge.fourWaySwitches) {
    fourWay.draw(ctx);
  }

  for (const wire of challenge.wires) {
    wire.draw(ctx);
  }
}

// Event listener for mouse down
canvas.addEventListener("mousedown", (event) => {
  mouseX = event.clientX - canvas.getBoundingClientRect().left;
  mouseY = event.clientY - canvas.getBoundingClientRect().top;
  mousePosition = {
    x: mouseX,
    y: mouseY,
  };

  // Check if any wire node is being dragged
  for (const wire of challenge.wires) {
    wire.checkDraggingNode(mousePosition);
    if (!wire.draggingNode.start && !wire.draggingNode.end) {
      wire.checkDraggingWire(mousePosition);
    }
  }
});

// Event listener for mouse move
canvas.addEventListener("mousemove", (event) => {
  let draggingNode = null;
  let draggingWire = null;

  for (const wire of challenge.wires) {
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
      y: mouseY,
    };

    if (draggingNode) {
      draggingNode.updatePosition(mousePosition);
    } else if (draggingWire) {
      draggingWire.updatePosition(mousePosition);
    }
    redrawCanvas();
  }
});

// Event listener for mouse up
canvas.addEventListener("mouseup", () => {
  for (const wire of challenge.wires) {
    wire.resetDraggingNode();
    wire.resetDraggingWire();
  }
});




function checkSolution(unique=false) {
  console.log(challenge.terminals);
  let score = 0
  for(let challenge of challenges){
    for (let possibleSolution of challenge.expectedConnections) {
      var correct = true;
      challengeLoop:
      for(let connection of possibleSolution){
        let startTerminal = challenge.terminals.filter(
          (terminal) => terminal.id == connection[0]
        )[0];
        let endTerminal = challenge.terminals.filter(
          (terminal) => terminal.id == connection[1]
        )[0];
        console.log(connection, startTerminal, endTerminal)
        if (startTerminal.connections.length != 0 && endTerminal.connections.length != 0) {
          console.log("connections", startTerminal.connections)
          for(let wire of startTerminal.connections){
            let wireConnections = [wire.nodeConnected.start.id, wire.nodeConnected.end.id]
            console.log("connection", wireConnections, endTerminal.id)
            if (wireConnections.indexOf(endTerminal.id) != -1) {
              correct = true;
              break
            } else{
              correct = false;
              continue
            }
          }
          if(!correct){
            correct = false
            break challengeLoop
          }
        } else {
          correct = false;
          //Swal.fire("Errado", "Ligações incompletas", "warning");
        }
      }
      if(correct){
        break
      }
    }
    if (correct) {
      challenge.is_correct = true;
      if(unique){
        Swal.fire("Correto", "Você acertou!", "success");
      }
      else{
        score += 1
      }
      
    } else {
      challenge.is_correct = false
      if(unique){
        Swal.fire("Errado", "Você errou!", "error");
      } else {
      }
      //Swal.fire("Errado", "Você errou!", "error");
    }
  }
  $("input[name=score]").val(score)
  console.log(challenges)
  redrawCanvas()
};

function showFeedback(){
  $("#show-feedback-btn").show()
  $("#restart-btn").show()
  $("#ranking-btn").show()
  let rows = $("#feedback-table tbody tr")
  for(let challenge of challenges){
    let icon = challenge.is_correct ?`<i class="fas fa-check text-success"></i>` : `<i class="fas fa-times text-danger"></i>`
    let row = $(rows[challenge.id - 1]).find("td")[0]
    console.log(row)
    row.innerHTML = icon
  }
  $("#show-feedback-btn").click()
}

const checkButton = document.getElementById("check-solution");
checkButton.addEventListener("click", () => checkSolution(true))

const reloadButton = document.getElementById("reload-btn");
reloadButton.addEventListener("click", () => {
  for (let terminal of challenge.terminals) {
    terminal.connections = [];
  }
  challenge.wires = []
  for(let challenge of challenges){
    challenge.is_correct = false
  }
  redrawCanvas();
});

const eraserButton = document.getElementById("eraser-btn");
let isErasing = false; // Flag to track whether the eraser is active

eraserButton.addEventListener("click", () => {
  isErasing = !isErasing; // Toggle the eraser state
  eraserButton.classList.toggle("active-btn", isErasing); // Add/remove an "active" class for styling purposes
  $("canvas").toggleClass("custom-cursor");
});

canvas.addEventListener("click", (event) => {
  if (isErasing) {
    const clickX = event.clientX - canvas.getBoundingClientRect().left;
    const clickY = event.clientY - canvas.getBoundingClientRect().top;
    console.log(clickX, clickY);
    console.log(challenge.wires);

    // Find the line that intersects with the click coordinates (if any)
    const index = challenge.wires.findIndex((wire) => {
      const threshold = 15; // Adjust as needed

      const startDist = euclidianDistance({ x: 0, y: 0 }, wire.start);
      const endDist = euclidianDistance({ x: 0, y: 0 }, wire.end);
      let startNode = wire.start;
      let endNode = wire.end;

      if (endDist < startDist) {
        startNode = wire.end;
        endNode = wire.start;
      }

      let angularCoefficient =
        (endNode.y - startNode.y) / (endNode.x - startNode.x);
      let distance1 = angularCoefficient * (clickX - startNode.x) + startNode.y;
      console.log({
        m: angularCoefficient,
        y: distance1,
        yo: -wire.start.y,
        x: clickX,
        xo: wire.start.x,
      });

      return Math.abs(distance1 - clickY) < threshold;
    });

    if (index !== -1) {
      let wire = challenge.wires[index];
      if (wire.nodeConnected.start) {
        wire.nodeConnected.start.connections =
          wire.nodeConnected.start.connections.filter(
            (connected) => connected.id != wire.id
          );
      }
      if (wire.nodeConnected.end) {
        wire.nodeConnected.end.connections =
          wire.nodeConnected.end.connections.filter(
            (connected) => connected.id != wire.id
          );
      }

      challenge.wires.splice(index, 1); // Remove the line from the array
      redrawCanvas();
    }
  }
});



function setChallenge() {
  console.log("here");
  challenge = challenges[currentChallenge];
  redrawCanvas();
  console.log(challenge);
  console.log(currentChallenge);
}


$("#current-question-id").change(() => {
  let counter = parseInt($("#current-question-id").val());
  $("#title").text(`Questão ${counter + 1}`);
  $("#question-statement").text(challenge.statement);
  if (counter == challenges.length - 1) {
    $("#next-challenge").addClass("d-none");
    $("#submit-challenge-btn").removeClass("d-none");
    $("#previous-challenge").removeClass("d-none");
  } else if (counter == 0) {
    $("#previous-challenge").addClass("d-none");
  } else {
    $("#next-challenge").removeClass("d-none");
    $("#previous-challenge").removeClass("d-none");
    $("#submit-challenge-btn").addClass("d-none");
  }
});

$("#previous-challenge").click(() => {
  if (currentChallenge > 0) {

    currentChallenge -= 1;
    setChallenge();
    $("#current-question-id").val(currentChallenge).change();

  }
});
$("#next-challenge").click(() => {
  if (currentChallenge < 10) {

    currentChallenge += 1;
    setChallenge();
    $("#current-question-id").val(currentChallenge).change();

  }
  //serializeChallenges();
});




function serializeChallenges() {
  let challengesJson = [...challenges];
  for (let _challenge of challengesJson) {
    console.log("challenge", _challenge.id, "\n");
    for (let wire of _challenge.wires) {
      if (wire.nodeConnected.start) {
        wire.nodeConnected.start = wire.nodeConnected.start.id;
      }
      if (wire.nodeConnected.end) {
        wire.nodeConnected.end = wire.nodeConnected.end.id;
      }
    }
    for (let terminal of _challenge.terminals) {
      let newConnections = [];
      for (let connection of terminal.connections) {
        newConnections.push(connection.id);
      }
      if (newConnections.length > 0) {
        terminal.connections = newConnections;
        console.log(terminal, newConnections);
      }
    }
    for (let lightSwitch of _challenge.switches) {
      if (lightSwitch.topTerminal) {
        lightSwitch.topTerminal = lightSwitch.topTerminal.id;
      }
      if (lightSwitch.bottomTerminal) {
        lightSwitch.bottomTerminal = lightSwitch.bottomTerminal.id;
      }
    }
    for (let lamp of _challenge.lamps) {
      if (lamp.leftTerminal) {
        lamp.leftTerminal = lamp.leftTerminal.id;
      }
      if (lamp.rightTerminal) {
        lamp.rightTerminal = lamp.rightTerminal.id;
      }
    }
    for (let outlet of _challenge.outlets) {
      if (outlet.phaseTerminal) {
        outlet.phaseTerminal = outlet.phaseTerminal.id;
      }
      if (outlet.groundTerminal) {
        outlet.groundTerminal = outlet.groundTerminal.id;
      }
      if (outlet.neutralTerminal) {
        outlet.neutralTerminal = outlet.neutralTerminal.id;
      }
    }
    for (let fourWaySwitches of _challenge.fourWaySwitches) {
      if(fourWaySwitches.topLeftTerminal){
        fourWaySwitches.topLeftTerminal = fourWaySwitches.topLeftTerminal.id;
      }
      if(fourWaySwitches.topRightTerminal){
        fourWaySwitches.topRightTerminal = fourWaySwitches.topRightTerminal.id;
      }
      if(fourWaySwitches.bottomLeftTerminal){
        fourWaySwitches.bottomLeftTerminal = fourWaySwitches.bottomLeftTerminal.id;
      }
      if(fourWaySwitches.bottomRightTerminal){
        fourWaySwitches.bottomRightTerminal = fourWaySwitches.bottomRightTerminal.id;
      }
    }
  }
  $("input[name='payload']").val(JSON.stringify(challengesJson));
}

$("#submit-challenge-btn").click(() => {
  //serializeChallenges();
  checkSolution()
  showFeedback()
  $("#solution-form").submit();

});

$("#solution-form").submit((e) => {
  e.preventDefault()
  var serializedData = $("#solution-form").serialize()
  console.log(serializedData)
  $.ajax({
    type: 'POST',
    url: '/desafio/1',
    data: serializedData,
    success: function(data){
      console.log(data);
    },
    error: function(){
      // alert('Deu Erro');
      console.log('Deu Erro');
    }
  });
})

function deserializeChallenge(challengesJson) {
  console.log(challengesJson);
  for (let _challenge of Object.values(challengesJson)) {
    console.log("challenge", _challenge.id, "\n");
    for (let wire of _challenge.wires) {
      if (wire.nodeConnected.start) {
        let connectedTerminal = _challenge.terminals.filter(
          (terminal) => terminal.id == wire.nodeConnected.start.id
        )[0];
        wire.nodeConnected.start = connectedTerminal;
      }
      if (wire.nodeConnected.end) {
        let connectedTerminal = _challenge.terminals.filter(
          (terminal) => terminal.id == wire.nodeConnected.end.id
        )[0];
        wire.nodeConnected.end = connectedTerminal;
      }
    }
    for (let terminal of _challenge.terminals) {
      let newConnections = [];
      for (let connection of terminal.connections) {
        if (connection) {
          let connectedWire = _challenge.wires.filter(
            (wire) => wire.id == connection
          )[0];
          newConnections.push(connectedWire);
        }
      }
      if (newConnections.length > 0) {
        terminal.connections = newConnections;
      }
    }
    for (let lightSwitch of _challenge.switches) {
      if (lightSwitch.topTerminal) {
        let topTerminal = _challenge.terminals.filter(
          (terminal) => terminal.id == lightSwitch.topTerminal
        )[0];
        lightSwitch.topTerminal = topTerminal;
      }
      if (lightSwitch.bottomTerminal) {
        let bottomTerminal = _challenge.terminals.filter(
          (terminal) => terminal.id == lightSwitch.bottomTerminal
        )[0];
        lightSwitch.bottomTerminal = bottomTerminal;
      }
    }
    for (let lamp of _challenge.lamps) {
      if (lamp.leftTerminal) {
        let topTerminal = _challenge.terminals.filter(
          (terminal) => terminal.id == lamp.leftTerminal
        )[0];
        lamp.leftTerminal = topTerminal;
      }
      if (lamp.rightTerminal) {
        let bottomTerminal = _challenge.terminals.filter(
          (terminal) => terminal.id == lamp.rightTerminal
        )[0];
        lamp.rightTerminal = bottomTerminal;
      }
    }
    for (let outlet of _challenge.outlets) {
      if (outlet.phaseTerminal) {
        let phaseTerminal = _challenge.terminals.filter(
          (terminal) => terminal.id == outlet.bottomTerminal
        )[0];
        outlet.phaseTerminal = phaseTerminal;
      }
      if (outlet.groundTerminal) {
        let groundTerminal = _challenge.terminals.filter(
          (terminal) => terminal.id == outlet.bottomTerminal
        )[0];
        outlet.groundTerminal = groundTerminal;
      }
      if (outlet.neutralTerminal) {
        let neutralTerminal = _challenge.terminals.filter(
          (terminal) => terminal.id == outlet.bottomTerminal
        )[0];
        outlet.neutralTerminal = neutralTerminal;
      }
    }
    for (let threeWaySwitches of _challenge.threeWaySwitches) {
      if (threeWaySwitches.topTerminal) {
        let topTerminal = _challenge.terminals.filter(
          (terminal) => terminal.id == threeWaySwitches.topTerminal
        )[0];
        threeWaySwitches.topTerminal = topTerminal;
      }
      if (threeWaySwitches.leftTerminal) {
        let leftTerminal = _challenge.terminals.filter(
          (terminal) => terminal.id == threeWaySwitches.leftTerminal
        )[0];
        threeWaySwitches.leftTerminal = leftTerminal;
      }
      if (threeWaySwitches.bottomTerminal) {
        let bottomTerminal = _challenge.terminals.filter(
          (terminal) => terminal.id == threeWaySwitches.bottomTerminal
        )[0];
        threeWaySwitches.bottomTerminal = bottomTerminal;
      }
    }
    for (let fourWaySwitches of _challenge.fourWaySwitches) {
      if (fourWaySwitches.topLeftTerminal) {
        let topLeftTerminal = _challenge.terminals.filter(
          (terminal) => terminal.id == fourWaySwitches.topLeftTerminal
        )[0];
        fourWaySwitches.topLeftTerminal = topLeftTerminal;
      }
      if (fourWaySwitches.topRightTerminal) {
        let topRightTerminal = _challenge.terminals.filter(
          (terminal) => terminal.id == fourWaySwitches.topRightTerminal
        )[0];
        fourWaySwitches.topRightTerminal = topRightTerminal;
      }
      if (fourWaySwitches.bottomLeftTerminal) {
        let bottomLeftTerminal = _challenge.terminals.filter(
          (terminal) => terminal.id == fourWaySwitches.bottomLeftTerminal
        )[0];
        fourWaySwitches.bottomLeftTerminal = bottomLeftTerminal;
      }
      if (fourWaySwitches.bottomRightTerminal) {
        let bottomRightTerminal = _challenge.terminals.filter(
          (terminal) => terminal.id == fourWaySwitches.bottomRightTerminal
        )[0];
        fourWaySwitches.bottomRightTerminal = bottomRightTerminal;
      }
    }
  }
  return challengesJson;
}

function loadComponentsFromSchema(){
  console.log(challengesSchema)
  for (let challenge of Object.values(challengesSchema)) {
    let challengeJson = {
      "id": challenge.id,
      "terminals": [...createBaseTerminals()],
      "wires": [],
      "switches": [],
      "threeWaySwitches": [],
      "fourWaySwitches": [],
      "lamps": [],
      "outlets": [],
      "expectedConnections": challenge.expectedConnections,
      "statement": challenge.statement
    }
    console.log("test", challenge)
    for (let wire of challenge.wires) {
      challengeJson.wires.push(new Wire(...wire))
    }
    for (let terminal of challenge.terminals) {
      challengeJson.terminals.push(new Terminal(...terminal))

    }
    for (let lightSwitch of challenge.switches) {
      console.log(lightSwitch)
      const newSwitch = new Switch(lightSwitch.x * canvas.width, lightSwitch.y * canvas.height);
      challengeJson.switches.push(newSwitch)
      challengeJson.terminals.push(newSwitch.topTerminal, newSwitch.bottomTerminal);
    }
    for (let threeway of challenge.threeWaySwitches) {
      console.log(threeway)
      const newThreeWaySwitch = new ThreeWaySwitch(threeway.x * canvas.width, threeway.y * canvas.height);
      challengeJson.threeWaySwitches.push(newThreeWaySwitch)
      challengeJson.terminals.push(newThreeWaySwitch.topTerminal, newThreeWaySwitch.leftTerminal, newThreeWaySwitch.bottomTerminal);
    }
    for (let fourway of challenge.fourWaySwitches) {
      console.log(fourway)
      const newFourWaySwitch = new FourWaySwitch(fourway.x * canvas.width, fourway.y * canvas.height);
      challengeJson.fourWaySwitches.push(newFourWaySwitch)
      challengeJson.terminals.push(newFourWaySwitch.topLeftTerminal, newFourWaySwitch.topRightTerminal, newFourWaySwitch.bottomLeftTerminal, newFourWaySwitch.bottomRightTerminal);
    }
    for (let lamp of challenge.lamps) {
      const newLamp = new Lamp(lamp.x * canvas.width, lamp.y * canvas.height);
      challengeJson.lamps.push(newLamp)
      challengeJson.terminals.push(newLamp.leftTerminal, newLamp.rightTerminal);
    }
    for (let outlet of challenge.outlets) {
      const newOutlet = new Outlet(outlet.x * canvas.width, outlet.y * canvas.height);
      challengeJson.outlets.push(newOutlet)
      challengeJson.terminals.push(newOutlet.leftTerminal, newOutlet.rightTerminal, newOutlet.bottomTerminal);
    }
    challenges.push(challengeJson)
  }
  
  console.log(challenges)
  

  setTimeout(()=>setChallenge(), 500)
  setTimeout(() => $("#current-question-id").val(0).change(), 500)
  
  
}

loadComponentsFromSchema()