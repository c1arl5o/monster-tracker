import React, { useState, useEffect } from 'react';
import Header from './Header';
import { supabase } from '../supabaseClient';
import './Leaderboard.css';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('main')
        .select('user_id, profiles(name)');

      if (error) throw error;

      const counts = data.reduce((acc, { user_id, profiles }) => {
        if (!user_id) return acc; // Skip entries without a user_id
        if (acc[user_id]) {
          acc[user_id].count++;
        } else {
          acc[user_id] = {
            count: 1,
            name: profiles ? profiles.name : 'Anonymous',
          };
        }
        return acc;
      }, {});

      const sortedLeaderboard = Object.values(counts).sort(
        (a, b) => b.count - a.count
      );

      setLeaderboard(sortedLeaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <Header title="Leaderboard" />
        <div className="loading-container">Loading...</div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <Header title="Leaderboard" />
      <div className="leaderboard-content">
        {leaderboard.map((user, index) => {
          const rank = index + 1;
          const rankClass = rank <= 3 ? `rank-${rank}` : '';
          
          return (
            <div key={index} className={`leaderboard-item ${rankClass}`}>
              <div className="leaderboard-rank">
                {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
              </div>
              <div className="leaderboard-info">
                <span className="leaderboard-name">{user.name}</span>
                <span>
                  <span className="leaderboard-count">{user.count}</span>
                  <span className="leaderboard-count-label">monsters</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Leaderboard;
