import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { AudioProvider, useAudio } from '../Utilities/AudioContext';

// Mock the audio files to prevent actual audio loading
jest.mock('../assets/musicForAll.mp3', () => 'musicForAll.mp3');
jest.mock('../assets/button.mp3', () => 'button.mp3');

// Mock the GlobalAudioManager functions
jest.mock('../Utilities/GlobalAudioManager', () => ({
  setGlobalMusicVolume: jest.fn(),
  setGlobalSoundsVolume: jest.fn()
}));

const TestComponent = () => {
  const { isMusicOn, toggleMusic, areSoundEffectsOn, toggleSoundEffects, volume, setVolume } = useAudio();
  return (
    <div>
      <button onClick={toggleMusic}>Toggle Music</button>
      <button onClick={toggleSoundEffects}>Toggle Sound Effects</button>
      <button onClick={() => setVolume(75)}>Set Volume to 75</button>
      <div data-testid="isMusicOn">{isMusicOn.toString()}</div>
      <div data-testid="areSoundEffectsOn">{areSoundEffectsOn.toString()}</div>
      <div data-testid="volume">{volume}</div>
    </div>
  );
};

describe('AudioProvider', () => {
  it('should toggle music on and off', () => {
    render(
      <AudioProvider>
        <TestComponent />
      </AudioProvider>
    );

    const toggleButton = screen.getByText('Toggle Music');
    const isMusicOnDiv = screen.getByTestId('isMusicOn');

    expect(isMusicOnDiv).toHaveTextContent('false');
    fireEvent.click(toggleButton);
    expect(isMusicOnDiv).toHaveTextContent('true');
    fireEvent.click(toggleButton);
    expect(isMusicOnDiv).toHaveTextContent('false');
  });

  it('should toggle sound effects on and off', () => {
    render(
      <AudioProvider>
        <TestComponent />
      </AudioProvider>
    );

    const toggleButton = screen.getByText('Toggle Sound Effects');
    const areSoundEffectsOnDiv = screen.getByTestId('areSoundEffectsOn');

    expect(areSoundEffectsOnDiv).toHaveTextContent('true');
    fireEvent.click(toggleButton);
    expect(areSoundEffectsOnDiv).toHaveTextContent('false');
    fireEvent.click(toggleButton);
    expect(areSoundEffectsOnDiv).toHaveTextContent('true');
  });

  it('should set the volume', () => {
    render(
      <AudioProvider>
        <TestComponent />
      </AudioProvider>
    );

    const setVolumeButton = screen.getByText('Set Volume to 75');
    const volumeDiv = screen.getByTestId('volume');

    expect(volumeDiv).toHaveTextContent('50');
    fireEvent.click(setVolumeButton);
    expect(volumeDiv).toHaveTextContent('75');
  });

  it('should call setGlobalMusicVolume and setGlobalSoundsVolume when volume changes', () => {
    const { setGlobalMusicVolume, setGlobalSoundsVolume } = require('../Utilities/GlobalAudioManager');

    render(
      <AudioProvider>
        <TestComponent />
      </AudioProvider>
    );

    const setVolumeButton = screen.getByText('Set Volume to 75');

    fireEvent.click(setVolumeButton);

    expect(setGlobalMusicVolume).toHaveBeenCalledWith(0.75);
    expect(setGlobalSoundsVolume).toHaveBeenCalledWith(0.75);
  });
});
