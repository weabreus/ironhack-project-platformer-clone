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

function addRowToLeaderboard(date, time, score) {
  const tableBody = document
    .getElementById("leaderboards-table")
    .getElementsByTagName("tbody")[0];

  const newRow = document.createElement("tr");

  const dateCell = document.createElement("td");
  dateCell.textContent = date;
  newRow.appendChild(dateCell);

  const timeCell = document.createElement("td");
  timeCell.textContent = (Math.floor(time / 1000)).toLocaleString();
  newRow.appendChild(timeCell);

  const scoreCell = document.createElement("td");
  scoreCell.textContent = score.toLocaleString();
  newRow.appendChild(scoreCell);

  tableBody.appendChild(newRow);
}

function initializeLeaderboard() {
  if (!localStorage.getItem('leaderboard')) {
      localStorage.setItem('leaderboard', JSON.stringify([]));
  }
}


function addToLeaderboard(entry) {

  const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");

  leaderboard.push(entry);

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

function getLeaderboard() {
  return JSON.parse(localStorage.getItem('leaderboard') || '[]');
}

function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();

  // Add 1 because JavaScript months start at 0
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');

  return `${month}-${day}-${year} ${hours}:${minutes}`;
}

function sortLeaderboard(leaderboard) {
  return leaderboard.sort((a, b) => b.score - a.score);
}

function getTop10Scores() {
  const leaderboard = getLeaderboard();
  const sortedLeaderboard = sortLeaderboard(leaderboard);
  return sortedLeaderboard.slice(0, 10);
}
