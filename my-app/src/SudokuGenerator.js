export class SudokuGenerator {
    static generateBoard() {
      let board = Array.from({length: 9}, () => Array(9).fill(0));
      this.fillBoard(board);
      return board;
    }
  
    static fillBoard(board) {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (board[i][j] === 0) {
            const numbers = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
            for (let num of numbers) {
              if (this.isValidPlacement(board, i, j, num)) {
                board[i][j] = num;
                if (this.fillBoard(board)) {
                  return true;
                } else {
                  board[i][j] = 0;
                }
              }
            }
            return false;
          }
        }
      }
      return true;
    }
  
    static isValidPlacement(board, row, col, num) {
      for (let i = 0; i < 9; i++) {
        const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
        const n = 3 * Math.floor(col / 3) + i % 3;
        if (board[row][i] === num || board[i][col] === num || board[m][n] === num) {
          return false;
        }
      }
      return true;
    }
  
    static removeNumbers(board, holes) {
      let attempts = holes;
      while (attempts > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (board[row][col] !== 0) {
          board[row][col] = 0;
          attempts--;
        }
      }
    }
  }
  