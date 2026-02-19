import React, { useState, useEffect } from 'react';
import '../styles/Etel-kereso.css';

const EtelKereses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);

  // Mint ételek
  const sampleFoods = [
    { name: 'Csirke melle', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
    { name: 'Barna rizs (100g)', calories: 111, protein: 2.6, carbs: 23, fat: 0.9 },
    { name: 'Avokádó (100g)', calories: 160, protein: 2, carbs: 9, fat: 15 },
    { name: 'Tojás (1 db)', calories: 70, protein: 6, carbs: 0.5, fat: 5 },
    { name: 'Brokkoli (100g)', calories: 34, protein: 2.8, carbs: 7, fat: 0.4 }
  ];

  // Kategóriák
  const sampleCategories = [
    'Reggeli', 'Ebéd', 'Vacsora', 'Nasi', 'Zöldség', 'Hús', 'Gabona'
  ];

  // LocalStorage ellenőrzés
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const showRegister = () => setIsLoginForm(false);
  const showLogin = () => setIsLoginForm(true);

  const login = (e) => {
    e.preventDefault();
    const email = e.target.loginEmail.value;
    const password = e.target.loginPassword.value;
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

  const searchFood = (term) => {
    setSearchTerm(term);
    const filtered = sampleFoods.filter(food => 
      food.name.toLowerCase().includes(term.toLowerCase())
    );
    setFoods(filtered);
  };

  const renderCategoryCards = () => (
    <div className="category-grid">
      {sampleCategories.map((category, index) => (
        <div key={index} className="category-card" onClick={() => searchFood(category)}>
          {category}
        </div>
      ))}
    </div>
  );

  const renderFoodCards = () => (
    <div className="food-grid">
      {foods.length > 0 ? (
        foods.map((food, index) => (
          <div key={index} className="food-card">
            <h4>{food.name}</h4>
            <div className="nutrition-info">
              <span>🔥 {food.calories} kcal</span>
              <span>💪 {food.protein}g fehérje</span>
              <span>🍠 {food.carbs}g szénhidrát</span>
              <span>🥑 {food.fat}g zsír</span>
            </div>
            <button className="btn btn-primary">➕ Hozzáadás</button>
          </div>
        ))
      ) : (
        <p className="no-results">Nincs találat "{searchTerm}" kifejezésre</p>
      )}
    </div>
  );

  return (
    <div className="container">
      <nav className="sidebar">
        <a href="/" className="sidebar-item">🏠 Menü</a>
        <a href="/naplo" className="sidebar-item">📅 Napló</a>
        <a href="/etel-keres" className="sidebar-item active">🔍 Étel kereső</a>
        <a href="/statisztika" className="sidebar-item">📊 Statisztika</a>
      </nav>
      
      <div className="main-content">
        <div className="title">
          Étel keresése
          <div className="right-panel" onClick={openModal}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>
                {isLoggedIn ? '👋' : '👤'}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700' }}>
                {isLoggedIn ? `Üdv, ${user?.name}!` : 'Bejelentkezés'}
              </div>
            </div>
          </div>
        </div>

        {/* KERESŐ SÁV */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Étel keresése..."
            value={searchTerm}
            onChange={(e) => searchFood(e.target.value)}
          />
          <button onClick={() => searchFood(searchTerm)}>🔍</button>
          <div className="category-cards">
            {renderCategoryCards()}
          </div>
        </div>

        {/* EREDMÉNYEK */}
        <div className="results-wrapper">
          <div className="results-panel">
            <div id="foodCards">
              {renderFoodCards()}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL - ugyanaz mint Main.jsx-ben */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}>×</button>
            
            <div className="modal-header">
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>
                {isLoggedIn ? '👋' : '🔐'}
              </div>
              <h2 className="modal-title">
                {isLoggedIn ? 'Profil' : 'Bejelentkezés'}
              </h2>
            </div>

            {!isLoggedIn ? (
              <>
                <div id="loginForm">
                  <form onSubmit={login}>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" id="loginEmail" placeholder="pelda@email.hu" required />
                    </div>
                    <div className="form-group">
                      <label>Jelszó</label>
                      <input type="password" id="loginPassword" placeholder="Legalább 6 karakter" required />
                    </div>
                    <button type="submit" className="btn btn-primary">🔑 Bejelentkezés</button>
                    <button type="button" className="btn btn-secondary" onClick={showRegister}>
                      📝 Új fiók regisztrálása
                    </button>
                  </form>
                </div>

                {!isLoginForm && (
                  <div id="registerForm">
                    <form onSubmit={register}>
                      <div className="form-group">
                        <label>Felhasználónév</label>
                        <input type="text" id="regUsername" placeholder="Pl: kovacs.janos" required />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input type="email" id="regEmail" placeholder="pelda@email.hu" required />
                      </div>
                      <div className="form-group">
                        <label>Jelszó</label>
                        <input type="password" id="regPassword" placeholder="Legalább 6 karakter" required minLength="6" />
                      </div>
                      <div className="form-group">
                        <label>Jelszó mégerősítése</label>
                        <input type="password" id="regConfirmPassword" placeholder="Ismételd meg" required />
                      </div>
                      <button type="submit" className="btn btn-primary">✅ Regisztráció</button>
                      <button type="button" className="btn btn-secondary" onClick={showLogin}>
                        Vissza a bejelentkezéshez
                      </button>
                    </form>
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '56px', marginBottom: '20px' }}>👋</div>
                <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>
                  Üdvözöljük, <span>{user?.name}</span>!
                </h3>
                <p style={{ color: '#666', marginBottom: '25px' }}>
                  <strong>Email:</strong> <span>{user?.email}</span>
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

export {EtelKereses} ;
