import React from 'react';
import { useAudio } from '../Utilities/AudioContext'; // Import the audio context
import { playSoundButton1 } from '../Utilities/AudioPlayer';

const CustomButton = ({ className, children, onClick, ...props }) => {
    const { areSoundEffectsOn, volume } = useAudio(); // Use volume from context

    const handleClick = (e) => {
        if (areSoundEffectsOn) {
            playSoundButton1(true, volume);
            console.log("hej:",volume);
        }
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <button className={`custom-button ${className}`} onClick={handleClick} {...props}>
            {children}
        </button>
    );
};

export default CustomButton;
