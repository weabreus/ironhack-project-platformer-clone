// Global variables
let game;
let scoreContainer;
let backgroundMusic;

const gravity = 0.5;
const targetFPS = 60;
const frameDelay = 1000 / targetFPS;
let lastFrameTime = 0;

let audioContext = new (window.AudioContext || window.webkitAudioContext)();

let jumpSoundBuffer;
let bumpSoundBuffer;
let coinSoundBuffer;
let oneUpSoundBuffer;
let deathSoundBuffer;
let levelClearBuffer;
let overworldBuffer;

loadSoundEffect("../audio/sfx/Mario Jump.wav").then(buffer => {
  jumpSoundBuffer = buffer;
});

loadSoundEffect("../audio/sfx/smb3_bump.wav").then(buffer => {
  bumpSoundBuffer = buffer;
});

loadSoundEffect("../audio/sfx/Coin.wav").then(buffer => {
  coinSoundBuffer = buffer;
})

loadSoundEffect("../audio/sfx/smb3_1-up.wav").then(buffer => {
  oneUpSoundBuffer = buffer;
})

loadSoundEffect("../audio/sfx/Death.wav").then(buffer => {
  deathSoundBuffer = buffer;
})

loadSoundEffect("../audio/sfx/smb3_level_clear.wav").then(buffer => {
  levelClearBuffer = buffer;
})

loadSoundEffect("../audio/sfx/overworld.mp3").then(buffer => {
  overworldBuffer = buffer;
})

window.onload = function () {
  backgroundMusic = document.getElementById("background-music");
  
  let startButton = document.getElementById("start-button");
  let continueButton = document.getElementById("continue-button");
  let endButton = document.getElementById("end-button");
  let continueButtonEnd = document.getElementById("game-end-continue-button");
  scoreContainer = document.getElementById("score");

  startButton.addEventListener("click", function () {
    startGame();
  });

  function startGame() {
    console.log("start game");

    game = new Game(
      floorCollisions2D,
      platformCollisions2D,
      questionBoxesCollisions2D,
      endGameCollisions2D
    );
    game.start();
    playMusic();
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
        playSoundEffectBuffer(jumpSoundBuffer);
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
        questionBoxesCollisions2D,
        endGameCollisions2D
      );
      game.restart();
    });

    endButton.addEventListener("click", () => {
      location.reload();
    })

    continueButtonEnd.addEventListener("click", () => {
      location.reload();
    })
  });
};
