import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import './CSS/MenuScreen.css'; // Import CSS file
import './CSS/Bar.css';

function MenuScreen() {
  let navigate = useNavigate();
  const { username, setUsername } = useUser(); // Now getting username from context
  const [localUsername, setLocalUsername] = useState('');
  const [n, setN] = useState(9);
  const [diff, setDiff] = useState(10);
  const k = Math.sqrt(n);

  const handleStartGame = (event) => {
    event.preventDefault();
    setUsername(localUsername);
    // Tjekker om n er et perfekt kvadrat og k er et heltal
    if (Number.isInteger(k) && n > 0) {
      console.log('Success:', localUsername, k, n, diff);
      navigate('/sudoku', { state: { n,diff }});
    } else {
      alert('Ugyldig værdi for n. n skal være et perfekt kvadrat (f.eks., 9, 16, 25).');
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

  const handleDiff = (event) => {
  setDiff(Number(event.target.value));
};

  const handleLoadGame = () => {
    // Use username from context for loading the game
    fetch(`http://localhost:3000/load?username=${username}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Loaded game:', data);
        navigate('/sudoku', { state: { n, load: data } });
      })
      .catch(error => {
        console.error('Error loading game:', error);
        alert('Ingen gemt spil fundet for brugeren.');
      });
  };

  const handleSettings = () => {

  }


  const BoardPreview = ({ n }) => {
    const regionSize = Math.sqrt(n);
    // Juster stilen for at sikre ensartede grænser mellem regionerne
    return (
      <div
        className="board-preview"
        style={{
          gridTemplateColumns: `repeat(${n}, 1fr)`,
          gridTemplateRows: `repeat(${n}, 1fr)`,
          maxWidth: '90vw',
          maxHeight: '90vh'

        }}>
        {[...Array(n * n)].map((_, idx) => {
          // Beregner hvilken region hver celle tilhører
          const row = Math.floor(idx / n);
          const col = idx % n;
          // Bestemmer om cellen er på en ydre grænse af en region
          const isOuterBorderRow = (row + 1) % regionSize === 0 && row !== n - 1;
          const isOuterBorderCol = (col + 1) % regionSize === 0 && col !== n - 1;

          // Skifter baggrundsfarve for bedre at vise regioner
          const backgroundColor = ((Math.floor(row / regionSize) + Math.floor(col / regionSize)) % 2 === 0) ? '#baaaaa' : '#ffffff';
          return (
            <div
              key={idx}
              className="preview-cell"
              style={{
                backgroundColor,
                borderBottom: isOuterBorderRow ? '2px solid #000000' : '1px solid #000000', // Tykkere kant kun ved ydre grænser
                borderRight: isOuterBorderCol ? '2px solid #000000' : '1px solid #000000', // Standard kant for indre celler
              }}
            ></div>
          );
        })}
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
        <select value={diff} onChange={handleDiff} required>
            <option value="">Vælg sværhedsgrad</option>
            <option value="1">Let</option>
            <option value="2">Medium</option>
            <option value="3">Svær</option>
         </select>

        <button type="submit">Start Spil</button>
      </form>


      <div class="bar">


            <button onClick={handleLeaderBoard} type="button" style={{ display: 'block', margin: '5px 0' }}>Leaderboard</button>
            <button onClick={handleGeoMap} type="button" className="geomap-button" style={{ display: 'block', margin: '5px 0' }}>Geomap</button>
            <button onClick={handleLoadGame} type="button" className="loadgame-button" style={{ display: 'block', margin: '5px 0' }}>Load Game</button>
        


        <button onClick={handleSettings} type="button" className="settings-button" style={{ display: 'block', margin: '5px 0' }}>Settings</button>

      </div>



      {/* Sudoku board size preview */}
      <BoardPreview k={k} n={n} />

      <div className="kn-inputs">
        <input
          type="number"
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          placeholder="Vælg n (bræt størrelse)"
          required
        />
      </div>
    </div>
    
  );

}

export default MenuScreen;
