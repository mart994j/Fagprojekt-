import React, { useState } from 'react';
import './CSS/SettingsScreen.css';
import './CSS/themes.css';
import { useAudio } from '../Utilities/AudioContext'; // Import the audio context

function SettingsScreen() {
    const { isMusicOn, toggleMusic, areSoundEffectsOn, toggleSoundEffects } = useAudio();
    const [volume, setVolume] = useState(100); // State for volume control

   // Function to change the theme of the app 
    const changeTheme = (theme) => {
        const root = document.documentElement;
        const themes = ['Original', 'Theme', 'Green'];
        themes.forEach((t) => root.classList.remove(t));
        root.classList.add(theme);
    }
    const handleVolumeChange = (event) => {
        const newVolume = event.target.value;
        setVolume(newVolume);
    }
    return (
        <div className="settings-container">
            <div className="settings-content">
                <h1>Settings</h1>
                <div className="settings-sections">
                    <div className="settings-section">
                        <h2>Change Theme</h2>
                        <button onClick={() => changeTheme('Original')} className="settings-button" type="button">OG</button>
                        <button onClick={() => changeTheme('Theme')} className="settings-button" type="button">Theme</button>
                        <button onClick={() => changeTheme('Green')} className="settings-button" type="button">Green</button>                    </div>
                    <div className="settings-section">
                        <h2>Sound Controls</h2>
                        <label className="settings-option">
                            <input type="checkbox" checked={areSoundEffectsOn} onChange={toggleSoundEffects} />
                            Sound Effects
                        </label>
                        <label className="settings-option">
                            <input type="checkbox" checked={isMusicOn} onChange={toggleMusic} />
                            Music
                        </label>
                        <label className="settings-option">
                            Volume:
                            <input type="range" min="0" max="100" value={volume} onChange={handleVolumeChange} />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsScreen;
