import React, { useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';
import './CSS/StatisticsView.css';

function StatisticsView() {
  const { username } = useContext(UserContext);




  return (
    <div className="map-container">
        <div className="StatisticsView">
            <div className="statistics-screen">
            <h1>Statistics </h1>
            </div>
            <div className="statistics-details"> {/* New div for aligning the text to the left */}
                <p>Statistics for user: {username}</p>
                <p>Number of games played: </p>
                <p>Number of games won: 0</p>
                <p>Number of games lost: 0</p>
                <p>Best time: 0:00</p>
                <p>Worst time: 0:00</p>
                <p>Average time: 0:00</p>
            </div>
        </div>
    </div>
);
}

export default StatisticsView;
