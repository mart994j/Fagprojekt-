import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import './CSS/MenuScreen.css'; // Import CSS file
import './CSS/MenuButtons.css';
import { IoIosMenu } from "react-icons/io";


function MenuScreen() {
  let navigate = useNavigate();
  const { username, setUsername } = useUser(); // Now getting username from context
  const [localUsername, setLocalUsername] = useState('');
  const [n, setN] = useState(9);
  const [diff, setDiff] = useState(10);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // Updated for sidebar

  const k = Math.sqrt(n);

  const handleStartGame = (event) => {
    event.preventDefault();
    setUsername(localUsername);
    // Tjekker om n er et perfekt kvadrat og k er et heltal
    if (Number.isInteger(k) && n > 0) {
      console.log('Success:', localUsername, k, n, diff);
      navigate('/sudoku', { state: { n, diff } });
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

  const handleSudokuMap = () => {
    navigate('/sudokuMap');
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

  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible); // Updated for sidebar



  return (
    <div className="menu-screen">
      <div className="icon-container">
        <IoIosMenu onClick={toggleSidebar} className="sidebar-trigger" size={48} />
      </div>

      <div className={`sidebar-menu ${isSidebarVisible ? 'active' : ''}`}>
        <div className="sidebar-menu-content">
          <button onClick={handleLeaderBoard}class="leaderboard-button" type="button">Leaderboard</button>
          <button onClick={handleGeoMap} class="geomap-button" type="button">Geomap</button>
          <button onClick={handleLoadGame} class="loadgame-button" type="button">Load Game</button>
          <button onClick={handleSudokuMap} class="SudokuChronicles-button" type="button">Sudoku Chronicles</button>

        
          <button onClick={handleSettings} class="settings-button" type="button">Settings</button>
        </div>
      </div>
      

      <form onSubmit={handleStartGame}>
        <h1>Velkommen til Sudoku!</h1>
        <input
          type="text"
          value={localUsername}
          onChange={(e) => setLocalUsername(e.target.value)}
          placeholder="Indtast brugernavn"
          required
        />
        <button type="submit">Start Spil</button>
        <select value={diff} onChange={handleDiff} required>
          <option value="">Vælg sværhedsgrad</option>
          <option value="1">Let</option>
          <option value="2">Medium</option>
          <option value="3">Svær</option>
        </select>

        {/* Sudoku board size preview */}
        <BoardPreview k={k} n={n} />

        <h3>Vælg Størrelse på Sudoku</h3>

        <div className="kn-inputs">
          <input
            type="number"
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            placeholder="Vælg n (bræt størrelse)"
            required
          />
        </div>
      </form>
    </div>
  );

}

export default MenuScreen;
