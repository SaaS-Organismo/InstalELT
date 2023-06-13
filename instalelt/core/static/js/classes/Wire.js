export class Wire {
    constructor(startX, startY, endX, endY, nodeRadius, nodeColor) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.nodeRadius = nodeRadius;
        this.nodeColor = nodeColor;
        this.startConnected = false;
        this.endConnected = false;
        this.draggingStart = false;
        this.draggingEnd = false;
    }

    draw(ctx) {
        // Set the line color and width
        ctx.strokeStyle = this.nodeColor;
        ctx.lineWidth = 2;

        // Start drawing the wire
        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
        ctx.stroke();

        // Draw the nodes
        ctx.beginPath();
        ctx.arc(this.startX, this.startY, this.nodeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = this.nodeColor;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.endX, this.endY, this.nodeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = this.nodeColor;
        ctx.fill();
    }

    // Check if a node is being dragged
    checkDraggingNode(x, y) {
        const startDist = Math.sqrt((x - this.startX) ** 2 + (y - this.startY) ** 2);
        const endDist = Math.sqrt((x - this.endX) ** 2 + (y - this.endY) ** 2);

        if (startDist <= this.nodeRadius) {
            this.draggingStart = true;
        } else if (endDist <= this.nodeRadius) {
            this.draggingEnd = true;
        }
    }

    // Update the wire position while dragging
    updatePosition(x, y) {
        if (this.draggingStart) {
            this.startX = x;
            this.startY = y;

            // Check if the start node is close to a terminal
            if (this.isNodeCloseToTerminal(this.startX, this.startY)) {
                if (!this.startConnected) {
                    this.connectToTerminal(this.startX, this.startY, 'start')
                } else {
                    this.disconnectFromTerminal()
                }

            }
        } else if (this.draggingEnd) {
            this.endX = x;
            this.endY = y;

            // Check if the end node is close to a terminal
            if (this.isNodeCloseToTerminal(this.endX, this.endY)) {
                if (!this.endConnected) {
                    this.connectToTerminal(this.endX, this.endY, 'end')
                } else {
                    this.disconnectFromTerminal()
                }

            }
        }
    }

    // Check if a node is close to a terminal
    isNodeCloseToTerminal(x, y) {
        const threshold = 3; // Adjust this value as needed

        // Calculate the distance between the node and each terminal
        const phaseDist = Math.sqrt((x - phaseTerminal.x) ** 2 + (y - phaseTerminal.y) ** 2);
        const neutralDist = Math.sqrt((x - neutralTerminal.x) ** 2 + (y - neutralTerminal.y) ** 2);
        const groundDist = Math.sqrt((x - groundTerminal.x) ** 2 + (y - groundTerminal.y) ** 2);

        // Check if any distance is below the threshold
        return phaseDist <= threshold || neutralDist <= threshold || groundDist <= threshold;
    }

    // Connect a node to a terminal
    connectToTerminal(x, y, nodeType) {
        // Check if the node is close to the phase terminal
        const phaseDist = Math.sqrt((x - phaseTerminal.x) ** 2 + (y - phaseTerminal.y) ** 2);
        if (!phaseTerminal.connected && phaseDist <= 3 && this.nodeColor === phaseTerminal.color) {
            phaseTerminal.connected = true;
            if (nodeType === 'start') {
                this.startX = phaseTerminal.x;
                this.startY = phaseTerminal.y;
                this.startConnected = true;
            } else if (nodeType === 'end') {
                this.endX = phaseTerminal.x;
                this.endY = phaseTerminal.y;
                this.endConnected = true;
            }
            this.resetDragging();
        }
        // Check if the node is close to the neutral terminal
        const neutralDist = Math.sqrt((x - neutralTerminal.x) ** 2 + (y - neutralTerminal.y) ** 2);
        if (!neutralTerminal.connected && neutralDist <= 3 && this.nodeColor === neutralTerminal.color) {
            neutralTerminal.connected = true;
            if (nodeType === 'start') {
                this.startX = neutralTerminal.x;
                this.startY = neutralTerminal.y;
                this.startConnected = true;
            } else if (nodeType === 'end') {
                this.endX = neutralTerminal.x;
                this.endY = neutralTerminal.y;
                this.endConnected = true;
            }
            this.resetDragging();
        }

        // Check if the node is close to the ground terminal
        const groundDist = Math.sqrt((x - groundTerminal.x) ** 2 + (y - groundTerminal.y) ** 2);
        if (!groundTerminal.connected && groundDist <= 3 && this.nodeColor === groundTerminal.color) {
            groundTerminal.connected = true;
            if (nodeType === 'start') {
                this.startX = groundTerminal.x;
                this.startY = groundTerminal.y;
                this.startConnected = true;
            } else if (nodeType === 'end') {
                this.endX = groundTerminal.x;
                this.endY = groundTerminal.y;
                this.endConnected = true;
            }
            this.resetDragging();
        }
    }

    // Disconnect a node from a terminal
    disconnectFromTerminal() {
        if (this.draggingStart && this.startConnected) {
            this.startConnected = false;
            if (this.nodeColor === phaseTerminal.color) {
                phaseTerminal.connected = false;
            } else if (this.nodeColor === neutralTerminal.color) {
                neutralTerminal.connected = false;
            } else if (this.nodeColor === groundTerminal.color) {
                groundTerminal.connected = false;
            }

        }
        if (this.draggingEnd && this.endConnected) {
            this.endConnected = false;
            if (this.nodeColor === phaseTerminal.color) {
                phaseTerminal.connected = false;
            } else if (this.nodeColor === neutralTerminal.color) {
                neutralTerminal.connected = false;
            } else if (this.nodeColor === groundTerminal.color) {
                groundTerminal.connected = false;
            }
        }
    }

    // Reset dragging state
    resetDragging() {
        this.draggingStart = false;
        this.draggingEnd = false;
    }
};
