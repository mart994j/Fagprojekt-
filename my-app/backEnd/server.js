const express = require('express');
const cors = require('cors');
const { SudokuGenerator } = require('./SudokuGenerator');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // Til at parse JSON bodies
const leaderboard = []; // Simpel in-memory "database" for leaderboard

app.get('/generate', (req, res) => {
  //console.log('Generate endpoint was called');
  const board = SudokuGenerator.generateBoard();
  SudokuGenerator.removeNumbers(board, 10); // Juster antallet af huller efter behov
  res.json({ board });
});

// Endpoint til at modtage brugernavne og score/tid (for demonstration gemmes kun brugernavn)
app.post('/submit', (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }
  // Tilføj brugernavn til "leaderboard". I praksis vil du inkludere score/tid eller anden relevant data.
  leaderboard.push({ username });
  console.log('Updated leaderboard:', leaderboard);
  res.json({ message: 'Username added to leaderboard', leaderboard });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
