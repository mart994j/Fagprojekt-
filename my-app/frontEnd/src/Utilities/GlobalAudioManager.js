import musicFile from '../assets/musicForAll.mp3';

const globalMusicPlayer = new Audio(musicFile);
globalMusicPlayer.loop = true;

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
