import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../styles/index.css'; 

const Main = () => {
  const [user, setUser] = useState(null);
  const [tipText, setTipText] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const [showFirstSetup, setShowFirstSetup] = useState(false);


  const [setupData, setSetupData] = useState({
    height: '',
    weight: '',
    targetWeight: ''
  });
   
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


useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('new') === 'true') {
      setShowFirstSetup(true);
    }
  }, [location]);

  const handleSetupSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');

  const payload = {
    height: parseFloat(setupData.height),
    currentWeight: parseFloat(setupData.weight),
    targetWeight: parseFloat(setupData.targetWeight)
  };

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
      // Eltávolítjuk a URL paramétert, hogy ne ugorjon fel újra
      navigate('/MainPage', { replace: true });
      alert("Profilod elkészült!");
    } else {
      const errorData = await response.json();
      alert("Hiba: " + (errorData.message || "Szerver hiba"));
    }
  } catch (error) {
    console.error("Hiba a mentés során:", error);
  }
};

  return (
    <Layout>
      <div className="page-content">
        {/* --- MODÁLIS ABLAK --- */}
      {showFirstSetup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>👋 Üdvözlünk! Kérlek add meg az alapadataidat!</h3>
            <form onSubmit={handleSetupSubmit}>
              <div className="form-group">
                <label>Magasság (cm)</label>
                <input 
                  type="number" 
                  value={setupData.height} 
                  onChange={(e) => setSetupData({...setupData, height: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Jelenlegi súly (kg)</label>
                <input 
                  type="number" 
                  value={setupData.weight} 
                  onChange={(e) => setSetupData({...setupData, weight: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Cél súly (kg)</label>
                <input 
                  type="number" 
                  value={setupData.targetWeight} 
                  onChange={(e) => setSetupData({...setupData, targetWeight: e.target.value})} 
                  required 
                />
              </div>
              <button type="submit" className="btn-primary">Mentés és Kezdés</button>
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
