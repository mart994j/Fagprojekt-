import clickSound from "../assets/clickSound.mp3";

export const playSound = (soundFile) => {
    if (soundFile) {
      const sound = new Audio(clickSound);
      sound.play();
    }
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



  