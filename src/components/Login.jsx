// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from './Layout';
import '../styles/AuthForms.css';

export default function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(formData.username, formData.password);
    if (result.success) {
      navigate('/MainPage');
    } else {
      setError(result.message);
    }
    setLoading(false);
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
        <p><Link to="/register">Regisztráció</Link></p>
      </div>
    </div>

    </Layout>
  );
}
