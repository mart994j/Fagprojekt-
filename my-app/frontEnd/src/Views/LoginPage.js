import React, { useState } from 'react';
import './CSS/LoginPage.css'; 
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

function LoginPage() {
  let navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUsername: setGlobalUsername } = useUser(); // Brug setUsername fra din UserContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const response = await fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      setGlobalUsername(username); // Opdater kontekstens brugernavn efter en vellykket login
      console.log('Login successful for', username);
      navigate('/menu'); 

    } else {
        const errorData = await response.json(); 
        setError(errorData.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
  <h2>Login</h2>
  {error && <div className="login-error">{error}</div>}
  <div className="input-group">
    <label htmlFor="username">Username</label>
    <input
      id="username"
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      required
    />
  </div>
  <div className="input-group">
    <label htmlFor="password">Password</label>
    <input
      id="password"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
  </div>
  <div className="register-prompt">
      Not a user? <button type="button" onClick={() => navigate('/register')}>Register here</button>
  </div>

  <button type="submit" className="login-button">Log In</button>
</form>

    </div>
  );
}

export default LoginPage;
