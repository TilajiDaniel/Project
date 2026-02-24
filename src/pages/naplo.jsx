import React, { useState } from 'react';
import Layout from '../components/Layout';
import '../styles/Naplo.css'; 

const Naplo = () => {

  return (
    <Layout>
    <div className="container">
      {/* Sidebar */}

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
    </Layout>
  );
};

export { Naplo };
