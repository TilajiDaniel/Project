import React, { useState } from 'react';
import '../styles/Naplo.css'; // feltételezve, hogy CSS-t külön fájlba teszed

const Naplo = () => {
  // Profil állapotok
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isRegisterForm, setIsRegisterForm] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const showRegister = () => setIsRegisterForm(true);
  const showLogin = () => setIsRegisterForm(false);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const login = (e) => {
    e.preventDefault();
    // Itt történhet a tényleges login logika
    console.log('Bejelentkezés:', loginData);
    setCurrentUser({ name: 'Példa Felhasználó', email: loginData.email });
    setIsLoggedIn(true);
    setShowModal(false);
  };

  const register = (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert('A jelszavak nem egyeznek!');
      return;
    }
    // Itt történhet a tényleges regisztráció logika
    console.log('Regisztráció:', registerData);
    setCurrentUser({ name: registerData.username, email: registerData.email });
    setIsLoggedIn(true);
    setShowModal(false);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <nav className="sidebar">
        <a href="/menu" className="sidebar-item">🏠 Menü</a>
        <a href="/naplo" className="sidebar-item active">📅 Napló</a>
        <a href="/etel-keres" className="sidebar-item">🔍 Étel kereső</a>
        <a href="/statisztika" className="sidebar-item">📊 Statisztika</a>
      </nav>

      <div className="main-content">
        <div className="title">
          Napló - Mai összefoglaló
          <div className="right-panel" onClick={openModal}>
            <div style={{ textAlign: 'center' }}>
              <div id="profile-icon" style={{ fontSize: '28px', marginBottom: '8px' }}>
                👤
              </div>
              <div id="profile-status" style={{ fontSize: '16px', fontWeight: '700' }}>
                {isLoggedIn ? 'Profil' : 'Bejelentkezés'}
              </div>
            </div>
          </div>
        </div>

        <div className="content-grid">
          <div className="main-panel">⚖️ Napi súly</div>
          <div className="main-panel">🎯 Cél súly</div>
          <div className="tall-panel">
            <div className="main-panel">📋 Napi összefoglalás</div>
            <div className="main-panel">🏃 Edzések</div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" id="modalOverlay">
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}>×</button>
            
            <div className="modal-header">
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔐</div>
              <h2 className="modal-title">
                {isLoggedIn ? 'Profil' : isRegisterForm ? 'Regisztráció' : 'Bejelentkezés'}
              </h2>
            </div>

            {/* Login Form */}
            {!isLoggedIn && (
              <>
                {!isRegisterForm && (
                  <form onSubmit={login}>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        placeholder="pelda@email.hu"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Jelszó</label>
                      <input
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        placeholder="Legalább 6 karakter"
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">🔑 Bejelentkezés</button>
                    <button type="button" className="btn btn-secondary" onClick={showRegister}>
                      📝 Új fiók regisztrálása
                    </button>
                  </form>
                )}

                {/* Register Form */}
                {isRegisterForm && (
                  <form onSubmit={register}>
                    <div className="form-group">
                      <label>Felhasználónév</label>
                      <input
                        type="text"
                        name="username"
                        value={registerData.username}
                        onChange={handleRegisterChange}
                        placeholder="Pl: kovacs.janos"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        placeholder="pelda@email.hu"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Jelszó</label>
                      <input
                        type="password"
                        name="password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        placeholder="Legalább 6 karakter"
                        required
                        minLength="6"
                      />
                    </div>
                    <div className="form-group">
                      <label>Jelszó mégerősítése</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        placeholder="Ismételd meg"
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">✅ Regisztráció</button>
                    <button type="button" className="btn btn-secondary" onClick={showLogin}>
                      Vissza a bejelentkezéshez
                    </button>
                  </form>
                )}
              </>
            )}

            {/* Profile Info */}
            {isLoggedIn && (
              <div id="profileInfo" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '56px', marginBottom: '20px' }}>👋</div>
                <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>
                  Üdvözöljük, <span id="userName">{currentUser?.name}</span>!
                </h3>
                <p style={{ color: '#666', marginBottom: '25px' }}>
                  <strong>Email:</strong> <span id="userEmail">{currentUser?.email}</span>
                </p>
                <button onClick={logout} className="btn btn-secondary" style={{ 
                  background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)', 
                  color: 'white' 
                }}>
                  🚪 Kijelentkezés
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export { Naplo };
