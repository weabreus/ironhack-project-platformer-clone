class Player {
    constructor(canvas, canvasContext, position) {
        this.canvas = canvas;
        this.canvasContext = canvasContext;
        this.position = position;
        this.velocity = {
            x: 0,
            y: 1
        };
        this.height = 100;
        this.width = 100;
        this.keys = {
            d: {
                pressed: false
            },
            a: {
                pressed: false
            },
            w: {
                pressed: false
            },
            s: {
                pressed: false
            }
        }
    }

    draw() {
        this.canvasContext.fillStyle = 'red';
        this.canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    move() {

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
        if (this.position.y + this.height + this.velocity.y < this.canvas.height) {
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
        }
        
        this.draw();
    }
}