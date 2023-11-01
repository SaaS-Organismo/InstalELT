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
let showValidations = false
function euclidianDistance(a, b, offsetX = 0, offsetY = 0) {
  return Math.sqrt((b.x + offsetX - a.x) ** 2 + (b.y + offsetY - a.y) ** 2);
}

// Define a class for the wire object
class Wire {
  constructor(x, y, type, slot) {
    this.id = lastWireId + 1;
    this.x = x;
    this.y = y;
    this.type = type;
    this.image = new Image();
    this.image.src = `../static/images/${type}.svg`;
    this.slot = slot
    this.circuit = ''
    lastWireId = this.id;

  }

  draw(ctx) {
    console.log(this.slot.x, this.slot.y, this.x, this.y)
    let wire = `<span id="wire-${this.id}" style="position:relative;left:${this.x}px;top:${this.slot.y}px" class="px-2">
    <span style="position:absolute;top:-20px">${this.circuit}</span>
    <img src='${this.image.src}'  style="position:absolute;width:auto;height:${40}px"/>
    </span>`
    $(`#slot-${this.slot.id} .wires`).append(wire)
    $(`#wire-${this.id}`).click(() => this.onClick(this))
  }

  deleteWire(){
    let newWires = [...this.slot.wires]
    this.slot.wires = newWires.filter((wire) => wire.id != this.id)
    $(`#wire-${this.id}`).remove()
    console.log(`#wire-${this.id}`)
  }

  checkClick(mousePosition){
    const dx =  this.x - 5 <= mousePosition.x &&  mousePosition.x <= this.x + 17;
    const dy = this.y - 5 <= mousePosition.y && mousePosition.y <= this.y + 25;
    if(dx && dy){
      console.log('clicked ', this.id)
    }

  }

  onClick(){
    const eraserButton = document.getElementById("eraser-btn");
    if(eraserButton.classList.contains("active-btn")){
      this.deleteWire()
    } else {
      $('#wire-modal').modal('toggle');
      $('#wire-modal').attr('wire-id', this.id)
      $('#wire-modal').attr('slot-id', this.slot.id)
      $('#wire-modal #wire-type').val(this.type)
      $('#wire-modal #wire-circuit').val(this.circuit)
      

    }
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
    this.drawButton();
    for (let wire of this.wires) {
      wire.draw(ctx);
    }
  }

