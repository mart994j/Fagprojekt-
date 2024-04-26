import musicFile from '../assets/musicForAll.mp3';
import buttonSound from '../assets/button.mp3';

const globalMusicPlayer = new Audio(musicFile);
globalMusicPlayer.loop = true;


//sounds
const globalSoundPlayer = new Audio(buttonSound);
export const playGlobalSounds = (volume = 1) => {
  globalSoundPlayer.volume = volume;
  globalSoundPlayer.play().catch(e => console.error("Failed to play sound:", e));
}
export const setGlobalSoundsVolume = (volume) => {
  globalSoundPlayer.volume = volume;
};

//music
export const playGlobalMusic = (volume = 1) => {
  globalMusicPlayer.volume = volume;
  globalMusicPlayer.play().catch(e => console.error("Playback was interrupted:", e));
};

export const pauseGlobalMusic = () => {
  globalMusicPlayer.pause();
};

export const setGlobalMusicVolume = (volume) => {
  globalMusicPlayer.volume = volume;
};

export default globalMusicPlayer;
