export class Terminal {
    constructor(x, y, outerRadius, innerRadius, color) {
        this.x = x;
        this.y = y;
        this.outerRadius = outerRadius;
        this.innerRadius = innerRadius;
        this.color = color;
        this.connected = false;
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
        ctx.fillStyle = 'white';
        ctx.fill();
    }
}