// pages/Bejelentkezes.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Bejelentkezes.css';

export const Bejelentkezes = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Kis késleltetés a loading effekt miatt
    setTimeout(() => {
      // Ellenőrizzük, hogy létezik-e a felhasználó
      const userData = localStorage.getItem(formData.email);
      
      if (!userData) {
        setError('Nincs ilyen email címmel regisztrált felhasználó!');
        setLoading(false);
        return;
      }

      const user = JSON.parse(userData);
      
      if (user.password !== formData.password) {
        setError('Hibás jelszó!');
        setLoading(false);
        return;
      }

      // Sikeres bejelentkezés - user info mentése sessionStorage-ba
      sessionStorage.setItem('currentUser', JSON.stringify({
        name: user.name,
        email: user.email,
        isLoggedIn: true
      }));

      setError('');
      
      // Átirányítás a főoldalra
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }, 1500);
  };

  return (
    <div className="bejelentkezes-container">
      <div className="bejelentkezes-card">
        <h2>Bejelentkezés</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="bejelentkezes-form">
          <div className="form-group">
            <label>Email cím *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Jelszó *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="bejelentkezes-btn"
            disabled={loading}
          >
            {loading ? 'Bejelentkezés...' : 'Bejelentkezés'}
          </button>
        </form>

        <p className="regisztracio-link">
          Nincs még fiókod? <a href="/regisztracio">Regisztráció</a>
        </p>
      </div>
    </div>
  );
};

export default Bejelentkezes;
