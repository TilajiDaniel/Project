import React, { useState, useEffect } from 'react';
import '../index.css'; // styles.css → Main.css néven

const Main = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [tipText, setTipText] = useState('');

  // Tippek rotációja
  useEffect(() => {
    const tips = [
      'Írd fel minden étkezést!',
      'Figyelj a Portion méretekre!',
      'Igyál elég vizet naponta!',
      'Mozogj legalább 30 percet!'
    ];
    let index = 0;
    const interval = setInterval(() => {
      setTipText(tips[index]);
      index = (index + 1) % tips.length;
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const showRegister = () => setIsLoginForm(false);
  const showLogin = () => setIsLoginForm(true);

  const login = (e) => {
    e.preventDefault();
    const email = e.target.loginEmail.value;
    const password = e.target.loginPassword.value;
    
    // Itt localStorage vagy API hívás
    const userData = { name: 'Kovács János', email };
    setUser(userData);
    setIsLoggedIn(true);
    setIsModalOpen(false);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const register = (e) => {
    e.preventDefault();
    const username = e.target.regUsername.value;
    const email = e.target.regEmail.value;
    const password = e.target.regPassword.value;
    const confirmPassword = e.target.regConfirmPassword.value;
    
    if (password !== confirmPassword) {
      alert('A jelszavak nem egyeznek!');
      return;
    }
    
    const userData = { name: username, email };
    setUser(userData);
    setIsLoggedIn(true);
    setIsModalOpen(false);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user');
  };

  // Ellenőrizzük a localStorage-t
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="container">
      <nav className="sidebar">
        <a href="/menu" className="sidebar-item active">🏠 Menü</a>
        <a href="/naplo" className="sidebar-item">📅 Napló</a>
        <a href="/etel-keres" className="sidebar-item">🔍 Étel kereső</a>
        <a href="/statisztika" className="sidebar-item">📊 Statisztika</a>
      </nav>
      
      <div className="main-content">
        <div className="title">
          Üdvözöl az Ételnapló
          <div 
            className="right-panel" 
            onClick={openModal}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ textAlign: 'center' }}>
              <div 
                id="profile-icon" 
                style={{ fontSize: '28px', marginBottom: '8px' }}
              >
                {isLoggedIn ? '👋' : '👤'}
              </div>
              <div 
                id="profile-status" 
                style={{ fontSize: '16px', fontWeight: '700' }}
              >
                {isLoggedIn ? `Üdv, ${user?.name}!` : 'Bejelentkezés'}
              </div>
            </div>
          </div>
        </div>

        <div className="content-grid">
          <div className="main-panel">🚀 Kezdd a napod! Válassz menüpontot</div>
          <div className="tall-panel">
            <div className="main-panel">💡 Gyors hozzáférés</div>
            <div className="main-panel">
              <p id="tipText" style={{ marginTop: '15px', fontWeight: '500' }}>
                {tipText}
              </p>
            </div>
            <a 
              href="/etel-keres" 
              className="btn btn-primary"
              style={{ textDecoration: 'none', display: 'inline-block' }}
            >
              🍽️ Kezdj el ételt felvenni
            </a>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" id="modalOverlay">
          <div className="modal-content">
            <button 
              className="close-modal" 
              onClick={closeModal}
              style={{ fontSize: '28px' }}
            >
              ×
            </button>
            
            <div className="modal-header">
              <div 
                style={{ fontSize: '48px', marginBottom: '15px' }} 
                id="modal-icon"
              >
                {isLoggedIn ? '👋' : '🔐'}
              </div>
              <h2 className="modal-title" id="modal-title">
                {isLoggedIn ? 'Profil' : 'Bejelentkezés'}
              </h2>
            </div>

            {/* LOGIN FORM */}
            {!isLoggedIn && (
              <>
                <div id="loginForm">
                  <form onSubmit={login}>
                    <div className="form-group">
                      <label>Email</label>
                      <input 
                        type="email" 
                        id="loginEmail" 
                        placeholder="pelda@email.hu" 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>Jelszó</label>
                      <input 
                        type="password" 
                        id="loginPassword" 
                        placeholder="Legalább 6 karakter" 
                        required 
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      🔑 Bejelentkezés
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={showRegister}
                    >
                      📝 Új fiók regisztrálása
                    </button>
                  </form>
                </div>

                {/* REGISTER FORM */}
                {!isLoginForm && (
                  <div id="registerForm">
                    <form onSubmit={register}>
                      <div className="form-group">
                        <label>Felhasználónév</label>
                        <input 
                          type="text" 
                          id="regUsername" 
                          placeholder="Pl: kovacs.janos" 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input 
                          type="email" 
                          id="regEmail" 
                          placeholder="pelda@email.hu" 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>Jelszó</label>
                        <input 
                          type="password" 
                          id="regPassword" 
                          placeholder="Legalább 6 karakter" 
                          required 
                          minLength="6"
                        />
                      </div>
                      <div className="form-group">
                        <label>Jelszó mégerősítése</label>
                        <input 
                          type="password" 
                          id="regConfirmPassword" 
                          placeholder="Ismételd meg" 
                          required 
                        />
                      </div>
                      <button type="submit" className="btn btn-primary">
                        ✅ Regisztráció
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={showLogin}
                      >
                        Vissza a bejelentkezéshez
                      </button>
                    </form>
                  </div>
                )}
              </>
            )}

            {/* PROFIL INFO */}
            {isLoggedIn && (
              <div id="profileInfo" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '56px', marginBottom: '20px' }}>👋</div>
                <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>
                  Üdvözöljük, <span id="userName">{user?.name}</span>!
                </h3>
                <p style={{ color: '#666', marginBottom: '25px' }}>
                  <strong>Email:</strong> <span id="userEmail">{user?.email}</span>
                </p>
                <button 
                  onClick={logout} 
                  className="btn btn-secondary" 
                  style={{ background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)', color: 'white' }}
                >
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

export { Main };
