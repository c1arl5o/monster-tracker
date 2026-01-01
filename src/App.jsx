import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './App.css';
import Auth from './components/Auth';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Home from './components/Home';
import AuthCallback from './AuthCallback';
import NewMonster from './components/NewMonster';
import Leaderboard from './components/Leaderboard';

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
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={!session ? <Auth /> : <Navigate to="/home" />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={session ? <Home /> : <Navigate to="/" />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/new-monster" element={session ? <NewMonster /> : <Navigate to="/" />} />
          <Route path="/leaderboard" element={session ? <Leaderboard /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
