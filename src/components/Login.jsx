import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import monsterLogo from '../assets/monster-white.png';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Deine E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Dein Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />
        <div className="auth-buttons">
          <button type="submit" className="auth-button">Sign In</button>
        </div>
      </form>
      <button className="auth-buttons" onClick={() => navigate('/')}>
        Zurück
      </button>
    </div>
  );
}

export default Login;
