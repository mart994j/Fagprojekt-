import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import background from './assets/sudokuBackground.jpg';

function MenuScreen() {
  let navigate = useNavigate();
  const [username, setUsername] = useState(''); // Tilstand for at gemme brugernavnet

  const handleStartGame = (event) => {
    event.preventDefault(); // Forhindrer standardformularindsendelsesadfærd
    fetch('http://localhost:3000/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      navigate('/sudoku'); // Navigerer brugeren til SudokuView komponenten, når data er succesfuldt sendt
    })
    .catch((error) => {
      console.error('Error:', error);
    });
    

  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundImage: `url(${background})`, 
      backgroundSize: 'cover', // Ændret til 'cover' for bedre billedehåndtering
      backgroundPosition: 'center', // Centreret baggrund
      backgroundRepeat: 'no-repeat'
    }}>
      <h1 style={{ marginBottom: '20px', fontSize: '60px', color: 'white' }}>Velkommen til Sudoku!</h1>
      <form onSubmit={handleStartGame}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Indtast brugernavn"
          style={{ padding: '10px', marginBottom: '10px' }}
          required
        />
        <button type="submit" className='button-blue' style={{ padding: '10px 20px', fontSize: '20px', cursor: 'pointer', color: 'white'}}>
          Start Spil
        </button>
      </form>
    </div>
  );
}

export default MenuScreen;
