import React, { useState, useEffect, useCallback } from 'react';
import './SudokuView.css';
import { isValidSudoku } from './sudokuUtils';

function SudokuView() {
  const [grid, setGrid] = useState([]);
  const [validity, setValidity] = useState(Array(9).fill().map(() => Array(9).fill(true)));
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [editableCells, setEditableCells] = useState([]);
  const [userEdits, setUserEdits] = useState(Array(9).fill().map(() => Array(9).fill(false)));
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/generate')
      .then(response => response.json())
      .then(data => {
        setGrid(data.board);
        const editable = data.board.map(row => row.map(value => value === 0));
        setEditableCells(editable);
        setIsDataLoaded(true);
        setIsTimerActive(true); // Start timeren, når data er indlæst
      })
      .catch(error => console.error('Error fetching data: ', error));
  }, []);

  useEffect(() => {
    let interval = null;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive]);

  const handleInputChange = (event, i, j) => {
    if (!editableCells[i][j]) {
      return;
    }
    const value = event.target.value;
    if (value === '' || (/^\d+$/.test(value) && value >= 1 && value <= 9)) {
      const numValue = value === '' ? 0 : parseInt(value, 10);
      const newGrid = grid.map((row, rowIndex) =>
        row.map((cell, cellIndex) => rowIndex === i && cellIndex === j ? numValue : cell)
      );
      setGrid(newGrid);

      const newUserEdits = [...userEdits];
      newUserEdits[i][j] = true;
      setUserEdits(newUserEdits);
    }
  };

  const checkSudoku = useCallback(() => {
    if (!isDataLoaded) return;
    const { isValid, newValidity } = isValidSudoku(grid);
    setValidity(newValidity);
    const isFullyFilled = grid.every(row => row.every(value => value !== 0));
    if (isValid && isFullyFilled) {
      alert("Congratulations! You've solved the Sudoku!");
      setIsTimerActive(false); // Stop timeren, når Sudoku er løst
    }
  }, [grid, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) {
      checkSudoku();
    }
  }, [grid, isDataLoaded, checkSudoku]);

  return (
    <div className="SudokuView">
      <div>Timer: {timer} sekunder</div>
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
                    readOnly={!editableCells[i][j]}
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
