import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Comments.css';

function Comments({ postId, userId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_comments_for_post', { p_post_id: postId });
      if (error) throw error;
      setComments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert([{ post_id: postId, user_id: userId, content: newComment }]);
      
      if (error) throw error;
      
      setNewComment('');
      fetchComments(); // Refresh comments
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="comments-section">
      {loading && <p>Loading comments...</p>}
      {error && <p className="error-message">Error: {error}</p>}
      
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p><strong>{comment.user_name || 'Someone'}:</strong> {comment.content}</p>
            <span className="comment-timestamp">{new Date(comment.created_at).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</span>
          </div>
        ))}
      </div>

      {userId && (
        <form onSubmit={handleAddComment} className="comment-form">
          <input
            type="text"
            placeholder="Schreibe einen Kommentar..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
          />
          {(isInputFocused || newComment) && <button type="submit">Send</button>}
        </form>
      )}
    </div>
  );
}

export default Comments;