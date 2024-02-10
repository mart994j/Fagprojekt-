import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

function MenuScreen() {
  let navigate = useNavigate();
  const { setUsername } = useUser(); // Use the setUsername from context
  const [localUsername, setLocalUsername] = useState(''); // Renamed to avoid confusion

  const handleStartGame = (event) => {
    event.preventDefault();
    setUsername(localUsername); // Update the global username in context
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
      backgroundColor: '#2f0f57',
      color: '#fff',
    }}>
      <h1 style={{ marginBottom: '20px', fontSize: '2.5rem' }}>Velkommen til Sudoku!</h1>
      <form onSubmit={handleStartGame} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <input
          type="text"
          value={localUsername}
          onChange={(e) => setLocalUsername(e.target.value)}
          placeholder="Indtast brugernavn"
          required
          style={{
            padding: '10px',
            fontSize: '1rem',
            width: '250px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
        <button type="submit" style={{
          padding: '10px 20px',
          fontSize: '1rem',
          borderRadius: '5px',
          border: 'none',
          backgroundColor: '#007bff',
          color: 'white',
          cursor: 'pointer',
          width: '250px', // Match input width
        }}>
          Start Spil
        </button>
      </form>
      <button onClick={handleLeaderBoard} style={{
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '1rem',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#28a745',
        color: 'white',
        cursor: 'pointer',
        width: '250px', // Match input width for consistency
      }}>
        Leaderboard
      </button>
    </div>
  );
}

export default MenuScreen;
