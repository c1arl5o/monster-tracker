import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Home.css';

function Home() {
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

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <div className="home-container">Loading...</div>;
  }

  return (
    <div className="home-container">
      <h1 className="home-title">Monster Tracker</h1>
      <p>Current User ID: {userId}</p>
      
      <button className="sign-out-button" onClick={handleSignOut}>
        Sign Out
      </button>

      <div style={{ marginTop: '2rem' }}>
        <h2>All Rows from 'main' table ({allRows.length})</h2>
        <pre style={{ background: '#f4f4f4', padding: '1rem', overflow: 'auto' }}>
          {JSON.stringify(allRows, null, 2)}
        </pre>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Rows where id matches user ID ({userRows.length})</h2>
        <pre style={{ background: '#f4f4f4', padding: '1rem', overflow: 'auto' }}>
          {JSON.stringify(userRows, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default Home;
