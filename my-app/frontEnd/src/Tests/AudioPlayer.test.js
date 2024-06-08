// src/Tests/AudioPlayer.test.js
import { playSoundButton1, playMusic } from '../Utilities/AudioPlayer.js';
import { playGlobalMusic, pauseGlobalMusic, playGlobalSounds } from '../Utilities/GlobalAudioManager.js'

// Mock the GlobalAudioManager functions
jest.mock('../Utilities/GlobalAudioManager.js', () => ({
  playGlobalMusic: jest.fn(),
  pauseGlobalMusic: jest.fn(),
  setGlobalMusicVolume: jest.fn(),
  playGlobalSounds: jest.fn()
}));

describe('AudioPlayer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('playSoundButton1', () => {
    it('should call playGlobalSounds when shouldPlay is true', () => {
      playSoundButton1(true);
      expect(playGlobalSounds).toHaveBeenCalled();
    });

    it('should not call playGlobalSounds when shouldPlay is false', () => {
      playSoundButton1(false);
      expect(playGlobalSounds).not.toHaveBeenCalled();
    });
  });

  describe('playMusic', () => {
    it('should call playGlobalMusic when shouldPlay is true', () => {
      playMusic(true);
      expect(playGlobalMusic).toHaveBeenCalled();
    });

    it('should call pauseGlobalMusic when shouldPlay is false', () => {
      playMusic(false);
      expect(pauseGlobalMusic).toHaveBeenCalled();
    });
  });
});
