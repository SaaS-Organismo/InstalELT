function createWire(color) {
    const startX = 0.3 * canvas.width;
    const startY = 0.3 * canvas.height;
    const endX = 0.5 * canvas.width;
    const endY = 0.5 * canvas.height;
    const nodeRadius = 5;

    const newWire = new Wire(startX, startY, endX, endY, nodeRadius, color);
    wires.push(newWire);
    newWire.draw(ctx);
}