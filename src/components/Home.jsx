import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from './Header';
import Tutorial from './Tutorial';
import { feedTexts } from '../data/text';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [showTutorial, setShowTutorial] = useState(!localStorage.getItem('tutorialSeen'));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id);

      const { data: feedData, error: feedError } = await supabase
        .from('main')
        .select(
          `
          which,
          date,
          notes,
          photo_url,
          profiles (
            name
          )
        `
        )
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

  const handleTutorialClose = () => {
    setShowTutorial(false);
  };

  if (loading) {
    return (
      <div className="home-container">
        <div style={{ textAlign: 'center' }}>Laden...</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      {showTutorial && <Tutorial onClose={handleTutorialClose} />}
      <Header title="Feed" />

      <div className="feed-container">
        {feed.map((post, index) => {
          const randomText = feedTexts[Math.floor(Math.random() * feedTexts.length)];
          return (
            <div key={index} className="feed-post">
              <p>
                {randomText(post.profiles?.name || 'Someone', post.which)}
              </p>
              <p className="post-timestamp">{new Date(post.date).toLocaleString()}</p>
              {post.photo_url && (
                <img src={post.photo_url} alt={post.which} className="post-image" />
              )}
              {post.notes && <p className="post-notes">{post.notes}</p>}
            </div>
          );
        })}
      </div>

      <p className="user-info">
        Current User ID: {userId || 'Not logged in'}
      </p>

      <button
        className="new-monster-btn"
        onClick={() => navigate('/new-monster')}
      >
        + Monster eintragen
      </button>
    </div>
  );
}

export default Home;
