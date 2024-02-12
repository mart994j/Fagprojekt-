import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import './CSS/MenuScreen.css'; // Import CSS file

function MenuScreen() {
  let navigate = useNavigate();
  const { setUsername } = useUser();
  const [localUsername, setLocalUsername] = useState('');
  const [k, setK] = useState(3);
  const [n, setN] = useState(3);

  const handleStartGame = (event) => {
    event.preventDefault();
    setUsername(localUsername);
    if (k >= 2 && n === 3 && k === 3) {
      console.log('Success:', localUsername, k, n);
      navigate('/sudoku', { state: { k, n } }); // Pass k and n as part of the state
    } else if (k >= 2 && n >= 4 && n % k === 0) {
      console.log('Success:', localUsername, k, n);
      navigate('/sudoku', { state: { k, n } }); // Pass k and n as part of the state
    } else {
      alert('Ugyldige værdier for k eller n. Vælg venligst igen.');
      return;
    }
    
    
  };

  const handleLeaderBoard = () => {
    navigate('/leaderboard');
  };

  const handleGeoMap = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        navigate('/geomap', { state: { lat: latitude, lng: longitude } });
      },
      (error) => {
        console.error("Geolocation error:", error);
        const defaultLat = 55.6761; // Example: Copenhagen's latitude
        const defaultLng = 12.5683; // Example: Copenhagen's longitude
        navigate('/geomap', { state: { lat: defaultLat, lng: defaultLng } });
      }
    );
  };
  
  const BoardPreview = ({ k, n }) => {
    const gridSize = n * n; // Total grid size corrected
    const regionSize = k * k; // Each region's size
    return (
      <div className="board-preview" style={{ gridTemplateColumns: `repeat(${n}, 1fr)`, gridTemplateRows: `repeat(${n}, 1fr)` }}>
        {[...Array(gridSize)].map((_, gridIdx) => (
          <div key={gridIdx} className="preview-region" style={{ gridTemplateColumns: `repeat(${k}, 1fr)`, gridTemplateRows: `repeat(${k}, 1fr)` }}>
            {[...Array(regionSize)].map((_, regionIdx) => (
              <div key={regionIdx} className="preview-cell"></div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  
  

  return (
    <div className="menu-screen"> 
      <h1>Velkommen til Sudoku!</h1>
      <form onSubmit={handleStartGame}>
        <input
          type="text"
          value={localUsername}
          onChange={(e) => setLocalUsername(e.target.value)}
          placeholder="Indtast brugernavn"
          required
        />
        <button type="submit">Start Spil</button>
      </form>

      <button onClick={handleLeaderBoard} type="button">Leaderboard</button>
      <button onClick={handleGeoMap} type="button" className="geomap-button">Geomap</button>

       {/* Sudoku board size preview */}
       <BoardPreview k={k} n={n} />

      <div className="kn-inputs">
        <input
          type="number"
          value={k}
          onChange={(e) => setK(Number(e.target.value))}
          placeholder="Vælg k (region størrelse)"
          required
        />
        <input
          type="number"
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          placeholder="Vælg n (celle størrelse)"
          required
        />
      </div>



    </div>
    
  );
}

export default MenuScreen;
