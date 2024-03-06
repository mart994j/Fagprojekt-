import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/SudokuMap.css'; // Ensure the path is correct

function SudokuMap() {
  const [lastCompletedLevel, setLastCompletedLevel] = useState(0);
  const navigate = useNavigate();
  const levels = Array.from({ length: 10 }, (_, i) => i + 1); // Generates 10 levels

  useEffect(() => {
    // This useEffect hook will run once when the component mounts
    const completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [];
    if (completedLevels.length > 0) {
      const highestLevelCompleted = Math.max(...completedLevels);
      setLastCompletedLevel(highestLevelCompleted);
      console.log('Setting lastCompletedLevel from localStorage:', highestLevelCompleted);
    }
  }, []); // Empty dependency array means this effect runs once on mount

  const handleLevelSelect = (id) => {
    const completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [];
    console.log('Completed Levels:', completedLevels);

    if (completedLevels.includes(id - 1) || id === 1) { // Always allow level 1
      let n, diff;
      switch(id) {
        case 1:
          n = 4;
          diff = 1;
          break;
        case 2:
          n = 4;
          diff = 1;
          break;
        default:
          n = 9;
          diff = 1;
          break;
      }

      console.log('Level selected:', id);
      console.log('Before update, lastCompletedLevel:', lastCompletedLevel);

      if (id > lastCompletedLevel) {
        setLastCompletedLevel(id);
        completedLevels.push(id); // Add the newly completed level to the array
        localStorage.setItem('completedLevels', JSON.stringify(completedLevels)); // Update localStorage
        console.log('Updated lastCompletedLevel to:', id);
      }

      navigate('/sudoku', { state: { n, diff, level: id, fromChronicles: true } });
    } else {
      alert("Level is locked. Complete previous levels to unlock.");
    }
  };
  
  return (
    <div className="map-container">
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
