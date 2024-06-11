import React, { useState, useEffect, useRef } from 'react';
import './CSS/SettingsScreen.css';
import './CSS/themes.css';
import { useAudio } from '../Utilities/AudioContext'; // Import the audio context
import CustomButton from '../Components/CustomButton';
//import button sound

import { useNavigate } from 'react-router-dom';
import { IoArrowBackCircleOutline } from "react-icons/io5";


//import music
import { playMusic } from '../Utilities/AudioPlayer';

function SettingsScreen() {
    const navigate = useNavigate();
    const { isMusicOn, toggleMusic, areSoundEffectsOn, toggleSoundEffects, volume, setVolume } = useAudio();
    const volumeRef = useRef(volume);  // Using a ref to store the current volume

    const handleBack = () => {
        navigate('/menu');
    }


    // Function to change the theme of the app 
    const changeTheme = (theme) => {
        const root = document.documentElement;
        const themes = ['Original', 'Theme', 'Green'];
        themes.forEach((t) => root.classList.remove(t));
        root.classList.add(theme);
    }
    const handleVolumeChange = (event) => {
        const newVolume = Number(event.target.value);  // Convert to number
        setVolume(newVolume);  // Set global volume
        console.log("vol2:", newVolume);
    };

    useEffect(() => {
        volumeRef.current = volume;
        console.log("vol ref:", volumeRef.current);
    }, [volume]);

    useEffect(() => {
        playMusic(isMusicOn, volume);
        console.log("vol1:", volume)
    }, [isMusicOn, volume]);



    const handleThemeButtonClick = (theme) => {
        changeTheme(theme);
    };


    return (

        <div className="settings-container">
            <CustomButton onClick={handleBack} style={{ background: 'none', color: 'white', border: 'none', position: 'absolute', marginRight: '90%', marginTop: '-45%' }}>
                <IoArrowBackCircleOutline size="35px" />
                <span>{''}</span>
            </CustomButton>
            <div className="settings-content">

                <h1>Settings</h1>
                <div className="settings-sections">
                    <div className="settings-section theme-buttons-container">
                        <h2>Change Theme</h2>
                        <CustomButton onClick={() => handleThemeButtonClick('Original')} className="settings-button">OG</CustomButton>
                        <CustomButton onClick={() => handleThemeButtonClick('Theme')} className="settings-button">Theme</CustomButton>
                        <CustomButton onClick={() => handleThemeButtonClick('Green')} className="settings-button">Green</CustomButton>
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
