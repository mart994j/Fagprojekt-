const { SudokuGenerator } = require('./SudokuGenerator');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

// Opdateret til at bruge SudokuGenerator til at generere brættet
app.get('/generate', (req, res) => {
  const board = SudokuGenerator.generateBoard();
  SudokuGenerator.removeNumbers(board, 10); // Du kan justere antallet af huller efter behov
  res.json({ board });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
});