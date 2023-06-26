class Wire {
    constructor(start, end, nodeRadius, nodeColor) {
        this.id = lastWireId + 1
        this.start = start;
        this.end = end;
        this.nodeRadius = nodeRadius;
        this.nodeColor = nodeColor;
        this.nodeConnected = {
            start: null,
            end: null
        }
        this.draggingNode = {
            start: false,
            end: false
        };
        this.isDraggingWire = false;
        this.threshold = 2;
        this.offset = {
            x: 0,
            y: 0
        };
        lastWireId = this.id
    }

    draw(ctx) {
        // Set the line color and width
        ctx.strokeStyle = this.nodeColor;
        ctx.lineWidth = 2;

        // Start drawing the wire
        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.stroke();

        // Draw the nodes
        ctx.beginPath();
        ctx.arc(this.start.x, this.start.y, this.nodeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = this.nodeColor;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.end.x, this.end.y, this.nodeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = this.nodeColor;
        ctx.fill();
    }

    // Check if a node is being dragged
    checkDraggingNode(mousePosition) {
        const startDist = euclidianDistance(mousePosition, this.start);
        const endDist = euclidianDistance(mousePosition, this.end);

        if (startDist <= this.nodeRadius) {
            this.draggingNode.start = true;
        } else if (endDist <= this.nodeRadius) {
            this.draggingNode.end = true;
        }
    }

    // Check if the wire is being dragged
    checkDraggingWire(mousePosition) {
        const dx = this.end.x - this.start.x;
        const dy = this.end.y - this.start.y;
        const distance = Math.abs(dy * mousePosition.x - dx * mousePosition.y + this.end.x * this.start.y - this.end.y * this.start.x) / Math.sqrt(dy * dy + dx * dx);
        if (distance <= this.nodeRadius) {
            this.isDraggingWire = true;
            this.offset.x = mousePosition.x - this.start.x;
            this.offset.y = mousePosition.y - this.start.y;
        }
    }

    // Update the wire position while dragging
    updatePosition(mousePosition) {
        for (let terminal of terminals) {
            if (this.draggingNode.start) {
                this.start.x = mousePosition.x;
                this.start.y = mousePosition.y;

                // Check if the start node is close to a terminal
                if (this.isNodeCloseToTerminal(this.start, terminal) && !this.nodeConnected.start) {
                    this.connectToTerminal(this.start, 'start', terminal);
                }
                if (this.draggingNode.start && this.nodeConnected.start) {
                    this.disconnectFromTerminal('start');
                }

            } else if (this.draggingNode.end) {
                this.end.x = mousePosition.x;
                this.end.y = mousePosition.y;

                // Check if the end node is close to a terminal
                if (this.isNodeCloseToTerminal(this.end, terminal) && !this.nodeConnected.end) {
                    this.connectToTerminal(this.end, 'end', terminal);
                }
                if (this.draggingNode.end && this.nodeConnected.end) {
                    this.disconnectFromTerminal('end');
                }
            }
        }
        if (this.isDraggingWire && !(this.nodeConnected.start || this.nodeConnected.end)) {
            const dx = mousePosition.x - this.offset.x - this.start.x;
            const dy = mousePosition.y - this.offset.y - this.start.y;
            this.start.x += dx;
            this.start.y += dy;
            this.end.x += dx;
            this.end.y += dy;
            this.offset.x = mousePosition.x - this.start.x;
            this.offset.y = mousePosition.y - this.start.y;
        }
    }

    // Check if a node is close to a terminal
    isNodeCloseToTerminal(nodePosition, terminal) {
        // Calculate the distance between the node and each terminal
        const nodeDistToTerminal = euclidianDistance(nodePosition, terminal);

        // Check if any distance is below the threshold
        return nodeDistToTerminal <= this.threshold
    }

    // Connect a node to a terminal
    connectToTerminal(nodePosition, nodeType, terminal) {
        // Check if the node is close to the terminal
        const terminalDist = euclidianDistance(nodePosition, terminal);
        if (terminalDist <= this.threshold) {
            terminal.connections.push(this)
            if (nodeType === 'start') {
                this.start.x = terminal.x;
                this.start.y = terminal.y;
                this.nodeConnected.start = terminal;
            } else if (nodeType === 'end') {
                this.end.x = terminal.x;
                this.end.y = terminal.y;
                this.nodeConnected.end = terminal;
            }
            this.resetDraggingNode();
        }
    }

    // Disconnect a node from a terminal
    disconnectFromTerminal(type) {
        console.log(this)
        if (type == "start") {
            let connectedTerminal = this.nodeConnected.start
            connectedTerminal.connections = connectedTerminal.connections.filter((connection) => connection.id != this.id)
            this.nodeConnected.start = null;

        }
        if (type == "end") {
            let connectedTerminal = this.nodeConnected.end
            connectedTerminal.connections = connectedTerminal.connections.filter((connection) => connection.id != this.id)
            this.nodeConnected.end = null;
        }
    }

    // Reset dragging state
    resetDraggingNode() {
        this.draggingNode.start = false;
        this.draggingNode.end = false;
    }

    resetDraggingWire() {
        this.isDraggingWire = false;
    }

}
