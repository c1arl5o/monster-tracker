import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import BurgerMenu from './BurgerMenu';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [allRows, setAllRows] = useState([]);
  const [userRows, setUserRows] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id);

      // Fetch all rows from main table
      const { data: allData, error: allError } = await supabase
        .from('main')
        .select('*');

      if (allError) throw allError;
      setAllRows(allData || []);

      // Fetch rows matching user ID
      if (user?.id) {
        const { data: userData, error: userError } = await supabase
          .from('main')
          .select('*')
          .eq('id', user.id);

        if (userError) throw userError;
        setUserRows(userData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="home-container"><div style={{ textAlign: 'center' }}>Loading...</div></div>;
  }

  return (
    <div className="home-container">
      <BurgerMenu />

      <h1 className="home-title">Monster Tracker</h1>
      <p className="user-info">Current User ID: {userId || 'Not logged in'}</p>

      <div className="data-section">
        <h2>All Rows from 'main' table ({allRows.length})</h2>
        <pre>
          {JSON.stringify(allRows, null, 2)}
        </pre>
      </div>

      <div className="data-section">
        <h2>Rows where id matches user ID ({userRows.length})</h2>
        <pre>
          {JSON.stringify(userRows, null, 2)}
        </pre>
      </div>

      <button className="new-monster-btn" onClick={() => navigate('/new-monster')}>
        + New Monster
      </button>
    </div>
  );
}

export default Home;
