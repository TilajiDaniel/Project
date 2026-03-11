import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../styles/index.css'; 

const Main = () => {
  const [user, setUser] = useState(null);
  const [tipText, setTipText] = useState('');
  const [showFirstSetup, setShowFirstSetup] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [setupData, setSetupData] = useState({
    height: '',
    weight: '',
    targetWeight: ''
  });
     useEffect(() => {
    const checkFirstLogin = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('https://localhost:7133/api/User/setup-complete', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (!data.isSetupComplete) {
            setShowFirstSetup(true);
          }
        } else {
          setShowFirstSetup(true);
        }
      } catch (error) {
        console.error('Setup ellenőrzés hiba:', error);
        setShowFirstSetup(true);
      }
    };

    checkFirstLogin();
  }, []);

  // Tippek rotációja
  useEffect(() => {
    const tips = [
      'Írd fel minden étkezést!',
      'Figyelj a Portion méretekre!',
      'Igyál elég vizet naponta!',
      'Mozogj legalább 30 percet!',
      'Ne szerencsétlenkedj a diétáddal!',
      'Ne szerencsejátékozz'
    ];

    let index = 0;
    const interval = setInterval(() => {
      setTipText(tips[index]);
      index = (index + 1) % tips.length;
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSetupSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Nincs bejelentkezve!');
      return;
    }

    const payload = {
      height: parseFloat(setupData.height),
      currentWeight: parseFloat(setupData.weight),
      targetWeight: parseFloat(setupData.targetWeight)
    };

    // Validáció
    if (!payload.height || !payload.currentWeight || !payload.targetWeight) {
      alert('Minden mező kitöltése kötelező!');
      return;
    }

    try {
      const response = await fetch('https://localhost:7133/api/Registry/complete-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowFirstSetup(false);
        navigate('/MainPage', { replace: true });
        alert("Profilod elkészült!");
      } else {
        const errorData = await response.json();
        alert("Hiba: " + (errorData.message || "Szerver hiba"));
      }
    } catch (error) {
      console.error("Hiba a mentés során:", error);
      alert('Hálózati hiba történt!');
    }
  };

  return (
    <Layout>
      <div className="page-content">
        {/* MODÁLIS ABLAK */}
        {showFirstSetup && (
          <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div className="modal-content" style={{
              background: 'white',
              padding: '30px',
              borderRadius: '10px',
              maxWidth: '400px',
              width: '90%'
            }}>
              <h3 style={{ marginBottom: '20px' }}>👋 Üdvözlünk! Kérlek add meg az alapadataidat!</h3>
              <form onSubmit={handleSetupSubmit}>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label>Magasság (cm)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    min="100"
                    max="250"
                    value={setupData.height} 
                    onChange={(e) => setSetupData({...setupData, height: e.target.value})} 
                    required 
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label>Jelenlegi súly (kg)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    min="30"
                    max="300"
                    value={setupData.weight} 
                    onChange={(e) => setSetupData({...setupData, weight: e.target.value})} 
                    required 
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label>Cél súly (kg)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    min="30"
                    max="300"
                    value={setupData.targetWeight} 
                    onChange={(e) => setSetupData({...setupData, targetWeight: e.target.value})} 
                    required 
                    style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                  />
                </div>
                <button type="submit" className="btn-primary" style={{
                  width: '100%',
                  padding: '12px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}>
                  Mentés és Kezdés
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="container">
          <div className="main-content">
            <div className="title">
              Üdvözöl az Ételnapló
            </div>

            <div className="content-grid">
              <div className="main-panel">🚀 Kezdd a napod! Válassz menüpontot</div>
              <div className="tall-panel">
                <div className="main-panel">💡 Gyors hozzáférés</div>
                <div className="main-panel">
                  <p>📅 Napi tipp:</p>
                  <p id="tipText" style={{ marginTop: '15px', fontWeight: '500' }}>
                    {tipText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export { Main };
