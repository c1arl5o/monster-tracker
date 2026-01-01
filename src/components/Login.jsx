import { useState } from 'react';
import { supabase } from '../supabaseClient';
import monsterLogo from '../assets/monster-white.png';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);

  const handleSubmit = async (e, action) => {
    e.preventDefault();
    if (action === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        alert(error.message);
      } else {
        setShowConfirmationMessage(true);
        setEmail('');
        setPassword('');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="auth-container">
      <img src={monsterLogo} alt="Monster Tracker" className="auth-logo" />
      {showConfirmationMessage ? (
        <div className="confirmation-message">
          <h2>Check your email!</h2>
          <p>We've sent you a confirmation link. Please check your inbox and click the link to verify your account.</p>
          <button onClick={() => setShowConfirmationMessage(false)}>Back to Login</button>
        </div>
      ) : (
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
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
            <button onClick={(e) => handleSubmit(e, 'signup')}>Sign Up</button>
            <button onClick={(e) => handleSubmit(e, 'signin')}>Sign In</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Login;
