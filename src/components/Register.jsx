import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from './Layout';
import FabButton from './FabButton';
import '../styles/AuthForms.css';


export default function Register() {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password.length < 6) {
      setError('A jelszó legalább 6 karakter legyen!');
      setLoading(false);
      return;
    }

    const result = await register(
      formData.username, 
      formData.email, 
      formData.password
    );
    
    if (result.success) {
      navigate('/MainPage?new=true');
    } else {
      setError(result.message);
    }
    setLoading(false);
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
