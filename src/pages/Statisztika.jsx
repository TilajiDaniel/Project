import React, { useState } from 'react';
import Layout from '../components/Layout';
import '../styles/Statisztika.css'; 

const Statisztika = () => {

  return (
    <Layout>
    <div className="container">

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
    </Layout>
  );
};

export { Statisztika };
