import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import './CSS/SudokuView.css';
import celebrateWin from '../Components/WinAnimation.js';
import { isValidSudoku } from '../sudokuUtils';
import { fetchNewBoard } from '../fetchNewBoard';
import SudokuPause from '../Components/sudokuPause';
import { FaPencilAlt, FaEraser, FaCheck, FaTimes, FaAccessibleIcon, FaLightbulb, FaSave, FaPause } from 'react-icons/fa';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import UserContext from '../UserContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { markLevelCompleted } from '../markLevelCompleted';

function SudokuView() {
  const location = useLocation();
  const navigate = useNavigate();

  const diff = location.state?.diff ?? 10;

  const [n, setN] = useState(9); // Initialiserer n med en standardværdi eller fallback værdi
  const [grid, setGrid] = useState([]);

  const [hints, setHints] = useState([]);
  const [hintsFetched, setHintsFetched] = useState(false);

  const [validity, setValidity] = useState(Array(n).fill().map(() => Array(n).fill(true)));
  const [userEdits, setUserEdits] = useState(Array(n).fill().map(() => Array(n).fill(false)));
  const [isPaused, setIsPaused] = useState(false);

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [editableCells, setEditableCells] = useState([]);
  const [timer, setTimer] = useState(0);
  const isTimerActiveRef = useRef(false);
  const { username,setUsername } = useContext(UserContext);
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [notes, setNotes] = useState(Array(n).fill().map(() => Array(n).fill([])));
  const [lastClickedCell, setLastClickedCell] = useState(null);


  const startTimer = useCallback(() => {
    if (!isTimerActiveRef.current) {
      isTimerActiveRef.current = true;
      setTimer(prevTimer => prevTimer); // Initialize timer without changing its state
      const interval = setInterval(() => {
        if (isTimerActiveRef.current) {
          setTimer(prevTimer => prevTimer + 1);
        }
      }, 1000);
      // Store the interval ID in the ref so it can be cleared later
      isTimerActiveRef.current = interval;
    }
  }, []);
  
  const stopTimer = useCallback(() => {
    // Clear the interval using the ID stored in the ref
    clearInterval(isTimerActiveRef.current);
    isTimerActiveRef.current = false;
  }, []);


  const incrementGamesPlayed = useCallback(() => {
    const gameData = {
      username: username,
      gamesPlayed: 1, // Only incrementing gamesPlayed here
    };
    console.log('Incrementing games played for:', username);
    fetch('http://localhost:3001/stats/gamesPlayed', {
      method: 'POST', // Assuming POST, but could be PUT depending on your backend setup
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Games played incremented:', data);
    })
    .catch(error => console.error('Error updating games played:', error));
  }, [username]);


  const updateStats = useCallback(() => {
    const gameData = {
        username: username, // This needs to be fetched from context or state
        gamesWon: 1, // Assuming the player wins
        time: timer, // Capture the current timer
        // Add other stats as necessary
    };
    console.log('Updating stats for:', username); // Add this to debug
    fetch('http://localhost:3001/stats/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Stats updated:', data);
        })
        .catch(error => console.error('Error updating stats:', error));
}, [username, timer]);


  const saveGame = useCallback(() => {
    // Assuming username is available in your context, and board state is stored in grid
    const gameData = {
      username: username, // This needs to be fetched from context or state
      board: grid,
      time: timer, // Assuming timer state holds the current time
    };
    console.log('Saving game with data:', gameData);
    fetch('http://localhost:3001/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameData),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Game saved:', data);
        // Handle UI feedback here, e.g., showing a success message
      })
      .catch(error => console.error('Error saving game:', error));
  }, [username, grid, timer]);

    
  useEffect(() => {
    if (hintsFetched) {
      console.log('Hints fetched:', hints);
      // Any other actions you want to perform after hints have been fetched and set
    }
  }, [hints, hintsFetched]);


  useEffect(() => {
    setUsername(username);
    // Initialize or re-initialize notes when n changes
    setNotes(Array(n).fill().map(() => Array(n).fill([])));
  }, [n]); // Dependency on n


  // Henter et nyt board fra serveren 
  const hasIncremented = useRef(false); // Add this line
  useEffect(() => {
    const { n: loadedN, load } = location.state ?? {};
    const newN = loadedN || 9; // Use loaded n or default to 9
    setN(newN);
    // If there's loaded game data and hasIncremented has not yet been set:
    if (load && !hasIncremented.current) {
      setGrid(load.board);
      setTimer(load.time);
      setIsDataLoaded(true);
      setEditableCells(load.board.map(row => row.map(value => value === 0)));
      incrementGamesPlayed(); // Increment games played for loaded game
      hasIncremented.current = true;
      if (!isTimerActiveRef.current) {
        startTimer(); // Only start the timer if it's not already running
      }
    } else if (!load && !hasIncremented.current) {
      // This condition checks if it's a fresh start of the game without loading an existing game
      fetchNewBoard({
        diff,
        n: newN,
        setGrid,
        setEditableCells,
        setUserEdits,
        setValidity,
        setIsDataLoaded,
        setTimer,
        setIsTimerActive: isTimerActiveRef.current ? () => {} : startTimer,
      });
      incrementGamesPlayed(); // Increment games played for new game
      hasIncremented.current = true;
      fetchHints();
      console.log('Hints called after:');
      console.log(hints);
    }

    // Cleanup function to reset hasIncremented when the component unmounts or before a new game starts
    return () => {
      hasIncremented.current = false;
    };
  }, [location.state, startTimer]); // Dependencies remain unchanged
  
  

  // Håndterer input fra brugeren
  const handleInputChange = useCallback((event, i, j) => {
    if (!editableCells[i][j]) {
      return;
    }
    setLastClickedCell([i,j]);
    const value = event.target.value;
    removeHintAndUpdateState(i, j, value);
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
    
  }, [editableCells, grid, userEdits, notes, n, isNotesMode, hints, setHints]);

  const applyHintToGrid = () => {
    const hint = getHint();
  
    // Apply the hint to the grid
    if (editableCells[hint.row][hint.col]) {
      const newGrid = grid.map((row, rowIndex) =>
        row.map((cell, cellIndex) =>
          rowIndex === hint.row && cellIndex === hint.col ? hint.hintNumber : cell
        )
      );
      
      setGrid(newGrid); // Assuming setGrid updates your grid state
      
      // Optionally, clear notes for this cell and remove the hint
      const updatedNotes = [...notes];
      updatedNotes[hint.row][hint.col] = [];
      setNotes(updatedNotes);
      
      removeHintAndUpdateState(hint.row, hint.col, String(hint.hintNumber));
    }
  };
  

  function fetchHints() {
    if (hintsFetched) {
      console.log('Hints already fetched.');
      return;
    }

    fetch('http://localhost:3001/hints')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Hints:', data.hints);
        setHints(data.hints); // Schedule the hints state to update
        setHintsFetched(true); // Schedule the hintsFetched state to update
      })
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
      });
  }
  

  

  const clearCell = useCallback(() => {
    if (lastClickedCell) {
      const [i, j] = lastClickedCell;
  
      const newGrid = [...grid];
      newGrid[i][j] = 0; 
      setGrid(newGrid);

      const updatedNotes = [...notes];
      updatedNotes[i][j] = [];
      setNotes(updatedNotes);

      setLastClickedCell(null);
    }
  }, [lastClickedCell, grid, notes]);

  const getHint = () => {
    if (hints.length === 0) {
      return null; // or handle this case differently
    }
    
    const randomIndex = Math.floor(Math.random() * hints.length);
    const hint = hints[randomIndex];
    console.log(`Hint: Row ${hint[0]}, Col ${hint[1]}, Number ${hint[2]}`);
    return {
      row: hint[0],
      col: hint[1],
      hintNumber: hint[2]
    };
  }

  

  function getUserLocation(callback) {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          callback(latitude, longitude, false); 
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Using Copenhagen's coordinates as fallback
          callback(55.6761, 12.5683, true); 
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      callback(55.6761, 12.5683, true); 
    }
  }
  
  const submitScore = useCallback((username, time) => {
    getUserLocation((latitude, longitude, isFallback) => {
      if (isFallback) {
        // Handle fallback scenario, such as not displaying a marker
        console.log('Fallback location used, not submitting location for score.');
        return; // Exit the function early
      }
  
      const location = { lat: latitude, lng: longitude };
      console.log({ username, time, location }); // For debugging
  
      fetch('http://localhost:3001/submit', {
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
          // Update UI or state here based on the response, if necessary
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
      const winMessageElement = celebrateWin();
      stopTimer();
      submitScore(username, timer);
      setTimer(timer);
      updateStats();

      if (location.state?.fromChronicles) {
        markLevelCompleted(location.state.level); // Tjekker også, at level information er tilgængelig
        console.log('Level completed:', location.state.level);
        navigate('/sudokuMap');
      }

      setTimeout(() => {
        document.body.removeChild(winMessageElement);
        navigate('/menu');

      }, 5000); 
    

    }
  }, [grid, isDataLoaded, timer, username, navigate, submitScore]);

  useEffect(() => {
    if (isDataLoaded) {
      checkSudoku();
    }
  }, [grid, isDataLoaded, checkSudoku]);

const handleBack = () => {
  navigate('/menu');
}

const togglePause = () => {
  setIsPaused(!isPaused);
  if (isPaused) {
    startTimer(); // This resumes the timer
  } else {
    stopTimer(); // This pauses the timer
  }
};


  useEffect(() => {
    return () => {
      isTimerActiveRef.current = false; // Sørg for at timeren stopper, når komponenten unmounts
    };
  }, []);


  function removeHintAndUpdateState(i, j, value) {
  
    // Filter the hints to exclude the matching hint
    const newHints = hints.filter(hint =>
      !(hint[0] === i && hint[1] === j && String(hint[2]) === value)
    );
  
    console.log("New hints:", newHints);
  
    // Check if the hints array has changed, indicating a hint was removed
    if (newHints.length !== hints.length) {
      console.log("Value is hint");
      setHints(newHints); // Update the hints state
    }
  }
  // Calculate the square root of n to determine subgrid size
  const subGridSize = Math.sqrt(n);
  const baseSize = 500; // Base size for the Sudoku board
  const cellSize = baseSize / n;
  const fontSize = Math.max(12, cellSize / 3);

  // Modify the return statement in your SudokuView component
  return (
    <div className="SudokuView">
       <button onClick = {handleBack} style={{background: 'none', color: 'white', border: 'none', marginRight: '90%'}}>
            <IoArrowBackCircleOutline size="35px" />
            <span>{''}</span>
          </button>
      <h1>Sudoku</h1>
      <div className="timer">Timer: {timer} sekunder</div>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: '65px' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '38%' }}>
          <button onClick={() => setIsNotesMode(!isNotesMode)} className='button-style'>
            <FaPencilAlt size="24px" />
            <span>
              {isNotesMode ? (
                <>Notes: <span style={{ position: 'relative', top: '2px' }}><FaCheck size="10px" /></span></>
              ) : (
                <>Notes: <span style={{ position: 'relative', top: '2px' }}><FaTimes size="10px" /></span></>
              )}
            </span>
          </button>
          <button onClick = {clearCell} className='button-style'>
            <FaEraser size="24px" />
            <span>{'Clear Field'}</span>
          </button>
          <button onClick = {applyHintToGrid} className='button-style'>
            <FaLightbulb size="24px" />
            <span>{'Hint'}</span>

          </button>
          <button onClick = {clearCell} className='button-style'>
            <FaAccessibleIcon size="24px" />
            <span>{'Solve Game'}</span>
          </button>
          <button onClick = {saveGame} className='button-style'>
            <FaSave size="24px" />
            <span>{'Save Game'}</span>
          </button>
          <button onClick = {togglePause} className='button-style'>
            <FaPause size="24px" />
            <span>{'Pause game'}</span>
          </button>
        </div>
        <SudokuPause isPaused={isPaused} onContinue={togglePause} />
      </div>
    </div>
    
  );

}

export default SudokuView;