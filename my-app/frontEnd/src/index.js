import React from 'react';
import ReactDOM from 'react-dom/client';
import './Views/CSS/index.css';
import App from './App'; 
import reportWebVitals from './reportWebVitals';
import { AudioProvider } from './Utilities/AudioContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AudioProvider>
    <App /> 
    </AudioProvider>
  </React.StrictMode>
);

reportWebVitals();
