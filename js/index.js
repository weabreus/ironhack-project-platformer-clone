// Global variables
let game;
let scoreContainer;

const gravity = 0.5;
const targetFPS = 60;
const frameDelay = 1000 / targetFPS;
let lastFrameTime = 0;

window.onload = function () {
  let startButton = document.getElementById("start-button");
  let continueButton = document.getElementById("continue-button");
  let endButton = document.getElementById("end-button");
  scoreContainer = document.getElementById("score");

  startButton.addEventListener("click", function () {
    startGame();
  });

  function startGame() {
    console.log("start game");

    game = new Game(
      floorCollisions2D,
      platformCollisions2D,
      questionBoxesCollisions2D
    );
    game.start();
  }

  window.addEventListener("resize", function () {
    if (game) {
      game.canvas.width = window.innerWidth;
      game.canvas.height = window.innerHeight;
      game.scaledCanvas.width = game.canvas.width;
      game.scaledCanvas.height = game.canvas.height;
    }
  });

  // Player movement
  window.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "d":
        game.player.keys.d.pressed = true;
        game.player.direction = "right";
        // game.player.velocity.x = 1;
        break;
      case "a":
        game.player.keys.a.pressed = true;
        game.player.direction = "left";
        game.player.velocity.x = -1;
        break;
      case "w":
        game.player.velocity.y = -18 / 2;
        break;
    }
  });

  window.addEventListener("keyup", function (event) {
    switch (event.key) {
      case "d":
        game.player.keys.d.pressed = false;

        // game.player.velocity.x = 1;
        break;
      case "a":
        game.player.keys.a.pressed = false;

        // game.player.velocity.x = -1;
        break;
    }

    continueButton.addEventListener("click", (event) => {
      scoreContainer.innerHTML = `points: 0`;
      window.cancelAnimationFrame(game.animationFrameId);
      questionBoxesCollisionsBlocks = [];
      let lostScreen = document.getElementById("game-lost");
      lostScreen.style.display = "none";
      game.canvasContext.clearRect(0, 0, game.canvas.width, game.canvas.height);
      game = null;
      game = new Game(
        floorCollisions2D,
        platformCollisions2D,
        questionBoxesCollisions2D
      );
      game.restart();
    });

    endButton.addEventListener("click", () => {
      location.reload();
    })
  });
};
