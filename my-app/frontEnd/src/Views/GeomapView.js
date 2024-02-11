import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './CSS/Geomap.css'; // Sørg for, at stien er korrekt
import { useLocation } from 'react-router-dom';

function Geomap() {
  const location = useLocation();
  const center = { lat:  55.719437, lng: 13.197304 };
  const userLocation = location.state || center; // Brug lokation fra state, eller brug standardværdien

  return (
    <div className="geomap-screen">
      <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={15} style={{ height: "100%", width: "100%" }}>
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
