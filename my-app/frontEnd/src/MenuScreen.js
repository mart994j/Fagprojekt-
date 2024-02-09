import React from 'react';
import { useNavigate } from 'react-router-dom';
import background from './assets/sudokuBackground.jpg'; // Opdater stien til, hvor du gemte billedet

function MenuScreen() {
  let navigate = useNavigate();

  const handleStartGame = () => {
    navigate('/sudoku'); // Navigerer brugeren til SudokuView komponenten
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundImage: `url(${background})`, 
      backgroundSize: '100%',
      backgroundPosition: 'top center', 
      backgroundRepeat: 'no-repeat'
      
    }}>
      <h1 style={{ marginBottom: '20px', fontSize: '60px', color: 'black' }}>Velkommen til Sudoku!</h1>
      <button onClick={handleStartGame} className='button-blue' style={{ padding: '10px 20px', fontSize: '20px', cursor: 'pointer', color: 'black'}}>
        Start Spil
      </button>
    </div>
  );
}

export default MenuScreen;
