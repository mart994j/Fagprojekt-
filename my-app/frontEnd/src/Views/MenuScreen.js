import React, { useState } from 'react';
import CustomButton from '../Components/CustomButton';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import './CSS/MenuScreen.css'; // Import CSS file
import './CSS/MenuButtons.css';
import './CSS/themes.css';
import { IoIosMenu } from "react-icons/io";


function MenuScreen() {
  let navigate = useNavigate();
  const { username} = useUser(); // Now getting username from context
  const [n, setN] = useState(9);
  const [diff, setDiff] = useState(10);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // Updated for sidebar
  const [savedGames, setSavedGames] = useState([]);

  const k = Math.sqrt(n);

  const handleStartGame = (event) => {
    event.preventDefault();
    // Tjekker om n er et perfekt kvadrat og k er et heltal
    if (Number.isInteger(k) && n > 0) {
      console.log('Success:',username, k, n, diff);
      navigate('/sudoku', { state: { n, diff } });
    } else {
      alert('Ugyldig værdi for n. n skal være et perfekt kvadrat (f.eks., 9, 16, 25).');
      return;
    }
  };

  const handleLeaderBoard = () => {
    navigate('/leaderboard');
  };

  const handleTutorial = () => {

  navigate('/tutorial')
  };

  const handleGeoMap = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        navigate('/geomap', { state: { lat: latitude, lng: longitude } });
      },
      (error) => {
        console.error("Geolocation error:", error);
        const defaultLat = 55.6761; 
        const defaultLng = 12.5683; 
        navigate('/geomap', { state: { lat: defaultLat, lng: defaultLng } });
      }
    );
  };

  const handleDiff = (event) => {
    setDiff(Number(event.target.value));
  };

  const handleLoadGames = () => {
    fetch(`http://localhost:3001/load?username=${username}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setSavedGames(data);  // Set the saved games
        console.log('Loaded games:', data);
      })
      .catch(error => {
        console.error('Error loading games:', error);
        alert('No saved games found for the user.');
      });
  };
  





  const handleSettings = () => {
    navigate('/settings');
  }

  const handleSudokuMap = () => {
    navigate('/sudokuMap');
  }


  const handleStatistics = () => {
    navigate('/statistics');
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
          <CustomButton onClick={handleLeaderBoard}className="leaderboard-button" type="button">Leaderboard</CustomButton>
          <CustomButton onClick={handleGeoMap} className="geomap-button" type="button">Geomap</CustomButton>
          <CustomButton onClick={handleLoadGames} className="loadgame-button" type="button">Load Game</CustomButton>
          <div>
            {savedGames.map((game, index) => (
              <div key={index}>
                <CustomButton onClick={() => navigate('/sudoku', { state: { n, load: game } })}>
                  Saved game: {index + 1}
                </CustomButton>
              </div>
            ))}
          </div>
          <CustomButton onClick={handleSudokuMap} className="SudokuChronicles-button" type="button">Sudoku Chronicles</CustomButton>
          <CustomButton onClick={handleStatistics} className="statistics-button" type="button">Statistics</CustomButton>
          <CustomButton onClick={handleSettings} className="settings-button" type="button">Settings</CustomButton>
          <CustomButton onClick={handleTutorial} className="tutorial-button" type="button">Tutorial</CustomButton>

        </div>
      </div>
      

      <form onSubmit={handleStartGame}>


        <h1>Welcome to Sudoku!</h1>
        
        <CustomButton type="submit">Begin Game</CustomButton>
        <select value={diff} onChange={handleDiff} required>
          <option value="">Choose Difficulty</option>
          <option value="1">Easy</option>
          <option value="2">Medium</option>
          <option value="3">Hard</option>
        </select>

        {/* Sudoku board size preview */}
        <BoardPreview k={k} n={n} />

        <h3>Choose The Size of The Sudoku</h3>
        <div className="kn-inputs">
          <input
            type="number"
            value={Math.sqrt(n)}
            onChange={(e) => {
              const value = Math.pow(Number(e.target.value), 2);

              // Size of board must be between 9 and 49 (small squares)
              if (value >= 9 && value <= 25) {
                setN(value);
              } else if (value > 25) {
                setN(36);
              }

            }}
            placeholder="Vælg n (bræt størrelse)"
            required
          />
        </div>

      </form>
    </div>
  );

}

export default MenuScreen;