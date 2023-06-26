class LightSwitch {
    constructor(x, y, color) {
        this.x = x
        this.y = y
        this.connected = true;
        this.image = new Image();
        this.image.src = '../static/images/light_switch.png';
        this.image.onload = () => {
            this.draw(ctx)
        }
        this.topTerminal = new Terminal(x, y, 15, 5, color);
        this.bottomTerminal = new Terminal(x, y + 150, 15, 5, color);
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x - 65, this.y, 130, 150);
    }
}
