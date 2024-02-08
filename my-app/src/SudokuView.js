//npm start

import React, { useState, useEffect } from 'react';
import './App.css';



function SudokuView() {
  // Initialize a 9x9 grid with some predefined numbers
  const [grid, setGrid] = useState([]);


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

  useEffect(() => {
    // Generate a new board when the component mounts
    const newBoard = generateBoard();
    setGrid(newBoard);
  }, []);

  return (
    <div className="SodukoView">
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


  function generateBoard() {
    let board = Array.from({length: 9}, () => Array(9).fill(0));
  
    const fillBoard = (board) => {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (board[i][j] === 0) {
            const numbers = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
            for (let num of numbers) {
              if (isValid(board, i, j, num)) {
                board[i][j] = num;
                if (fillBoard(board)) {
                  return true;
                } else {
                  board[i][j] = 0; // undo & try again
                }
              }
            }
            return false; // trigger backtracking from previous cell
          }
        }
      }
      return true; // sudoku solved
    };
  
    const isValid = (board, row, col, num) => {
      for (let i = 0; i < 9; i++) {
        const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
        const n = 3 * Math.floor(col / 3) + i % 3;
        if (board[row][i] === num || board[i][col] === num || board[m][n] === num) {
          return false; // not valid
        }
      }
      return true; // valid
    };
  
    // Fill the board completely first
    fillBoard(board);
  
    // Create holes in the board based on difficulty
    const removeNumbers = (board, holes) => {
      let attempts = holes;
      while (attempts > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (board[row][col] !== 0) {
          board[row][col] = 0;
          attempts--;
        }
      }
    };
  
    // Example: Remove 40 numbers for a medium difficulty puzzle
    removeNumbers(board, 10);
  
    return board;
  }
  
}

export default SudokuView;