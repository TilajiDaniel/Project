// pages/Regisztracio.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Regisztracio.css'; // lásd lent

export const Regisztracio = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setSuccess('');

    // Validáció
    if (!formData.name || !formData.email || !formData.password) {
      setError('Minden mező kitöltése kötelező!');
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError('A jelszavak nem egyeznek!');
      return;
    }

    if (formData.password.length < 6) {
      setError('A jelszó legalább 6 karakter legyen!');
      return;
    }

    // Email ellenőrzés localStorage-ban
    const existingUser = localStorage.getItem(formData.email);
    if (existingUser) {
      setError('Ez az email cím már regisztrált!');
      return;
    }

    // Felhasználó mentése
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password
    };
    
    localStorage.setItem(formData.email, JSON.stringify(userData));
    setSuccess('Sikeres regisztráció! Bejelentkezés után használhatod az alkalmazást.');
    
    // 2 mp múlva átirányítás bejelentkezésre
    setTimeout(() => {
      navigate('/bejelentkezes');
    }, 2000);
  };

  return (
    <div className="regisztracio-container">
      <div className="regisztracio-card">
        <h2>Regisztráció</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="regisztracio-form">
          <div className="form-group">
            <label>Név *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email cím *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
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
            />
          </div>

          <div className="form-group">
            <label>Jelszó megerősítése *</label>
            <input
              type="password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="regisztracio-btn">
            Regisztráció
          </button>
        </form>

        <p className="login-link">
          Már van fiókod? <a href="/bejelentkezes">Bejelentkezés</a>
        </p>
      </div>
    </div>
  );
};

export default Regisztracio;
