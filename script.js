let grid = [];
let mineCount = 0;
let revealedCount = 0;
let totalCells = 0;

function initGame(rows, cols, mines) {
  document.getElementById('modeDialog').style.display = 'none';
  mineCount = mines;
  totalCells = rows * cols;
  revealedCount = 0;
  
  const container = document.getElementById('grid');
  container.style.gridTemplate = `repeat(${rows}, 30px) / repeat(${cols}, 30px)`;
  
  grid = Array(rows).fill().map(() => 
    Array(cols).fill().map(() => ({
      isMine: false,
      revealed: false,
      marked: false,
      neighborMines: 0
    }))
  );

  // 放置地雷
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!grid[r][c].isMine) {
      grid[r][c].isMine = true;
      placed++;
    }
  }

  // 计算相邻地雷数
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!grid[r][c].isMine) {
        grid[r][c].neighborMines = countNeighborMines(r, c, rows, cols);
      }
    }
  }

  // 生成DOM元素
  container.innerHTML = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('click', handleLeftClick);
      cell.addEventListener('contextmenu', handleRightClick);
      container.appendChild(cell);
    }
  }

  document.getElementById('minesLeft').textContent = mineCount;
}

function countNeighborMines(r, c, rows, cols) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const nr = r + i;
      const nc = c + j;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
        if (grid[nr][nc].isMine) count++;
      }
    }
  }
  return count;
}

function handleLeftClick(e) {
  const cell = e.target;
  const r = parseInt(cell.dataset.row);
  const c = parseInt(cell.dataset.col);
  
  if (grid[r][c].marked || grid[r][c].revealed) return;

  if (grid[r][c].isMine) {
    alert('游戏结束！');
    return;
  }

  revealCell(r, c);
  if (revealedCount === totalCells - mineCount) {
    alert('你赢了！');
  }
}

function handleRightClick(e) {
  e.preventDefault();
  const cell = e.target;
  const r = parseInt(cell.dataset.row);
  const c = parseInt(cell.dataset.col);
  
  if (grid[r][c].revealed) return;

  grid[r][c].marked = !grid[r][c].marked;
  cell.classList.toggle('marked');
  document.getElementById('minesLeft').textContent = 
    mineCount - document.querySelectorAll('.marked').length;
}

function revealCell(r, c) {
  if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) return;
  if (grid[r][c].revealed || grid[r][c].marked) return;

  const cell = document.querySelector(`[data-row='${r}'][data-col='${c}']`);
  cell.classList.add('revealed');
  grid[r][c].revealed = true;
  revealedCount++;

  if (grid[r][c].neighborMines === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        revealCell(r + i, c + j);
      }
    }
  } else {
    cell.textContent = grid[r][c].neighborMines;
  }
}