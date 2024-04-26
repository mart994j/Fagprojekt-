// AudioPlayer.js
import { playGlobalMusic, pauseGlobalMusic, setGlobalMusicVolume,playGlobalSounds,setGlobalSoundsVolume } from './GlobalAudioManager';

export const playSoundButton1 = (shouldPlay,volumeLevel) => {
  setGlobalSoundsVolume(volumeLevel / 100);
  if (shouldPlay){
    setGlobalSoundsVolume(volumeLevel / 100);
    playGlobalSounds();
  }
}

export const playMusic = (shouldPlay, volumeLevel) => {
  setGlobalMusicVolume(volumeLevel / 100);
  if (shouldPlay) {
    playGlobalMusic();
  } else {
    pauseGlobalMusic();
  }
};
