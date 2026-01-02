import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub } from 'react-icons/fa';
import './Auth.css';
import monsterLogo from '../assets/monster-white.png';

const Auth = () => {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <img src={monsterLogo} alt="Monster Tracker" className="auth-logo" />
        <div className="auth-buttons">
          <Link to="/login" className="auth-button login">Login</Link>
          <Link to="/signup" className="auth-button signup">Sign Up</Link>
        </div>
      </div>
      Made with 💟 by Carlo<br /><br />
      <FaGithub style={{ verticalAlign: 'middle', marginRight: '5px' }} />
      <a href="https://github.com/c1arl5o" target="_blank" rel="noopener noreferrer">c1arl5o</a>
    </div>
  );
};

export default Auth;
