import React, { useState} from 'react';
import UserContext from './UserContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SudokuView from './Views/SudokuView';
import MenuScreen from './Views/MenuScreen';
import LeaderBoardView from './Views/LeaderBoardView'; 
import Geomap from './Views/GeomapView';
import LoginPage from './Views/LoginPage';
import RegisterPage from './Views/RegisterView';
import SudokuMap from './Views/SudokuMap';
import StatisticsView from './Views/StatisticsView';
import SettingsView from './Views/SettingsScreen';
import Tutorial from './Views/Tutorial';
function App() {
  const [username, setUsername] = useState('');

  return (

    <UserContext.Provider value={{ username, setUsername }}>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/statistics" element={<StatisticsView />} />
          <Route path="/sudokuMap" element={<SudokuMap />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/menu" element={<MenuScreen />} />
          <Route path="/sudoku" element={<SudokuView />} />
          <Route path="/leaderboard" element={<LeaderBoardView/>} />
          <Route path="/geoMap" element={<Geomap />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="/tutorial" element={<Tutorial />} />

        </Routes>
      </Router>    
    
  </UserContext.Provider>
  );
    

}

export default App;
