import React, { useState} from 'react';
import UserContext from './UserContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SudokuView from './Views/SudokuView';
import MenuScreen from './Views/MenuScreen';
import LeaderBoardView from './Views/LeaderBoardView'; 

function App() {
  const [username, setUsername] = useState('');

  return (

    <UserContext.Provider value={{ username, setUsername }}>
      <Router>
        <Routes>
          <Route path="/" element={<MenuScreen />} />
          <Route path="/sudoku" element={<SudokuView />} />
          <Route path="/leaderboard" element={<LeaderBoardView/>} />
        </Routes>
      </Router>    
    
  </UserContext.Provider>
  );
    

}

export default App;
