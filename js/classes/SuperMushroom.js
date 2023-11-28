class SuperMushroom extends Item {
  constructor({ canvas, canvasContext, position, player }) {
    super({
      canvas,
      canvasContext,
      position,
      imgSrc: "../images/sprites/SuperMushroom.png",
      frameRate: 1,
      scale: 1,
      value: 1000,
      player,
    });
  }
}
