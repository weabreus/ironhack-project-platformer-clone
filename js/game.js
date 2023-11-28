let collisionBlocks = [];
let platformCollisionsBlocks = [];
let questionBoxesCollisionsBlocks = [];
let endGameCollisionsBlocks = [];
let bricksCollisionsBlocks = [];
let stageItems = [];

class Game {
  constructor(
    floorCollisions,
    platformCollisions,
    questionBoxesCollisions,
    endGameCollisions,
    brickCollisions
  ) {
    this.startTime = null;
    this.elapsedTime = 0;
    this.animationFrameId = null;
    this.startScreen = document.getElementById("game-intro");
    this.gameScreen = document.getElementById("game-container");
    this.gameEndScreen = document.getElementById("game-end");
    this.resultsTimeElement = document.getElementById("results-time-element");
    this.resultsScoreElement = document.getElementById("results-score-element");
    this.lostScreen = document.getElementById("game-lost");
    this.canvas = document.querySelector("canvas");
    this.canvasContext = this.canvas.getContext("2d");
    this.player = null;
    this.obstacles = [];
    this.score = 0;
    this.lives = 1;
    this.isGameOver = false;
    this.isGameLost = false;
    this.background = new Sprite({
      canvas: this.canvas,
      canvasContext: this.canvasContext,
      position: {
        x: 0,
        y: 0,
      },
      imgSrc: "./images/level1-main-background.png",
    });
    this.scaledCanvas = {
      width: this.canvas.width / 2,
      height: this.canvas.height / 2,
    };
    this.floorCollisions = floorCollisions;

    this.platformCollisions = platformCollisions;

    this.questionBoxesCollisions = questionBoxesCollisions;
    this.endGameCollisions = endGameCollisions;
    this.brickCollisions = brickCollisions;

    this.camera = {
      position: {
        x: 0,
        y: 0,
      },
    };
  }

  start() {
    initializeLeaderboard();
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.scaledCanvas.width = this.canvas.width / 2;
    this.scaledCanvas.height = this.canvas.height / 2;

    this.startScreen.style.display = "none";
    this.gameScreen.style.display = "block";

    // add collision blocks to the array
    this.floorCollisions.forEach((row, y) => {
      row.forEach((symbol, x) => {
        if (symbol === 4753) {
          collisionBlocks.push(
            new CollisionBlock({
              canvas: this.canvas,
              canvasContext: this.canvasContext,
              position: { x: x * 16, y: y * 16 },
            })
          );
        }
      });
    });

    // add platform collision blocks to the array
    this.platformCollisions.forEach((row, y) => {
      row.forEach((symbol, x) => {
        if (symbol === 4753) {
          platformCollisionsBlocks.push(
            new CollisionBlock({
              canvas: this.canvas,
              canvasContext: this.canvasContext,
              position: {
                x: x * 16,
                y: y * 16,
              },
              height: 16,
            })
          );
        }
      });
    });

    this.createPlayer();

    // add questionBoxes collision blocks to the array
    this.questionBoxesCollisions.forEach((row, y) => {
      row.forEach((symbol, x) => {
        if (symbol === 4753) {
          questionBoxesCollisionsBlocks.push(
            new QuestionBlock({
              canvas: this.canvas,
              canvasContext: this.canvasContext,
              position: {
                x: x * 16,
                y: y * 16,
              },
              imgSrc:
                "./images/sprites/question-box-inactive-sprite-sheet.png",
              frameRate: 4,
              scale: 1,
              player: this.player,
            })
          );
        }
      });
    });

    // add endgame collisions
    this.endGameCollisions.forEach((row, y) => {
      row.forEach((symbol, x) => {
        if (symbol === 4753) {
          questionBoxesCollisionsBlocks.push(
            new EndGameCard({
              canvas: this.canvas,
              canvasContext: this.canvasContext,
              position: {
                x: x * 16 - 5,
                y: y * 16 - 5,
              },
              imgSrc: "./images/sprites/end-game-cards.png",
              frameRate: 3,
              scale: 1,
              player: this.player,
            })
          );
        }
      });
    });

    // add bricks collision blocks to the array
    this.brickCollisions.forEach((row, y) => {
      row.forEach((symbol, x) => {
        if (symbol === 4753) {
          bricksCollisionsBlocks.push(
            new BrickBlock({
              canvas: this.canvas,
              canvasContext: this.canvasContext,
              position: {
                x: x * 16,
                y: y * 16,
              },
              imgSrc: "./images/sprites/brick-sprite-sheet.png",
              frameRate: 4,
              scale: 1,
              player: this.player,
            })
          );
        }
      });
    });

    this.player.draw();
    this.startTime = Date.now();
    this.animationFrameId = window.requestAnimationFrame((timestamp) =>
      this.gameLoop(timestamp)
    );
  }

  restart() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.scaledCanvas.width = this.canvas.width / 2;
    this.scaledCanvas.height = this.canvas.height / 2;

    this.createPlayer();

    // add questionBoxes collision blocks to the array
    this.questionBoxesCollisions.forEach((row, y) => {
      row.forEach((symbol, x) => {
        if (symbol === 4753) {
          questionBoxesCollisionsBlocks.push(
            new QuestionBlock({
              canvas: this.canvas,
              canvasContext: this.canvasContext,
              position: {
                x: x * 16,
                y: y * 16,
              },
              imgSrc:
                "./images/sprites/question-box-inactive-sprite-sheet.png",
              frameRate: 4,
              scale: 1,
              player: this.player,
            })
          );
        }
      });
    });

