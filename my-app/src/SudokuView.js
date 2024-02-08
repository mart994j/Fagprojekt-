import React, { useState, useEffect } from 'react';
import './App.css';
import { SudokuGenerator } from './SudokuGenerator.js'; // Make sure you have this class created

function SudokuView() {
  const [grid, setGrid] = useState([]);

  useEffect(() => {
    // Initialize the grid when the component mounts
    const newBoard = SudokuGenerator.generateBoard();
    SudokuGenerator.removeNumbers(newBoard, 10); // Adjust the number of holes based on the desired difficulty
    setGrid(newBoard);
  }, []);

  const handleInputChange = (event, i, j) => {
    const value = event.target.value;
    // Check if the input is a valid number or an empty string
    if (value === '' || (/^\d+$/.test(value) && value >= 1 && value <= 9)) {
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
    // This method might need adjustments to work with the SudokuGenerator class if it does not include validation logic
    for (let i = 0; i < 9; i++) {
      const row = new Set();
      const col = new Set();
      const box = new Set();

      for (let j = 0; j < 9; j++) {
        const valueRow = grid[i][j];
        const valueCol = grid[j][i];
        const valueBox = grid[3 * Math.floor(i / 3) + Math.floor(j / 3)][3 * (i % 3) + (j % 3)];

        if ((valueRow > 0 && row.has(valueRow)) || (valueCol > 0 && col.has(valueCol)) || (valueBox > 0 && box.has(valueBox))) {
          return 'Invalid Sudoku';
        }

        row.add(valueRow);
        col.add(valueCol);
        box.add(valueBox);
      }
    }

    return 'Valid Sudoku';
  };

  const checkSudoku = () => {
    alert(isValidSudoku()); // Display the validation message in an alert
  };

  return (
    <div className="SudokuView">
      <table className="center">
        <tbody>
          {grid.map((row, i) => (
            <tr key={i}>
              {row.map((value, j) => (
                <td key={j}>
                  <input 
                    type="text" 
                    value={value === 0 ? '' : value} 
                    onChange={(event) => handleInputChange(event, i, j)} 
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

export default SudokuView;
