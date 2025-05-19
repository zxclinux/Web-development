import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/user';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginUser({ email, password });
      localStorage.setItem('token', data.token);
      navigate('/users');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="full-height">
      <div className="container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn--primary">Sign In</button>
          <p className="text-link">
            Don't have an account? <a href="/register">Register</a>
          </p>
          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;