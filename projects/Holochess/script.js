


const piecesContainer = document.getElementById("pieces");
const raysContainer = document.getElementById("rays");
const status = document.getElementById("status");

const NUM_RAYS = 12;
const OUTER_ORBIT_SPACES = NUM_RAYS;
const MIDDLE_ORBIT_SPACES = NUM_RAYS;
const CENTER_ORBIT_SPACE = 1;
const TOTAL_SPACES =
  OUTER_ORBIT_SPACES + MIDDLE_ORBIT_SPACES + CENTER_ORBIT_SPACE;

let currentPlayer = "red";
let selectedPiece = null;

// Turn counters for Sudden Death
const suddenDeathCounters = {
  red: 0,
  blue: 0,
};
const players = {
  red: {
    pieces: [
      { type: "Brute", orbit: "middle", position: 4 },
      { type: "Predator", orbit: "outer", position: 3 },
      { type: "Scout", orbit: "outer", position: 4 },
      { type: "Guardian", orbit: "middle", position: 3 },
    ],
  },
  blue: {
    pieces: [
      { type: "Brute", orbit: "middle", position: 10 },
      { type: "Predator", orbit: "outer", position: 9 },
      { type: "Scout", orbit: "outer", position: 10 },
      { type: "Guardian", orbit: "middle", position: 9 },
    ],
  },
};

function createRays() {
  for (let i = 0; i < NUM_RAYS; i++) {
    const ray = document.createElement("div");
    ray.className = "ray";
    ray.style.transform = `rotate(${i * (360 / NUM_RAYS)}deg)`;
    // Alternate colors between black and white
    ray.style.background = i % 2 === 0 ? "white" : "black";

    raysContainer.appendChild(ray);
  }
}

function drawPieces() {
  piecesContainer.innerHTML = "";
  Object.keys(players).forEach((team) => {
    players[team].pieces.forEach((piece) => {
      const pieceElement = document.createElement("div");
      pieceElement.className = `piece ${team}`;
      pieceElement.textContent = piece.type[0];
      pieceElement.dataset.team = team; // Associate the team
      pieceElement.dataset.type = piece.type;
      positionPiece(pieceElement, piece.orbit, piece.position);
      pieceElement.addEventListener("click", () => selectPiece(piece, team)); // Pass the team
      piecesContainer.appendChild(pieceElement);
    });
  });
}
function positionPiece(element, orbit, position) {
  const orbitRadius = {
    outer: 200,
    middle: 110,
  }[orbit];
  const angle = (position - 0.5) * (360 / 12) * (Math.PI / 180);
  const x = 250 + orbitRadius * Math.cos(angle) - 20;
  const y = 250 + orbitRadius * Math.sin(angle) - 20;
  element.style.left = `${x}px`;
  element.style.top = `${y}px`;
}

function selectPiece(piece, team) {
  if (team !== currentPlayer) {
    alert("It's not your turn!");
    return;
  }

  // Deselect if the same piece is clicked again
  if (selectedPiece === piece) {
    clearHighlights();
    selectedPiece = null;
    return;
  }

  selectedPiece = piece;
  clearHighlights(); // Clear previous highlights before showing new ones
  highlightMoves(piece);
}

function endTurn() {
  checkSuddenDeath(); // Check Sudden Death condition before switching turns.

  currentPlayer = currentPlayer === "red" ? "blue" : "red";
  status.textContent = `${
    currentPlayer[0].toUpperCase() + currentPlayer.slice(1)
  }'s turn`;

  // Increment the turn counter if the player has only one piece.
  if (players[currentPlayer].pieces.length === 1) {
    suddenDeathCounters[currentPlayer]++;
  } else {
    suddenDeathCounters[currentPlayer] = 0; // Reset if they have more than one piece.
  }

  checkWin();
}
function checkSuddenDeath() {
  const opponent = currentPlayer === "red" ? "blue" : "red";

  if (
    players[currentPlayer].pieces.length === 1 &&
    suddenDeathCounters[currentPlayer] >= 3
  ) {
    alert(
      `${opponent[0].toUpperCase() + opponent.slice(1)} wins by Sudden Death!`
    );
    status.textContent = `${
      opponent[0].toUpperCase() + opponent.slice(1)
    } wins by Sudden Death!`;
  }
}
function checkWin() {
  const redPieces = players.red.pieces.length;
  const bluePieces = players.blue.pieces.length;
  if (redPieces === 0) {
    status.textContent = "Blue wins!";
  } else if (bluePieces === 0) {
    status.textContent = "Red wins!";
  }
}