  drawButton() {
    let addButton = `
    <div class="d-flex flex-column justify-content-between add-unifilar-div" id="slot-${this.id}">
      <button class="btn add-unifilar-btn" type="button" data-bs-toggle="dropdown"
          data-bs-toggle="tooltip" data-bs-placement="top" title="Condutores" aria-expanded="false"
          style="left:${this.x}px; top:${this.y}px">
          <i class="fas fa-plus-circle"></i>
          <span>${showTerminalId ? this.id : ''}</span>
      </button>
      <ul id="wire-dropdown-menu" class="dropdown-menu" aria-labelledby="wire-dropdown-button"
          style="min-width: 50px !important;">
          <li class="dropdown-item wire-dropdown-item" id="neutralWireButton" onclick="createWire(${this.id},'neutro')">
              <img class="wire-button" src="../static/images/neutro.svg" data-wire-type="neutro"></img>
          </li>
          <li class="dropdown-item wire-dropdown-item" id="phaseWireButton" onclick="createWire(${this.id},'fase')">
          <img class="wire-button" src="../static/images/fase.svg" data-wire-type="fase"></img>
          </li>
          <li class="dropdown-item wire-dropdown-item" id="groundWireButton" onclick="createWire(${this.id},'terra')">
          <img class="wire-button" src="../static/images/terra.svg" data-wire-type="terra"></img>
          </li>
          <li class="dropdown-item wire-dropdown-item" id="returnWireButton" onclick="createWire(${this.id},'retorno')">
          <img class="wire-button" src="../static/images/retorno.svg" data-wire-type="retorno"></img>
          </li>
      </ul>
      <div class="wires d-flex" style="width:0px; height:0px">
      
      
      </div>
      <div style="position: absolute;left:${this.x + 10}px; top:${this.y - 20}px"> 
      ${
        showValidations ? (this.solution ? (
          `<i class="fas fa-check text-success"></i>`
        ) : (
          `<i class="fas fa-times text-danger"></i>`
        )) : ""
      }
      </div>
    </div>
      `;
    $("#canvas-buttons").append(addButton);
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

// Event listener for mouse/touch down
canvas.addEventListener("mousedown", (event) => handleClickComponentOnCanvas(event));
canvas.addEventListener("touchstart", (event) => handleClickComponentOnCanvas(event));

$('#wire-modal #wire-circuit').change(()=> {
  let currentWireId = $('#wire-modal').attr('wire-id')
  let currentSlotId = $('#wire-modal').attr('slot-id')
  let slot = challenge.slots.filter((slot) => slot.id == currentSlotId)[0]
  let wire = slot.wires.filter((wire) => wire.id == currentWireId)[0]
  wire.circuit = $('#wire-modal #wire-circuit').val()
  $(`#wire-${wire.id} span`).text(wire.circuit)
  
})


function createWire(slotId, type) {
  let slot = challenge.slots.filter((slot) => slot.id == slotId)[0]
  let startX = slot.x + 40;
  if (slot.wires.length > 0) {
    let lastWire = slot.wires.at(-1);
    startX = lastWire.x + 10;
  }
  const newWire = new Wire(startX, slot.y, type, slot);
  newWire.draw(ctx);
  slot.wires.push(newWire);
}

function handleClickComponentOnCanvas(event) {
  let click = event.type.includes("touch") ? event.touches[0] : event
  mouseX = click.clientX - canvas.getBoundingClientRect().left;
  mouseY = click.clientY - canvas.getBoundingClientRect().top;
  mousePosition = {
    x: mouseX,
    y: mouseY,
  };

  // Check if any wire node is being dragged
  for (let slot of challenge.slots) {
    for (let wire of slot.wires){
      wire.checkClick(mousePosition);
    }
  }
}

function redrawCanvas(all=true) {
  // Clear the canvas and redraw all wires and nodes
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  $(".add-unifilar-div").empty();
  $("#canvas-buttons").empty()

  let image = new Image();
  image.src = challenge.image;
  image.onload = () => {
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    for (let slot of challenge.slots) {
      slot.draw(ctx);
    }
  };
  
}

function checkSolution(unique = false) {
  showValidations = true
  console.log(challenge.terminals);
  let score = 0;
  let filteredChallenges = [...challenges];
  if (unique) {
    filteredChallenges = [filteredChallenges[currentChallenge]];
  }
  for (let challenge of filteredChallenges) {
    for (let possibleSolution of challenge.expectedConnections) {
      for (let {id, wires:expectedWires} of possibleSolution) {
        var correct = true;
        let slot = challenge.slots.filter(
          (slot) => slot.id == id
        )[0]
        let connections = [...slot.wires]
        console.log("Slot ", id, slot, connections)

        if (
          connections.length != expectedWires.length
        ) {
          correct = false;
        }
        else {
          wireFor: for(let wire of expectedWires){
            let index = connections.findIndex((connection) => connection.type == wire.type)
            console.log(index, connections)
            if(index != -1 ){
              connections.splice(index, 1)
              continue
            }
            console.log("Here", correct) 
            correct = false
            break wireFor;
          }
        }
        console.log("Correct: ", correct)
        slot.solution = correct
      }
    }
    let challengeIsCorrect = challenge.slots.every((slot) => slot.solution)
    if (challengeIsCorrect) {
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
checkButton.addEventListener("click", () => checkSolution(true));

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
hideTerminalIdButton.addEventListener("click", () => {
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
});

const eraserButton = document.getElementById("eraser-btn");
let isErasing = false; // Flag to track whether the eraser is active

eraserButton.addEventListener("click", () => {
  isErasing = !isErasing; // Toggle the eraser state
  eraserButton.classList.toggle("active-btn", isErasing); // Add/remove an "active" class for styling purposes
  $("canvas").toggleClass("custom-cursor");
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
  console.log(counter, challenges.length);
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

$("#submit-challenge-btn").click(() => {
  checkSolution();
  showFeedback();
});

function loadComponentsFromSchema() {
  console.log(unifilarSchema);
  for (let challenge of Object.values(unifilarSchema)) {
    let challengeJson = {
      id: challenge.id,
      slots: [],
      expectedConnections: challenge.expectedConnections,
      statement: challenge.statement,
      image: challenge.image,
    };
    for (let slot of challenge.slots) {
      const newSlot = new Slot(slot.x * canvas.width, slot.y * canvas.height);
      challengeJson.slots.push(newSlot);
    }

    challenges.push(challengeJson);
  }

  console.log(challenges);

  setTimeout(() => setChallenge(), 500);
  setTimeout(() => $("#current-question-id").val(0).change(), 500);
}

loadComponentsFromSchema();
