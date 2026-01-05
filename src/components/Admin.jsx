import { useState } from 'react';
import { supabase } from '../supabaseClient';
import './Admin.css';

function Admin({ onClose }) {
  const [text, setText] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const { error } = await supabase
        .from('custom_posts')
        .insert([{ text, photo_url: photoUrl }]);

      if (error) {
        throw error;
      }
      setMessage('Custom post created successfully!');
      setText('');
      setPhotoUrl('');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-modal">
      <div className="admin-modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>Create Custom Post</h2>
        <form onSubmit={handleCreatePost}>
          <textarea
            placeholder="Post text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="text"
            placeholder="Photo URL"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default Admin;