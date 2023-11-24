// Global variables
const gravity = 0.5;

window.onload = function () {
  let startButton = document.getElementById("start-button");
  let game;
  startButton.addEventListener("click", function () {
    startGame();
  });

  function startGame() {
    console.log("start game");

    game = new Game(floorCollisions2D, platformCollisions2D);
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
window.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'd':
            game.player.keys.d.pressed = true;
            // game.player.velocity.x = 1;
            break;
        case 'a':
            game.player.keys.a.pressed = true;
            game.player.velocity.x = -1;
            break;
        case 'w':
            game.player.velocity.y = -18 / 2;
            break;
    }
});

window.addEventListener('keyup', function (event) {
    switch (event.key) {
        case 'd':
            game.player.keys.d.pressed = false;
            // game.player.velocity.x = 1;
            break;
        case 'a':
            game.player.keys.a.pressed = false;
            // game.player.velocity.x = -1;
            break;
       
    }
});
};
