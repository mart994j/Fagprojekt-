import React, { useState, useEffect } from 'react';
import './SudokuView.css';



function SudokuView() {
  const [grid, setGrid] = useState([]);
  const [validity, setValidity] = useState(Array(9).fill().map(() => Array(9).fill(true)));

  //sætter editableCells til at være et tomt array
  const [editableCells, setEditableCells] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/generate')
      .then(response => response.json())
      .then(data => {
        setGrid(data.board);
        // Initialize editableCells based on whether the cell value is 0
        const editable = data.board.map(row => row.map(value => value === 0));
        setEditableCells(editable);
      })
      .catch(error => console.error('Error fetching data: ', error));
  }, []);

  const handleInputChange = (event, i, j) => {
    if (!editableCells[i][j]) {
      // hvis cellen ikke er redigerbar, gør intet
      return;
    }
    const value = event.target.value;
    if (value === '' || (/^\d+$/.test(value) && value >= 1 && value <= 9)) {
      const numValue = value === '' ? 0 : parseInt(value, 10); // convert to number
  
      const newGrid = grid.map((row, rowIndex) =>
        row.map((cell, cellIndex) =>
          rowIndex === i && cellIndex === j ? numValue : cell
        )
      );
  
      setGrid(newGrid);
    }
    //hvis input ikke er gyldigt, gør intet og returner tilbage til inputfeltet og 
  };
  

  const isValidSudoku = () => {
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
  
   
    setValidity(newValidity);
    
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
  
    return isValid;
  };
  // tjek om sudoku er valid
  const checkSudoku = () => {
    alert(isValidSudoku()); //vis alert med resultat
  };
  

  return (
    <div className="SudokuView">
      <table className="center">
        <tbody>
          {grid.map((row, i) => (
            <tr key={i}>
              {row.map((value, j) => (
                <td key={j} className={!validity[i][j] ? 'invalid' : ''}>
                  <input
                    type="text"
                    className={!validity[i][j] ? 'invalid-input' : ''}
                    value={value === 0 ? '' : value}
                    onChange={(event) => handleInputChange(event, i, j)}
                    readOnly={!editableCells[i][j]} // Gør inputfeltet ikke-redigerbart, hvis cellen ikke er redigerbar
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
  
      <button
        className="button-blue"
        onClick={checkSudoku}>
  
          Check Sudoku
        
        </button>
  
    </div>
  );
}

export default SudokuView;
