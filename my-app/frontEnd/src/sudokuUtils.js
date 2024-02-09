

export const isValidSudoku = (grid) => {
    let newValidity = Array(9).fill().map(() => Array(9).fill(true)); 
    let isValid = true;
  
    // Track first occurrences of values in rows, columns, and boxes
    let firstOccurrencesRows = Array(9).fill().map(() => ({}));
    let firstOccurrencesCols = Array(9).fill().map(() => ({}));
    let firstOccurrencesBoxes = Array(9).fill().map(() => ({}));
  
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const val = grid[i][j];
        if (val) {
          // Check rows
          if (val in firstOccurrencesRows[i]) {
            // Mark both the original and the duplicate as invalid
            newValidity[i][j] = false; 
            const originalPos = firstOccurrencesRows[i][val];
            newValidity[originalPos[0]][originalPos[1]] = false; 
          } else {
            firstOccurrencesRows[i][val] = [i, j]; 
          }
  
          // Check columns
          if (val in firstOccurrencesCols[j]) {
            // Mark both the original and the duplicate as invalid
            newValidity[i][j] = false; 
            const originalPos = firstOccurrencesCols[j][val];
            newValidity[originalPos[0]][originalPos[1]] = false; 
          } else {
            firstOccurrencesCols[j][val] = [i, j]; 
          }
  
          // Calculate box index
          const boxIndex = 3 * Math.floor(i / 3) + Math.floor(j / 3);
          // Check boxes
          if (val in firstOccurrencesBoxes[boxIndex]) {
            // Mark both the original and the duplicate as invalid
            newValidity[i][j] = false; 
            const originalPos = firstOccurrencesBoxes[boxIndex][val];
            newValidity[originalPos[0]][originalPos[1]] = false; 
          } else {
            firstOccurrencesBoxes[boxIndex][val] = [i, j]; 
          }
        }
      }
    }
  
    // Check if any cell is marked as invalid
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (!newValidity[i][j]) {
          isValid = false;
          break;
        }
      }
      if (!isValid) break;
    }

    return { isValid, newValidity };
  };