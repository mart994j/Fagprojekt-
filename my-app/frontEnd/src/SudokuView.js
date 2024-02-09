import React, { useState, useEffect } from 'react';
import './SudokuView.css';

function SudokuView() {
  const [grid, setGrid] = useState([]);
  const [validity, setValidity] = useState(Array(9).fill().map(() => Array(9).fill(true)));


  useEffect(() => {
    // Hent et nyt Sudoku bræt fra backenden
    fetch('http://localhost:3000/generate')
      .then(response => response.json())
      .then(data => setGrid(data.board))
      .catch(error => console.error('Error fetching data: ', error));
  }, []);

  const handleInputChange = (event, i, j) => {
    const value = event.target.value;
    // check om input er et tal mellem 1 og 9
    if (value === '' || (/^\d+$/.test(value) && value >= 1 && value <= 9)) {
      const numValue = value === '' ? 0 : parseInt(value, 10); // konverter til tal

      // lav en ny kopi af grid og opdater værdien på den valgte celle
      const newGrid = grid.map((row, rowIndex) =>
        row.map((cell, cellIndex) =>
          rowIndex === i && cellIndex === j ? numValue : cell
        )
      );

      setGrid(newGrid);
      
    }
    //hvis input ikke er et tal mellem 1 og 9, så gør ingenting
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

  useEffect(() => {
    // Perform actions that depend on the updated validity state here
    console.log('Validity state updated', validity);
  
    // Example: Check if the entire grid is valid and do something
    const isEntireGridValid = validity.every(row => row.every(cell => cell));
    if (isEntireGridValid) {
      console.log('The entire grid is valid!');
      // Perform additional actions here
    }
  }, [validity]); 

  

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
                    value={value === 0 ? '' : value}
                    onChange={(event) => handleInputChange(event, i, j)}
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
