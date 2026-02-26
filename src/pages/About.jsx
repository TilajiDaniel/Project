import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/About.css';

export const About = () => {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1>🍽️ NutriTrack - Ismeretterjesztő</h1>
        <div className="about-grid">
          <div className="about-card">
            <h3>📊 Naplózás</h3>
            <p>Kövesd nyomon napi étkezéseidet és lásd a kalória bevitelt valós időben.</p>
          </div>
          <div className="about-card">
            <h3>🔍 Étel keresés</h3>
            <p>Hatalmas élelmiszer adatbázisunkból kereshetsz pontos tápanyag információkat.</p>
          </div>
          <div className="about-card">
            <h3>📈 Statisztikák</h3>
            <p>Részletes elemzések heti/havi bontásban - lásd a fejlődésed!</p>
          </div>
          <div className="about-card">
            <h3>🧮 Kalkulátor</h3>
            <p>Számold ki pontosan a napi kalória szükségleted testsúly/cél alapján.</p>
          </div>
        </div>
        
        <div className="about-actions">
          <NavLink to="/login" className="btn-primary">🚀 Bejelentkezés</NavLink>
          <NavLink to="/register" className="btn-secondary">📝 Regisztráció</NavLink>
          <NavLink to="/" className="btn-primary">Vissza</NavLink>
          </div>
      </div>
    </div>
  );
};
