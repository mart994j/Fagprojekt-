//Hannah
import { playGlobalMusic, pauseGlobalMusic, setGlobalMusicVolume, playGlobalSounds } from './GlobalAudioManager';

export const playSoundButton1 = (shouldPlay) => {
  if (shouldPlay) {
    playGlobalSounds();
  }
}

export const playMusic = (shouldPlay) => {
  if (shouldPlay) {
    playGlobalMusic();
  } else {
    pauseGlobalMusic();
  }
};
