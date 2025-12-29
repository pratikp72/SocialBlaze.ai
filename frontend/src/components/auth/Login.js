import React from 'react';
import { FaFire } from 'react-icons/fa';

const Login = ({ loginData, setLoginData, handleLogin, loading, message }) => {
  return (
    <div className="App login-mode">
      <div className="login-container">
        <div className="login-header">
          <div className="logo-circle">
            <FaFire className="logo-icon" />
          </div>
          <h1>Welcome Back</h1>
          <p>Connect your Bluesky account to manage your posts</p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="card login-card">
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="identifier">Bluesky Handle</label>
              <input
                type="text"
                id="identifier"
                placeholder="e.g. username.bsky.social"
                value={loginData.identifier}
                onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">App Password</label>
              <input
                type="password"
                id="password"
                placeholder="••••••••••••••••"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
              <small className="helper-text">Use an App Password to connect with Blue Sky</small>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary full-width">
              {loading ? 'Connecting...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
