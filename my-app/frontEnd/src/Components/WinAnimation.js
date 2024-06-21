// Sebastian

import confetti from 'canvas-confetti';
import './CSS/Component.css'

function celebrateWin() {
  // Trigger confetti
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });

  // Show winning message
  const winMessage = document.createElement('div');
  winMessage.textContent = 'Congratulations! You won!';
  winMessage.style.position = 'fixed';
  winMessage.style.left = '50%';
  winMessage.style.top = '50%';
  winMessage.style.transform = 'translate(-50%, -50%)';
  winMessage.style.fontSize = '3rem';
  winMessage.style.fontWeight = 'bold';
  winMessage.style.zIndex = '1000';
  winMessage.style.animation = 'rainbow-color 2s linear infinite';




  document.body.appendChild(winMessage);

  return winMessage;
}

export default celebrateWin;
