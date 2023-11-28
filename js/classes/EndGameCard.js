class EndGameCard extends QuestionBlock {
  constructor({
    canvas,
    canvasContext,
    position,
    imgSrc,
    frameRate,
    scale,
    player,
  }) {
    super({canvas, canvasContext, position, imgSrc, frameRate, scale, player});
    this.value = 0;
  }

  checkForBottomCollision() {
    
    if (this.status === "inactive") {
      if (bottomCollision({ object: this.player, collisionBlock: this })) {
        console.log('collision')
        console.log(this.currentFrame)
        this.status = "activated";
        updateGameScore(this.getCurrentValue());
        game.endGame();
       
      }
    }
  }

  getCurrentValue() {
    if(this.currentFrame === 0) {
        // Super Mushroom
        return 5000;
    } else if (this.currentFrame === 1) {
        // Flame Flower
        return 10000;
    } else if (this.currentFrame === 2) {
        // Star
        return 15000;
    }
  }
}