    this.player.draw();
    this.startTime = Date.now();
    playMusic();
    this.animationFrameId = window.requestAnimationFrame((timestamp) =>
      this.gameLoop(timestamp)
    );
  }
  gameLoop(timestamp) {
    console.log("game looping");
    if (this.isGameOver) return;
    if (this.isGameLost) return;

    const deltaTime = timestamp - lastFrameTime;

    if (deltaTime >= frameDelay) {
      this.update();

      this.player.velocity.x = 0;
      if (this.player.keys.d.pressed) {
        this.player.switchSprite("run");
        this.player.velocity.x = 5;
        this.player.shouldPanCameraToTheLeft();
      } else if (this.player.keys.a.pressed) {
        this.player.switchSprite("runLeft");
        this.player.velocity.x = -5;
        this.player.shouldPanCameraToTheRight();
      } else if (this.player.velocity.x === 0) {
        this.player.switchSprite(
          this.player.direction === "right" ? "idle" : "idleLeft"
        );
      }

      if (this.player.velocity.y > 0.5 || this.player.velocity.y < 0) {
        this.player.switchSprite(
          this.player.direction === "right" ? "jump" : "jumpLeft"
        );
      }

      lastFrameTime = timestamp;
    }

    window.requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
  }

  update() {
    // Update timer
    this.elapsedTime = Date.now() - this.startTime;
    this.updateInformationUI();
    // Clear the canvas in each frame
    this.canvasContext.fillStyle = "white";
    this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Update the background
    this.canvasContext.save();
    this.canvasContext.scale(2, 2);
    this.canvasContext.translate(
      this.camera.position.x,
      -this.background.image.height + this.scaledCanvas.height
    );

    this.background.update();

    // render collision blocks
    // collisionBlocks.forEach((block) => block.update());
    // render platform collision blocks
    // platformCollisionsBlocks.forEach((block) => block.update());
    // render questionBox collision block
    questionBoxesCollisionsBlocks.forEach((block) => block.update());

    // render brick blocks
    bricksCollisionsBlocks.forEach((block) => block.update());
    // render end game cards collision block
    endGameCollisionsBlocks.forEach((block) => block.update());

    this.player.checkForHorizontalCanvasCollision();
    // Render stage items
    stageItems.forEach((item, index) => {
      if (item instanceof BlockCoin) {
        if (item.status === "expired") return stageItems.splice(index, 1);
        item.update();
      } else {
        item.move();
      }
    });
    // Update the player position in each frame
    this.player.move();

    this.canvasContext.restore();

    if (this.lives === 0) {
      this.endGame();
    }
  }

  loseGame() {
    pauseMusic();
    playSoundEffectBuffer(deathSoundBuffer);
    this.isGameLost = true;
    this.lostScreen.style.display = "flex";
  }

  endGame() {
    this.isGameOver = true;
    pauseMusic();
    playSoundEffectBuffer(levelClearBuffer);

    setTimeout(() => {
      playSoundEffectBuffer(overworldBuffer);
    }, 3000);

    addToLeaderboard({
      date: formatDate(Date.now()),
      time: this.elapsedTime,
      score: this.score,
    });

    let leaderboard = getLeaderboard();
    let sortedLeaderboard = sortLeaderboard(leaderboard);
    let topScores = getTop10Scores(sortedLeaderboard);
    // Here i need to add these scores to the HTML table
    topScores.forEach((score) =>
      addRowToLeaderboard(score.date, score.time, score.score)
    );
    this.resultsTimeElement.innerHTML = `final time: ${Math.floor(
      this.elapsedTime / 1000
    ).toLocaleString()} seconds`;
    this.resultsScoreElement.innerHTML = `final score: ${this.score.toLocaleString()}`;
    this.gameScreen.style.display = "none";
    this.gameEndScreen.style.display = "flex";
  }

  createPlayer() {
    this.player = new Player({
      background: this.background,
      camera: this.camera,
      canvas: this.canvas,
      canvasContext: this.canvasContext,
      position: {
        x: 50,
        y: 100,
      },
      collisionBlocks: collisionBlocks,
      platformCollisionsBlocks: platformCollisionsBlocks,
      questionBoxesCollisionsBlocks: questionBoxesCollisionsBlocks,
      imgSrc: "./images/sprites/mario-standing-right.png",
      frameRate: 1,
      animations: {
        idle: {
          imgSrc: "./images/sprites/mario-standing-right.png",
          frameRate: 1,
          frameBuffer: 8,
        },
        idleLeft: {
          imgSrc: "./images/sprites/mario-standing-left.png",
          frameRate: 1,
          frameBuffer: 8,
        },
        run: {
          imgSrc: "./images/sprites/mario-running.png",
          frameRate: 2,
          frameBuffer: 8,
        },
        runLeft: {
          imgSrc: "./images/sprites/mario-running-left.png",
          frameRate: 2,
          frameBuffer: 8,
        },
        jump: {
          imgSrc: "./images/sprites/mario-jumping-right.png",
          frameRate: 1,
          frameBuffer: 8,
        },
        jumpLeft: {
          imgSrc: "./images/sprites/mario-jumping-left.png",
          frameRate: 1,
          frameBuffer: 8,
        },
      },
      scale: 1,
    });
  }

  updateInformationUI() {
    let seconds = Math.floor(this.elapsedTime / 1000);
    scoreContainer.innerHTML = `time: ${seconds.toLocaleString()} score: ${this.score.toLocaleString()}`;
  }
}
