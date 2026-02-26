import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import '../styles/index.css'; 

const Main = () => {
  const [user, setUser] = useState(null);
  const [tipText, setTipText] = useState('');

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


  return (
    <Layout>
      <div className="page-content">
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
