import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './CSS/Geomap.css'; // Sørg for, at stien er korrekt
import { useLocation } from 'react-router-dom';

function Geomap() {
  const location = useLocation();
  const userLocation = location.state; // Brug lokation fra state, eller brug standardværdien

  return (
    <div className="geomap-screen">
      <h1>Geomap</h1>
      <p>Her kan du se hvor du har løst dine sudokuer henne!</p>
      <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={15} style={{ height: "60%", width: "80%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>
            Du er her!
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default Geomap;
