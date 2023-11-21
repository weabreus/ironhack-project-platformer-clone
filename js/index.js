window.onload = function () {
  let startButton = document.getElementById("start-button");

  startButton.addEventListener("click", function () {
    let gameIntro = document.getElementById("game-intro");
    let gameContainer = document.getElementById("game-container");

    gameIntro.style.display = "none";
    gameContainer.style.display = "block";
    // startGame();
  });
};
