import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import '../styles/Naplo.css'; 

const Naplo = () => {
  const [waterIntake, setWaterIntake] = useState(0);
  const [weight, setWeight] = useState(''); 
  const [displayWeight, setDisplayWeight] = useState('--');
  const [loading, setLoading] = useState(false);
  const [targetWeight, setTargetWeight] = useState(null);

  const authToken = localStorage.getItem('token');
  const navigate = useNavigate();

  // Load today's data on page load
  useEffect(() => {
    fetchTodayWater();
    fetchTodayWeight();
  }, []);

  const fetchTodayWater = async () => {
    try {
      const response = await fetch('https://localhost:7133/api/WaterIntake/today', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`, 
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWaterIntake(data.amountMilliliters || 0); 
      }
    } catch (error) {
      console.error('Error fetching water:', error);
    }
  };

  const addWater = async (amountToAdd) => {
    if (loading) return;
    setLoading(true);

    // Optimistic UI update
    const previousValue = waterIntake;
    setWaterIntake(prev => prev + amountToAdd);

    try {
      const payload = {
        amountMilliliters: amountToAdd,
        date: new Date().toISOString()
      };

      const response = await fetch('https://localhost:7133/api/WaterIntake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Server error');
      }
      
      fetchTodayWater();

    } catch (error) {
      console.error('Error saving water:', error);
      alert('Failed to save water!');
      setWaterIntake(previousValue);
    } finally {
      setLoading(false);
    }
  };

  // --- WEIGHT FUNCTIONS ---
  const fetchTodayWeight = async () => {
    try {
      const response = await fetch('https://localhost:7133/api/Weight/today', {
        headers: {
          Authorization: `Bearer ${authToken}`, 
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWeight(data.weight?.toString() || '');
        setDisplayWeight(data.weight ? data.weight.toFixed(1) : '--');
      }
    } catch (error) {
      console.error('Error fetching weight:', error);
    }
  };

  const handleWeightSubmit = async () => {
    if (!weight || weight === '' || loading) return;
    setLoading(true);

    const weightValue = parseFloat(weight);
    if (isNaN(weightValue)) return;

    const previousDisplayWeight = displayWeight;

    try {
      const payload = {
        weight: weightValue
      };

      const response = await fetch('https://localhost:7133/api/Weight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setDisplayWeight(weightValue.toFixed(1));
        await fetchTodayWeight();
        alert("Weight saved successfully!");
      } else {
        throw new Error('Server error');
      }
    } catch (error) {
      console.error("Error saving weight:", error);
      setDisplayWeight(previousDisplayWeight);
      alert('Failed to save weight!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://localhost:7133/api/User/my-goal', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setTargetWeight(data.targetWeight);
        }
      } catch (error) {
        console.error("Error fetching target weight:", error);
      }
    };

    fetchGoal();
  }, []);

  return (
    <Layout>
      <div className="container">
        <div className="main-content">
          <div className="title">Diary - Daily Summary</div>

          <div className="content-grid">
            <div className="main-panel weight-card">
              <h3>⚖️ Daily Weight</h3>
              <div className="weight-display">
                <span className="weight-val">{displayWeight}</span>
                <span className="weight-unit"> kg</span>  
              </div>
              <div className="weight-input-group">
                <input 
                  type="number" 
                  step="0.1"
                  value={weight} 
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.0"
                  disabled={loading}
                />
                <button 
                  onClick={handleWeightSubmit} 
                  disabled={loading || !weight || weight === ''}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
            
            <div className="main-panel">
              <h3>🎯 Target Weight</h3>
              <div className="weight-display">
                {targetWeight ? `${targetWeight} kg` : "Not set"}
              </div>
            </div>
            
            <div className="main-panel water-card">
              <h3>💧 Water Intake</h3>
              <div className="water-display">
                <span className="water-amount">{waterIntake}</span>
                <span className="water-unit"> ml</span>
              </div>
              <div className="water-buttons">
                <div className="water-button">
                  <button onClick={() => addWater(250)} disabled={loading}>+ 250 ml</button>
                </div>
                <div className="water-button">
                  <button onClick={() => addWater(500)} disabled={loading}>+ 500 ml</button>
                </div>
              </div>
            </div>
            <div className="main-panel">
              <button onClick={() => window.location.href = "/etel-elrendezese"}>🍽️ Daily Meals</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export { Naplo };
