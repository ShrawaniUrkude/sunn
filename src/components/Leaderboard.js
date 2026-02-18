import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/global.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/points/leaderboard`);
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="container" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <h1>🏆 Top Contributors</h1>
      <p>Celebrating our most active community members</p>

      <div className="card" style={{ marginTop: '2rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ecf0f1' }}>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Rank</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Name</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold' }}>Role</th>
              <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold' }}>Points</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr key={user._id} style={{ borderBottom: '1px solid #ecf0f1' }}>
                <td style={{ padding: '1rem' }}>
                  <span style={{ fontSize: '1.3rem' }}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </span>
                </td>
                <td style={{ padding: '1rem', fontWeight: '500' }}>
                  {user.organizationName || user.name}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span className="badge badge-info">{user.role}</span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 'bold', color: '#667eea', fontSize: '1.1rem' }}>
                  {user.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
