import React from 'react';
import { useAudio } from './AudioContext';
import { playSoundButton } from './AudioPlayer';
import buttonSound from '../assets/button.mp3';

const withSoundEffect = (WrappedComponent) => {
    return function WithSoundComponent({ onClick, ...props }) {
        const { areSoundEffectsOn, volume } = useAudio();

        const handleClick = (event) => {
            if (areSoundEffectsOn) {
                console.log(`Playing sound at volume: ${volume}`);
                playSoundButton(buttonSound, volume);
            }
            if (onClick) {
                onClick(event);
            }
        };

        return <WrappedComponent {...props} onClick={handleClick} />;
    };
};

export default withSoundEffect;
