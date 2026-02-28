import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/NavHeader.css';

export default function NavHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userRole = localStorage.getItem('userRole');


  const handleLogout = () => {
    logout();
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <header className="nav-header">
      <div className="nav-brand">
        <h2>🍽️ NutriTrack</h2>
        {user && <span>Üdv, {user.username}!</span>}
      </div>
      
      <nav className="nav-menu">
        <NavLink to="/MainPage" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
          Főoldal
        </NavLink>
        <NavLink to="/naplo" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
          Napló
        </NavLink>
        <NavLink to="/Etel-kereses" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
          Étel keresés
        </NavLink>
        <NavLink to="/Kalorie-kalkulator" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
          Kalória kalkulátor
        </NavLink>
        <NavLink to="/Statisztika" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
          Statisztika
        </NavLink>
        {userRole === 'Admin' && (
          <NavLink to="/admin" className={({isActive}) => isActive ? 'nav-link active admin-link' : 'nav-link admin-link'}>
            ⚙️ Admin
          </NavLink>
        )}
        <button onClick={handleLogout} className="btn-logout">
          Kilépés
        </button>
      </nav>
    </header>
  );
}
