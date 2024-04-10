export const playSoundButton = (soundFile, volumeLevel) => {
    const sound = new Audio(soundFile);
    sound.volume = volumeLevel / 100; // Volume levels are from 0.0 to 1.0
    sound.play();
  };
  
  export const playMusic = (musicFile, isMusicOn) => {
    const music = new Audio(musicFile);
    music.loop = true;
  
    if (isMusicOn) {
      music.play();
    } else {
      music.pause();
    }
  };



  