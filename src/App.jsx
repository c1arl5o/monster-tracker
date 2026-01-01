import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';
import Login from './components/Login';
import Home from './components/Home';

function App() {
  const [session, setSession] = useState(null);

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

  return (
    <div className="app-container">
      {!session ? <Login /> : <Home />}
    </div>
  );
}

export default App;
