import { NavLink, Routes, Route } from "react-router-dom"
import { LogPage } from "./pages/Naplo"
//import { EtelKereses } from "./pages/EtelKereses"
import { UjEtelFelvetel } from "./pages/UjEtelFelvetel"
import {Regisztracio} from "./pages/registracio"
import {Bejelentkezes} from "./pages/Bejelentkezes"

import './App.css'

export const HomePage = () => {
  
  return (
    <>
      <header className="app-header">
        <h1>Főoldal</h1>
        <nav>
          <NavLink className="auth-btn" to="regisztracio">Regisztráció</NavLink>
          <NavLink className="auth-btn" to="bejelentkezes">Bejelentkezés</NavLink>
        </nav>
      </header>

      <div className="app-body">
        {/* navigációs sáv */}
      <nav className="navbar navbar-expand-sm navbar-light bg-light">
      <div className="container-fluid">
    <NavLink className="navbar-brand" to="/">Menü</NavLink>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink to={'/naplo'} className={({isActive}) => 
            "nav-link" + (isActive ? " active" : "")}>
            <span className="nav-link"><i className="bi bi-safe2"></i>Naplo</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={'/'} className={({isActive}) => 
            "nav-link" + (isActive ? " active" : "")}>
            <span className="nav-link">Étel Keresése</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to={'/ujetelfelvetel'} className={({isActive}) => 
            "nav-link" + (isActive ? " active" : "")}>
            <span className="nav-link">Uj Étel Felvétele</span>
            </NavLink>
          </li>

        </ul>
      </div>
      </div>
    </nav>
        <main className="content">
          <section className="card large">
            <h2>Napi adatok</h2>
          </section>
          <section className="card large">
            <h2>Ajánlott ételek</h2>
          </section>
        </main>
      </div>

    <Routes>
          <Route path="/naplo" element={<LogPage />} />
          {/* <Route path="/etelkereses" element={<EtelKereses />} /> */}
          <Route path="/ujetelfelvetel" element={<UjEtelFelvetel />} />
          <Route path="/regisztracio" element={<Regisztracio/>} />
          <Route path="/bejelentkezes" element={<Bejelentkezes/>} />
    </Routes>
    </>
  );
}


export default HomePage
