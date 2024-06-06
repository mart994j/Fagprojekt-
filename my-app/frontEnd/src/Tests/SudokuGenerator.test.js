//npm install --save-dev jest

const { SudokuGenerator } = require('../../../backEnd/SudokuGenerator');

describe('SudokuGenerator', () => {

  test('generateBoard creates a board of the correct size', () => {
    const size = 9;
    const board = SudokuGenerator.generateBoard(size);
    expect(board).toHaveLength(size);
    for (let row of board) {
      expect(row).toHaveLength(size);
    }
  });

  test('isValidPlacement correctly identifies valid and invalid placements', () => {
    const size = 9;
    const board = Array.from({ length: size }, () => Array(size).fill(0));
    // Valid placement
    expect(SudokuGenerator.isValidPlacement(board, 0, 0, 5, size)).toBe(true);
    board[0][0] = 5;
    // Invalid placement in the same row
    expect(SudokuGenerator.isValidPlacement(board, 0, 1, 5, size)).toBe(false);
    // Invalid placement in the same column
    expect(SudokuGenerator.isValidPlacement(board, 1, 0, 5, size)).toBe(false);
    // Invalid placement in the same box
    expect(SudokuGenerator.isValidPlacement(board, 1, 1, 5, size)).toBe(false);
  });

  test('solveBoard solves the board correctly', () => {
    const size = 9;
    const board = [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];
    const solutions = SudokuGenerator.solveBoard(board, size);
    expect(solutions).toBe(1); // Expect only one solution
  });

  test('removeNumbers makes the board solvable with unique solution', () => {
    const size = 9;
    const holes = 20;
    let board = SudokuGenerator.generateBoard(size);
    SudokuGenerator.removeNumbers(board, holes);
    const solutions = SudokuGenerator.solveBoard(JSON.parse(JSON.stringify(board)), size);
    expect(solutions).toBe(1); // Expect the board to have only one solution
  });

  test('findCellWithFewestCandidates correctly identifies the cell with the fewest candidates', () => {
    const size = 9;
    const board = Array.from({ length: size }, () => Array(size).fill(0));
    const candidates = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => new Set(Array.from({ length: size }, (_, index) => index + 1)))
    );
    const [row, col] = SudokuGenerator.findCellWithFewestCandidates(board, candidates, size);
    expect(row).not.toBe(-1);
    expect(col).not.toBe(-1);
  });

});
