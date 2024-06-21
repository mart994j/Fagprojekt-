//Martin
import React, { useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/SudokuMap.css';
import UserContext from '../UserContext';
import CustomButton from '../Components/CustomButton';

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
      }, 1500); // Hide the error message after 1.5 seconds
      return () => clearTimeout(timer);
    }
  }, [showErrorMessage]);

  useEffect(() => {
    const fetchCompletedLevels = async () => {
      if (!username) return;
      try {
        const response = await fetch(`http://localhost:3001/levels/completed?username=${username}`);
        if (!response.ok) throw new Error('Failed to fetch completed levels');
        
        const data = await response.json();
        setLevelsCompleted(data.completedLevels || []);
        const highestLevelCompleted = Math.max(...data.completedLevels, 0);
        setLastCompletedLevel(highestLevelCompleted);
      } catch (error) {
        console.error('Error fetching completed levels:', error.message);
      }
    };

    fetchCompletedLevels();
  }, [username]);

  const handleLevelSelect = (id) => {
      let n, diff;
    if (id === 1 || id === 2) {
      n = 4; diff = 1;
    } else {
      n = 9; diff = id - 1; // Example adjustment, assuming difficulty increases with level
    }
    
    if (levelsCompleted.includes(id - 1) || id === 1) {
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
        <CustomButton
          key={level}
          className={`level-button level-button-${level}`}
          onClick={() => handleLevelSelect(level)}>
          Level {level}
        </CustomButton>
      ))}
    </div>
  );
}

export default SudokuMap;
