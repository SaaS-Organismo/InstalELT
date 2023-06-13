import { Terminal } from './Terminal.js';
import { ctx } from '../script.js'; 

export class LightSwitch extends Terminal {
    constructor(x, y, outerRadius, innerRadius, color) {
        super(x, y, outerRadius, innerRadius, color);
        this.connected = true;
        this.image = new Image();
        this.image.src = '../static/images/light_switch.png';
        this.image.onload = () => {
            this.draw(ctx);
        };
        this.TopTerminal = null;
        this.BottomTerminal = null;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x - 65, this.y, 130, 150);   
        this.TopTerminal = this.drawTopTerminal(ctx);
        this.BottomTerminal = this.drawBottomTerminal(ctx);
    }

    drawTopTerminal(ctx) {
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
    }

    drawBottomTerminal(ctx) {
         // Draw the outer circle bottom
         ctx.beginPath();
         ctx.arc(this.x, this.y + 150, this.outerRadius, 0, Math.PI * 2, false);
         ctx.fillStyle = this.color;
         ctx.fill();
 
         // Draw the inner circle
         ctx.beginPath();
         ctx.arc(this.x, this.y + 150, this.innerRadius, 0, Math.PI * 2, true);
         ctx.fillStyle = 'white';
         ctx.fill();
    }

}