import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/SudokuMap.css'; // Sørg for stien er korrekt

function SudokuMap() {
  const [lastCompletedLevel, setLastCompletedLevel] = useState(0);
  const navigate = useNavigate();
  const levels = Array.from({ length: 10 }, (_, i) => i + 1); // Genererer 10 levels
  const handleLevelSelect = (id) => {
    const completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [];
    
    if (completedLevels.includes(id - 1) || id === 1) { // Tillad level 1 altid
      // Definer n og diff baseret på level id
      let n, diff;
      switch(id) {
        case 1:
          n = 4; // antag et 4x4 bræt for niveau 1
          diff = 1;
          break;
        case 2:
          n = 4;
          diff = 1
          break;
        // Tilføj flere cases som nødvendigt for de forskellige levels
        default:
          n = 9; // standard størrelse for et Sudoku bræt
          diff = 1;
          break;
      }
      navigate('/sudoku', { state: { n, diff,level: id, fromChronicles: true } }); 
      console.log('Level selected:', id);
      if (id > lastCompletedLevel) {
        id = setLastCompletedLevel(id);
        console.log('Level completed:', id);
      }
    } else {
      alert("Level is locked. Complete previous levels to unlock.");
    }
  };
  
  

  return (
    <div className="map-container">
        <svg className="map-path" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
    {/* Linje fra Level 1 til Level 2 */}
    <line x1="80" y1="70" x2="350" y2="300" className={`map-path-line ${lastCompletedLevel >= 1 ? 'unlocked' : 'locked'}`} strokeWidth="5" />
    
    {/* Linje fra Level 2 til Level 3 */}
    <line x1="350" y1="300" x2="80" y2="550" className={`map-path-line ${lastCompletedLevel >= 2 ? 'unlocked' : 'locked'}`} strokeWidth="5" />
    
    {/* Linje fra Level 3 til Level 4 */}
    <line x1="80" y1="550" x2="450" y2="650" className={`map-path-line ${lastCompletedLevel >= 3 ? 'unlocked' : 'locked'}`} strokeWidth="5" />

    {/* Linje fra Level 4 til Level 5 */}
    <line x1="450" y1="650" x2="650" y2="70" className={`map-path-line ${lastCompletedLevel >= 4 ? 'unlocked' : 'locked'}`} strokeWidth="5" />

    {/* Linje fra Level 5 til Level 6 */}
    <line x1="650" y1="70" x2="950" y2="70" className={`map-path-line ${lastCompletedLevel >= 5 ? 'unlocked' : 'locked'}`} strokeWidth="5" />

    {/* Linje fra Level 6 til Level 7 */}
    <line x1="950" y1="70" x2="1250" y2="250" className={`map-path-line ${lastCompletedLevel >= 6 ? 'unlocked' : 'locked'}`} strokeWidth="5" />

    {/* Linje fra Level 7 til Level 8 */}
    <line x1="1250" y1="250" x2="1350" y2="650" className={`map-path-line ${lastCompletedLevel >= 7 ? 'unlocked' : 'locked'}`} strokeWidth="5" />

    {/* Linje fra Level 8 til Level 9 */}
    <line x1="1350" y1="650" x2="950" y2="650" className={`map-path-line ${lastCompletedLevel >= 8 ? 'unlocked' : 'locked'}`} strokeWidth="5" />

    {/* Linje fra Level 9 til Level 10 */}
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
