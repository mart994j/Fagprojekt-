import React, { useEffect, useState } from 'react';

import './CSS/Leaderboard.css';
import './CSS/themes.css';


import {useNavigate } from 'react-router-dom';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import CustomButton from '../Components/CustomButton.js';



function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    // Fetch leaderboard data when the component mounts
    fetch('http://localhost:3001/leaderboard')
      .then(response => response.json())
      .then(data => {
        setLeaderboard(data); 
      })
      .catch(error => {
        console.error('Error fetching leaderboard:', error);
      });
  }, []); 
  const navigate = useNavigate();


  const handleBack = () => {
    navigate('/menu');
  };



  return (
    <div className="leaderbord-view">
      <CustomButton onClick={handleBack} style={{ background: 'none', color: 'white', border: 'none',position: 'absolute', marginRight: '90%' , marginTop: '-45%' }}>
        <IoArrowBackCircleOutline size="35px" />
        <span>{''}</span>
      </CustomButton>

      <h1 className="leaderboard-title">Leaderboard</h1>
      <ul className="leaderboard-list">
        {leaderboard.map((entry, index) => (
          <li key={index}>{entry.username} - {entry.time}s</li>
        ))}
      </ul>
    </div>
  );
}

export default Leaderboard;
