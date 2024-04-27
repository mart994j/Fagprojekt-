import React, { createContext, useContext, useEffect, useState } from 'react';
import musicFile from '../assets/musicForAll.mp3';
import buttonSound from '../assets/button.mp3';
import { setGlobalMusicVolume, setGlobalSoundsVolume } from './GlobalAudioManager';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

const globalMusicPlayer = new Audio(musicFile);
globalMusicPlayer.loop = true;

const globalSoundPlayer = new Audio(buttonSound);

export const AudioProvider = ({ children }) => {
  const [isMusicOn, setMusicOn] = useState(false);
  const [areSoundEffectsOn, setSoundEffectsOn] = useState(true);
  const [volume, setVolume] = useState(50);  // Default volume set to 50

  // Synchronize global audio players with the volume state
  useEffect(() => {
    setGlobalMusicVolume(volume / 100);
    setGlobalSoundsVolume(volume / 100);
  }, [volume]);

  // Play or pause music depending on isMusicOn
  useEffect(() => {
    isMusicOn ? globalMusicPlayer.play() : globalMusicPlayer.pause();
    globalMusicPlayer.volume = volume / 100;
  }, [isMusicOn,volume]);

  // Toggle functions for music and sound effects
  const toggleMusic = () => setMusicOn(!isMusicOn);
  const toggleSoundEffects = () => setSoundEffectsOn(!areSoundEffectsOn);

  const value = {
    isMusicOn,
    toggleMusic,
    areSoundEffectsOn,
    toggleSoundEffects,
    volume,
    setVolume
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};
