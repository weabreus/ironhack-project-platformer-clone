const collision = ({ object, collisionBlock }) => {
  if (object?.position && collisionBlock.position) {
    return (
      object?.position.y + object?.height >= collisionBlock?.position.y &&
      object?.position.y <= collisionBlock.position.y + collisionBlock.height &&
      object?.position.x <= collisionBlock.position.x + collisionBlock.width &&
      object?.position.x + object.width >= collisionBlock.position.x
    );
  }
};

const platformCollision = ({ object, collisionBlock }) => {
  return (
    object.position.y + object.height >= collisionBlock.position.y &&
    object.position.y + object.height <=
      collisionBlock.position.y + collisionBlock.height &&
    object.position.x <= collisionBlock.position.x + collisionBlock.width &&
    object.position.x + object.width >= collisionBlock.position.x
  );
};

const bottomCollision = ({ object, collisionBlock }) => {
  return (
    object.position.y - 0.1 <=
      collisionBlock.position.y + collisionBlock.height &&
    object.position.y + 0.1 >=
      collisionBlock.position.y + collisionBlock.height &&
    object.position.x < collisionBlock.position.x + collisionBlock.width &&
    object.position.x + object.width > collisionBlock.position.x
  );
};

const updateGameScore = (points) => {
  game.score += points;
  scoreContainer.innerHTML = `points: ${game.score.toLocaleString()}`;
};
