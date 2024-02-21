import React, { useEffect, useState } from 'react';

function LeaderBoardView() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Fetch leaderboard data when the component mounts
    fetch('http://localhost:3000/leaderboard')
      .then(response => response.json())
      .then(data => {
        setLeaderboard(data); 
      })
      .catch(error => {
        console.error('Error fetching leaderboard:', error);
      });
  }, []); 

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#2f0f57',
      color: '#fff',
    }}>
      <h1 style={{ marginBottom: '20px', fontSize: '60px', color: 'white' }}>Leaderboard</h1>
      <ul>
        {leaderboard.map((entry, index) => (
          <li key={index}>{entry.username} - {entry.time}s</li>
        ))}
      </ul>
    </div>
  );
}

export default LeaderBoardView;
