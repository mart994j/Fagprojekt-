import React, { useState,useEffect } from 'react';
import './CSS/SettingsScreen.css';
import './CSS/themes.css';
import { useAudio } from '../Utilities/AudioContext'; // Import the audio context
import CustomButton from '../Components/CustomButton';
//import button sound
import { playSoundButton } from '../Utilities/AudioPlayer';
import buttonSound from '../assets/button.mp3';

//import music
import { playMusic } from '../Utilities/AudioPlayer';

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

    const handleThemeButtonClick = (theme) => {
        changeTheme(theme);
        if (areSoundEffectsOn) {
          playSoundButton(buttonSound, volume);
          
        }
      };
      useEffect(() => {
        playMusic(isMusicOn, volume);
    }, [isMusicOn, volume]);

    return (
        <div className="settings-container">
            <div className="settings-content">
                <h1>Settings</h1>
                <div className="settings-sections">
                    <div className="settings-section">
                        <h2>Change Theme</h2>
                        <CustomButton onClick={() => handleThemeButtonClick('Original')} className="settings-button" type="button">OG</CustomButton>
                        <CustomButton onClick={() => handleThemeButtonClick('Theme')} className="settings-button" type="button">Theme</CustomButton>
                        <CustomButton onClick={() => handleThemeButtonClick('Green')} className="settings-button" type="button">Green</CustomButton>
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
