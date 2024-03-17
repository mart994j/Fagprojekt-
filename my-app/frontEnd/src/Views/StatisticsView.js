import React, { useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';
import './CSS/StatisticsView.css';

function StatisticsView() {
    const { username } = useContext(UserContext);
    const navigate = useNavigate();

    const formatTime = (totalSeconds) => {
        if (!totalSeconds) return '0:00';
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const formatPlayedGames = (gamesPlayed) => {
        if(gamesPlayed===0){
            return '0';
        }else {
            return gamesPlayed-1;
        }
    }



    const [stats, setStats] = useState({
        gamesPlayed: 0,
        gamesWon: 0,
        bestTime: '0:00',
        worstTime: '0:00',
        averageTime: '0:00',
    });


    useEffect(() => {
        fetch(`http://localhost:3000/stats/${username}`)
            .then(response => response.json())
            .then(data => {
                setStats({
                    gamesPlayed: formatPlayedGames(data.gamesPlayed),
                    gamesWon: data.gamesWon,
                    bestTime: formatTime(data.bestTime === Infinity ? 0 : data.bestTime), // Handle the Infinity value
                    worstTime: formatTime(data.worstTime),
                    averageTime: formatTime(data.averageTime),
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [username]);

    return (
        <div className="map-container">
            <div className="StatisticsView">
                <div className="statistics-screen">
                    <h1>Statistics</h1>
                </div>
                <div className="statistics-details">
                    <p>Statistics for user: {username}</p>
                    <p>Number of games played: {stats.gamesPlayed}</p>
                    <p>Number of games won: {stats.gamesWon}</p>
                    <p>Best time: {stats.bestTime}</p>
                    <p>Worst time: {stats.worstTime}</p>
                    <p>Average time: {stats.averageTime}</p>
                </div>
            </div>
        </div>
    );
    
}

export default StatisticsView;
