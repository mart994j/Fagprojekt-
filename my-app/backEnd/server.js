const express = require('express');
const cors = require('cors');
const { SudokuGenerator } = require('./SudokuGenerator');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
const leaderboard = [];

app.get('/generate', (req, res) => {
  const board = SudokuGenerator.generateBoard();
  SudokuGenerator.removeNumbers(board, 1);
  res.json({ board });
});

app.post('/submit', (req, res) => {
  const { username, time, location } = req.body; // Modtag lokationsdata
  if (!username || time == null || !location) { // Tjek også for lokationsdata
    return res.status(400).json({ message: 'Username, time, and location are required' });
  }
  leaderboard.push({ username, time, location }); // Gem lokationsdata sammen med de andre oplysninger
  leaderboard.sort((a, b) => a.time - b.time);
  console.log('Updated leaderboard:', leaderboard);
  res.json({ message: 'Username, time, and location submitted successfully', leaderboard });
});


app.get('/leaderboard', (req, res) => {
  res.json(leaderboard);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
