import React, { createContext, useContext, useEffect, useState } from 'react';
import musicFile from '../assets/musicForAll.mp3';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
  const [isMusicOn, setMusicOn] = useState(false);
  const [areSoundEffectsOn, setSoundEffectsOn] = useState(true);
  const [musicPlayer] = useState(() => {
    const audio = new Audio(musicFile);
    audio.loop = true;
    return audio;
  });

  useEffect(() => {
    isMusicOn ? musicPlayer.play() : musicPlayer.pause();
  }, [isMusicOn, musicPlayer]);

  // Toggle music function
  const toggleMusic = () => setMusicOn(!isMusicOn);
  const toggleSoundEffects = () => setSoundEffectsOn(!areSoundEffectsOn);

  return (
    <AudioContext.Provider value={{ isMusicOn, toggleMusic,areSoundEffectsOn,toggleSoundEffects  }}>
      {children}
    </AudioContext.Provider>
  );
};
