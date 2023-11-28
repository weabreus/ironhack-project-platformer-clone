class Item extends Sprite {
  constructor({
    canvas,
    canvasContext,
    position,
    player,
    imgSrc,
    frameRate,
    scale,
    value,
  }) {
    super({
      canvas,
      canvasContext,
      position,
      imgSrc,
      frameRate,
      scale,
    });
    this.status = "unpicked";
    this.value = value;
    this.player = player;
    this.direction = Math.random() > 0.5 ? "right" : "left";
    this.velocity = {
      x: 0,
      y: 0,
    };
  }

  move() {
    if (this.velocity.x === 0)
      this.direction === "right"
        ? (this.velocity.x = 0.5)
        : (this.velocity.x = -0.5);
    this.updateFrames();
    this.update();
    this.position.x += this.velocity.x;
    this.checkForHorizontalCollisions();
    this.applyGravity();
    let numberOfChecks = Math.abs(Math.ceil(this.velocity.y * 2));

    for (let i = 0; i < numberOfChecks; i++) {
      if (this.checkForVerticalCollisions()) break;
    }
  }

  applyGravity() {
    this.velocity.y += gravity;
    this.position.y += this.velocity.y;
  }

  checkForHorizontalCollisions() {
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i];

      if (
        collision({
          object: this,
          collisionBlock,
        })
      ) {
        if (this.velocity.x > 0) {
          this.velocity.x = -1;
          this.position.x = collisionBlock.position.x - this.width - 0.01;
          break;
        }

        if (this.velocity.x < 0) {
          this.velocity.x = 1;
          this.position.x =
            collisionBlock.position.x + collisionBlock.width + 0.01;
          break;
        }
      }
    }

    // check for collisions with question boxes
    for (let i = 0; i < questionBoxesCollisionsBlocks.length; i++) {
      const collisionBlock = questionBoxesCollisionsBlocks[i];

      if (
        collision({
          object: this,
          collisionBlock,
        })
      ) {
        if (this.velocity.x > 0) {
          this.velocity.x = 0;
          this.position.x = collisionBlock.position.x - 0.01;
          break;
        }

        if (this.velocity.x < 0) {
          this.velocity.x = 0;

          this.position.x =
            collisionBlock.position.x + collisionBlock.width + 0.01;
          break;
        }
      }
    }
  }

  checkForVerticalCollisions() {
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i];

      if (
        collision({
          object: this,
          collisionBlock,
        })
      ) {
        
        if (this.velocity.y > 0) {
          
          this.velocity.y = 0;
          this.position.y = collisionBlock.position.y - collisionBlock.height - 0.01;
          break;

        }

        if (this.velocity.y < 0) {
          console.log('collision <');
          this.velocity.y = 0;
          this.position.y =
            collisionBlock.position.y + collisionBlock.height + 0.01;
          break;
        }
      }
    }
    // check for question boxes collisions
    for (let i = 0; i < questionBoxesCollisionsBlocks.length; i++) {
      const collisionBlock = questionBoxesCollisionsBlocks[i];

      if (
        collision({
          object: this,
          collisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          this.position.y = collisionBlock.position.y - collisionBlock.height - 0.01;
          break;
        }

        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          this.position.y =
            collisionBlock.position.y + collisionBlock.height + 0.01;
          break;
        }
      }
    }
    for (let i = 0; i < collisionBlocks.length; i++) {
      const collisionBlock = collisionBlocks[i];

      if (
        collision({
          object: this,
          collisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          this.position.y = collisionBlock.position.y - collisionBlock.height - 0.01;
          break;
        }

        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          this.position.y =
            collisionBlock.position.y + collisionBlock.height + 0.01;
          break;
        }
      }
    }

    // Detects collision for platforms

    for (let i = 0; i < platformCollisionsBlocks.length; i++) {
      const platformCollisionBlock = platformCollisionsBlocks[i];

      if (
        platformCollision({
          object: this,
          collisionBlock: platformCollisionBlock,
        })
      ) {
        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          this.position.y = platformCollisionBlock.position.y - platformCollisionBlock.height - 0.01;
          break;
        }
      }
    }
  }

  
}
