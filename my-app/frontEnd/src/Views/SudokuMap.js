import React, { useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/SudokuMap.css';
import UserContext from '../UserContext';

function SudokuMap() {
  const { username } = useContext(UserContext);

  console.log('SudokuMap component rendered with username:', username); // Debug username passed to component
  
  const [lastCompletedLevel, setLastCompletedLevel] = useState(0);
  const [levelsCompleted, setLevelsCompleted] = useState([]);
  const navigate = useNavigate();
  const levels = Array.from({ length: 10 }, (_, i) => i + 1); // Generates 10 levels
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (showErrorMessage) {
      const timer = setTimeout(() => {
        setShowErrorMessage(false);
      }, 1500); // Fade away after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [showErrorMessage]);

  useEffect(() => {
    console.log('Effect running: Fetching completed levels for', username);
    const fetchCompletedLevels = async () => {
      try {
        const response = await fetch(`http://localhost:3000/levels/completed?username=${username}`);
        const data = await response.json();
        if (response.ok) {
          const completedLevels = data.completedLevels || [];
          console.log('Completed levels fetched:', completedLevels);
          setLevelsCompleted(completedLevels);
          const highestLevelCompleted = Math.max(...completedLevels, 0);
          console.log('Highest level completed:', highestLevelCompleted);
          setLastCompletedLevel(highestLevelCompleted);
        } else {
          throw new Error(data.message || 'Error fetching completed levels');
        }
      } catch (error) {
        console.error('Error in fetchCompletedLevels:', error);
      }
    };

    if (username) {
      fetchCompletedLevels();
    }
  }, [username]);

  const handleLevelSelect = async (id) => {
    console.log(`Level ${id} selected`, levelsCompleted);
    
    if (levelsCompleted.includes(id - 1) || id === 1) {
      let n, diff;
      switch (id) {
        case 1:
        case 2:
          n = 4;
          diff = 1;
          break;
        default:
          n = 9;
          diff = 1;
          break;
      }

      if (!levelsCompleted.includes(id)) {
        console.log(`Attempting to complete level ${id} for user ${username}`);
        try {
          console.log('Sending request to complete level:', { username, level: id });
          const response = await fetch('http://localhost:3000/levels/complete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, level: id })
          });
          const data = await response.json();
          if (response.ok) {
            console.log(`Level ${id} completed successfully, updating state.`);
            setLastCompletedLevel(id);
            setLevelsCompleted(data.completedLevels);
          } else {
            throw new Error(data.message || 'Error updating completed levels');
          }
        } catch (error) {
          console.error('Error in handleLevelSelect:', error);
        }
      }

      navigate('/sudoku', { state: { n, diff, level: id, fromChronicles: true } });
    } else {
      setErrorMessage("Level is locked. Complete previous levels to unlock.");
      setShowErrorMessage(true);
    }
  };
  
  return (
    <div className="map-container">
      {showErrorMessage && <div className="errorMessage" style={{display: 'block'}}>{errorMessage}</div>}
      <svg className="map-path" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        {/* Line from Level 1 to Level 2 */}
        <line x1="80" y1="70" x2="350" y2="300" className={`map-path-line ${lastCompletedLevel >= 1 ? 'unlocked' : 'locked'}`} strokeWidth="5" />
        
        {/* Line from Level 2 to Level 3 */}
        <line x1="350" y1="300" x2="80" y2="550" className={`map-path-line ${lastCompletedLevel >= 2 ? 'unlocked' : 'locked'}`} strokeWidth="5" />
        
        {/* Line from Level 3 to Level 4 */}
        <line x1="80" y1="550" x2="450" y2="650" className={`map-path-line ${lastCompletedLevel >= 3 ? 'unlocked' : 'locked'}`} strokeWidth="5" />

        {/* Line from Level 4 to Level 5 */}
        <line x1="450" y1="650" x2="650" y2="70" className={`map-path-line ${lastCompletedLevel >= 4 ? 'unlocked' : 'locked'}`} strokeWidth="5" />

        {/* Line from Level 5 to Level 6 */}
        <line x1="650" y1="70" x2="950" y2="70" className={`map-path-line ${lastCompletedLevel >= 5 ? 'unlocked' : 'locked'}`} strokeWidth="5" />

        {/* Line from Level 6 to Level 7 */}
        <line x1="950" y1="70" x2="1250" y2="250" className={`map-path-line ${lastCompletedLevel >= 6 ? 'unlocked' : 'locked'}`} strokeWidth="5" />

        {/* Line from Level 7 to Level 8 */}
        <line x1="1250" y1="250" x2="1350" y2="650" className={`map-path-line ${lastCompletedLevel >= 7 ? 'unlocked' : 'locked'}`} strokeWidth="5" />

        {/* Line from Level 8 to Level 9 */}
        <line x1="1350" y1="650" x2="950" y2="650" className={`map-path-line ${lastCompletedLevel >= 8 ? 'unlocked' : 'locked'}`} strokeWidth="5" />

        {/* Line from Level 9 to Level 10 */}
        <line x1="950" y1="650" x2="740" y2="375" className={`map-path-line ${lastCompletedLevel >= 9 ? 'unlocked' : 'locked'}`} strokeWidth="5" />
      </svg>

      {levels.map(level => (
        <button
          key={level}
          className={`level-button level-button-${level}`}
          onClick={() => handleLevelSelect(level)}>
          Level {level}
        </button>
      ))}
    </div>
  );
}

export default SudokuMap;
