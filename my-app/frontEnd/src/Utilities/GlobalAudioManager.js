import musicFile from '../assets/musicForAll.mp3';
import buttonSound from '../assets/button.mp3';


const globalMusicPlayer = new Audio(musicFile);
globalMusicPlayer.loop = true;

const globalSoundPlayer = new Audio(buttonSound);

export const playGlobalSounds = () => {
  globalSoundPlayer.play().catch(e => console.error("Failed to play sound:", e));
};

export const setGlobalSoundsVolume = (volume) => {
  console.log("Setting sound player volume to:", volume);
  globalSoundPlayer.volume = volume;
};

export const playGlobalMusic = () => {
  globalMusicPlayer.play().catch(e => console.error("Playback was interrupted:", e));
};

export const pauseGlobalMusic = () => {
  globalMusicPlayer.pause();
};

export const setGlobalMusicVolume = (volume) => {
  console.log("Setting music player volume to:", volume);
  globalMusicPlayer.volume = volume;
};
