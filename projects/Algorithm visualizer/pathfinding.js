const grid = document.getElementById("grid");
const tileCountSlider = document.getElementById("tileCountSlider");
const tileCountValue = document.getElementById("tileCountValue");
const speedSlider2 = document.getElementById("speedSlider2");
const status = document.getElementById("status");

let rows = tileCountSlider.value;
let columns = tileCountSlider.value;
let tiles = [];
let startTile = null;
let endTile = null;
let isDrawing = false;
let animationDelay = (21 - speedSlider2.value) * 10;

tileCountSlider.addEventListener("input", (e) => {
  tileCountValue.textContent = e.target.value;
  updateGrid();
});

speedSlider2.addEventListener("input", (e) => {
  animationDelay = (21 - parseInt(e.target.value)) * 10;
});

function updateGrid() {
  rows = columns = parseInt(tileCountSlider.value);
  grid.style.gridTemplateColumns = `repeat(${columns}, 20px)`;
  grid.style.gridTemplateRows = `repeat(${rows}, 20px)`;
  createGrid();
}

function createGrid() {
  grid.innerHTML = "";
  tiles = Array.from({ length: rows }, () => []);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.addEventListener("mousedown", (e) =>
        handleMouseDown(e, tile, row, col)
      );
      tile.addEventListener("mouseover", () => handleMouseOver(tile, row, col));
      tile.addEventListener("mouseup", handleMouseUp);

      grid.appendChild(tile);
      tiles[row][col] = tile;
    }
  }
}

function handleMouseDown(e, tile, row, col) {
  if (e.target.classList.contains("tile")) {
    isDrawing = true;
    handleTileClick(tile, row, col);
  }
}

function handleMouseOver(tile, row, col) {
  if (isDrawing) {
    if (!tile.classList.contains("start") && !tile.classList.contains("end")) {
      tile.classList.add("wall");
    }
  }
}

function handleMouseUp() {
  isDrawing = false;
}

function handleTileClick(tile, row, col) {
  if (!startTile) {
    startTile = { row, col };
    tile.classList.add("start");
  } else if (!endTile && !(startTile.row === row && startTile.col === col)) {
    endTile = { row, col };
    tile.classList.add("end");
  } else if (
    !(startTile.row === row && startTile.col === col) &&
    !(endTile.row === row && endTile.col === col)
  ) {
    tile.classList.toggle("wall");
  }
}
let mazeGenerationInProgress = false; // Track maze generation status

function resetGrid() {
  mazeGenerationInProgress = false; // Stop maze generation
  tiles.flat().forEach((tile) => {
    tile.className = "tile"; // Reset all tiles
  });
  startTile = null;
  endTile = null;
  status.textContent = "Select start and end points to begin.";
}

async function startPathfinding(algorithm) {
  if (!startTile || !endTile) return;
  resetVisitedTiles();
  status.textContent = "Pathfinding in progress...";
  await algorithm();
  status.textContent = "Pathfinding complete!";
}

function resetVisitedTiles() {
  tiles.flat().forEach((tile) => {
    tile.classList.remove("visited", "path");
  });
}

function getNeighbors(row, col) {
  const neighbors = [];
  if (row > 0) neighbors.push([row - 1, col]);
  if (row < rows - 1) neighbors.push([row + 1, col]);
  if (col > 0) neighbors.push([row, col - 1]);
  if (col < columns - 1) neighbors.push([row, col + 1]);
  return neighbors;
}

