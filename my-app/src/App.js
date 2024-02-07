import React, { useState } from 'react';
import './App.css';

function App() {
  // Initialize a 9x9 grid with some predefined numbers
  const [grid, setGrid] = useState([
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ]);

  const handleInputChange = (event, i, j) => {
    const value = event.target.value;
    // Check if the input is a valid number or an empty string
    if (value === '' || (/^\d+$/.test(value) && value >= 0 && value <= 9)) {
      const numValue = value === '' ? 0 : parseInt(value, 10); // Convert input to number or reset to 0 if empty
  
      // Create a new grid with the updated value
      const newGrid = grid.map((row, rowIndex) =>
        row.map((cell, cellIndex) =>
          rowIndex === i && cellIndex === j ? numValue : cell
        )
      );
  
      setGrid(newGrid);
    }
    // If the input is not valid (letters or invalid characters), do nothing
  };
  const isValidSudoku = () => {
    for (let i = 0; i < 9; i++) {
      const row = new Set();
      const col = new Set();
      const box = new Set();

      for (let j = 0; j < 9; j++) {
        const valueRow = grid[i][j];
        const valueCol = grid[j][i];
        const valueBox = grid[3 * Math.floor(i / 3) + Math.floor(j / 3)][3 * (i % 3) + (j % 3)];

        if ((valueRow > 0 && row.has(valueRow)) || (valueCol > 0 && col.has(valueCol)) || (valueBox > 0 && box.has(valueBox))) {
          return 'Invalid Sudoku'; // Set the validation message to 'Invalid Sudoku'
          
        }

        row.add(valueRow);
        col.add(valueCol);
        box.add(valueBox);
      }
    }

    return 'Valid Sudoku'; // Set the validation message to 'Valid Sudoku'
  };
  
  const checkSudoku = () => {
    alert(isValidSudoku()); // Display the validation message in an alert
  };

  return (
    <div className="App">
      <table className="center">
        <tbody>
          {grid.map((row, i) => (
            <tr key={i}>
              {row.map((value, j) => (
                <td key={j}>
                  <input 
                    type="text" 
                    value={value === 0 ? '' : value} 
                    onChange={event => handleInputChange(event, i, j)} 
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={checkSudoku}>Check Sudoku</button>
    </div>
  );
}

export default App;