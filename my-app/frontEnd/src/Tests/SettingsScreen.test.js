// src/Tests/SettingsScreen.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SettingsScreen from '../Views/SettingsScreen';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '../Utilities/AudioContext';

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock useAudio from AudioContext
jest.mock('../Utilities/AudioContext', () => ({
  useAudio: jest.fn().mockReturnValue({
    isMusicOn: false,
    toggleMusic: jest.fn(),
    areSoundEffectsOn: false,
    toggleSoundEffects: jest.fn(),
    volume: 50,
    setVolume: jest.fn(),
  }),
}));

// Mock playMusic from AudioPlayer
jest.mock('../Utilities/AudioPlayer', () => ({
  playMusic: jest.fn(),
}));

describe('SettingsScreen', () => {
  const mockNavigate = jest.fn();
  const mockToggleMusic = jest.fn();
  const mockToggleSoundEffects = jest.fn();
  const mockSetVolume = jest.fn();
  
  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    useAudio.mockReturnValue({
      isMusicOn: false,
      toggleMusic: mockToggleMusic,
      areSoundEffectsOn: false,
      toggleSoundEffects: mockToggleSoundEffects,
      volume: 50,
      setVolume: mockSetVolume,
    });
  });

  it('renders SettingsScreen component', () => {
    render(<SettingsScreen />);

    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Change Theme')).toBeInTheDocument();
    expect(screen.getByText('Sound Controls')).toBeInTheDocument();
    expect(screen.getByText('OG')).toBeInTheDocument();
    expect(screen.getByText('Theme')).toBeInTheDocument();
    expect(screen.getByText('Green')).toBeInTheDocument();
  });

  it('handles theme changes', () => {
    render(<SettingsScreen />);

    const root = document.documentElement;
    const originalClassName = root.className;

    fireEvent.click(screen.getByText('OG'));
    expect(root.classList.contains('Original')).toBe(true);

    fireEvent.click(screen.getByText('Theme'));
    expect(root.classList.contains('Theme')).toBe(true);

    fireEvent.click(screen.getByText('Green'));
    expect(root.classList.contains('Green')).toBe(true);

    root.className = originalClassName; // Restore original class name
  });

  it('handles toggling sound effects', () => {
    render(<SettingsScreen />);

    const soundEffectsCheckbox = screen.getByLabelText('Sound Effects');
    fireEvent.click(soundEffectsCheckbox);
    expect(mockToggleSoundEffects).toHaveBeenCalled();
  });

  it('handles toggling music', () => {
    render(<SettingsScreen />);

    const musicCheckbox = screen.getByLabelText('Music');
    fireEvent.click(musicCheckbox);
    expect(mockToggleMusic).toHaveBeenCalled();
  });

  it('handles volume change', () => {
    render(<SettingsScreen />);

    const volumeSlider = screen.getByLabelText('Volume:');
    fireEvent.change(volumeSlider, { target: { value: '75' } });
    expect(mockSetVolume).toHaveBeenCalledWith(75);
  });

  it('navigates back to menu when back button is clicked', () => {
    render(<SettingsScreen />);

    const backButton = screen.getByTestId('back');
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/menu');
  });
});
