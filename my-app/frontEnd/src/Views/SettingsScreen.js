import React, {  } from 'react';
import './CSS/SettingsScreen.css';
import './CSS/themes.css';

function SettingsScreen() {
    const changeTheme = (theme) => {
        const root = document.documentElement;
        const themes = ['Original', 'Theme', 'Green'];
        themes.forEach((t) => root.classList.remove(t));
        root.classList.add(theme);
    }

    return (
        <div className="map-container">
            <div className="SettingsView">
                <div className="settings-screen">
                    <h1>Settings</h1>
                    <div className="square">
                        <h2>Change Theme</h2>
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
