import { Wire } from '../classes/Wire.js';


export default function createWire(canvas, color, wires) {
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