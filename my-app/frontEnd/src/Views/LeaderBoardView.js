import React from 'react';
import './CSS/Leaderboard.css';
import './CSS/themes.css';

function Leaderboard({ leaderboard }) {
  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">Leaderboard</h1>
      <ul className="leaderboard-list">
        {leaderboard.map((entry, index) => (
          <li key={index}>{entry.username} - {entry.time}s</li>
        ))}
      </ul>
    </div>
  );
}

export default Leaderboard;
