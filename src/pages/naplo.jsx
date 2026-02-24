import React, { useState } from 'react';
import '../styles/Naplo.css'; // feltételezve, hogy CSS-t külön fájlba teszed

const Naplo = () => {

  return (
    <div className="container">
      {/* Sidebar */}
      <nav className="sidebar">
        <a href="/MainPage" className="sidebar-item">🏠 Menü</a>
        <a href="/naplo" className="sidebar-item active">📅 Napló</a>
        <a href="/etel-keres" className="sidebar-item">🔍 Étel kereső</a>
        <a href="/statisztika" className="sidebar-item">📊 Statisztika</a>
        <a href="/kalorie-kalkulator" className="sidebar-item">⚖️ Kalória kalkulátor</a>
      </nav>

      <div className="main-content">
        <div className="title">
          Napló - Mai összefoglaló
        </div>

        <div className="content-grid">
          <div className="main-panel">⚖️ Napi súly</div>
          <div className="main-panel">🎯 Cél súly</div>
          <div className="tall-panel">
            <div className="main-panel">📋 Napi összefoglalás</div>
            <div className="main-panel">🏃 Edzések</div>
          </div>
        </div>
      </div>

    </div>
  );
};

export { Naplo };