async function constructPath(previous) {
  let [row, col] = [endTile.row, endTile.col];
  while (`${row},${col}` in previous) {
    const tile = tiles[row][col];
    tile.classList.add("path");
    await delay(animationDelay);
    [row, col] = previous[`${row},${col}`];
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function heuristic(row, col, endRow, endCol) {
  return Math.abs(row - endRow) + Math.abs(col - endCol);
}

// Breadth-First Search (BFS) Algorithm
async function bfs() {
  const queue = [[startTile.row, startTile.col]];
  const visited = new Set();
  const previous = {};
  visited.add(`${startTile.row},${startTile.col}`);

  while (queue.length > 0) {
    const [row, col] = queue.shift();
    const tile = tiles[row][col];

    if (row === endTile.row && col === endTile.col) {
      await constructPath(previous);
      return;
    }

    tile.classList.add("visited");
    await delay(animationDelay);

    for (const [r, c] of getNeighbors(row, col)) {
      if (
        !visited.has(`${r},${c}`) &&
        !tiles[r][c].classList.contains("wall")
      ) {
        queue.push([r, c]);
        visited.add(`${r},${c}`);
        previous[`${r},${c}`] = [row, col];
      }
    }
  }
}

// Dijkstra's Algorithm
async function dijkstra() {
  const distances = Array(rows)
    .fill()
    .map(() => Array(columns).fill(Infinity));
  const visited = new Set();
  const previous = {};
  distances[startTile.row][startTile.col] = 0;

  const priorityQueue = [[startTile.row, startTile.col, 0]];

  while (priorityQueue.length > 0) {
    priorityQueue.sort((a, b) => a[2] - b[2]);
    const [row, col, dist] = priorityQueue.shift();

    if (visited.has(`${row},${col}`)) continue;
    visited.add(`${row},${col}`);

    const tile = tiles[row][col];
    tile.classList.add("visited");
    await delay(animationDelay);

    if (row === endTile.row && col === endTile.col) {
      await constructPath(previous);
      return;
    }

    for (const [r, c] of getNeighbors(row, col)) {
      const newDist = dist + 1;
      if (
        newDist < distances[r][c] &&
        !tiles[r][c].classList.contains("wall")
      ) {
        distances[r][c] = newDist;
        priorityQueue.push([r, c, newDist]);
        previous[`${r},${c}`] = [row, col];
      }
    }
  }
}

// A* Search Algorithm
async function aStar() {
  const openSet = [[startTile.row, startTile.col, 0]];
  const previous = {};
  const gScore = Array(rows)
    .fill()
    .map(() => Array(columns).fill(Infinity));
  gScore[startTile.row][startTile.col] = 0;

  while (openSet.length > 0) {
    openSet.sort((a, b) => a[2] - b[2]);
    const [row, col, fScore] = openSet.shift();

    if (row === endTile.row && col === endTile.col) {
      await constructPath(previous);
      return;
    }

    const tile = tiles[row][col];
    tile.classList.add("visited");
    await delay(animationDelay);

    for (const [r, c] of getNeighbors(row, col)) {
      if (tiles[r][c].classList.contains("wall")) continue; // Skip walls

      const tentativeGScore = gScore[row][col] + 1;
      if (tentativeGScore < gScore[r][c]) {
        previous[`${r},${c}`] = [row, col];
        gScore[r][c] = tentativeGScore;
        const fScore =
          tentativeGScore + heuristic(r, c, endTile.row, endTile.col);
        openSet.push([r, c, fScore]);
      }
    }
  }
}

// Depth-First Search (DFS) Algorithm
async function dfs() {
  const stack = [[startTile.row, startTile.col]];
  const visited = new Set();
  const previous = {};
  visited.add(`${startTile.row},${startTile.col}`);

  while (stack.length > 0) {
    const [row, col] = stack.pop();

    if (row === endTile.row && col === endTile.col) {
      await constructPath(previous);
      return;
    }

    tiles[row][col].classList.add("visited");
    await delay(animationDelay);

    for (const [r, c] of getNeighbors(row, col)) {
      if (
        !visited.has(`${r},${c}`) &&
        !tiles[r][c].classList.contains("wall")
      ) {
        stack.push([r, c]);
        visited.add(`${r},${c}`);
        previous[`${r},${c}`] = [row, col];
      }
    }
  }
}

// Greedy Best-First Search (GBFS) Algorithm
async function gbfs() {
  const openSet = [[startTile.row, startTile.col]];
  const previous = {};
  const visited = new Set();
  visited.add(`${startTile.row},${startTile.col}`);

  while (openSet.length > 0) {
    openSet.sort(
      (a, b) =>
        heuristic(a[0], a[1], endTile.row, endTile.col) -
        heuristic(b[0], b[1], endTile.row, endTile.col)
    );
    const [row, col] = openSet.shift();

    if (row === endTile.row && col === endTile.col) {
      await constructPath(previous);
      return;
    }

    tiles[row][col].classList.add("visited");
    await delay(animationDelay);

    for (const [r, c] of getNeighbors(row, col)) {
      if (
        !visited.has(`${r},${c}`) &&
        !tiles[r][c].classList.contains("wall")
      ) {
        openSet.push([r, c]);
        visited.add(`${r},${c}`);
        previous[`${r},${c}`] = [row, col];
      }
    }
  }
}
async function generateMaze() {
    resetGrid(); // Clear existing grid
    mazeGenerationInProgress = true; // Set flag to indicate maze generation started
    const visited = Array(rows).fill().map(() => Array(columns).fill(false));
  
    function getNeighbors(row, col) {
      const directions = [
        [row - 2, col], // Up
        [row + 2, col], // Down
        [row, col - 2], // Left
        [row, col + 2]  // Right
      ];
      return directions.filter(
        ([r, c]) => r >= 0 && r < rows && c >= 0 && c < columns && !visited[r][c]
      );
    }
  
    async function carvePath(row, col) {
      visited[row][col] = true;
      tiles[row][col].classList.remove("wall"); // Carve out path
  
      let neighbors = getNeighbors(row, col);
      neighbors = neighbors.sort(() => Math.random() - 0.5); // Shuffle neighbors
  
      for (const [nRow, nCol] of neighbors) {
        if (!visited[nRow][nCol]) {
          // Remove wall between current and neighbor
          const wallRow = (row + nRow) / 2;
          const wallCol = (col + nCol) / 2;
          tiles[wallRow][wallCol].classList.remove("wall");
          await delay(animationDelay); // Pause for animation
  
          // Recursively carve path
          await carvePath(nRow, nCol);
        }
        // Check if reset was called during generation
        if (!mazeGenerationInProgress) {
          return; // Exit if reset is called
        }
      }
    }
  
    // Initialize walls
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        tiles[row][col].classList.add("wall");
      }
    }
  
    // Start carving paths from a random starting point
    const startRow = Math.floor(Math.random() * rows);
    const startCol = Math.floor(Math.random() * columns);
    await carvePath(startRow - (startRow % 2), startCol - (startCol % 2)); // Ensure it’s an odd number
  
    mazeGenerationInProgress = false; // Mark maze generation as complete
    status.textContent = "Maze generated! Set start and end points.";
  }
  
// Expose function globally
window.generateMaze = generateMaze;

// Expose functions globally
window.resetGrid = resetGrid;
window.startPathfinding = startPathfinding;
window.bfs = bfs;
window.dijkstra = dijkstra;
window.aStar = aStar;
window.dfs = dfs;
window.gbfs = gbfs;

updateGrid();
