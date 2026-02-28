// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from './Layout';
import FabButton from './FabButton';
import '../styles/AuthForms.css';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('https://localhost:7133/api/Auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: myUsername, password: myPassword })
    });

    if (response.ok) {
      const data = await response.json();
      
      // 💾 ITT MENTJÜK EL AZ ADATOKAT:
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.role); // "Admin" vagy "User" fog ide kerülni
      
      alert(`Sikeres bejelentkezés! Jogosultság: ${data.role}`);
      navigate('/dashboard'); // Vagy ahova bejelentkezés után viszed a usert
    } else {
      alert("Hibás felhasználónév vagy jelszó!");
    }
  } catch (error) {
    console.error("Bejelentkezési hiba:", error);
  }
};

  return (
    <Layout showNav={false}>
    <div className="auth-container">
      <div className="auth-card">
        <h2>🔐 Bejelentkezés</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              name="username"
              placeholder="Felhasználónév"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Jelszó"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Belépés...' : 'Bejelentkezés'}
          </button>
        </form>
        <p> Nincs még fiókod? <Link to="/register" >Regisztrálj</Link></p>
      </div>
       <FabButton />
    </div>

   
  </Layout>
  );
}
