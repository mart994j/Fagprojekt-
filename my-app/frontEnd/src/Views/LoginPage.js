import React, { useState } from 'react';
import './CSS/LoginPage.css'; 
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  let navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
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
    Not a user? <button onClick={() => navigate('/register')}>Register here</button>
  </div>
  <button type="submit" className="login-button">Log In</button>
</form>

    </div>
  );
}

export default LoginPage;
