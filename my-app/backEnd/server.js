const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { SudokuGenerator } = require('./SudokuGenerator');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const leaderboard = [];
const savedGames = [];
const users = {
  'admin': { 
    password: 'admin', 
    completedLevels: [], 
    stats: {
      gamesPlayed: 0,
      gamesWon: 0,
      bestTime: Infinity, // Use Infinity for times initially since we want to minimize this
      worstTime: 0,
      averageTime: 0
    }
  },
};
// Increment games played for a user
app.post('/stats/gamesPlayed', (req, res) => {
  const { username, gamesPlayed} = req.body;
  if (!users[username]) {
    return res.status(404).json({ message: 'User not found' });
  }
  const userStats = users[username].stats;
  userStats.gamesPlayed += gamesPlayed;
  
  res.json({ message: 'Statistics updated', stats: userStats.gamesPlayed });
});


// Update user statistics
app.post('/stats/update', (req, res) => {
  const { username, gamesWon, time } = req.body;
  if (!users[username]) {
    return res.status(404).json({ message: 'User not found' });
  }
  const userStats = users[username].stats;
  userStats.gamesWon += gamesWon;
  userStats.bestTime = Math.min(userStats.bestTime === Infinity ? time : userStats.bestTime, time);
  userStats.worstTime = Math.max(userStats.worstTime, time);
  if (gamesWon > 0) {
    userStats.averageTime = userStats.gamesWon === 1 ? time : ((userStats.averageTime * (userStats.gamesWon - 1) + time) / userStats.gamesWon);
  }
  res.json({ message: 'Statistics updated', stats: userStats });
});


// Retrieve user statistics to the StatisticsView
app.get('/stats/:username', (req, res) => {
  const { username } = req.params;
  
  if (!users[username]) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(users[username].stats);
});


app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users[username]) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  users[username] = { password, completedLevels: [], stats: { gamesPlayed: 0, gamesWon: 0, bestTime: Infinity, worstTime: 0, averageTime: 0 }};
  res.json({ message: 'User registered successfully' });
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username].password === password) { // Changed to access password correctly
    res.json('Login successful');
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});



app.post('/save', (req, res) => {
  const { username, board, time } = req.body;
  if (!username || !board || time == null) {
    return res.status(400).json({ message: 'Username, board, and time are required' });
  }

  const existingIndex = savedGames.findIndex(game => game.username === username);
  if (existingIndex >= 0) {
    savedGames[existingIndex] = { username, board, time};
  } else {
    savedGames.push({ username, board, time});
  }
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
  const diff = parseInt(req.query.difficulty, 10) || 2;

  let numbersToRemove;
  switch(diff) {
    case 1: // Easy
      numbersToRemove = 5;
      break;
    case 2: // Medium
      numbersToRemove = 10;
      break;
    case 3: // Hard
      numbersToRemove = 20;
      break;
    default:
      numbersToRemove = 10; 
  }
  // Tjek at størrelsen er gyldig (du kan tilføje yderligere validering baseret på dine behov)
  if (!Number.isInteger(Math.sqrt(size))) { // Tjekker om størrelsen er et kvadrattal
    return res.status(400).json({ message: 'Invalid board size' });
  }
  console.log('Generating board of size', size);
  // Antager at SudokuGenerator.generateBoard kan acceptere en størrelse parameter
  const board = SudokuGenerator.generateBoard(size);
  // Tilpas fjernelse af tal baseret på størrelsen, om nødvendigt
  SudokuGenerator.removeNumbers(board, numbersToRemove); // Denne linje skal måske tilpasses
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



app.post('/levels/complete', (req, res) => {
  const { username, level } = req.body;
  if (!users[username]) {
    return res.status(404).json({ message: 'User not found' });
  }
  if (!users[username].completedLevels.includes(level)) {
    users[username].completedLevels.push(level);
  }
  res.json({ message: 'Level completed', completedLevels: users[username].completedLevels });
});

app.get('/levels/completed', (req, res) => {
  const { username } = req.query;
  if (!users[username]) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ completedLevels: users[username].completedLevels });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

