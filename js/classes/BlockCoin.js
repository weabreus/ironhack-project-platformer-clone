class BlockCoin extends Sprite {
  constructor({canvas, canvasContext, position}) {
    super({
      canvas,
      canvasContext,
      position,
      imgSrc: "/mario-clone/images/sprites/box-coin-sprite-sheet.png",
      frameRate: 4,
      scale: 1,
    });
    this.value = 500;
  }
}
