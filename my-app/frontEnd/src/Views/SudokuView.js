// Martin,Marcus,Sebastian,Hannah
import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import './CSS/SudokuView.css';
import celebrateWin from '../Components/WinAnimation.js';
import { isValidSudoku } from '../Utilities/sudokuUtils.js';
import SudokuPause from '../Components/sudokuPause';
import { FaPencilAlt, FaEraser, FaCheck, FaTimes, FaAccessibleIcon, FaLightbulb, FaSave, FaPause } from 'react-icons/fa';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import UserContext from '../UserContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { markLevelCompleted } from '../Utilities/markLevelCompleted.js';
import ApiService from '../Utilities/APIService.js';
import { fetchNewBoard } from '../Utilities/fetchNewBoard.js';
import CustomButton from '../Components/CustomButton.js';

function SudokuView() {
  const location = useLocation();
  const navigate = useNavigate();

  const diff = location.state?.diff ?? 10;

  const [n, setN] = useState(9);
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
  const { username, setUsername } = useContext(UserContext);
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [notes, setNotes] = useState(Array(n).fill().map(() => Array(n).fill([])));
  const [lastClickedCell, setLastClickedCell] = useState(null);

  const [flashingCell, setFlashingCell] = useState(null);

  const startTimer = useCallback(() => {
    if (!isTimerActiveRef.current) {
      isTimerActiveRef.current = true;
      setTimer(prevTimer => prevTimer);
      const interval = setInterval(() => {
        if (isTimerActiveRef.current) {
          setTimer(prevTimer => prevTimer + 1);
        }
      }, 1000);
      isTimerActiveRef.current = interval;
    }
  }, []);

  const stopTimer = useCallback(() => {
    clearInterval(isTimerActiveRef.current);
    isTimerActiveRef.current = false;
  }, []);

  const incrementGamesPlayed = useCallback(() => {
    console.log('Incrementing games played for:', username);
    ApiService.incrementGamesPlayed(username)
      .then(data => {
        console.log('Games played incremented:', data);
      })
      .catch(error => console.error('Error updating games played:', error));
  }, [username]);

  const updateStats = useCallback(() => {
    console.log('Updating stats for:', username);
    ApiService.updateStats(username, 1, timer, diff) 
      .then(data => {
        console.log('Stats updated:', data);
      })
      .catch(error => console.error('Error updating stats:', error));
  }, [username, timer, diff]);

  const saveGame = useCallback(() => {
    console.log('Saving game with data:', { username, grid, timer });
    ApiService.saveGame(username, grid, timer)
      .then(data => {
        console.log('Game saved:', data);
      })
      .catch(error => console.error('Error saving game:', error));
  }, [username, grid, timer]);

  useEffect(() => {
    if (hintsFetched) {
      console.log('Hints fetched:', hints);
    }
  }, [hints, hintsFetched]);

  useEffect(() => {
    setUsername(username);
    setNotes(Array(n).fill().map(() => Array(n).fill([])));
  }, [n, setUsername, username]);

  const hasIncremented = useRef(false);
  useEffect(() => {
    const { n: loadedN, load } = location.state ?? {};
    const newN = loadedN || 9;
    setN(newN);

    if (load && !hasIncremented.current) {
      setGrid(load.board);
      setTimer(load.time);
      setIsDataLoaded(true);
      setEditableCells(load.board.map(row => row.map(value => value === 0)));
      incrementGamesPlayed();
      console.log('Loaded game:', load);
      console.log('Loaded board:', load.board);
      console.log('Loaded size:', load.board.length);

      hasIncremented.current = true;
      if (!isTimerActiveRef.current) {
        startTimer();
      }
    } else if (!load && !hasIncremented.current) {
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
      incrementGamesPlayed();
      hasIncremented.current = true;
      ApiService.fetchHints();
      console.log(hints);
    }
    return () => {
      hasIncremented.current = false;
    };
  }, [location.state, startTimer, diff]);

  const handleInputChange = useCallback((event, i, j) => {
    if (!editableCells[i][j]) {
      return;
    }
    setLastClickedCell([i, j]);
    const value = event.target.value;
    removeHintAndUpdateState(i, j, value);
    if (isNotesMode) {
      const noteValue = parseInt(value, 10);
      const updatedNotes = [...notes];
      if (value === '') {
        updatedNotes[i][j] = [];
      } else if (/^\d+$/.test(value) && value >= 1 && value <= n) {
        if (updatedNotes[i][j].includes(noteValue)) {
          updatedNotes[i][j] = updatedNotes[i][j].filter(note => note !== noteValue);
        } else {
          updatedNotes[i][j] = [...new Set([...updatedNotes[i][j], noteValue])];
        }
      }
      setNotes(updatedNotes);
    } else {
      if (value === '' || (/^\d+$/.test(value) && value >= 1 && value <= n)) {
        const numValue = value === '' ? 0 : parseInt(value, 10);
        const newGrid = grid.map((row, rowIndex) =>
          row.map((cell, cellIndex) => rowIndex === i && cellIndex === j ? numValue : cell)
        );

        const updatedNotes = [...notes];
        if (numValue !== 0) {
          updatedNotes[i][j] = [];
        }

        setGrid(newGrid);
        setNotes(updatedNotes);

        const newUserEdits = [...userEdits];
        newUserEdits[i][j] = true;
        setUserEdits(newUserEdits);
      }
    }
  }, [editableCells, grid, userEdits, notes, n, isNotesMode, hints, setHints]);

  const applySolveToGrid = () => {
    if (hints.length === 0) {
      return;
    }
    let newGrid = JSON.parse(JSON.stringify(grid));
    let newEditableCells = JSON.parse(JSON.stringify(editableCells));

    hints.forEach(hint => {
      if (newEditableCells[hint[0]][hint[1]]) {
        newGrid[hint[0]][hint[1]] = hint[2];
        newEditableCells[hint[0]][hint[1]] = false;
        const updatedNotes = [...notes];
        updatedNotes[hint[0]][hint[1]] = [];
        setNotes(updatedNotes);
      }
    });

    setGrid(newGrid);
    setEditableCells(newEditableCells);
    setHints([]);
    console.log('Hints cleared:', hints);
  };

  const applyHintToGrid = () => {
    const hint = getHint();
    if (!hint) return;

    if (editableCells[hint.row][hint.col]) {
      const newGrid = grid.map((row, rowIndex) =>
        row.map((cell, cellIndex) =>
          rowIndex === hint.row && cellIndex === hint.col ? hint.hintNumber : cell
        )
      );

      const newEditableCells = editableCells.map((row, rowIndex) =>
        row.map((cell, cellIndex) =>
          rowIndex === hint.row && cellIndex === hint.col ? false : cell
        )
      );

      setGrid(newGrid);
      setEditableCells(newEditableCells);

      const updatedNotes = [...notes];
      updatedNotes[hint.row][hint.col] = [];
      setNotes(updatedNotes);

      setFlashingCell([hint.row, hint.col]);
      setTimeout(() => {
        setFlashingCell(null);
      }, 1000);

      removeHintAndUpdateState(hint.row, hint.col, String(hint.hintNumber));
    }
  };

  useEffect(() => {
    if (!hintsFetched) {
      ApiService.fetchHints()
        .then(hintsData => {
          console.log('Hints:', hintsData);
          setHints(hintsData);
          setHintsFetched(true);
        })
        .catch(error => {
          console.error('There was a problem with your fetch operation:', error);
        });
    }
  }, [hintsFetched]);

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
      return null;
    }

    const randomIndex = Math.floor(Math.random() * hints.length);
    const hint = hints[randomIndex];
    console.log(`Hint: Row ${hint[0]}, Col ${hint[1]}, Number ${hint[2]}`);
    return {
      row: hint[0],
      col: hint[1],
      hintNumber: hint[2]
    };
  };

  function getUserLocation(callback) {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          callback(latitude, longitude, false); 
        },
        (error) => {
          console.error("Geolocation error:", error);
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
        console.log('Fallback location used, not submitting location for score.');
        return;
      }

      const location = { lat: latitude, lng: longitude };
      console.log({ username, time, location });

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
        })
        .catch(error => console.error('Error submitting score:', error));
    });
  }, []);

  const checkSudoku = useCallback(() => {
    if (!isDataLoaded) return;
    const { isValid, newValidity } = isValidSudoku(grid);
    setValidity(newValidity);
    const isFullyFilled = grid.every(row => row.every(value => value !== 0));
    if (isValid && isFullyFilled) {
      const winMessageElement = celebrateWin();
      stopTimer();
      submitScore(username, timer);
      setTimer(timer);
      updateStats();

      if (location.state?.fromChronicles) {
        markLevelCompleted(username, location.state.level);
        console.log('Level completed:', location.state.level);
        navigate('/sudokuMap');
      }

      setTimeout(() => {
        document.body.removeChild(winMessageElement);
        console.log(diff);
        navigate('/menu');
      }, 5000);
    }
  }, [grid, isDataLoaded, timer, username, navigate, submitScore, diff]);

  useEffect(() => {
    if (isDataLoaded) {
      checkSudoku();
    }
  }, [grid, isDataLoaded, checkSudoku]);

  const handleBack = () => {
    navigate('/menu');
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      startTimer();
    } else {
      stopTimer();
    }
  };

  useEffect(() => {
    return () => {
      isTimerActiveRef.current = false;
    };
  }, []);

  function removeHintAndUpdateState(i, j, value) {
    const newHints = hints.filter(hint =>
      !(hint[0] === i && hint[1] === j && String(hint[2]) === value)
    );
    console.log("New hints:", newHints);
    if (newHints.length !== hints.length) {
      console.log("Value is hint");
      setHints(newHints);
    }
  }

  const subGridSize = Math.sqrt(n);
  const baseSize = 500;
  const cellSize = baseSize / n;
  const fontSize = Math.max(12, cellSize / 3);

  return (
    <div className="SudokuView">
      <CustomButton onClick={handleBack} style={{ background: 'none', color: 'white', border: 'none', marginRight: '90%' }}>
        <IoArrowBackCircleOutline size="35px" />
        <span>{''}</span>
      </CustomButton>
      <h1>Sudoku</h1>
      <div className="timer">Timer: {timer} seconds</div>
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
                      `${(i + 1) % subGridSize === 0 && i + 1 !== n ? 'bottom-border' : ''}` +
                      `${flashingCell && flashingCell[0] === i && flashingCell[1] === j ? ' flash' : ''}`
                    }
                    style={{ width: cellSize + 'px', height: cellSize + 'px', position: 'relative' }}
                    onClick={() => setLastClickedCell([i, j])}
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
          <CustomButton onClick={() => setIsNotesMode(!isNotesMode)} className='button-style'>
            <FaPencilAlt size="24px" />
            <span>
              {isNotesMode ? (
                <>Notes: <span style={{ position: 'relative', top: '2px' }}><FaCheck size="10px" /></span></>
              ) : (
                <>Notes: <span style={{ position: 'relative', top: '2px' }}><FaTimes size="10px" /></span></>
              )}
            </span>
          </CustomButton>
          <CustomButton onClick={clearCell} className='button-style'>
            <FaEraser size="24px" />
            <span>{'Clear Field'}</span>
          </CustomButton>
          <CustomButton onClick={applyHintToGrid} className='button-style'>
            <FaLightbulb size="24px" />
            <span>{'Hint'}</span>
          </CustomButton>
          <CustomButton onClick={applySolveToGrid} className='button-style'>
            <FaAccessibleIcon size="24px" />
            <span>{'Solve Game'}</span>
          </CustomButton>
          <CustomButton onClick={saveGame} className='button-style'>
            <FaSave size="24px" />
            <span>{'Save Game'}</span>
          </CustomButton>
          <CustomButton onClick={togglePause} className='button-style'>
            <FaPause size="24px" />
            <span>{'Pause game'}</span>
          </CustomButton>
        </div>
        <SudokuPause isPaused={isPaused} onContinue={togglePause} />
      </div>
    </div>
  );
}

export default SudokuView;
