import React, { useState,useEffect,useRef } from 'react';
import './CSS/SettingsScreen.css';
import './CSS/themes.css';
import { useAudio } from '../Utilities/AudioContext'; // Import the audio context
import CustomButton from '../Components/CustomButton';
//import button sound

//import music
import { playMusic } from '../Utilities/AudioPlayer';

function SettingsScreen() {
    const { isMusicOn, toggleMusic, areSoundEffectsOn, toggleSoundEffects } = useAudio();
    const [volume, setVolume] = useState(100); // State for volume control
    const volumeRef = useRef(volume);  // Using a ref to store the current volume

    useEffect(() => {
        volumeRef.current = volume;
        console.log("vol ref:",volumeRef.current);
    }, [volume]);

    useEffect(() => {
        playMusic(isMusicOn, volume);
        console.log("vol1:",volume)
    }, [isMusicOn, volume]);

   // Function to change the theme of the app 
    const changeTheme = (theme) => {
        const root = document.documentElement;
        const themes = ['Original', 'Theme', 'Green'];
        themes.forEach((t) => root.classList.remove(t));
        root.classList.add(theme);
    }
    const handleVolumeChange = (event) => {
        setVolume(event.target.value);
        console.log("vol2:",volume)
    }

    const handleThemeButtonClick = (theme) => {
        changeTheme(theme);
      };
      

    return (
        <div className="settings-container">
            <div className="settings-content">
                <h1>Settings</h1>
                <div className="settings-sections">
                    <div className="settings-section">
                        <h2>Change Theme</h2>
                        <CustomButton onClick={() => handleThemeButtonClick('Original')} className="settings-button" shouldPlaySound={areSoundEffectsOn} volumeLevel={volume} type="button">OG</CustomButton>
                        <CustomButton onClick={() => handleThemeButtonClick('Theme')} className="settings-button" shouldPlaySound={areSoundEffectsOn} volumeLevel={volume} type="button">Theme</CustomButton>
                        <CustomButton onClick={() => handleThemeButtonClick('Green')} className="settings-button" shouldPlaySound={areSoundEffectsOn} volumeLevel={volume} type="button">Green</CustomButton>
                    </div>
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
