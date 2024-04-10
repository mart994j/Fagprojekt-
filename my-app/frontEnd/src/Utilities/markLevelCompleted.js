export async function markLevelCompleted(username, levelId) {
  try {
      const response = await fetch('http://localhost:3001/levels/complete', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, level: levelId }),
          
      });
      const data = await response.json();
      if (!response.ok) {
          throw new Error(data.message || 'Could not mark level as completed.');
      }
      console.log(`Level ${levelId} marked as completed for ${username}.`);
  } catch (error) {
      console.error('Error marking level as completed:', error);
  }
}
