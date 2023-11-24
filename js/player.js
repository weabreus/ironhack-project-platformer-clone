class Player extends Sprite {
  constructor(
    canvas,
    canvasContext,
    position,
    collisionBlocks,
    imgSrc,
    frameRate,
    scale = 1
  ) {
    super({ imgSrc, frameRate, scale });
    this.canvas = canvas;
    this.canvasContext = canvasContext;
    this.position = position;
    this.collisionBlocks = collisionBlocks;
    this.hitbox = {
      position: {
        x: this.position.x + 8,
        y: this.position.y,
      },
      width: 16,
      height: 16,
    };
    this.velocity = {
      x: 0,
      y: 1,
    };
    // this.height = 50 / 2;
    // this.width = 50 / 2;
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

    this.canvasContext.fillStyle = "rgba(0, 0, 255, 0.2)";
    this.canvasContext.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    // draw the hitbox
    this.canvasContext.fillStyle = "rgba(255, 0, 0, 0.2)";
    this.canvasContext.fillRect(
      this.hitbox.position.x,
      this.hitbox.position.y,
      this.hitbox.width,
      this.hitbox.height
    );

    this.update();

    this.position.x += this.velocity.x;
    this.updateHitbox();
    this.checkForHorizontalCollisions();
    this.applyGravity();
    this.updateHitbox();
    this.checkForVerticalCollisions();
  }

  updateHitbox() {
    this.hitbox = {
      position: {
        x: this.position.x + 10,
        y: this.position.y + 7,
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
          const offset =
            this.hitbox.position.x - this.position.x;
          this.position.x =
            collisionBlock.position.x + collisionBlock.width - offset + 0.01;
          break;
        }
      }
    }
  }

  applyGravity() {
    this.position.y += this.velocity.y;
    this.velocity.y += gravity;
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
          const offset =
            this.hitbox.position.y - this.position.y
          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01;
          break;
        }
      }
    }
  }
}
