import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CustomButton from '../Components/CustomButton';
import { useAudio } from '../Utilities/AudioContext';
import { playSoundButton1 } from '../Utilities/AudioPlayer';

//Laver et mock af useAudio hooket
jest.mock('../Utilities/AudioContext', () => ({
    useAudio: jest.fn()
}));

// lavet et mock af playSoundButton1 funktionen
jest.mock('../Utilities/AudioPlayer', () => ({
    playSoundButton1: jest.fn()
}));

describe('CustomButton', () => {
    beforeEach(() => {
        // Ensure the mock implementation is reset before each test
        useAudio.mockReturnValue({
            areSoundEffectsOn: false,
            volume: 1.0
        });
    });

    it('renders correctly with children and class name', () => {
        render(<CustomButton className="test-class">Click Me</CustomButton>);
        
        const buttonElement = screen.getByText('Click Me');
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveClass('custom-button test-class');
    });

    it('calls onClick prop when clicked', () => {
        const handleClick = jest.fn();
        render(<CustomButton onClick={handleClick}>Click Me</CustomButton>);
        
        const buttonElement = screen.getByText('Click Me');
        fireEvent.click(buttonElement);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('plays sound when areSoundEffectsOn is true', () => {
        useAudio.mockReturnValue({ areSoundEffectsOn: true, volume: 0.5 });

        render(<CustomButton>Click Me</CustomButton>);
        
        const buttonElement = screen.getByText('Click Me');
        fireEvent.click(buttonElement);

        expect(playSoundButton1).toHaveBeenCalledWith(true, 0.5);
    });

    it('does not play sound when areSoundEffectsOn is false', () => {
        useAudio.mockReturnValue({ areSoundEffectsOn: false, volume: 0.5 });

        render(<CustomButton>Click Me</CustomButton>);
        
        const buttonElement = screen.getByText('Click Me');
        fireEvent.click(buttonElement);

        expect(playSoundButton1).not.toHaveBeenCalled();
    });
});
