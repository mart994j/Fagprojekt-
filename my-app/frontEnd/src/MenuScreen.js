import React from 'react';
import { useNavigate } from 'react-router-dom';

function MenuScreen() {
  let navigate = useNavigate();

  const handleStartGame = () => {
    navigate('/sudoku'); // Navigerer brugeren til SudokuView komponenten
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <h1 style={{ marginBottom: '20px', fontSize: '60px' }}>Velkommen til Sudoku!</h1>
      <button onClick={handleStartGame} style={{ padding: '10px 20px', fontSize: '20px', cursor: 'pointer' }}>
        Start Spil
      </button>
    </div>
  );
}

export default MenuScreen;
