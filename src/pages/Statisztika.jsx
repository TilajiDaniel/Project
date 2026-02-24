import React, { useState } from 'react';
import '../styles/Statisztika.css'; // feltételezve, hogy CSS-t külön fájlba teszed

const Statisztika = () => {

  return (
    <div className="container">
      {/* Sidebar */}
      <nav className="sidebar">
        <a href="/MainPage" className="sidebar-item">🏠 Menü</a>
        <a href="/naplo" className="sidebar-item">📅 Napló</a>
        <a href="/etel-keres" className="sidebar-item">🔍 Étel kereső</a>
        <a href="/statisztika" className="sidebar-item active">📊 Statisztika</a>
        <a href="/kalorie-kalkulator" className="sidebar-item">⚖️ Kalória kalkulátor</a>
      </nav>

      <div className="main-content">
        <div className="title">
          Statisztikák
          
        </div>

        <div className="content-grid">
          <div className="main-panel">📈 Heti/havi diagramok</div>
          <div className="main-panel">🎯 Célok</div>
          <div className="tall-panel">
            <div className="main-panel">📊 Átlagok és trendek</div>
            <div className="main-panel">🏆 Ranglisták</div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export { Statisztika };
