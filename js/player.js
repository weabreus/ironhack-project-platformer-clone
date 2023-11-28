class Player extends Sprite {
  constructor({
    background,
    camera,
    canvas,
    canvasContext,
    position,
    imgSrc,
    frameRate,
    animations,
    scale = 1,
  }) {
    super({ imgSrc, frameRate, scale });
    this.jumps = 2;
    this.background = background;
    this.camera = camera;
    this.canvas = canvas;
    this.canvasContext = canvasContext;
    this.position = position;
    this.hitbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 16,
      height: 16,
    };
    this.camerabox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 200,
      height: 80,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };
    this.keys = {
      d: {
        pressed: false,
      },
      a: {
        pressed: false,
      },
      w: {
        pressed: false,
      },
      s: {
        pressed: false,
      },
    };
    this.direction = "right";
    this.animations = animations;

    for (let key in this.animations) {
      const image = new Image();
      image.src = this.animations[key].imgSrc;
      this.animations[key].image = image;
    }
  }

  //   draw() {
  //     this.canvasContext.fillStyle = "red";
  //     this.canvasContext.fillRect(
  //       this.position.x,
  //       this.position.y,
  //       this.width,
  //       this.height
  //     );
  //   }

  move() {
    this.checkIfGameLost();
    this.updateFrames();
    this.updateHitbox();
    this.updateCamerabox();

    // draw the camera box
    // this.canvasContext.fillStyle = "rgba(0,0,255,0.6";
    // this.canvasContext.fillRect(
    //   this.camerabox.position.x,
    //   this.camerabox.position.y,
    //   this.camerabox.width,
    //   this.camerabox.height
    // );
    // this.canvasContext.fillStyle = "rgba(0, 0, 255, 0.2)";
    // this.canvasContext.fillRect(
    //   this.position.x,
    //   this.position.y,
    //   this.width,
    //   this.height
    // );

    // draw the hitbox
    // this.canvasContext.fillStyle = "rgba(255, 0, 0, 0.2)";
    // this.canvasContext.fillRect(
    //   this.hitbox.position.x,
    //   this.hitbox.position.y,
    //   this.hitbox.width,
    //   this.hitbox.height
    // );

    this.update();

    if(!game.isGameLost) this.position.x += this.velocity.x;
    this.updateHitbox();
    this.checkForHorizontalCollisions();
    if(!game.isGameLost) this.applyGravity();
    this.updateHitbox();
    // I need to check multiple times for vertical collision based on velocity.y to avoid "Bullet thru paper" effect
    let numberOfChecks = Math.abs(Math.ceil(this.velocity.y * 2));

    for (let i = 0; i < numberOfChecks; i++) {
      if (this.checkForVerticalCollisions()) break;
    }
  }

  updateHitbox() {
    this.hitbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 12,
      height: 16,
    };
  }

  updateCamerabox() {
    this.camerabox = {
      position: {
        x: this.position.x - window.innerWidth / 4,
        y: this.position.y - this.camerabox.height,
      },
      width: window.innerWidth / 2,
      height: 80,
    };
  }

  shouldPanCameraToTheLeft() {
    const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width;

    if (cameraboxRightSide >= this.background.width - 10) return;
    if (
      cameraboxRightSide >=
      this.canvas.width / 2 + Math.abs(this.camera.position.x)
    ) {
      this.camera.position.x -= this.velocity.x;
    }
  }

  shouldPanCameraToTheRight() {
    if (this.camerabox.position.x <= 0) return;
    if (this.camerabox.position.x <= Math.abs(this.camera.position.x)) {
      this.camera.position.x -= this.velocity.x;
    }
  }

  checkForHorizontalCollisions() {
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i];

      if (
        collision({
          object: this.hitbox,
          collisionBlock,
        })
      ) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0;
          const offset =
            this.hitbox.position.x - this.position.x + this.hitbox.width;
          this.position.x = collisionBlock.position.x - offset - 0.01;
          break;
        }

        if (this.velocity.x < 0) {
          this.velocity.x = 0;
          const offset = this.hitbox.position.x - this.position.x;
          this.position.x =
            collisionBlock.position.x + collisionBlock.width - offset + 0.01;
          break;
        }
      }
    }

    // check for collisions with question boxes
    for (let i = 0; i < questionBoxesCollisionsBlocks.length; i++) {
      const collisionBlock = questionBoxesCollisionsBlocks[i];

      if (
        collision({
          object: this.hitbox,
          collisionBlock,
        })
      ) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0;
          const offset =
            this.hitbox.position.x - this.position.x + this.hitbox.width;
          this.position.x = collisionBlock.position.x - offset - 0.01;
          break;
        }

        if (this.velocity.x < 0) {
          this.velocity.x = 0;
          const offset = this.hitbox.position.x - this.position.x;
          this.position.x =
            collisionBlock.position.x + collisionBlock.width - offset + 0.01;
          break;
        }
      }
    }

    // horizontal collision with bricks
    for (let i = 0; i < bricksCollisionsBlocks.length; i++) {
      const collisionBlock = bricksCollisionsBlocks[i];

      if (
        collision({
          object: this.hitbox,
          collisionBlock,
        })
      ) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0;
          const offset =
            this.hitbox.position.x - this.position.x + this.hitbox.width;
          this.position.x = collisionBlock.position.x - offset - 0.01;
          break;
        }

        if (this.velocity.x < 0) {
          this.velocity.x = 0;
          const offset = this.hitbox.position.x - this.position.x;
          this.position.x =
            collisionBlock.position.x + collisionBlock.width - offset + 0.01;
          break;
        }
      }
    }

  }

  checkForHorizontalCanvasCollision() {
    if (
      this.hitbox.position.x + this.hitbox.width + this.velocity.x >=
        this.background.width - 10 ||
      this.hitbox.position.x + this.velocity.x <= 0
    ) {
      this.velocity.x = 0;
    }
  }

  applyGravity() {
    this.velocity.y += gravity;
    this.position.y += this.velocity.y;
  }

  checkForVerticalCollisions() {
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i];

      if (
        collision({
          object: this.hitbox,
          collisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;
          this.position.y = collisionBlock.position.y - offset - 0.01;
          break;
        }

        if (this.velocity.y < 0) {
          
          this.velocity.y = 0;
          const offset = this.hitbox.position.y - this.position.y;
          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01;
          break;
        }

        if (this.velocity.y === 0) {
          this.jumps = 2;
        }
      }
    }
    // check for question boxes collisions
    for (let i = 0; i < questionBoxesCollisionsBlocks.length; i++) {
      const collisionBlock = questionBoxesCollisionsBlocks[i];

      if (
        collision({
          object: this.hitbox,
          collisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;
          this.position.y = collisionBlock.position.y - offset - 0.01;
          break;
        }

        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          const offset = this.hitbox.position.y - this.position.y;
          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01;
          break;
        }

        if (this.velocity.y === 0) {
          this.jumps = 2;
        }
      }
    }

    // Detects collision for platforms

    for (let i = 0; i < platformCollisionsBlocks.length; i++) {
      const platformCollisionBlock = platformCollisionsBlocks[i];

      if (
        platformCollision({
          object: this.hitbox,
          collisionBlock: platformCollisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;
          this.position.y = platformCollisionBlock.position.y - offset - 0.01;
          break;
        }

        if (this.velocity.y === 0) {
          this.jumps = 2;
        }
      }
    }

    // Detects collision with items
    for (let i = 0; i < stageItems.length; i++) {
      const collisionBlock = stageItems[i];

      if (
        collision({
          object: this.hitbox,
          collisionBlock,
        })
      ) {
        playSoundEffectBuffer(oneUpSoundBuffer);
        updateGameScore(stageItems[i].value);
        stageItems.splice(i, 1);
      }
    }

    //check collision with bricks
    for (let i = 0; i < bricksCollisionsBlocks.length; i++) {
      const collisionBlock = bricksCollisionsBlocks[i];

      if (
        collision({
          object: this.hitbox,
          collisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;
          this.position.y = collisionBlock.position.y - offset - 0.01;
          break;
        }

        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          const offset = this.hitbox.position.y - this.position.y;
          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01;
          break;
        }

        if (this.velocity.y === 0) {
          this.jumps = 2;
        }
      }
    }
  }

  switchSprite(key) {
    if (this.image === this.animations[key].image || !this.loaded) return;

    this.currentFrame = 0;
    this.image = this.animations[key].image;
    this.frameRate = this.animations[key].frameRate;
    this.frameBuffer = this.animations[key].frameBuffer;
  }

  checkIfGameLost() {
    if (this.hitbox.position.y + this.hitbox.height > this.canvas.height) {
      game.loseGame();
      this.velocity.y = 0;
      this.position.y = this.canvas.height - 200;
      this.hitbox.position.y = this.canvas.height - 200;
      

      return true;
    } else {
      return false;
    }
  }
}
