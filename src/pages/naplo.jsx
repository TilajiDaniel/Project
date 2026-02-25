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
        // A C# Ok(new { amountMilliliters = totalWater })-t küld vissza
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
        date: new Date().toISOString() // A C# DateTime-ot vár
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
      
      // Ha sikeres, frissítjük a végleges állapotot a biztonság kedvéért
      fetchTodayWater();

    } catch (error) {
      console.error('Hiba a mentés során:', error);
      alert('Nem sikerült elmenteni a vizet!');
      setWaterIntake(previousValue); // Hiba esetén visszavonjuk
    } finally {
      setLoading(false);
    }
  };
// --- SÚLY FUNKCIÓ ---
  const handleWeightSubmit = async () => {
    if (!weight || loading) return;
    setLoading(true);

    try {
      const response = await fetch('https://localhost:7133/api/Weight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(parseFloat(weight))
      });

      if (response.ok) {
        setDisplayWeight(weight);
        alert("Súly sikeresen rögzítve!");
        setWeight(''); // Mező ürítése
      }
    } catch (error) {
      console.error("Hiba a súly mentésekor:", error);
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
                <span className="weight-val">{displayWeight}</span> kg
              </div>
              <div className="weight-input-group">
                <input 
                  type="number" 
                  step="0.1"
                  value={weight} 
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.0"
                />
                <button onClick={handleWeightSubmit} disabled={loading}>Mentés</button>
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
                <button onClick={() => addWater(250)} disabled={loading}>+ 250 ml</button>
                <button onClick={() => addWater(500)} disabled={loading}>+ 500 ml</button>
              </div>
            </div>

            <div className="tall-panel">
              <div className="main-panel">📋 Napi összefoglalás</div>
              <div className="main-panel">🏃 Edzések</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export { Naplo };