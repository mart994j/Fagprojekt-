//Sebastian
export const isValidSudoku = (grid) => {
  const size = grid.length; // Dynamisk bestem størrelsen af brættet
  const boxSize = Math.sqrt(size); // Beregn størrelsen af en enkelt box
  let newValidity = Array(size).fill().map(() => Array(size).fill(true));
  let isValid = true;

  let firstOccurrencesRows = Array(size).fill().map(() => ({}));
  let firstOccurrencesCols = Array(size).fill().map(() => ({}));
  let firstOccurrencesBoxes = Array(size).fill().map(() => ({}));

  for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
          const val = grid[i][j];
          if (val) {
              // Check rows
              if (val in firstOccurrencesRows[i]) {
                  newValidity[i][j] = false;
                  const originalPos = firstOccurrencesRows[i][val];
                  newValidity[originalPos[0]][originalPos[1]] = false;
              } else {
                  firstOccurrencesRows[i][val] = [i, j];
              }

              // Check columns
              if (val in firstOccurrencesCols[j]) {
                  newValidity[i][j] = false;
                  const originalPos = firstOccurrencesCols[j][val];
                  newValidity[originalPos[0]][originalPos[1]] = false;
              } else {
                  firstOccurrencesCols[j][val] = [i, j];
              }

              // Calculate box index
              const boxIndex = boxSize * Math.floor(i / boxSize) + Math.floor(j / boxSize);
              // Check boxes
              if (val in firstOccurrencesBoxes[boxIndex]) {
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
  for (let row of newValidity) {
      if (row.includes(false)) {
          isValid = false;
          break;
      }
  }

  return { isValid, newValidity };
};
