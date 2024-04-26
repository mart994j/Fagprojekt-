import React from 'react';
import withSoundEffect from '../Utilities/withSoundEffect'; 

const Button = ({ className, children, ...props }) => (
    <button className={`settings-button ${className}`} {...props}>
        {children}
    </button>
);

const SoundButton = withSoundEffect(Button);

export default SoundButton;
