import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';
import './CSS/SettingsScreen.css';
import './CSS/themes.css';

function SettingsScreen() {
    const { username } = useContext(UserContext);
    const navigate = useNavigate();

    const changeTheme = (theme) => {  
        const root = document.documentElement;
        const themes = ['Original', 'Theme', 'Green'];
        themes.forEach((t) => root.classList.remove(t));
        root.classList.add(theme);
    }

    return (
        <div className="map-container">
            <div className="StatisticsView">
                <div className="statistics-screen">
                    <h1>Statistics</h1>
                    <div className="square">
                        <button onClick={() => changeTheme('Original')} className="settings-button" type="button">OG</button>
                        <button onClick={() => changeTheme('Theme')} className="settings-button" type="button">Theme</button>
                        <button onClick={() => changeTheme('Green')} className="settings-button" type="button">Green</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsScreen;
