import React from 'react';
import { useNavigate } from 'react-router-dom';

function MenuScreen() {
  let navigate = useNavigate();

  const handleStartGame = () => {
    navigate('/sudoku'); // Navigerer brugeren til SudokuView komponenten
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <button onClick={handleStartGame} style={{ padding: '10px 20px', fontSize: '20px', cursor: 'pointer' }}>
        Start Spil
      </button>
    </div>
  );
}

export default MenuScreen;
