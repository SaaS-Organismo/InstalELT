import { wires } from '../variables/variables.js';

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