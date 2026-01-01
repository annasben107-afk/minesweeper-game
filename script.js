const BOARD_SIZE = 10;
const NUM_MINES = 10;

const boardElement = document.getElementById('game-board');
let board = [];
let gameOver = false;

function createBoard() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        const row = [];
        for (let j = 0; j < BOARD_SIZE; j++) {
            const cell = {
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0,
                element: document.createElement('div')
            };
            cell.element.classList.add('cell');
            cell.element.addEventListener('click', () => revealCell(i, j));
            cell.element.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                flagCell(i, j);
            });
            boardElement.appendChild(cell.element);
            row.push(cell);
        }
        board.push(row);
    }
}

function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < NUM_MINES) {
        const row = Math.floor(Math.random() * BOARD_SIZE);
        const col = Math.floor(Math.random() * BOARD_SIZE);
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            minesPlaced++;
        }
    }
}

function calculateAdjacentMines() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j].isMine) continue;
            let count = 0;
            for (let x = -1; x <= 1; x++) {
                for (let y = -1; y <= 1; y++) {
                    const ni = i + x;
                    const nj = j + y;
                    if (ni >= 0 && ni < BOARD_SIZE && nj >= 0 && nj < BOARD_SIZE && board[ni][nj].isMine) {
                        count++;
                    }
                }
            }
            board[i][j].adjacentMines = count;
        }
    }
}

function revealCell(row, col) {
    if (gameOver || board[row][col].isRevealed || board[row][col].isFlagged) {
        return;
    }

    board[row][col].isRevealed = true;
    board[row][col].element.classList.add('revealed');

    if (board[row][col].isMine) {
        board[row][col].element.classList.add('mine');
        alert('Game Over!');
        gameOver = true;
        revealAllMines();
        return;
    }

    if (board[row][col].adjacentMines > 0) {
        board[row][col].element.textContent = board[row][col].adjacentMines;
    } else {
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                const ni = row + x;
                const nj = col + y;
                if (ni >= 0 && ni < BOARD_SIZE && nj >= 0 && nj < BOARD_SIZE) {
                    revealCell(ni, nj);
                }
            }
        }
    }
    checkWinCondition();
}

function flagCell(row, col) {
    if (gameOver || board[row][col].isRevealed) {
        return;
    }
    board[row][col].isFlagged = !board[row][col].isFlagged;
    if (board[row][col].isFlagged) {
        board[row][col].element.classList.add('flagged');
    } else {
        board[row][col].element.classList.remove('flagged');
    }
}

function revealAllMines() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j].isMine) {
                board[i][j].element.classList.add('mine');
            }
        }
    }
}

function checkWinCondition() {
    let revealedCount = 0;
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j].isRevealed) {
                revealedCount++;
            }
        }
    }
    if (revealedCount === BOARD_SIZE * BOARD_SIZE - NUM_MINES) {
        alert('You Win!');
        gameOver = true;
    }
}


createBoard();
placeMines();
calculateAdjacentMines();
