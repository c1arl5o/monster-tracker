import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import monsterLogo from '../assets/monster-white.png';
import './SignUp.css';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar_url, setAvatarUrl] = useState('');
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          avatar_url,
        },
      },
    });
    if (error) {
      alert(error.message);
    } else {
      setShowConfirmationMessage(true);
      setEmail('');
      setPassword('');
      setName('');
      setAvatarUrl('');
    }
  };

  return (
    <div className="auth-container">
      {showConfirmationMessage ? (
        <div className="confirmation-message">
          <h2>Check your email!</h2>
          <p>We've sent you a confirmation link. Please check your inbox and click the link to verify your account.</p>
          <Link to="/login" className="auth-button">Go to Login</Link>
        </div>
      ) : (
        <>
          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Show these inputs only when signing up, strictly speaking,
              but for now let's just add them to the form */}

            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="auth-input"
            />

            {/* Existing inputs */}
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            />

            <div className="auth-buttons">
              <button type="submit">Sign Up</button>
            </div>
          </form>
          <button className="auth-buttons" onClick={() => navigate('/')}>
            Back
          </button>
        </>
      )}
    </div>
  );
}

export default SignUp;
