export default function redrawCanvas(canvas, ctx, elements, terminals, wires) {
    // Clear the canvas and redraw all wires and nodes
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const element of elements) {
        element.draw(ctx);
    };

    for (const terminal of terminals) {
        terminal.draw(ctx);
    };

    for (const wire of wires) {
        wire.draw(ctx);
    };
};