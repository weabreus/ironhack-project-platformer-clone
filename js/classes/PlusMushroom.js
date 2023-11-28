class PlusMushroom extends Item {
  constructor({ canvas, canvasContext, position, player }) {
    super({
      canvas,
      canvasContext,
      position,
      imgSrc: "../images/sprites/1upMushroom.png",
      frameRate: 1,
      scale: 1,
      value: 1500,
      player,
    });
  }
}
