import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';
import monsterLogo from './assets/monster-white.png';

function App() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e, action) => {
    e.preventDefault();
    if (action === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        alert(error.message);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert(error.message);
      }
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
    }
  };

  if (!session) {
    return (
      <div className="auth-container">
        <img src={monsterLogo} alt="Monster Tracker" className="auth-logo" />
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
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Hello World</h1>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}

export default App;
