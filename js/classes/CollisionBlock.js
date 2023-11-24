class CollisionBlock {
  constructor({ canvas, canvasContext, position }) {
    this.canvas = canvas;
    this.canvasContext = canvasContext;
    this.position = position;
    this.width = 16;
    this.height = 16;
  }

  draw() {
    this.canvasContext.fillStyle = 'rgba(255, 0, 0, 0.5)'
    this.canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
  }
}
