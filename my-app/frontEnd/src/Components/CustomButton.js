import React from "react";
import buttonSound from '../assets/button.mp3'; 
import { playSoundButton } from '../Utilities/AudioPlayer'; 


const CustomButton = ({ className, children, onClick, volumeLevel = 50, ...props }) => {
    const handleClick = (e) => {
        // Play the button sound
        playSoundButton(buttonSound, volumeLevel);

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
