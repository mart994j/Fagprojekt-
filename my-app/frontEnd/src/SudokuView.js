import React, { useState, useEffect } from 'react';
import './SudokuView.css';

function SudokuView() {
  const [grid, setGrid] = useState([]);

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
    for (let i = 0; i < 9; i++) {
      const row = new Set();
      const col = new Set();
      const box = new Set();

      for (let j = 0; j < 9; j++) {
        // tjek værdier i række, kolonne og boks
        const valueRow = grid[i][j];
        const valueCol = grid[j][i];
        const valueBox = grid[3 * Math.floor(i / 3) + Math.floor(j / 3)][3 * (i % 3) + (j % 3)];
        // tjek om værdien allerede findes i række, kolonne eller boks
        if ((valueRow > 0 && row.has(valueRow)) || (valueCol > 0 && col.has(valueCol)) || (valueBox > 0 && box.has(valueBox))) {
          return 'Invalid Sudoku';
        }
        // tilføj værdier til række, kolonne og boks
        row.add(valueRow);
        col.add(valueCol);
        box.add(valueBox);
      }
    }
    // hvis ingen værdier er blevet fundet, så er det en valid sudoku
    return 'Valid Sudoku';
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
