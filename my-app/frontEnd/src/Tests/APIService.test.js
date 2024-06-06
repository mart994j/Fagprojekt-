// npm install --save-dev jest-fetch-mock

import ApiService from '../Utilities/APIService.js';
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

describe('ApiService', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should increment games played', async () => {
    fetch.mockResponseOnce(JSON.stringify({ success: true }));

    const response = await ApiService.incrementGamesPlayed('testuser');
    expect(response).toEqual({ success: true });
    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/stats/gamesPlayed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser', gamesPlayed: 1 }),
    });
  });

  it('should update stats', async () => {
    fetch.mockResponseOnce(JSON.stringify({ success: true }));

    const response = await ApiService.updateStats('testuser', 5, 120, 'hard');
    expect(response).toEqual({ success: true });
    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/stats/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser', gamesWon: 5, time: 120, diff: 'hard' }),
    });
  });

  it('should save game', async () => {
    fetch.mockResponseOnce(JSON.stringify({ success: true }));

    const response = await ApiService.saveGame('testuser', [[0, 1], [1, 0]], 150);
    expect(response).toEqual({ success: true });
    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'testuser', board: [[0, 1], [1, 0]], time: 150 }),
    });
  });

  it('should fetch hints', async () => {
    fetch.mockResponseOnce(JSON.stringify({ hints: ['hint1', 'hint2'] }));

    const hints = await ApiService.fetchHints();
    expect(hints).toEqual(['hint1', 'hint2']);
    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/hints');
  });

  it('should handle fetch errors', async () => {
    fetch.mockRejectOnce(new Error('Network response was not ok'));

    await expect(ApiService.incrementGamesPlayed('testuser')).rejects.toThrow('Network response was not ok');
  });
});
