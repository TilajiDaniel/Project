import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/NavHeader.css';


export default function NavHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); 
  const [isDark, setIsDark] = useState(document.body.classList.contains("dark-mode"));
  
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

  const toggleDarkMode = () => {
  const darkModeActive = document.body.classList.toggle("dark-mode");
  setIsDark(darkModeActive);
  // Opcionális: Mentés, hogy frissítés után is így maradjon
  localStorage.setItem('theme', darkModeActive ? 'dark' : 'light');
};

  return (
    <header className={`nav-header ${mobileMenuOpen ? 'menu-open' : ''}`}>
      <div className="nav-brand">
        <h2> NutriTrack</h2>
        {user && <span>Hi, {user.username}!</span>}
      </div>
      
      <nav className={`nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <button onClick={toggleDarkMode} className="nav-link mode-toggle">
  {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
</button>
        <NavLink 
          to="/MainPage" 
          className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={() => setMobileMenuOpen(false)}
        >
          Home
        </NavLink>
        <NavLink 
          to="/naplo" 
          className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={() => setMobileMenuOpen(false)}
        >
          Diary
        </NavLink>
        <NavLink 
          to="/Etel-kereses" 
          className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={() => setMobileMenuOpen(false)}
        >
          Food Search
        </NavLink>
        <NavLink 
          to="/Kalorie-kalkulator" 
          className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={() => setMobileMenuOpen(false)}
        >
          Calorie Calculator
        </NavLink>
        <NavLink 
          to="/Statisztika" 
          className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={() => setMobileMenuOpen(false)}
        >
          Statistics
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
          Logout
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
