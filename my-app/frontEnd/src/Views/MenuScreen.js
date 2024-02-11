import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import './CSS/MenuScreen.css'; // Import CSS file

function MenuScreen() {
  let navigate = useNavigate();
  const { setUsername } = useUser();
  const [localUsername, setLocalUsername] = useState('');

  const handleStartGame = (event) => {
    event.preventDefault();
    setUsername(localUsername);
    console.log('Success:', localUsername);
    navigate('/sudoku');
  };

  const handleLeaderBoard = () => {
    navigate('/leaderboard');
  };

  const handleGeoMap = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        navigate('/geoMap', { state: { lat: latitude, lng: longitude } }); // Brugerens lokation
      },
      () => {
        const copenhagen = { lat: 55.6761, lng: 12.5683 }; // Standardkoordinater for København
        navigate('/geoMap', { state: copenhagen }); // Standardlokation
      }
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
    </div>
  );
}

export default MenuScreen;
