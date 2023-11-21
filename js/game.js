class Game {
  constructor() {
    this.startScreen = document.getElementById("game-intro");
    this.gameScreen = document.getElementById("game-container");
    this.gameEndScreen = document.getElementById("game-end");
    this.player = null;
    this.obstacles = [];
    this.score = 0;
    this.lives = 1;
    this.isGameOver = false;
  }

  start() {
    this.startScreen.style.display = "none";
    this.gameScreen.style.display = "block";
    this.gameLoop();
  }

  gameLoop() {
    if (this.isGameOver) return;
    this.update();
    window.requestAnimationFrame(() => this.gameLoop());
  }

  update() {
    if(this.lives === 0) {
        this.endGame();
    }
  }

  endGame() {
    this.isGameOver = true;
    this.gameScreen.style.display = 'none';
    this.gameEndScreen.style.display = ' block';
  }
}
