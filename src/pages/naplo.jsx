import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import '../styles/Naplo.css'; 

const Naplo = () => {
  const [waterIntake, setWaterIntake] = useState(0);
  const [weight, setWeight] = useState(''); 
  const [displayWeight, setDisplayWeight] = useState('--');
  const [loading, setLoading] = useState(false);

  // A bejelentkezéskor elmentett token kiolvasása
  const authToken = localStorage.getItem('token'); 

  // Oldal betöltésekor lekérdezzük a mai adatot
  useEffect(() => {
    fetchTodayWater();
    fetchTodayWeight();
  }, []);

  const fetchTodayWater = async () => {
    try {
      const response = await fetch('https://localhost:7133/api/WaterIntake/today', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWaterIntake(data.amountMilliliters || 0); 
      }
    } catch (error) {
      console.error('Hiba a víz lekérésekor:', error);
    }
  };

  const addWater = async (amountToAdd) => {
    if (loading) return;
    setLoading(true);

    // Optimista frissítés a UI-on
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
        throw new Error('Szerver hiba');
      }
      
      fetchTodayWater();

    } catch (error) {
      console.error('Hiba a mentés során:', error);
      alert('Nem sikerült elmenteni a vizet!');
      setWaterIntake(previousValue);
    } finally {
      setLoading(false);
    }
  };

  // --- SÚLY FUNKCIÓK ---
  const fetchTodayWeight = async () => {
    try {
      const response = await fetch('https://localhost:7133/api/Weight/today', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWeight(data.weight?.toString() || '');
        setDisplayWeight(data.weight ? data.weight.toFixed(1) : '--');
      }
    } catch (error) {
      console.error('Hiba a súly lekérésekor:', error);
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
        weight: weightValue,
        date: new Date().toISOString()
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
        // Frissítjük a mai súlyt a szerverről
        await fetchTodayWeight();
        alert("Súly sikeresen rögzítve!");
      } else {
        throw new Error('Szerver hiba');
      }
    } catch (error) {
      console.error("Hiba a súly mentésekor:", error);
      setDisplayWeight(previousDisplayWeight);
      alert('Nem sikerült elmenteni a súlyt!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="main-content">
          <div className="title">Napló - Mai összefoglaló</div>

          <div className="content-grid">
            {/* SÚLY PANEL */}
            <div className="main-panel weight-card">
              <h3>⚖️ Napi súly</h3>
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
                  {loading ? 'Mentés...' : 'Mentés'}
                </button>
              </div>
            </div>
            
            <div className="main-panel">🎯 Cél súly</div>
            
            {/* Vízfogyasztás Szekció */}
            <div className="main-panel water-card">
              <h3>💧 Vízfogyasztás</h3>
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
            <div className="main-panel"><button onClick={() => window.location.href = "/etel-elrendezese"}>🍽️ Napi étkezések</button></div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export { Naplo };
