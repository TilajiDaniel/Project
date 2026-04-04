import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import '../styles/Statisztika.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Statisztika = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const authToken = localStorage.getItem('token'); 

  useEffect(() => {
    fetchWeeklyStats();
  }, []);
// Function to fetch weekly statistics from the API and format it for the charts
  const fetchWeeklyStats = async () => {
    try {
      const response = await fetch('https://localhost:7133/api/Registry/weekly-stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error fetching data');
      }

      const result = await response.json();
      console.log('Raw data:', result);

      const formattedData = result.map(item => ({
        name: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
        consumedCalories: item.consumedCalories,
        targetCalories: item.targetCalories,
        consumedWater: item.consumedWater,
        targetWater: item.targetWater
      }));

      setData(formattedData);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Layout>
      <div style={{ width: '100%', height: 'auto', padding: '20px' }}>
        <h2 style={{ textAlign: 'center' }}>Weekly Calorie Consumption</h2>
        <div style={{ width: '100%', height: 300, marginBottom: '40px' }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="consumedCalories" stroke="#8884d8" name="Consumed Calories" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="targetCalories" stroke="#82ca9d" name="Target Calories" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <h2 style={{ textAlign: 'center' }}>Weekly Water Intake (ml)</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="consumedWater" stroke="#8884d8" name="Consumed Water" />
              <Line type="monotone" dataKey="targetWater" stroke="#82ca9d" name="Target Water" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
};

export { Statisztika };
