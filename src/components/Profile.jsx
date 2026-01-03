import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import './Profile.css';
import { supabase } from '../supabaseClient';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function Profile() {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <Header title="Profile / Statistics" />
      <div className="profile-content">
        <h2>Your Profile and Statistics</h2>
        {loading ? (
          <p>Loading chart...</p>
        ) : chartData && chartData.labels.length > 0 ? (
          <div className="chart-container">
            <Pie data={chartData} />
          </div>
        ) : (
          <p>No monster data found to display a chart.</p>
        )}
        <button onClick={() => navigate('/')}>Go to Home</button>
      </div>
    </div>
  );
}

export default Profile;
