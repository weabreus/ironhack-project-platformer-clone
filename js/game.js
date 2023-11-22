class Game {
  constructor() {
    this.startScreen = document.getElementById("game-intro");
    this.gameScreen = document.getElementById("game-container");
    this.gameEndScreen = document.getElementById("game-end");
    this.canvas = document.querySelector("canvas");
    this.canvasContext = this.canvas.getContext("2d");
    this.player = null;
    this.obstacles = [];
    this.score = 0;
    this.lives = 1;
    this.isGameOver = false;
    this.background = new Sprite({
      canvas: this.canvas,
      canvasContext: this.canvasContext,
      position: {
        x: 0,
        y: 0,
      },
      imgSrc: "../images/level1-main-background.png",
    });
    this.scaledCanvas = {
        width: this.canvas.width / 2,
        height: this.canvas.height / 2
    }
  }

  start() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.scaledCanvas.width = this.canvas.width / 2;
    this.scaledCanvas.height = this.canvas.height / 2;

 
    this.startScreen.style.display = "none";
    this.gameScreen.style.display = "block";
    this.player = new Player(this.canvas, this.canvasContext, {
      x: 100,
      y: 100,
    });
    this.player.draw();
    this.gameLoop();
  }

  gameLoop() {
    if (this.isGameOver) return;
    this.update();

    this.player.velocity.x = 0;
    if (this.player.keys.d.pressed) {
      this.player.velocity.x = 5;
    } else if (this.player.keys.a.pressed) {
      this.player.velocity.x = -5;
    }

    window.requestAnimationFrame(() => this.gameLoop());
  }

  update() {
    // Clear the canvas in each frame
    this.canvasContext.fillStyle = "white";
    this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Update the background
    this.canvasContext.save();
    this.canvasContext.scale(2, 2);
    this.canvasContext.translate(0, -this.background.image.height + this.scaledCanvas.height);
    this.background.update();
    this.canvasContext.restore();

    // Update the player position in each frame
    this.player.move();

    if (this.lives === 0) {
      this.endGame();
    }
  }

  endGame() {
    this.isGameOver = true;
    this.gameScreen.style.display = "none";
    this.gameEndScreen.style.display = " block";
  }
}
