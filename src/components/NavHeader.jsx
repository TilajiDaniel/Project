import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/NavHeader.css';

export default function NavHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); 
  
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    logout();
    localStorage.removeItem('userRole');
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={`nav-header ${mobileMenuOpen ? 'menu-open' : ''}`}>
      <div className="nav-brand">
        <h2>🍽️ NutriTrack</h2>
        {user && <span>Üdv, {user.username}!</span>}
      </div>
      
      <nav className={`nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <NavLink 
          to="/MainPage" 
          className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={() => setMobileMenuOpen(false)}
        >
          Főoldal
        </NavLink>
        <NavLink 
          to="/naplo" 
          className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={() => setMobileMenuOpen(false)}
        >
          Napló
        </NavLink>
        <NavLink 
          to="/Etel-kereses" 
          className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={() => setMobileMenuOpen(false)}
        >
          Étel keresés
        </NavLink>
        <NavLink 
          to="/Kalorie-kalkulator" 
          className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={() => setMobileMenuOpen(false)}
        >
          Kalória kalkulátor
        </NavLink>
        <NavLink 
          to="/Statisztika" 
          className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={() => setMobileMenuOpen(false)}
        >
          Statisztika
        </NavLink>
        {userRole === 'Admin' && (
          <NavLink 
            to="/admin" 
            className={({isActive}) => isActive ? 'nav-link active admin-link' : 'nav-link admin-link'}
            onClick={() => setMobileMenuOpen(false)}
          >
            ⚙️ Admin
          </NavLink>
        )}
        <button onClick={handleLogout} className="btn-logout">
          Kilépés
        </button>
      </nav>
      
      <button className="hamburger" onClick={toggleMobileMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
}
