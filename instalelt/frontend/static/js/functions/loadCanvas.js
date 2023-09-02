export function LoadCanvas() {
    // Get the canvas element and its 2D rendering context
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    // Variable to track the currently dragged wire
    let draggedWire = null;

    // Create the terminals
    const phaseTerminal = new Terminal(0.05 * canvas.width, 0.4 * canvas.height, 15, 5, 'red');
    const neutralTerminal = new Terminal(0.05 * canvas.width, 0.5 * canvas.height, 15, 5, 'blue');
    const groundTerminal = new Terminal(0.05 * canvas.width, 0.6 * canvas.height, 15, 5, 'green');

    // Draw the terminals on the canvas
    phaseTerminal.draw(ctx);
    neutralTerminal.draw(ctx);
    groundTerminal.draw(ctx);

    // Create the switch
    const switchTerminal = new LightSwitch(0.3 * canvas.width, 0.325 * canvas.height, 15, 5, 'grey');

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
}