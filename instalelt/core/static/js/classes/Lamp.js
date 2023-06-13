import { Terminal } from './Terminal.js';
import { ctx } from '../script.js';

export class Lamp extends Terminal {
    constructor(x, y, outerRadius, innerRadius, color) {
        super(x, y, outerRadius, innerRadius, color);
        this.connected = true;
        this.image = new Image();
        this.image.src = '../static/images/lamp_bulb.png';
        this.image.onload = () => {
            this.draw(ctx);
        }
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y - 130, 100, 150);

        // Draw the outer circle top
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.outerRadius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Draw the inner circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.innerRadius, 0, Math.PI * 2, true);
        ctx.fillStyle = 'white';
        ctx.fill();

        // Draw the outer circle bottom
        ctx.beginPath();
        ctx.arc(this.x + 100, this.y, this.outerRadius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Draw the inner circle
        ctx.beginPath();
        ctx.arc(this.x + 100, this.y, this.innerRadius, 0, Math.PI * 2, true);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
}