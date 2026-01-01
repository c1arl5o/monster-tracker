import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import BurgerMenu from './BurgerMenu';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); // Keep this for debugging if needed

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get current user to have the ID for debugging
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id);

      // Fetch posts for the feed
      const { data: feedData, error: feedError } = await supabase
        .from('main')
        .select(`
          which,
          date,
          notes,
          profiles (
            name
          )
        `)
        .order('date', { ascending: false });

      if (feedError) throw feedError;
      
      setFeed(feedData || []);

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
      <div className="home-header">
        <BurgerMenu />
        <h1 className="home-title">Feed</h1>
      </div>
      
      {/* This is the new feed */}
      <div className="feed-container">
        {feed.map((post, index) => (
          <div key={index} className="feed-post">
            <p>
              <strong>{post.profiles?.name || 'Someone'}</strong> just encountered <strong>{post.which}</strong>.
            </p>
            <p className="post-timestamp">
              {new Date(post.date).toLocaleString()}
            </p>
            {post.notes && <p className="post-notes">{post.notes}</p>}
          </div>
        ))}
      </div>

      <p className="user-info">Current User ID: {userId || 'Not logged in'}</p>

      <button className="new-monster-btn" onClick={() => navigate('/new-monster')}>
        + New Monster
      </button>
    </div>
  );
}

export default Home;
