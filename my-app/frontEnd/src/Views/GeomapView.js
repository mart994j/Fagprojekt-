import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './CSS/Geomap.css';
import { useLocation } from 'react-router-dom';
import L from 'leaflet';
import icon from '../assets/markerIcon.png'; 

function Geomap() {
  const [solutions, setSolutions] = useState([]);
  const locationState = useLocation().state; // Tilgå state fra navigation

  const defaultIcon = L.icon({
    iconUrl: icon,
    iconSize: [41, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  useEffect(() => {
    fetch('http://localhost:3000/leaderboard')
      .then(response => response.json())
      .then(data => {
        setSolutions(data);
      })
      .catch(error => console.error("Failed to load leaderboard data:", error));
  }, []);
  console.log(locationState);
  const center = locationState || { lat: 55.6761, lng: 12.5683 }; // Brug lokation fra state eller en standardværdi

  return (
    <div className="geomap-screen">
      <h1>Geomap</h1>
      <p>Her kan du se, hvor du har løst dine sudokuer henne</p>
      <MapContainer center={[center.lat, center.lng]} zoom={15} style={{ height: "60%", width: "80%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {solutions.map((solution, index) => (
          <Marker 
            key={index} 
            position={[solution.location.lat, solution.location.lng]} 
            icon={defaultIcon} // Angiv defaultIcon her
          >
            <Popup>
              {solution.username} løste en Sudoku på {solution.time} sekunder her!
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Geomap;
