let collisionBlocks = [];
let platformCollisionsBlocks = [];
let questionBoxesCollisionsBlocks = [];
let stageItems = [];

class Game {
  constructor(floorCollisions, platformCollisions, questionBoxesCollisions) {
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
      height: this.canvas.height / 2,
    };
    this.floorCollisions = floorCollisions;

    this.platformCollisions = platformCollisions;

    this.questionBoxesCollisions = questionBoxesCollisions;

    this.camera = {
      position: {
        x: 0,
        y: 0,
      },
    };
  }

  start() {
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
      imgSrc: "../images/sprites/mario-standing-right.png",
      frameRate: 1,
      animations: {
        idle: {
          imgSrc: "../images/sprites/mario-standing-right.png",
          frameRate: 1,
          frameBuffer: 8,
        },
        idleLeft: {
          imgSrc: "../images/sprites/mario-standing-left.png",
          frameRate: 1,
          frameBuffer: 8,
        },
        run: {
          imgSrc: "../images/sprites/mario-running.png",
          frameRate: 2,
          frameBuffer: 8,
        },
        runLeft: {
          imgSrc: "../images/sprites/mario-running-left.png",
          frameRate: 2,
          frameBuffer: 8,
        },
        jump: {
          imgSrc: "../images/sprites/mario-jumping-right.png",
          frameRate: 1,
          frameBuffer: 8,
        },
        jumpLeft: {
          imgSrc: "../images/sprites/mario-jumping-left.png",
          frameRate: 1,
          frameBuffer: 8,
        },
      },
      scale: 1,
    });

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
                "../images/sprites/question-box-inactive-sprite-sheet.png",
              frameRate: 4,
              scale: 1,
              player: this.player,
            })
          );
        }
      });
    });

    this.player.draw();
    window.requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
  }

  gameLoop(timestamp) {
    if (this.isGameOver) return;

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
    collisionBlocks.forEach((block) => block.update());
    // render platform collision blocks
    platformCollisionsBlocks.forEach((block) => block.update());
    // render questionBox collision block
    questionBoxesCollisionsBlocks.forEach((block) => block.update());
    this.player.checkForHorizontalCanvasCollision();
    // Render stage items
    stageItems.forEach((item, index) => {
      if (item instanceof BlockCoin) {
        if(item.status === 'expired') return stageItems.splice(index, 1);
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

  endGame() {
    this.isGameOver = true;
    this.gameScreen.style.display = "none";
    this.gameEndScreen.style.display = " block";
  }
}
