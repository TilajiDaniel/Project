import React, { useState, useEffect } from 'react';
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
      'Mozogj legalább 30 percet!'
    ];
    let index = 0;
    const interval = setInterval(() => {
      setTipText(tips[index]);
      index = (index + 1) % tips.length;
    }, 4000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="container">
      <nav className="sidebar">
        <a href="/MainPage" className="sidebar-item active">🏠 Menü</a>
        <a href="/naplo" className="sidebar-item">📅 Napló</a>
        <a href="/etel-keres" className="sidebar-item">🔍 Étel kereső</a>
        <a href="/statisztika" className="sidebar-item">📊 Statisztika</a>
        <a href="/kalorie-kalkulator" className="sidebar-item">⚖️ Kalória kalkulátor</a>
      </nav>
      
      <div className="main-content">
        <div className="title">
          Üdvözöl az Ételnapló
          
        </div>

        <div className="content-grid">
          <div className="main-panel">🚀 Kezdd a napod! Válassz menüpontot</div>
          <div className="tall-panel">
            <div className="main-panel">💡 Gyors hozzáférés</div>
            <div className="main-panel">
              <p id="tipText" style={{ marginTop: '15px', fontWeight: '500' }}>
                {tipText}
              </p>
            </div>
            <a 
              href="/etel-keres" 
              className="btn btn-primary"
              style={{ textDecoration: 'none', display: 'inline-block' }}
            >
              🍽️ Kezdj el ételt felvenni
            </a>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export { Main };
