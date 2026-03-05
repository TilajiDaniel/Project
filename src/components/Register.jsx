import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from './Layout';
import FabButton from './FabButton';
import '../styles/AuthForms.css';

// HARDCODE URL - nincs process.env probléma
const API_BASE_URL = 'https://localhost:7133';  // itt állítsd be a saját URL-det

export default function Register() {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password.length < 6 && !formData.password.includes('A, Á, B, C, CS, D, DZ, DZS, E, É, F, G, GY, H, I, Í, J, K, L, LY, M, N, NY, O, Ó, Ö, Ő, P, Q, R, S, SZ, T, TY, U, Ú, Ü, Ű, V, W, X, Y, Z, ZS')) {
      setError('A jelszó legalább 6 karakter legyen és tartalmazzon nagybetűt!');
      setLoading(false);
      return;
    }

    if (formData.username.length < 3) {
      setError('A felhasználónév legalább 3 karakter legyen!');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/Registry/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data || 'Regisztráció sikertelen');
      }

      navigate('/register-success');
    } catch (err) {
      setError(err.message || 'Hiba történt a regisztráció során');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout showNav={false}>
      <div className="auth-container">
        <div className="auth-card">
          <h2>📝 Regisztráció</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Felhasználónév</label>
              <input
                type="text"
                name="username"
                placeholder="Új felhasználónév"
                value={formData.username}
                onChange={handleChange}
                required
                minLength="3"
              />
            </div>
            
            <div className="form-group">
              <label>Email cím</label>
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Jelszó</label>
              <input
                type="password"
                name="password"
                placeholder="Legalább 6 karakter"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
              />
            </div>
            
            {error && <div className="error">{error}</div>}
            
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Regisztrálás...' : 'Regisztráció'}
            </button>
          </form>
          
          <p className="auth-link">
            Van már fiókod? <Link to="/login">Jelentkezz be!</Link>
          </p>
        </div>
        <FabButton />
      </div>
    </Layout>
  );
}
