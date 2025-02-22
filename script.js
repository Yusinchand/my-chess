const chessboard = document.getElementById('chessboard');

// Chess pieces (Unicode characters)
const pieces = {
  rook: '♜',
  knight: '♞',
  bishop: '♝',
  queen: '♛',
  king: '♚',
  pawn: '♟',
};

// Create the chessboard
for (let row = 0; row < 8; row++) {
  for (let col = 0; col < 8; col++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
    square.dataset.row = row;
    square.dataset.col = col;

    // Add pieces to the starting positions
    if (row === 0 || row === 7) {
      let piece;
      if (col === 0 || col === 7) piece = pieces.rook;
      else if (col === 1 || col === 6) piece = pieces.knight;
      else if (col === 2 || col === 5) piece = pieces.bishop;
      else if (col === 3) piece = pieces.queen;
      else if (col === 4) piece = pieces.king;
      square.textContent = piece;
    } else if (row === 1 || row === 6) {
      square.textContent = pieces.pawn;
    }

    // Add draggable attribute to pieces
    if (square.textContent) {
      square.draggable = true;
      square.addEventListener('dragstart', dragStart);
    }

    square.addEventListener('dragover', dragOver);
    square.addEventListener('drop', drop);

    chessboard.appendChild(square);
  }
}

let draggedPiece = null;

// Drag start event
function dragStart(event) {
  draggedPiece = event.target;
  event.dataTransfer.setData('text/plain', event.target.textContent);
}

// Drag over event
function dragOver(event) {
  event.preventDefault();
  event.target.classList.add('dragover');
}

// Drop event
function drop(event) {
  event.preventDefault();
  event.target.classList.remove('dragover');

  const targetSquare = event.target;

  if (targetSquare.classList.contains('square') && targetSquare !== draggedPiece) {
    const startRow = parseInt(draggedPiece.dataset.row);
    const startCol = parseInt(draggedPiece.dataset.col);
    const endRow = parseInt(targetSquare.dataset.row);
    const endCol = parseInt(targetSquare.dataset.col);
    const piece = draggedPiece.textContent;

    if (isValidMove(startRow, startCol, endRow, endCol, piece)) {
      targetSquare.textContent = piece;
      draggedPiece.textContent = '';
    } else {
      alert('Invalid move!');
    }
  }
}

// Validate moves
function isValidMove(startRow, startCol, endRow, endCol, piece) {
  const rowDiff = Math.abs(endRow - startRow);
  const colDiff = Math.abs(endCol - startCol);

  // Pawn movement
  if (piece === pieces.pawn) {
    const direction = startRow === 1 ? 1 : -1; // Assuming white starts at row 1
    if (endRow === startRow + direction && endCol === startCol) {
      return true;
    }
  }

  // Knight movement
  if (piece === pieces.knight) {
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  }

  // Rook movement
  if (piece === pieces.rook) {
    return startRow === endRow || startCol === endCol;
  }

  // Bishop movement
  if (piece === pieces.bishop) {
    return rowDiff === colDiff;
  }

  // Queen movement
  if (piece === pieces.queen) {
    return startRow === endRow || startCol === endCol || rowDiff === colDiff;
  }

  // King movement
  if (piece === pieces.king) {
    return rowDiff <= 1 && colDiff <= 1;
  }

  // Default: invalid move
  return false;
}