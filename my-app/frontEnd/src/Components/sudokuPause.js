import React from 'react';
import './CSS/Component.css'

const sudokuPause = ({ isPaused, onContinue }) => {
  if (!isPaused) return null;

  return (
    <div className="pauseModalOverlay">
      <div className="pauseModal">
        <h2>Paused</h2>
        <button onClick={onContinue} style={{marginLeft: '10px'}}>Continue</button>
      </div>
    </div>
  );
};

export default sudokuPause;