createRays();
drawPieces();
function highlightMoves(piece) {
  const validMoves = getValidMoves(piece);
  validMoves.forEach(([orbit, position]) => {
    highlightPosition(orbit, position);
  });
}

function getValidMoves(piece) {
  const moves = [];
  const { orbit, position, type } = piece;

  if (type === "Brute") {
    moves.push(...calculateOrthogonalAndDiagonalMoves(orbit, position, 1));
  } else if (type === "Predator") {
    moves.push(...calculateOrbitMoves(orbit, position, 2));
    moves.push([orbit, (position + 1) % NUM_RAYS]); // 1 space in Ray
  } else if (type === "Scout") {
    moves.push(...calculateOrbitMoves(orbit, position, 2));
    moves.push(...calculateDiagonalMoves(orbit, position, 1));
  } else if (type === "Guardian") {
    moves.push([orbit, (position + 1) % NUM_RAYS]); // 1 space in Ray
    moves.push(...calculateLShapeMoves(orbit, position));
  }

  return moves.filter(([newOrbit, newPosition]) =>
    isValidMove(newOrbit, newPosition)
  );
}

function calculateOrthogonalAndDiagonalMoves(orbit, position, steps) {
  const moves = [];
  const adjacentPositions = [position + steps, position - steps];

  adjacentPositions.forEach((newPos) => {
    moves.push([orbit, (newPos + NUM_RAYS) % NUM_RAYS]); // Wrap around Rays
  });

  // If in the Outer Orbit, add the wrap-around Ray move
  if (orbit === "outer") {
    moves.push([orbit, (position + NUM_RAYS / 2) % NUM_RAYS]); // Opposite Ray
  }

  return moves;
}

function calculateOrbitMoves(orbit, position, steps) {
  const moves = [];
  const newOrbit =
    orbit === "outer" ? "middle" : orbit === "middle" ? "outer" : orbit; // Alternate orbit

  moves.push([newOrbit, position]); // Change orbit, keep same position

  // Add lateral orbit movement
  moves.push([orbit, (position + steps) % NUM_RAYS]);
  moves.push([orbit, (position - steps + NUM_RAYS) % NUM_RAYS]);

  return moves;
}

function calculateDiagonalMoves(orbit, position, steps) {
  // Diagonal moves in polar coordinates: move in Ray and Orbit
  const moves = [];
  const adjacentPositions = [position + steps, position - steps];

  adjacentPositions.forEach((newPos) => {
    const newOrbit =
      orbit === "outer" ? "middle" : orbit === "middle" ? "outer" : orbit; // Toggle orbit
    moves.push([newOrbit, (newPos + NUM_RAYS) % NUM_RAYS]);
  });

  return moves;
}

function calculateLShapeMoves(orbit, position) {
  const moves = [];
  const newOrbits = ["outer", "middle"];
  newOrbits.forEach((newOrbit) => {
    moves.push([newOrbit, (position + 2) % NUM_RAYS]); // L-shape move
    moves.push([newOrbit, (position - 2 + NUM_RAYS) % NUM_RAYS]);
  });
  return moves;
}

function isValidMove(orbit, position) {
  // Check if the move is within the board bounds
  const isInBounds =
    (orbit === "outer" || orbit === "middle" || orbit === "center") &&
    position >= 0 &&
    position < NUM_RAYS;

  // Check if the position is occupied by any piece
  const isOccupied = Object.keys(players).some((team) =>
    players[team].pieces.some(
      (piece) => piece.orbit === orbit && piece.position === position
    )
  );

  // Prevent moving to a position occupied by the current player's piece
  const isOccupiedBySelf = players[currentPlayer].pieces.some(
    (piece) => piece.orbit === orbit && piece.position === position
  );

  return isInBounds && !isOccupiedBySelf; // Valid move if it's not occupied by the player's piece
}

