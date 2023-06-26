import { Terminal } from '../classes/Terminal.js';


export default function createTerminals(canvas) {
    const phaseTerminal = new Terminal(0.05 * canvas.width, 0.4 * canvas.height, 15, 5, 'red');
    const neutralTerminal = new Terminal(0.05 * canvas.width, 0.5 * canvas.height, 15, 5, 'blue');
    const groundTerminal = new Terminal(0.05 * canvas.width, 0.6 * canvas.height, 15, 5, 'green');

    return [phaseTerminal, neutralTerminal, groundTerminal]
};