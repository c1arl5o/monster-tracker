import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();

  return (
    <div className="profile-container">
      <Header title="Profile / Statistics" />
      <div className="profile-content">
        <h2>Your Profile and Statistics</h2>
        <p>This is a placeholder for your profile information and game statistics.</p>
        <button onClick={() => navigate('/')}>Go to Home</button>
      </div>
    </div>
  );
}

export default Profile;
