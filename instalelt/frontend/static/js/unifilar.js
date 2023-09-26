let challenges = [];
let challenge = {
  terminals: [],
  wires: [],
  switches: [],
  lamps: [],
  outlets: [],
  is_correct: false,
};
let lastWireId = 0;
let lastSlotId = 0;
let currentChallenge = 0;

// Variables to track the mouse position
let mouseX = 0;
let mouseY = 0;
let mousePosition = {
  x: mouseX,
  y: mouseY,
};
let showTerminalId = false;

function euclidianDistance(a, b, offsetX = 0, offsetY = 0) {
  return Math.sqrt(((b.x + offsetX) - a.x) ** 2 + ((b.y + offsetY) - a.y) ** 2);
}

// Define a class for the wire object
class Wire {
  constructor(x, y, type) {
    this.id = lastWireId + 1;
    this.x = x;
    this.y = y;
    this.type = type
    this.image = new Image();
    this.image.src = `../static/images/${type}.svg`;
    lastWireId = this.id;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, 17, 25);
  }


}

class Slot {
    constructor(x, y) {
      this.id = lastSlotId + 1;
      this.x = x;
      this.y = y;
      this.wires = [];
      lastSlotId = this.id;
    }
  
    draw(ctx) {
      for(let wire of this.wires){
        wire.draw(ctx)
      }
    }

    addWire(wire){
      this.wires.push(wire)
    }
  }


// Get the canvas element and its 2D rendering context
$("#canvas-container").append(
  `<canvas id="myCanvas" width="${window.innerWidth * 0.9}" height="${
    window.innerHeight * 0.75
  }"></canvas>`
);

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let image = new Image();
image.src = "../static/images/desafio-unifilar.png";
image.onload = () => {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
}

let slot = new Slot(0.55*canvas.width, 0.45*canvas.height)

drawAddButtons()
function drawAddButtons() {
    let addButton = `
<div class="d-flex flex-column justify-content-between" id="buttons">
                        <button class="btn add-unifilar-btn" type="button" data-bs-toggle="dropdown"
                            data-bs-toggle="tooltip" data-bs-placement="top" title="Condutores" aria-expanded="false"
                            style="left:${0.5*canvas.width}px; top:${0.43*canvas.height}px">
                            <i class="fas fa-plus-circle"></i>
                        </button>
                        <ul id="wire-dropdown-menu" class="dropdown-menu" aria-labelledby="wire-dropdown-button"
                            style="min-width: 50px !important;">
                            <li class="dropdown-item wire-dropdown-item" id="neutralWireButton" data-wire-type="neutro">
                                <img class="wire-button" src="../static/images/neutro.svg" data-wire-type="neutro"></img>
                            </li>
                            <li class="dropdown-item wire-dropdown-item" id="phaseWireButton" data-wire-type="fase">
                            <img class="wire-button" src="../static/images/fase.svg" data-wire-type="fase"></img>
                            </li>
                            <li class="dropdown-item wire-dropdown-item" id="groundWireButton" data-wire-type="terra">
                            <img class="wire-button" src="../static/images/terra.svg" data-wire-type="terra"></img>
                            </li>
                            <li class="dropdown-item wire-dropdown-item" id="returnWireButton" data-wire-type="retorno">
                            <img class="wire-button" src="../static/images/retorno.svg" data-wire-type="retorno"></img>
                            </li>
                        </ul>
                    </div>`
    $("#canvas-buttons").append(addButton)
}


// Create wires by color
$("li.wire-dropdown-item").click((e) => {
  let btn = e.target;
  let type = $(btn).data("wire-type");
  console.log(btn, type)
  createWire(type);
});

// Function to create a new wire of a specific color
function createWire(type) {
  let startX = slot.x
  if (slot.wires.length > 0){
    let lastWire = slot.wires.at(-1)
    startX = lastWire.x + 20
  }
  const newWire = new Wire(startX, slot.y, type);
  slot.addWire(newWire)
  slot.draw(ctx);
  console.log(slot)
  console.log(newWire)
}

