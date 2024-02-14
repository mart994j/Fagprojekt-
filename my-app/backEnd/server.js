const express = require('express');
const cors = require('cors');
const { SudokuGenerator } = require('./SudokuGenerator');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
const leaderboard = [];

app.get('/generate', (req, res) => {
  // Hent størrelsen fra query parameteret, eller brug en standardværdi hvis det ikke er angivet
  const size = parseInt(req.query.size, 10) || 9; // Standard størrelse er 9x9 hvis ikke angivet

  // Tjek at størrelsen er gyldig (du kan tilføje yderligere validering baseret på dine behov)
  if (![9, 16, 25].includes(size)) { // Eksempel på validering for almindelige Sudoku størrelser
    return res.status(400).json({ message: 'Invalid board size' });
  }

  // Antager at SudokuGenerator.generateBoard kan acceptere en størrelse parameter
  const board = SudokuGenerator.generateBoard(size);
  // Tilpas fjernelse af tal baseret på størrelsen, om nødvendigt
  SudokuGenerator.removeNumbers(board, 1); // Denne linje skal måske tilpasses

  res.json({ board });
});

app.post('/submit', (req, res) => {
  const { username, time, location } = req.body;
  if (!username || time == null || !location) {
    return res.status(400).json({ message: 'Username, time, and location are required' });
  }
  leaderboard.push({ username, time, location });
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
