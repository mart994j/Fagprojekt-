import React, { useState, useEffect, useCallback, useRef } from 'react';
import './CSS/SudokuView.css';
import celebrateWin from '../Components/WinAnimation.js';
import { isValidSudoku } from '../Utilities/sudokuUtils.js';
import SudokuPause from '../Components/sudokuPause';
import { FaPencilAlt, FaEraser, FaCheck, FaTimes, FaAccessibleIcon, FaLightbulb, FaSave, FaPause } from 'react-icons/fa';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

function SudokuView() {
  const tourRef = useRef(null);
  const navigate = useNavigate();
  const n = 9;
  const initialGrid = [
    [4, 5, 6, 0, 7, 9, 3, 2, 1],
    [1, 2, 3, 5, 4, 6, 9, 8, 7],
    [7, 8, 0, 2, 1, 3, 6, 5, 4],
    [2, 3, 1, 7, 6, 4, 5, 9, 8],
    [6, 9, 4, 3, 0, 8, 7, 1, 2],
    [8, 7, 5, 1, 9, 2, 4, 6, 3],
    [3, 1, 7, 6, 2, 5, 8, 4, 9],
    [9, 6, 8, 4, 3, 1, 2, 7, 5],
    [5, 4, 2, 9, 0, 7, 1, 0, 6]
  ];
  const [grid, setGrid] = useState(initialGrid);
  const [validity, setValidity] = useState(Array(n).fill().map(() => Array(n).fill(true)));
  const [userEdits, setUserEdits] = useState(Array(n).fill().map(() => Array(n).fill(false)));
  const [isPaused, setIsPaused] = useState(false);
  const [hints, setHints] = useState([[8, 7, 3], [8, 4, 8], [0, 3, 8], [2, 2, 9], [4, 4, 5]]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [editableCells, setEditableCells] = useState(grid.map(row => row.map(value => value === 0)));
  const [timer, setTimer] = useState(0);
  const isTimerActiveRef = useRef(false);
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [notes, setNotes] = useState(Array(n).fill().map(() => Array(n).fill([])));
  const [lastClickedCell, setLastClickedCell] = useState(null);
  const [tempGreenCells, setTempGreenCells] = useState({});

  const startTimer = useCallback(() => {
    if (!isTimerActiveRef.current) {
      isTimerActiveRef.current = true;
      setTimer(prevTimer => prevTimer); // Initialize timer without changing its state
      const interval = setInterval(() => {
        if (isTimerActiveRef.current) {
          setTimer(prevTimer => prevTimer + 1);
        }
      }, 1000);
      isTimerActiveRef.current = interval;
    }
  }, []);

  useEffect(() => {
    setIsDataLoaded(true);
    const editable = grid.map(row => row.map(value => value === 0));
    setEditableCells(editable);
  }, [startTimer]);

  const stopTimer = useCallback(() => {
    clearInterval(isTimerActiveRef.current);
    isTimerActiveRef.current = false;
  }, []);

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

  }, [editableCells, grid, userEdits, notes, n, isNotesMode]);

  const applySolveToGrid = () => {
    if (hints.length === 0) {
      return;
    }
    let newGrid = JSON.parse(JSON.stringify(grid));

    hints.forEach(hint => {
      if (editableCells[hint[0]][hint[1]]) {
        newGrid[hint[0]][hint[1]] = hint[2];
        const updatedNotes = [...notes];
        updatedNotes[hint[0]][hint[1]] = [];
        setNotes(updatedNotes);
      }
    });

    setGrid(newGrid);
    setHints([]);
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

      setGrid(newGrid);
      const updatedNotes = [...notes];
      updatedNotes[hint.row][hint.col] = [];
      setNotes(updatedNotes);

      const cellKey = `${hint.col}-${hint.row}`;
      setTempGreenCells(prev => {
        const newState = { ...prev, [cellKey]: true };
        return newState;
      });

      removeHintAndUpdateState(hint.row, hint.col, String(hint.hintNumber));
    }
  };

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
    return {
      row: hint[0],
      col: hint[1],
      hintNumber: hint[2]
    };
  };

  const checkSudoku = useCallback(() => {
    if (!isDataLoaded) return;
    const { isValid, newValidity } = isValidSudoku(grid);
    setValidity(newValidity);

    const isFullyFilled = grid.every(row => row.every(value => value !== 0));
    if (isValid && isFullyFilled) {
      const winMessageElement = celebrateWin();
      stopTimer();
      setTimeout(() => {
        document.body.removeChild(winMessageElement);
        navigate('/menu');
      }, 5000);
    }
  }, [grid, isDataLoaded, stopTimer, navigate]);

  useEffect(() => {
    if (isDataLoaded) {
      checkSudoku();
    }
  }, [grid, isDataLoaded, checkSudoku]);

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (isPaused) {
      startTimer();
    } else {
      stopTimer();
    }
  };

  function removeHintAndUpdateState(i, j, value) {
    const newHints = hints.filter(hint =>
      !(hint[0] === i && hint[1] === j && String(hint[2]) === value)
    );
    if (newHints.length !== hints.length) {
      setHints(newHints);
    }
  }

  const handleBack = () => {
    navigate('/menu');
  };

  const subGridSize = Math.sqrt(n);
  const baseSize = 500;
  const cellSize = baseSize / n;
  const fontSize = Math.max(12, cellSize / 3);


 
  useEffect(() => {
      const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          cancelIcon: {
            enabled: true
          },
          classes: 'shadow-md bg-purple-dark',
          scrollTo: { behavior: 'smooth', block: 'center' }
        }
      });

      tour.addStep({
        id: 'step-1',
        text: 'Try and put the correct number in the cell.',
        attachTo: {
          element: '#cell-0-3 input',
          on: 'bottom'
        },
        buttons: [
          {
            text: 'Next',
            action: () => {
              const inputValue = document.querySelector('#input-0-3').value;
              if (inputValue === '8' && inputValue !== '') {
                tour.next();
              } else {
                alert('Please enter the number 8.');
              }
            }
          }
        ]
      });

      tour.addStep({
        id: 'step-2',
        text: 'Put a wrong number (any number other than 9) and see what happens',
        attachTo: {
          element: '#cell-2-2 input',
          on: 'bottom'
        },
        buttons: [
          {
            text: 'Back',
            action: tour.back
          },
          {
            text: 'Next',
            action: () => {
              const inputValue = document.querySelector('#input-2-2').value;
              if (inputValue !== '9' && inputValue !== '') {
                tour.next();
              } else {
                alert('Please enter a number other than 9.');
              }
            }
          }
        ]
      });

      tour.addStep({
        id: 'step-3',
        text: 'Now you can see there are red squares around some numbers. This indicates that the number is wrong. Try to put in the number 9.',
        attachTo: {
          element: '#cell-2-2 input',
          on: 'bottom'
        },
        buttons: [
          {
            text: 'Back',
            action: tour.back
          },
          {
            text: 'Next',
            action: () => {
              const inputValue = document.querySelector('#input-2-2').value;
              if (inputValue === '9' && inputValue !== '') {
                tour.next();
              } else {
                alert('Please enter the number 9.');
              }
            }
          }
        ]
      });

      tour.addStep({
        id: 'step-4',
        text: 'Use a hint on a cell.',
        attachTo: {
          element: '#hint-button', // Ensure this ID matches your hint button's ID
          on: 'bottom'
        },
        buttons: [
          {
            text: 'Back',
            action: tour.back
          },
          {
            text: 'Next',
            action: tour.next
          }
        ]
      });

      tour.addStep({
        id: 'step-5',
        text: 'Click on the notes button to toggle notes mode. In notes mode, you can enter multiple numbers in a cell and press it again to switch back.',
        attachTo: {
          element: '#notes-button', // Ensure this ID matches your notes button's ID
          on: 'bottom'
        },
        buttons: [
          {
            text: 'Back',
            action: tour.back
          },
          {
            text: 'Next',
            action: tour.next
          }
        ]
      });


      tour.addStep({
        id: 'step-6',
        text: 'Here in a real game you can press save to save the game and you will return to the menu.',
        attachTo: {
          element: '#save-game-button',
          on: 'bottom'
        },
        buttons: [
          {
            text: 'Back',
            action: tour.back
          },
          {
            text: 'Next',
            action: tour.next
          }
        ]
      });

      tour.addStep({
        id: 'step-7',
        text: 'This button pauses the game.',
        attachTo: {
          element: '#pause-game-button',
          on: 'bottom'
        },
        buttons: [
          {
            text: 'Back',
            action: tour.back
          },
          {
            text: 'Next',
            action: tour.next
          }
        ]
      });

      tour.addStep({
        id: 'step-8',
        text: 'Solve the game.',
        attachTo: {
          element: '#solve-game-button',
          on: 'bottom'
        },
        buttons: [
          {
            text: 'Back',
            action: tour.back
          },
          {
            text: 'Finish',
            action: tour.complete
          }
        ]
      });

      tour.start();

      return () => {
        // Clean up the tour instance on component unmount

         tour.complete();
      };
    
  }, [isNotesMode]);
  
  

  return (
    <div className="SudokuView">
      <button onClick={handleBack} style={{ background: 'none', color: 'white', border: 'none', marginRight: '90%' }}>
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
                    id={`cell-${i}-${j}`} // Add a unique ID to each cell
                    className={
                      `${!validity[i][j] ? 'invalid' : ''} ` +
                      `${(j + 1) % subGridSize === 0 && j + 1 !== n ? 'right-border' : ''} ` +
                      `${(i + 1) % subGridSize === 0 && i + 1 !== n ? 'bottom-border' : ''}`
                    }
                    style={{ width: cellSize + 'px', height: cellSize + 'px', position: 'relative' }}
                  >
                    {notes[i][j].length > 0 ? (
                      <div id={`notes-${i}-${j}`} className="notes" style={{ fontSize: '10px' }}>{notes[i][j].join(', ')}</div>
                    ) : null}
                    <input
                      type="text"
                      id={`input-${i}-${j}`} // Add a unique ID to each input
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
        <button
  id="notes-button"

  className='button-style'
>
  <FaPencilAlt size="24px" />
  <span>
    {isNotesMode ? (
      <>Notes: <span style={{ position: 'relative', top: '2px' }}><FaCheck size="10px" /></span></>
    ) : (
      <>Notes: <span style={{ position: 'relative', top: '2px' }}><FaTimes size="10px" /></span></>
    )}
  </span>
</button>

          <button id = "hint-button" onClick={applyHintToGrid} className='button-style'>
            <FaLightbulb size="24px" />
            <span>{'Hint'}</span>
          </button>
          <button id="solve-game-button" onClick={applySolveToGrid} className='button-style'>
            <FaAccessibleIcon size="24px" />
            <span>{'Solve Game'}</span>
          </button>
          <button id="save-game-button" className='button-style'>
            <FaSave size="24px" />
            <span>{'Save Game'}</span>
          </button>
          <button id="pause-game-button" className='button-style'>
            <FaPause size="24px" />
            <span>{'Pause game'}</span>
          </button>
        </div>
        <SudokuPause isPaused={isPaused} onContinue={togglePause} />
      </div>
      <button id="start-tour">Start Tour</button>
    </div>
  );
}

export default SudokuView;