function redrawCanvas() {
  // Clear the canvas and redraw all wires and nodes
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const terminal of challenge.terminals) {
    terminal.draw(ctx);
  }

}




function checkSolution(unique = false) {
  console.log(challenge.terminals);
  let score = 0;
  let filteredChallenges = [...challenges];
  if (unique) {
    filteredChallenges = [filteredChallenges[currentChallenge]];
  }
  for (let challenge of filteredChallenges) {
    for (let possibleSolution of challenge.expectedConnections) {
      var correct = true;
      challengeLoop: for (let connection of possibleSolution) {
        let startTerminal = challenge.terminals.filter(
          (terminal) => terminal.id == connection[0]
        )[0];
        let endTerminal = challenge.terminals.filter(
          (terminal) => terminal.id == connection[1]
        )[0];
        console.log(connection, startTerminal, endTerminal);
        if (
          startTerminal.connections.length == 0 ||
          endTerminal.connections.length == 0
        ) {
          correct = false;
        }
        console.log("connections", startTerminal.connections);
        for (let wire of startTerminal.connections) {
          let wireConnections = [];
          if (wire.nodeConnected.start) {
            wireConnections.push(wire.nodeConnected.start.id);
          }
          if (wire.nodeConnected.end) {
            wireConnections.push(wire.nodeConnected.end.id);
          }
          console.log("connection", wireConnections, endTerminal.id);
          if (wireConnections.indexOf(endTerminal.id) != -1) {
            correct = true;
            break;
          } else {
            correct = false;
            continue;
          }
        }
        if (!correct) {
          correct = false;
          break challengeLoop;
        }
      }
      if (correct) {
        break;
      }
    }
    if (correct) {
      challenge.is_correct = true;
      if (unique) {
        Swal.fire("Correto", "Você acertou!", "success");
      } else {
        score += 1;
      }
    } else {
      challenge.is_correct = false;
      if (unique) {
        Swal.fire("Errado", "Você errou!", "error");
      } else {
      }
      //Swal.fire("Errado", "Você errou!", "error");
    }
  }
  $("input[name=score]").val(score);
  console.log(challenges);
  redrawCanvas();
}

function showFeedback() {
  $("#show-feedback-btn").show();
  $("#restart-btn").show();
  $("#ranking-btn").show();
  let rows = $("#feedback-table tbody tr");
  for (let challenge of challenges) {
    let icon = challenge.is_correct
      ? `<i class="fas fa-check text-success"></i>`
      : `<i class="fas fa-times text-danger"></i>`;
    let row = $(rows[challenge.id - 1]).find("td")[0];
    console.log(row);
    row.innerHTML = icon;
  }
  $("#show-feedback-btn").click();
}

const checkButton = document.getElementById("check-solution");
//checkButton.addEventListener("click", () => checkSolution(true));

const reloadButton = document.getElementById("reload-btn");
reloadButton.addEventListener("click", () => {
  for (let terminal of challenge.terminals) {
    terminal.connections = [];
  }
  challenge.wires = [];
  for (let challenge of challenges) {
    challenge.is_correct = false;
  }
  redrawCanvas();
});

const hideTerminalIdButton = document.getElementById("hide-id-btn");
/*hideTerminalIdButton.addEventListener("click", () => {
  showTerminalId = !showTerminalId;
  if (showTerminalId) {
    $(hideTerminalIdButton)
      .find("i")
      .removeClass("fa-eye-slash")
      .addClass("fa-eye");
  } else {
    $(hideTerminalIdButton)
      .find("i")
      .removeClass("fa-eye")
      .addClass("fa-eye-slash");
  }
  redrawCanvas();
});*/

const eraserButton = document.getElementById("eraser-btn");
let isErasing = false; // Flag to track whether the eraser is active

eraserButton.addEventListener("click", () => {
  isErasing = !isErasing; // Toggle the eraser state
  eraserButton.classList.toggle("active-btn", isErasing); // Add/remove an "active" class for styling purposes
  $("canvas").toggleClass("custom-cursor");
});




