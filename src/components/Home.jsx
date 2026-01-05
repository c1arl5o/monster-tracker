import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Header from './Header';
import Tutorial from './Tutorial';
import Admin from './Admin';
import Comments from './Comments';
import { feedTexts } from '../data/text';
import './Home.css';

function Home() {
  const navigate = useNavigate();
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [showTutorial, setShowTutorial] = useState(!localStorage.getItem('tutorialSeen'));
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  useEffect(() => {
    fetchData();
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      if (user.user_metadata && user.user_metadata.role === 'admin') {
        setIsAdmin(true);
      }
    }
  }

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch user posts
      const { data: userPosts, error: userPostsError } = await supabase.rpc('get_feed_posts');
      if (userPostsError) throw userPostsError;

      const typedUserPosts = userPosts.map(p => ({ ...p, post_type: 'user_post' }));

      // Fetch custom posts
      const { data: customPostsData, error: customPostsError } = await supabase
        .from('custom_posts')
        .select('id, created_at, photo_url, text');
      if (customPostsError) throw customPostsError;

      const typedCustomPosts = customPostsData.map(p => ({
        ...p,
        post_type: 'custom_post',
        date: p.created_at, // aliasing for sorting
        notes: p.text, // aliasing for rendering
      }));

      // Combine and sort
      const combinedFeed = [...typedUserPosts, ...typedCustomPosts].sort((a, b) => new Date(b.date) - new Date(a.date));

      setFeed(combinedFeed);
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

  const handleAdminModalClose = () => {
    setShowAdminModal(false);
    fetchData(); // Refresh feed after admin action
  }

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
      {showAdminModal && <Admin onClose={handleAdminModalClose} />}
      <Header title="Feed" isAdmin={isAdmin} onAdminClick={() => setShowAdminModal(true)} />

      <div className="feed-container">
        {feed.map((post) => {
          if (post.post_type === 'user_post') {
            const randomText = feedTexts[Math.floor(Math.random() * feedTexts.length)];
            return (
              <div key={`user-${post.id}`} className="feed-post">
                <p>
                  {randomText(post.user_name || 'Someone', post.which)}
                </p>
                <p className="post-timestamp">{new Date(post.date).toLocaleString()}</p>
                {post.photo_url && (
                  <img src={post.photo_url} alt={post.which} className="post-image" />
                )}
                {post.notes && <p className="post-notes">{post.notes}</p>}

                <Comments postId={post.id} userId={userId} />
              </div>
            );
          } else if (post.post_type === 'custom_post') {
            return (
              <div key={`custom-${post.id}`} className="feed-post custom-post">
                {post.notes && <p className="post-notes">{post.notes}</p>}
                {post.photo_url && (
                    <img src={post.photo_url} alt="Custom Post" className="post-image" />
                )}
                <p className="post-timestamp">{new Date(post.date).toLocaleString()}</p>
              </div>
            );
          }
          return null;
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