function highlightMoves(piece) {
  const validMoves = getValidMoves(piece);
  const attackablePositions = getAttackablePositions(piece);

  // Highlight valid move positions
  validMoves.forEach(([orbit, position]) => {
    highlightPosition(orbit, position, "move");
  });

  // Highlight attackable positions
  attackablePositions.forEach(([orbit, position]) => {
    highlightPosition(orbit, position, "attack");
  });

  // Highlight invalid positions (occupied by own team)
  highlightInvalidPositions(piece);
}

function highlightInvalidPositions(piece) {
  const { team } = piece;

  players[team].pieces.forEach(({ orbit, position }) => {
    highlightPosition(orbit, position, "invalid");
  });
}
function getAttackablePositions(piece) {
  const attacks = [];
  const { orbit, position, type } = piece;

  if (type === "Brute") {
    attacks.push(...calculateOrthogonalAndDiagonalMoves(orbit, position, 1));
  } else if (type === "Predator") {
    attacks.push(...calculateLShapeMoves(orbit, position)); // L-shape attack
  } else if (type === "Scout") {
    attacks.push([orbit, (position + 1) % NUM_RAYS]); // 1 space in Ray
  } else if (type === "Guardian") {
    attacks.push(...calculateOrbitMoves(orbit, position, 2));
  }

  return attacks.filter(([newOrbit, newPosition]) =>
    isOccupiedByOpponent(newOrbit, newPosition, piece.team)
  );
}

function isOccupiedByOpponent(orbit, position, team) {
  return Object.keys(players).some(
    (opponentTeam) =>
      opponentTeam !== team &&
      players[opponentTeam].pieces.some(
        (piece) => piece.orbit === orbit && piece.position === position
      )
  );
}

function highlightPosition(orbit, position, type) {
  const orbitRadius = {
    outer: 200,
    middle: 110,
    center: 50,
  }[orbit];

  const angle = (position - 0.5) * (360 / NUM_RAYS) * (Math.PI / 180);
  const x = 250 + orbitRadius * Math.cos(angle) - 10;
  const y = 250 + orbitRadius * Math.sin(angle) - 10;

  const highlight = document.createElement("div");
  highlight.className = `highlight ${type}`;
  highlight.style.position = "absolute";
  highlight.style.left = `${x}px`;
  highlight.style.top = `${y}px`;
  highlight.style.width = "20px";
  highlight.style.height = "20px";
  highlight.style.borderRadius = "50%";

  // Differentiate styles for move, attack, and invalid positions
  if (type === "move") {
    highlight.style.backgroundColor = "rgba(255, 255, 0, 0.5)";
  } else if (type === "attack") {
    highlight.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
  } else if (type === "invalid") {
    highlight.style.backgroundColor = "rgba(255, 217, 0, 0.2)"; // Dim blue overlay for invalid positions
  }

  piecesContainer.appendChild(highlight);

  // Add interaction for valid moves or attacks only
  if (type === "move") {
    highlight.addEventListener("click", () => movePiece(orbit, position));
  } else if (type === "attack") {
    highlight.addEventListener("click", () => attackPiece(orbit, position));
  }
}

function movePiece(newOrbit, newPosition) {
  if (!selectedPiece) return;

  // Update the selected piece's position
  selectedPiece.orbit = newOrbit;
  selectedPiece.position = newPosition;

  // Clear highlights and redraw pieces
  clearHighlights();
  drawPieces();

  endTurn();
}

