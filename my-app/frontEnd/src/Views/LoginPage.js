import React, { useState } from 'react';
import './CSS/LoginPage.css'; 
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';

function LoginPage() {
  let navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUsername: setGlobalUsername } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem(username);

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.password === password) {
          // Password matches
          setGlobalUsername(username); 
          console.log('Login successful for', username);
          navigate('/menu');
        } else {
          setError('Incorrect password');
        }
      } catch (e) {
        setError('Stored user data is corrupted');
      }
    } else {
      setError('Username not registered');
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
