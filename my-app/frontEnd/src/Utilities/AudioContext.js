import React, { createContext, useState, useContext } from 'react';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const [isMusicOn, setMusicOn] = useState(true);
  const [areSoundEffectsOn, setSoundEffectsOn] = useState(true);

  const toggleMusic = () => setMusicOn(!isMusicOn);
  const toggleSoundEffects = () => setSoundEffectsOn(!areSoundEffectsOn);

  return (
    <AudioContext.Provider value={{ isMusicOn, toggleMusic, areSoundEffectsOn, toggleSoundEffects }}>
      {children}
    </AudioContext.Provider>
  );
};
