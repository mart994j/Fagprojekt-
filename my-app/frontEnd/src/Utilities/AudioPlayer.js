// AudioPlayer.js
import { playGlobalMusic, pauseGlobalMusic, setGlobalMusicVolume } from './GlobalAudioManager';
import buttonSound from '../assets/button.mp3';

export const playSoundButton = (soundFile, volumeLevel) => {
  const sound = new Audio(soundFile);
  sound.volume = volumeLevel / 100; // Volume levels are from 0.0 to 1.0
  sound.play().catch(e => console.error("Failed to play sound:", e));
};

export const playMusic = (shouldPlay, volumeLevel) => {
  setGlobalMusicVolume(volumeLevel / 100);
  if (shouldPlay) {
    playGlobalMusic();
  } else {
    pauseGlobalMusic();
  }
};
