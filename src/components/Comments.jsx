import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Comments.css';

function Comments({ postId, userId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);

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
      <h4>Comments</h4>
      {loading && <p>Loading comments...</p>}
      {error && <p className="error-message">Error: {error}</p>}
      
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p><strong>{comment.user_name || 'Someone'}:</strong> {comment.content}</p>
            <span className="comment-timestamp">{new Date(comment.created_at).toLocaleString()}</span>
          </div>
        ))}
        {comments.length === 0 && !loading && <p>No comments yet.</p>}
      </div>

      {userId && (
        <form onSubmit={handleAddComment} className="comment-form">
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit">Post</button>
        </form>
      )}
    </div>
  );
}

export default Comments;