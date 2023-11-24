class Player extends Sprite {
  constructor({
    canvas,
    canvasContext,
    position,
    collisionBlocks,
    platformCollisionsBlocks,
    imgSrc,
    frameRate,
    animations,
    scale = 1,
  }) {
    super({ imgSrc, frameRate, scale });
    this.canvas = canvas;
    this.canvasContext = canvasContext;
    this.position = position;
    this.collisionBlocks = collisionBlocks;
    this.platformCollisionBlocks = platformCollisionsBlocks;
    this.hitbox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      width: 16,
      height: 16,
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
    this.updateFrames();
    this.updateHitbox();

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

    this.position.x += this.velocity.x;
    this.updateHitbox();
    this.checkForHorizontalCollisions();
    this.applyGravity();
    this.updateHitbox();
    // I need to check multiple times for vertical collision based on velocity.y to avoid "Bullet thru paper" effect
    let numberOfChecks = Math.ceil(this.velocity.y * 2);

    for (let i = 0; i < numberOfChecks; i++) {
      if(this.checkForVerticalCollisions()) break;
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
  checkForHorizontalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

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

  applyGravity() {
    this.velocity.y += gravity;
    this.position.y += this.velocity.y;
  }

  checkForVerticalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

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
      }
    }

    // Detects collision for platforms
    
    for (let i = 0; i < this.platformCollisionBlocks.length; i++) {
      const platformCollisionBlock = this.platformCollisionBlocks[i];

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
}
