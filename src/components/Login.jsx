import { useState } from 'react';
import { supabase } from '../supabaseClient';
import monsterLogo from '../assets/monster-white.png';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [sec_name, setSecName] = useState('');
  const [fav_monster, setFavMonster] = useState('');
  const [avatar_url, setAvatarUrl] = useState('');
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);

  const handleSubmit = async (e, action) => {
    e.preventDefault();
    if (action === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            sec_name,
            fav_monster,
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
        setSecName('');
        setFavMonster('');
        setAvatarUrl('');
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
          {/* Show these inputs only when signing up, strictly speaking, 
              but for now let's just add them to the form */}
          
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="auth-input"
          />
          <input
            type="text"
            placeholder="Second Name"
            value={sec_name}
            onChange={(e) => setSecName(e.target.value)}
            className="auth-input"
          />
          <input
            type="text"
            placeholder="Favorite Monster"
            value={fav_monster}
            onChange={(e) => setFavMonster(e.target.value)}
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
            <button onClick={(e) => handleSubmit(e, 'signup')}>Sign Up</button>
            <button onClick={(e) => handleSubmit(e, 'signin')}>Sign In</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Login;
