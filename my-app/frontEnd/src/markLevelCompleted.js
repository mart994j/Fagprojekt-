// I en separat fil, f.eks. utils.js
export function markLevelCompleted(levelId) {
    const completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [];
    if (!completedLevels.includes(levelId)) {
      completedLevels.push(levelId);
      localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
    }
  }
  