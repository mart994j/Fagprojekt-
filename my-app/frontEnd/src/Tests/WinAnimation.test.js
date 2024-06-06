// src/Tests/celebrateWin.test.js
import confetti from 'canvas-confetti';
import celebrateWin from '../Components/WinAnimation';
// Mock the confetti function
jest.mock('canvas-confetti', () => jest.fn());

describe('celebrateWin', () => {
  beforeEach(() => {
    // Clear all instances and calls to the mock before each test
    confetti.mockClear();
    document.body.innerHTML = ''; // Reset the DOM
  });

  it('should trigger confetti with correct parameters', () => {
    celebrateWin();

    expect(confetti).toHaveBeenCalledWith({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  });

  it('should append a winning message to the document body', () => {
    const winMessage = celebrateWin();

    const appendedMessage = document.querySelector('div');
    expect(appendedMessage).toBeInTheDocument();
    expect(appendedMessage).toHaveTextContent('Congratulations! You won!');
    expect(appendedMessage.style.position).toBe('fixed');
    expect(appendedMessage.style.left).toBe('50%');
    expect(appendedMessage.style.top).toBe('50%');
    expect(appendedMessage.style.transform).toBe('translate(-50%, -50%)');
    expect(appendedMessage.style.fontSize).toBe('3rem');
    expect(appendedMessage.style.fontWeight).toBe('bold');
    expect(appendedMessage.style.zIndex).toBe('1000');
    expect(appendedMessage.style.animation).toBe('rainbow-color 2s linear infinite');
  });
});
