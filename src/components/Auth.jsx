import React from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">Welcome to Monster Tracker</h2>
        <div className="auth-buttons">
          <Link to="/signup" className="auth-button signup">Sign Up</Link>
          <Link to="/login" className="auth-button login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
