class ApiService {
  baseUrl = "http://localhost:3001";
  isFetching = false;


  async incrementGamesPlayed(username) {
    const response = await fetch(`${this.baseUrl}/stats/gamesPlayed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, gamesPlayed: 1 }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  }

  async updateStats(username, gamesWon, time, diff) {
    const response = await fetch(`${this.baseUrl}/stats/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, gamesWon, time, diff }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  }

  async saveGame(username, board, time) {
    const response = await fetch(`${this.baseUrl}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, board, time }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  }

  async fetchHints() {
    const response = await fetch(`${this.baseUrl}/hints`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.hints; 
  }

}
export default new ApiService();
