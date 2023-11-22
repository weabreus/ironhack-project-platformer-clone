class Sprite {
    constructor({canvas, canvasContext, position, imgSrc}) {
        this.canvas = canvas;
        this.canvasContext = canvasContext;
        this.position = position;
        this.image = new Image();
        this.image.src = imgSrc;
    }

    draw() {
        if (!this.image) return;
        this.canvasContext.drawImage(this.image, this.position.x, this.position.y);
    }

    update() {
        this.draw();
    }
}