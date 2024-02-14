import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [n, setN] = useState(9); // Standardværdi for n er sat til 9 for et 9x9 Sudoku bræt


  const value = {
    username,
    setUsername,
    n,
    setN,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);

export default UserContext;
