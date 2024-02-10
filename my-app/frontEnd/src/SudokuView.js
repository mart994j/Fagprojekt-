import React, { useState, useEffect, useCallback,useContext } from 'react';
import './SudokuView.css';
import { isValidSudoku } from './sudokuUtils';
import { fetchNewBoard } from './fetchNewBoard';
import UserContext from './UserContext';
import { useNavigate } from 'react-router-dom';


function SudokuView() {
  const [grid, setGrid] = useState([]);
  const [validity, setValidity] = useState(Array(9).fill().map(() => Array(9).fill(true)));
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [editableCells, setEditableCells] = useState([]);
  const [userEdits, setUserEdits] = useState(Array(9).fill().map(() => Array(9).fill(false)));
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const { username } = useContext(UserContext);
  const navigate = useNavigate();

  // Henter et nyt board fra serveren 
  useEffect(() => {
    fetchNewBoard({
      setGrid,
      setEditableCells,
      setUserEdits,
      setValidity,
      setIsDataLoaded,
      setTimer,
      setIsTimerActive
    });
  }, []);

  // Timer logik 
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
  
  // Håndterer input fra brugeren
  const handleInputChange = useCallback((event, i, j) => {
    if (!editableCells[i][j]) {
      return;
    }
    const value = event.target.value;
    // Tjekker om input er gyldigt 
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
  }, [editableCells, grid, userEdits]);

  // Tjekker om Sudoku er løst
  const checkSudoku = useCallback(() => {
    if (!isDataLoaded) return;
    const { isValid, newValidity } = isValidSudoku(grid);
    setValidity(newValidity);
    // Tjekker om brættet er fuldt udfyldt og gyldigt
    const isFullyFilled = grid.every(row => row.every(value => value !== 0));
    if (isValid && isFullyFilled) {
      alert(`Congratulations! You've solved the Sudoku in ${timer} seconds!`);
      setIsTimerActive(false);
      submitScore(username, timer);
      navigate('/'); 

    }
  }, [grid, isDataLoaded, timer, username,navigate]);

  useEffect(() => {
    if (isDataLoaded) {
      checkSudoku();
    }
  }, [grid, isDataLoaded, checkSudoku]);


  function submitScore(username, time) {
    console.log({ username, time }); // Add this line to debug
    fetch('http://localhost:3000/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        time,
      }),
    })
    .then(response => response.json())
    .then(data => console.log('Score submitted:', data))
    .catch(error => console.error('Error submitting score:', error));
  }

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
