import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useUser} from './UserContext';

function MenuScreen() {
  let navigate = useNavigate();
  const { setUsername } = useUser(); // Use the setUsername from context
  const [localUsername, setLocalUsername] = useState(''); // Renamed to avoid confusion

  const handleStartGame = (event) => {
    event.preventDefault();
    setUsername(localUsername); // Update the global username in context

    // Her skal du sandsynligvis ikke sende brugernavn til backenden endnu, men i stedet sætte det i context eller state
    // fetch('http://localhost:3000/submit', { ... })

    console.log('Success:', localUsername);
    navigate('/sudoku');
  };

  const handleLeaderBoard = () => {
    navigate('/leaderboard');
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#e6f7ff',
    }}>
      <h1 style={{ marginBottom: '20px', fontSize: '60px', color: 'black' }}>Velkommen til Sudoku!</h1>
      <form onSubmit={handleStartGame}>
        <input
          type="text"
          value={localUsername}
          onChange={(e) => setLocalUsername(e.target.value)}
          placeholder="Indtast brugernavn"
          required
        />
        <button type="submit">
          Start Spil
        </button>
      </form>
      <button onClick={handleLeaderBoard}>
        Leaderboard
      </button>
    </div>
  );
}

export default MenuScreen;
