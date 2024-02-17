const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { SudokuGenerator } = require('./SudokuGenerator');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const leaderboard = [];
const savedGames = [];
const users = {
  'gg': 'gg',
}

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (users[username] && users[username] === password) {
    // For simplicity, returning a dummy token
    res.json({ token: 'dummy-jwt-token' });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});


app.post('/save', (req, res) => {
  const { username, board, time } = req.body;
  if (!username || !board || time == null) {
    return res.status(400).json({ message: 'Username, board, and time are required' });
  }

  // Check if there's already a saved game for the user
  const existingIndex = savedGames.findIndex(game => game.username === username);

  if (existingIndex >= 0) {
    // Update the existing saved game
    savedGames[existingIndex] = { username, board, time: Date.now() };
    console.log(`Game updated for user: ${username}`);
  } else {
    // Add a new saved game
    savedGames.push({ username, board, time: Date.now() }); // Add a timestamp for uniqueness
    console.log(`Game saved for user: ${username}`);
  }

  console.log('Current saved games:', savedGames);
  res.json({ message: 'Game saved successfully' });
});

app.get('/load', (req, res) => {
  console.log('Loading game:', savedGames);
  const { username } = req.query;
  if (!username) {
  return res.status(400).json({ message: 'Username is required' });
  }

  // Find the most recent saved game for the user
  const game = [...savedGames].reverse().find(game => game.username === username);
  if (!game) {
    return res.status(404).json({ message: 'No saved game found for the user' });
  }
  console.log('Loaded game:', game);
  res.json({ board: game.board, time: game.time });
});

app.get('/generate', (req, res) => {
  // Hent størrelsen fra query parameteret, eller brug en standardværdi hvis det ikke er angivet
  const size = parseInt(req.query.size, 10) || 9; // Standard størrelse er 9x9 hvis ikke angivet

  // Tjek at størrelsen er gyldig (du kan tilføje yderligere validering baseret på dine behov)
  if (![9, 16, 25].includes(size)) { // Eksempel på validering for almindelige Sudoku størrelser
    return res.status(400).json({ message: 'Invalid board size' });
  }
  console.log('Generating board of size', size);
  // Antager at SudokuGenerator.generateBoard kan acceptere en størrelse parameter
  const board = SudokuGenerator.generateBoard(size);
  // Tilpas fjernelse af tal baseret på størrelsen, om nødvendigt
  SudokuGenerator.removeNumbers(board, 1); // Denne linje skal måske tilpasses
  console.log('Generated board:', board);
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