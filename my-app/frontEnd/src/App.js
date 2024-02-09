import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SudokuView from './SudokuView';
import MenuScreen from './MenuScreen'; // Husk at oprette denne fil

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MenuScreen />} />
        <Route path="/sudoku" element={<SudokuView />} />
      </Routes>
    </Router>
  );
}

export default App;
