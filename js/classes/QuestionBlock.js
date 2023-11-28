class QuestionBlock extends Sprite {
  constructor({
    canvas,
    canvasContext,
    position,
    imgSrc,
    frameRate,
    scale,
    player,
  }) {
    super({ imgSrc, frameRate, scale });
    this.canvas = canvas;
    this.canvasContext = canvasContext;
    this.position = position;
    this.status = "inactive";
    this.player = player;
    this.object = undefined;
    this.itemsList = [BlockCoin, PlusMushroom, SuperMushroom];
    // this.animations = animations;
  }

  checkForBottomCollision() {
    
    if (this.status === "inactive") {
      if (bottomCollision({ object: this.player, collisionBlock: this })) {
        playSoundEffectBuffer(bumpSoundBuffer);
        this.status = "activated";
        this.image.src = "/mario-clone/images/sprites/EmptyBlock.png";
        this.frameRate = 1;
        this.object = this.generateRandomItem();
        stageItems.push(this.object);
        if (this.object instanceof BlockCoin) {
          updateGameScore(this.object.value);
          playSoundEffectBuffer(coinSoundBuffer);
          setTimeout(() => {
            this.object.status = 'expired';
          }, 3000)
        }

      }
    }
  }

  update() {
    this.checkForBottomCollision();
    
    this.draw();
    // this.checkPlayerObjectCollision();

    this.updateFrames();
  }

  generateRandomItem() {
    const randomNumber = Math.random() * this.itemsList.length;
    const randomIndex = Math.floor(randomNumber);
    
    const ItemClass = this.itemsList[randomIndex];
    return new ItemClass({
      canvas: this.canvas,
      canvasContext: this.canvasContext,
      position: {
        x: this.position.x,
        y: this.position.y - 20,
      },
    });
  }

//   checkPlayerObjectCollision() {
//     if (this.object) {
//       let collisionBlock = this.player.hitbox;
//       let object = this.object;
        
//       if (
//         collision(
//           object?.position.y + object?.height >= collisionBlock?.position.y &&
//             object?.position.y <=
//               collisionBlock.position.y + collisionBlock.height &&
//             object?.position.x <=
//               collisionBlock.position.x + collisionBlock.width &&
//             object?.position.x + object.width >= collisionBlock.position.x
//         )
//       ) {
//         console.log("collision");
//         this.object = undefined;
//       }
//     }
//   }
}
