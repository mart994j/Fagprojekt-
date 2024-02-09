import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App'; // Ændr dette til at importere App i stedet for SudokuView direkte
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App /> {/* Brug App komponenten her, som indeholder din routing */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
