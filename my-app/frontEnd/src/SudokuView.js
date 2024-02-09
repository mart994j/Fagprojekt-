import React, { useState, useEffect, useCallback } from 'react';
import './SudokuView.css';
import { isValidSudoku } from './sudokuUtils';




function SudokuView() {
  const [grid, setGrid] = useState([]);
  const [validity, setValidity] = useState(Array(9).fill().map(() => Array(9).fill(true)));
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [editableCells, setEditableCells] = useState([]);
  const [userEdits, setUserEdits] = useState(Array(9).fill().map(() => Array(9).fill(false)));


  useEffect(() => {
    fetch('http://localhost:3000/generate')
      .then(response => response.json())
      .then(data => {
        setGrid(data.board);
        // Initialize editableCells based on whether the cell value is 0
        const editable = data.board.map(row => row.map(value => value === 0));
        setEditableCells(editable);
        setIsDataLoaded(true);
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

       // Mark the cell as edited by the user
       const newUserEdits = [...userEdits];
       newUserEdits[i][j] = true; // Mark as edited
       setUserEdits(newUserEdits);
   
    }
    //hvis input ikke er gyldigt, gør intet og returner tilbage til inputfeltet og 
  };

  const checkSudoku = useCallback(() => {
    if (!isDataLoaded) return; // Ensure grid is loaded before checking
    const { isValid, newValidity } = isValidSudoku(grid);
    setValidity(newValidity);
    const isFullyFilled = grid.every(row => row.every(value => value !== 0));
    if (isValid && isFullyFilled) {
      alert("Congratulations! You've solved the Sudoku!");
    }
  }, [grid, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) {
      checkSudoku();
    }
  }, [grid, isDataLoaded, checkSudoku]);
  


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
                    className={`${!validity[i][j] ? 'invalid-input' : ''} ${userEdits[i][j] ? 'user-input' : ''}`}
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
    </div>
  );
}


export default SudokuView;
