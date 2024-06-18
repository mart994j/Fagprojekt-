import { isValidSudoku } from '../Utilities/sudokuUtils';
describe('isValidSudoku', () => {
  it('should return true for a valid Sudoku grid', () => {
    const validGrid = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ];
    const result = isValidSudoku(validGrid);
    expect(result.isValid).toBe(true);
    result.newValidity.forEach(row => {
      expect(row.every(cell => cell === true)).toBe(true);
    });
  });

  it('should return false for an invalid Sudoku grid with duplicate numbers in a row', () => {
    const invalidGrid = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 3] // Duplicate '3' in the last row
    ];
    const result = isValidSudoku(invalidGrid);
    expect(result.isValid).toBe(false);
    expect(result.newValidity[8][8]).toBe(false);
    expect(result.newValidity[8][0]).toBe(false);
  });

  it('should return false for an invalid Sudoku grid with duplicate numbers in a column', () => {
    const invalidGrid = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 5] // Duplicate '5' in the last column
    ];
    const result = isValidSudoku(invalidGrid);
    expect(result.isValid).toBe(false);
    expect(result.newValidity[8][8]).toBe(false);
  });

  it('should return false for an invalid Sudoku grid with duplicate numbers in a box', () => {
    const invalidGrid = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 9, 9] // Duplicate '9' in the bottom-right box
    ];
    const result = isValidSudoku(invalidGrid);
    expect(result.isValid).toBe(false);
    expect(result.newValidity[8][8]).toBe(false);
    expect(result.newValidity[8][7]).toBe(false);
  });

  it('should return true for an empty Sudoku grid', () => {
    const emptyGrid = Array(9).fill().map(() => Array(9).fill(0));
    const result = isValidSudoku(emptyGrid);
    expect(result.isValid).toBe(true);
    result.newValidity.forEach(row => {
      expect(row.every(cell => cell === true)).toBe(true);
    });
  });
});
