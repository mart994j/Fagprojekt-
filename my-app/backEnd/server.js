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
  const { username, time } = req.body;
  if (!username || time == null) {
    return res.status(400).json({ message: 'Username and time are required' });
  }
  leaderboard.push({ username, time });
  leaderboard.sort((a, b) => a.time - b.time);
  console.log('Updated leaderboard:', leaderboard);
  res.json({ message: 'time and username submitted successfully', leaderboard });
});

app.get('/leaderboard', (req, res) => {
  res.json(leaderboard);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
