import { useState } from 'react'

import '../App.css';

function AddFoodPage() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Új étel felvétele</h1>
        <button className="auth-btn">Regisztráció / Bejelentkezés</button>
      </header>

      <div className="app-body">
        <nav className="sidebar">
          <button>Menü</button>
          <button>Napló</button>
          <button>Új étel felvétele</button>
          <button>Ételek keresése</button>
          <button>Statisztika</button>
        </nav>

        <main className="content">
          <form className="card form">
            <div className="form-row">
              <label>Étel neve</label>
              <input type="text" />
            </div>

            <div className="form-row">
              <label>Kalória</label>
              <input type="number" />
            </div>

            <div className="form-row">
              <label>Zsír</label>
              <input type="number" />
            </div>

            <div className="form-row">
              <label>Szénhidrát</label>
              <input type="number" />
            </div>

            <div className="form-row">
              <label>Fehérje</label>
              <input type="number" />
            </div>

            <div className="form-row">
              <label>Cukor</label>
              <input type="number" />
            </div>

            <button type="submit" className="save-btn">
              Mentés
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
export {AddFoodPage as UjEtelFelvetel};