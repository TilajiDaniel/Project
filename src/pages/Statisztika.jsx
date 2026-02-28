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
        throw new Error('Hiba történt az adatok lekérésekor');
      }

      const result = await response.json();
      console.log('Nyers adatok:', result);

      // 2. Adatok formázása a Recharts számára
      const formattedData = result.map(item => ({
        // Dátum formázása pl. "H" (Hétfő), "K" (Kedd)
        name: new Date(item.date).toLocaleDateString('hu-HU', { weekday: 'short' }).replace('.', ''),
        bevittKalória: item.consumedCalories,
        kalóriaCél: item.targetCalories,
        bevittViz: item.consumedWater,
        vizCél: item.targetWater
      }));

      setData(formattedData);
      setLoading(false);
    } catch (err) {
      console.error('Hiba:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div>Betöltés...</div>;
  if (error) return <div>Hiba: {error}</div>;

  return (
    <Layout> {/* Feltételezve, hogy a Layout komponenst használni szeretnéd */}
      <div style={{ width: '100%', height: 'auto', padding: '20px' }}>
        <h2 style={{ textAlign: 'center' }}>Heti Kalória Fogyasztás</h2>
        <div style={{ width: '100%', height: 300, marginBottom: '40px' }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="bevittKalória" stroke="#8884d8" name="Bevitt Kalória" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="kalóriaCél" stroke="#82ca9d" name="Cél Kalória" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <h2 style={{ textAlign: 'center' }}>Heti Vízfogyasztás (ml)</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="bevittViz" stroke="#8884d8" name="Bevitt Víz" />
              <Line type="monotone" dataKey="vizCél" stroke="#82ca9d" name="Cél Víz" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
};

export { Statisztika };