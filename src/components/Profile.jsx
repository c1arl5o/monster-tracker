import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './Profile.css';
import { supabase } from '../supabaseClient';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { monsters } from '../data/monsters';

ChartJS.register(ArcElement, Tooltip, Legend);

function Profile() {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favoriteMonster, setFavoriteMonster] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from('main')
            .select('which')
            .eq('user_id', user.id);

          if (error) {
            throw error;
          }

          const flavorCounts = data.reduce((acc, { which }) => {
            acc[which] = (acc[which] || 0) + 1;
            return acc;
          }, {});

          const labels = Object.keys(flavorCounts);
          const chartValues = Object.values(flavorCounts);

          // Find favorite monster
          const maxCount = Math.max(...chartValues);
          const favorites = labels.filter(label => flavorCounts[label] === maxCount);
          
          if (favorites.length === 1) {
            const monsterData = monsters.find(m => m.name === favorites[0]);
            setFavoriteMonster({
              name: favorites[0],
              count: maxCount,
              image: monsterData?.image
            });
          } else {
            setFavoriteMonster(null);
          }

          setChartData({
            labels,
            datasets: [
              {
                label: ' # of Monsters',
                data: chartValues,
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
              },
            ],
          });
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="profile-container">
      <Header title="Meine Stats" />
      <div className="profile-content">
        {loading ? (
          <p>Lade Diagramm...</p>
        ) : chartData && chartData.labels.length > 0 ? (
          <>
            <div className="chart-container">
              <div className="favorite-label">Flavor Aufteilung</div>
              <Pie data={chartData} />
            </div>
            <div className="favorite-container">
              <div className="favorite-label">Mein Lieblingsmonster</div>
              {favoriteMonster ? (
                <div className="favorite-content">
                  {favoriteMonster.image && (
                    <img 
                      src={favoriteMonster.image} 
                      alt={favoriteMonster.name}
                      className="favorite-image"
                    />
                  )}
                  <div className="favorite-text">
                    <div className="favorite-name">{favoriteMonster.name}</div>
                    <div className="favorite-count">{favoriteMonster.count}x getrunken</div>
                  </div>
                </div>
              ) : (
                <div className="no-favorite">Du hast keinen eindeutigen Favoriten</div>
              )}
            </div>
            <div className="metrics-container">
              <div className="metric-item">
                <div className="metric-label">Koffein konsumiert</div>
                <div className="metric-value">
                  {chartData.datasets[0].data.reduce((a, b) => a + b, 0) * 160}
                  <span className="metric-unit"> mg</span>
                </div>
                <div className="metric-subtitle">Irgendwie muss man ja das Leben aushalten</div>
              </div>
              <div className="metric-item">
                <div className="metric-label">Getrunkene Menge</div>
                <div className="metric-value">
                  {chartData.datasets[0].data.reduce((a, b) => a + b, 0) * 0.5}
                  <span className="metric-unit"> Liter</span>
                </div>
                <div className="metric-subtitle">So viel Liter habe ich getrunken</div>
              </div>
            </div>
          </>
        ) : (
          <p>Keine Monster-Daten gefunden, um ein Diagramm anzuzeigen.</p>
        )}
        <button onClick={() => navigate('/')}>Zur Startseite</button>
      </div>
    </div>
  );
}

export default Profile;
