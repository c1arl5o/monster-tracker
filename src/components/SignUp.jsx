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
          <h2>Check deine Mail</h2>
          <p>Ich habe dir einen Bestätigungslink geschickt. Bitte überprüfe deine Mails und klicke auf den Link, um dein Konto zu verifizieren.</p>
          <Link to="/login" className="auth-button">Zum Login</Link>
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
              <button type="submit">Registrieren</button>
              <button className="auth-button" onClick={() => navigate('/')}>
        Zurück
      </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default SignUp;