$("#current-question-id").change(() => {
  let counter = parseInt($("#current-question-id").val());
  console.log(counter, challenges);
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
      if (fourWaySwitches.topLeftTerminal) {
        fourWaySwitches.topLeftTerminal = fourWaySwitches.topLeftTerminal.id;
      }
      if (fourWaySwitches.topRightTerminal) {
        fourWaySwitches.topRightTerminal = fourWaySwitches.topRightTerminal.id;
      }
      if (fourWaySwitches.bottomLeftTerminal) {
        fourWaySwitches.bottomLeftTerminal =
          fourWaySwitches.bottomLeftTerminal.id;
      }
      if (fourWaySwitches.bottomRightTerminal) {
        fourWaySwitches.bottomRightTerminal =
          fourWaySwitches.bottomRightTerminal.id;
      }
    }
  }
  $("input[name='payload']").val(JSON.stringify(challengesJson));
}

$("#submit-challenge-btn").click(() => {
  //serializeChallenges();
  checkSolution();
  showFeedback();
});

function loadComponentsFromSchema() {
  console.log(challengesSchema);
  for (let challenge of Object.values(challengesSchema)) {
    let challengeJson = {
      id: challenge.id,
      terminals: [...createBaseTerminals()],
      wires: [],
      switches: [],
      threeWaySwitches: [],
      fourWaySwitches: [],
      lamps: [],
      outlets: [],
      expectedConnections: challenge.expectedConnections,
      statement: challenge.statement,
    };
    console.log("test", challenge);
    for (let wire of challenge.wires) {
      challengeJson.wires.push(new Wire(...wire));
    }
    for (let terminal of challenge.terminals) {
      challengeJson.terminals.push(new Terminal(...terminal));
    }
    for (let lightSwitch of challenge.switches) {
      console.log(lightSwitch);
      const newSwitch = new Switch(
        lightSwitch.x * canvas.width,
        lightSwitch.y * canvas.height
      );
      challengeJson.switches.push(newSwitch);
      challengeJson.terminals.push(
        newSwitch.topTerminal,
        newSwitch.bottomTerminal
      );
    }
    for (let threeway of challenge.threeWaySwitches) {
      console.log(threeway);
      const newThreeWaySwitch = new ThreeWaySwitch(
        threeway.x * canvas.width,
        threeway.y * canvas.height
      );
      challengeJson.threeWaySwitches.push(newThreeWaySwitch);
      challengeJson.terminals.push(
        newThreeWaySwitch.topTerminal,
        newThreeWaySwitch.leftTerminal,
        newThreeWaySwitch.bottomTerminal
      );
    }
    for (let fourway of challenge.fourWaySwitches) {
      console.log(fourway);
      const newFourWaySwitch = new FourWaySwitch(
        fourway.x * canvas.width,
        fourway.y * canvas.height
      );
      challengeJson.fourWaySwitches.push(newFourWaySwitch);
      challengeJson.terminals.push(
        newFourWaySwitch.topLeftTerminal,
        newFourWaySwitch.topRightTerminal,
        newFourWaySwitch.bottomLeftTerminal,
        newFourWaySwitch.bottomRightTerminal
      );
    }
    for (let lamp of challenge.lamps) {
      const newLamp = new Lamp(lamp.x * canvas.width, lamp.y * canvas.height);
      challengeJson.lamps.push(newLamp);
      challengeJson.terminals.push(newLamp.leftTerminal, newLamp.rightTerminal);
    }
    for (let outlet of challenge.outlets) {
      const newOutlet = new Outlet(
        outlet.x * canvas.width,
        outlet.y * canvas.height
      );
      challengeJson.outlets.push(newOutlet);
      challengeJson.terminals.push(
        newOutlet.leftTerminal,
        newOutlet.rightTerminal,
        newOutlet.bottomTerminal
      );
    }
    challenges.push(challengeJson);
  }

  console.log(challenges);

  setTimeout(() => setChallenge(), 500);
  setTimeout(() => $("#current-question-id").val(0).change(), 500);
}

loadComponentsFromSchema();