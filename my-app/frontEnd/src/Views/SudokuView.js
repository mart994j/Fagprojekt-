import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import './CSS/SudokuView.css';
import { isValidSudoku } from '../sudokuUtils';
import { fetchNewBoard } from '../fetchNewBoard';
import UserContext from '../UserContext';
import { useLocation, useNavigate } from 'react-router-dom';


function SudokuView() {
  const location = useLocation();
  const navigate = useNavigate();

  const [n, setN] = useState(9); // Initialiserer n med en standardværdi eller fallback værdi
  const [grid, setGrid] = useState([]);

  const [validity, setValidity] = useState(Array(n).fill().map(() => Array(n).fill(true)));
  const [userEdits, setUserEdits] = useState(Array(n).fill().map(() => Array(n).fill(false)));

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [editableCells, setEditableCells] = useState([]);
  const [timer, setTimer] = useState(0);
  const isTimerActiveRef = useRef(false);
  const { username } = useContext(UserContext);
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [notes, setNotes] = useState(Array(n).fill().map(() => Array(n).fill([]))); // Initialize with empty arrays for notes


  useEffect(() => {
    // Initialize or re-initialize notes when n changes
    setNotes(Array(n).fill().map(() => Array(n).fill([])));
  }, [n]); // Dependency on n
//hej
  // Henter et nyt board fra serveren 
  useEffect(() => {
    const n = location.state?.n ? location.state.n : 9; // Fallback til 9 som standard størrelse
    setN(n);
    fetchNewBoard({
      n,
      setGrid,
      setEditableCells,
      setUserEdits,
      setValidity,
      setIsDataLoaded,
      setTimer,
      setIsTimerActive: isTimerActiveRef.current ? () => { } : startTimer,
    });
  }, [location.state?.n]);

  // Timer logik 
  const startTimer = () => {
    if (!isTimerActiveRef.current) {
      isTimerActiveRef.current = true;
      const interval = setInterval(() => {
        if (isTimerActiveRef.current) {
          setTimer((prevTimer) => prevTimer + 1);
        } else {
          clearInterval(interval);
        }
      }, 1000);
    }
  };

  // Stop timer-funktion
  const stopTimer = () => {
    isTimerActiveRef.current = false;
  };

  // Håndterer input fra brugeren
  const handleInputChange = useCallback((event, i, j) => {
    if (!editableCells[i][j]) {
      return;
    }
    const value = event.target.value;

    if (isNotesMode) {
      // Handle note input
      const noteValue = parseInt(value, 10);
      const updatedNotes = [...notes];
      if (value === '') {
        updatedNotes[i][j] = []; // Clear notes if input is empty
      } else if (/^\d+$/.test(value) && value >= 1 && value <= n) {
        if (updatedNotes[i][j].includes(noteValue)) {
          // If the note is already present, remove it
          updatedNotes[i][j] = updatedNotes[i][j].filter(note => note !== noteValue);
        } else {
          // Add note if it's a valid number and not already present
          updatedNotes[i][j] = [...new Set([...updatedNotes[i][j], noteValue])]; // This also prevents duplicate notes
        }
      }
      setNotes(updatedNotes);
    } else {
      // Existing logic for handling value input
      if (value === '' || (/^\d+$/.test(value) && value >= 1 && value <= n)) {
        const numValue = value === '' ? 0 : parseInt(value, 10);
        const newGrid = grid.map((row, rowIndex) =>
          row.map((cell, cellIndex) => rowIndex === i && cellIndex === j ? numValue : cell)
        );

        const updatedNotes = [...notes]; // Prepare to potentially clear notes
        if (numValue !== 0) {
          // If a valid number is placed, clear the notes for this cell
          updatedNotes[i][j] = [];
        }

        setGrid(newGrid);
        setNotes(updatedNotes); // Update notes state to reflect changes

        const newUserEdits = [...userEdits];
        newUserEdits[i][j] = true;
        setUserEdits(newUserEdits);
      }
    }
    stopTimer();
  }, [editableCells, grid, userEdits, notes, n, isNotesMode]);


  function getUserLocation(callback) {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          callback(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          callback(null, null); // Håndter fejl eller ingen tilladelse
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      callback(null, null); // Håndter unsupported browser
    }
  }
  const submitScore = useCallback((username, time) => {
    getUserLocation((latitude, longitude) => {
      const location = { lat: latitude, lng: longitude };
      console.log({ username, time, location }); // Debugging
      fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          time,
          location,
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Score submitted:', data);
          // Opdater UI eller state her baseret på svaret, hvis nødvendigt
        })
        .catch(error => console.error('Error submitting score:', error));
    });
  }, []);




  // Tjekker om Sudoku er løst
  const checkSudoku = useCallback(() => {
    if (!isDataLoaded) return;
    const { isValid, newValidity } = isValidSudoku(grid);
    setValidity(newValidity);
    // Tjekker om brættet er fuldt udfyldt og gyldigt
    const isFullyFilled = grid.every(row => row.every(value => value !== 0));
    if (isValid && isFullyFilled) {
      alert(`Congratulations! You've solved the Sudoku in ${timer} seconds!`);
      stopTimer();
      submitScore(username, timer);
      navigate('/');

    }
  }, [grid, isDataLoaded, timer, username, navigate, submitScore]);

  useEffect(() => {
    if (isDataLoaded) {
      checkSudoku();
    }
  }, [grid, isDataLoaded, checkSudoku]);




  useEffect(() => {
    return () => {
      isTimerActiveRef.current = false; // Sørg for at timeren stopper, når komponenten unmounts
    };
  }, []);

  // Calculate the square root of n to determine subgrid size
  const subGridSize = Math.sqrt(n);
  const baseSize = 500; // Base size for the Sudoku board
  const cellSize = baseSize / n;
  const fontSize = Math.max(12, cellSize / 3); // Adjust this formula as needed

  // Modify the return statement in your SudokuView component
  return (
    <div className="SudokuView">
      <h1>Sudoku</h1>
      <div className="timer">Timer: {timer} sekunder</div>
      <button onClick={() => setIsNotesMode(!isNotesMode)}>
        {isNotesMode ? 'Disable Notes Mode' : 'Enable Notes Mode'}
      </button>
      <table className="center" style={{ width: baseSize + 'px', height: baseSize + 'px' }}>
        <tbody>
          {grid.map((row, i) => (
            <tr key={i}>
              {row.map((value, j) => (
                <td
                  key={j}
                  className={
                    `${!validity[i][j] ? 'invalid' : ''} ` +
                    `${(j + 1) % subGridSize === 0 && j + 1 !== n ? 'right-border' : ''} ` +
                    `${(i + 1) % subGridSize === 0 && i + 1 !== n ? 'bottom-border' : ''}`
                  }
                  style={{ width: cellSize + 'px', height: cellSize + 'px', position: 'relative' }}
                >
                  {notes[i][j].length > 0 ? (
                    <div className="notes" style={{ fontSize: '10px' }}>{notes[i][j].join(', ')}</div>
                  ) : null}
                  <input
                    type="text"
                    className={`${!validity[i][j] ? 'invalid-input' : ''} ${userEdits[i][j] ? 'user-input' : ''}`}
                    value={value === 0 ? '' : value}
                    onChange={(event) => handleInputChange(event, i, j)}
                    readOnly={!editableCells[i][j]}
                    style={{ fontSize: `${fontSize}px`, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}
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
