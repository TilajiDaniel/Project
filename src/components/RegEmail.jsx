import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from './Layout';
import FabButton from './FabButton';
import '../styles/AuthForms.css';

// HARDKÓDOLT URL - állítsd be a saját backend URL-edre
const API_BASE_URL = 'https://localhost:7133';

export default function RegisterSuccess() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleResendVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSent(false);

    try {
      const response = await fetch(`${API_BASE_URL}/api/Registry/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Újra küldés sikertelen');
      }

      setSent(true);
      setError('');
    } catch (err) {
      setError(err.message || 'Hiba történt az újraküldés során');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <Layout showNav={false}>
      <div className="auth-container">
        <div className="auth-card">
          <h2>📬 Email megerősítés</h2>

          <p className="auth-text">
            Nézze meg az email címét, és kattintson a megerősítő linkre az emailben.
          </p>

          <button
            type="button"
            onClick={handleLoginClick}
            className="btn-primary"
          >
            Vissza a bejelentkezésre
          </button>

          <hr className="auth-divider" />

          <h3>Új megerősítő link küldése</h3>
          <p>
            Ha nem érkezett email, vagy lejárt a link, kérhet új megerősítő emailt.
          </p>

          <form onSubmit={handleResendVerification}>
            <div className="form-group">
              <label>Felhasználónév vagy email</label>
              <input
                type="text"
                name="username"
                placeholder="Felhasználónév vagy email"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Jelszó</label>
              <input
                type="password"
                name="password"
                placeholder="Jelszó"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <div className="error">{error}</div>}
            {sent && (
              <div className="success">
                Új megerősítő email elküldve. Nézze meg az email postafiókját.
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Küldés...' : 'Újraküldés'}
            </button>
          </form>
        </div>
        <FabButton />
      </div>
    </Layout>
  );
}
