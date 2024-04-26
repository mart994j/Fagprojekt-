// CustomButton.js
import React from 'react';
import { playSoundButton1 } from '../Utilities/AudioPlayer';
const CustomButton = ({ className, children, onClick, shouldPlaySound, volumeLevel, ...props }) => {
    const handleClick = (e) => {
        // Play the button sound only if sound effects are enabled
        if (shouldPlaySound) {
            playSoundButton1(true, volumeLevel);
        }

        // If there's an additional onClick handler passed to the component, execute it
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <button
            className={`custom-button ${className}`}
            onClick={handleClick}
            {...props}
        >
            {children}
        </button>
    );
};

export default CustomButton;
