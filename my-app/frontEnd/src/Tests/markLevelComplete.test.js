// src/Tests/markLevelCompleted.test.js
import { markLevelCompleted } from '../Utilities/markLevelCompleted';

// Mock the fetch function globally
global.fetch = jest.fn();

describe('markLevelCompleted', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should mark level as completed and log success message', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Level marked as completed' })
    });

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await markLevelCompleted('testuser', 'level1');

    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/levels/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: 'testuser', level: 'level1' }),
    });
    expect(consoleLogSpy).toHaveBeenCalledWith('Level level1 marked as completed for testuser.');

    consoleLogSpy.mockRestore();
  });

  it('should throw an error and log error message if response is not ok', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Failed to mark level as completed' })
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await markLevelCompleted('testuser', 'level1');

    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/levels/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: 'testuser', level: 'level1' }),
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error marking level as completed:', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });

  it('should log error message if fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Fetch error'));

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await markLevelCompleted('testuser', 'level1');

    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/levels/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: 'testuser', level: 'level1' }),
    });
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error marking level as completed:', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });
});