function attackPiece(targetOrbit, targetPosition) {
  if (!selectedPiece) return;

  // Find and remove the attacked piece
  Object.keys(players).forEach((team) => {
    players[team].pieces = players[team].pieces.filter(
      (piece) =>
        !(piece.orbit === targetOrbit && piece.position === targetPosition)
    );
  });

  // Move the attacking piece to the target position
  selectedPiece.orbit = targetOrbit;
  selectedPiece.position = targetPosition;

  suddenDeathCounters[currentPlayer] = 0; // Reset the counter on successful attack.
  // Provide visual feedback for the attack
  const attackEffect = document.createElement("div");
  attackEffect.style.position = "absolute";
  attackEffect.style.width = "60px";
  attackEffect.style.height = "60px";
  attackEffect.style.borderRadius = "50%";
  attackEffect.style.backgroundColor = "rgba(255, 0, 0, 0.7)";
  attackEffect.style.left = `${250 + targetPosition}px`; // Approximation
  attackEffect.style.top = `${250}px`; // Approximation
  attackEffect.style.zIndex = "10";
  piecesContainer.appendChild(attackEffect);

  setTimeout(() => attackEffect.remove(), 500);

  // Clear highlights and redraw pieces
  clearHighlights();
  drawPieces();

  endTurn();
}

function clearHighlights() {
  const highlights = document.querySelectorAll(".highlight");
  highlights.forEach((highlight) => highlight.remove());
}

function endTurn() {
  currentPlayer = currentPlayer === "red" ? "blue" : "red";
  status.textContent = `${
    currentPlayer[0].toUpperCase() + currentPlayer.slice(1)
  }'s turn`;

  checkWin();
}

function checkWin() {
  const redPieces = players.red.pieces.length;
  const bluePieces = players.blue.pieces.length;
  if (redPieces === 0) {
    status.textContent = "Blue wins!";
  } else if (bluePieces === 0) {
    status.textContent = "Red wins!";
  }
}
function createPalette() {
  const palette = document.createElement("div");
  palette.classList.add("palette");
  palette.style.position = "absolute";
  
  palette.style.height = "500px";
  palette.style.width = "500px";
  palette.style.display = "grid";
  palette.style.placeItems = "center";
  palette.style.zIndex = "-1";

  const colors = [
    "#141414",
    "#c0c0c0",
    "#141414",
    "#c0c0c0",
    "#141414",
    "#c0c0c0",
    "#141414",
    "#c0c0c0",
    "#141414",
    "#c0c0c0",
    "#141414",
    "#c0c0c0",
  ];

  colors.forEach((color, index) => {
    const colorDiv = document.createElement("div");
    colorDiv.classList.add(`color${index + 1}`);
    colorDiv.style.position = "absolute";
    colorDiv.style.border = "102px solid " + color;
    colorDiv.style.borderRadius = "50%";
    colorDiv.style.clipPath =
      "polygon(calc(50% + 0px / 2) 50%, calc(50% + 0px / 2) 0%, calc(79% - 0px / 2) 0%, 50% calc(50% - 0px / 2))";
    colorDiv.style.transform = `rotate(${(index + 1) * 30}deg)`;

    palette.appendChild(colorDiv);
  });

  document.body.appendChild(palette);
}

createPalette();
function createPalette2() {
  const palette = document.createElement("div");
  palette.classList.add("palette");
  palette.style.position = "absolute";
  palette.style.height = "300px";
  palette.style.top = "12.5em";
  palette.style.width = "300px";
  palette.style.display = "grid";
  palette.style.placeItems = "center";
  palette.style.zIndex = "-1";

  const colors = [
    "#c0c0c0",
    "#141414",
    "#c0c0c0",
    "#141414",
    "#c0c0c0",
    "#141414",
    "#c0c0c0",
    "#141414",
    "#c0c0c0",
    "#141414",
    "#c0c0c0",
    "#141414",
  ];

  colors.forEach((color, index) => {
    const colorDiv = document.createElement("div");
    colorDiv.classList.add(`color${index + 1}`);
    colorDiv.style.position = "absolute";
    colorDiv.style.top = "0";
    colorDiv.style.border = "100px solid " + color;
    colorDiv.style.borderRadius = "50%";
    colorDiv.style.clipPath =
      "polygon(calc(50% + 0px / 2) 50%, calc(50% + 0px / 2) 0%, calc(79% - 0px / 2) 0%, 50% calc(50% - 0px / 2))";
    colorDiv.style.transform = `rotate(${(index + 1) * 30}deg)`;

    palette.appendChild(colorDiv);
  });

  document.body.appendChild(palette);
}

createPalette2();
