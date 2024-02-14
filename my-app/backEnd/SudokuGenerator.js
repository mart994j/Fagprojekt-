class SudokuGenerator {
  // Generer et nyt sudoku bræt med variabel størrelse
  static generateBoard(size=9) {
    let board = Array.from({ length: size }, () => Array(size).fill(0));
    this.fillBoard(board, size);
    return board;
  }
    //Fyld brættet med tal
  static fillBoard(board, size) {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (board[i][j] === 0) {
          const numbers = Array.from({ length: size }, (_, index) => index + 1).sort(() => Math.random() - 0.5);
          for (let num of numbers) {
            if (this.isValidPlacement(board, i, j, num, size)) {
              board[i][j] = num;
              if (this.fillBoard(board, size)) {
                return true;
              } else {
                board[i][j] = 0;
              }
            }
          }
          return false; // Ingen gyldig nummer fundet, backtrack
        }
      }
    }
    return true; // Hele brættet er fyldt
  }
  // Check om tal er gyldigt, tilpasset til variabel størrelse
  static isValidPlacement(board, row, col, num, size) {
    const boxSize = Math.sqrt(size);
    for (let i = 0; i < size; i++) {
      const m = boxSize * Math.floor(row / boxSize) + Math.floor(i / boxSize);
      const n = boxSize * Math.floor(col / boxSize) + i % boxSize;
      if (board[row][i] === num || board[i][col] === num || board[m][n] === num) {
        return false;
      }
    }
    return true;
  }
  // Fjern tal fra brættet, tilpasset til variabel størrelse
  static removeNumbers(board, holes) {
    let attempts = holes;
    const size = board.length;
    while (attempts > 0) {
      let row = Math.floor(Math.random() * size);
      let col = Math.floor(Math.random() * size);
      if (board[row][col] !== 0) {
        board[row][col] = 0;
        attempts--;
      }
    }
  }
}
  module.exports = { SudokuGenerator };

  