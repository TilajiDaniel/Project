import { useNavigate } from "react-router-dom";

import '../App.css';

export const LogPage = () => {
  
return (
    <div className="app">
      <header className="app-header">
        <h1>Napló</h1>
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
          <div className="row">
            <section className="card medium">
              <h2>Napi súly</h2>
            </section>
            <section className="card medium">
              <h2>Cél súly</h2>
            </section>
          </div>

          <section className="card">
            <h2>Napi vízfogyasztás</h2>
          </section>

          <section className="card">
            <h2>Alváskövető</h2>
          </section>

          <section className="card">
            <h2>Edzés követő</h2>
          </section>
        </main>
      </div>
    </div>
  );

}


