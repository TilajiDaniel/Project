// pages/EtelKereses.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export const EtelKereses = () => {

  useEffect(() => {
    const user = sessionStorage.getItem('currentUser');
    setIsLoggedIn(!!user);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      let filtered = etelekData;
      
      if (searchTerm) {
        filtered = filtered.filter(etel => 
          etel.nev.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (category !== 'minden') {
        filtered = filtered.filter(etel => etel.kategoria === category);
      }
      
      setResults(filtered);
      setLoading(false);
    }, 500);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCategory('minden');
    setResults([]);
  };

  const addToNaplo = (etel) => {
    if (!isLoggedIn) {
      alert('Kérlek, jelentkezz be a naplóhoz hozzáadáshoz!');
      navigate('/bejelentkezes');
      return;
    }
    
    const naplo = JSON.parse(localStorage.getItem('naplo') || '[]');
    naplo.push({
      ...etel,
      datum: new Date().toISOString().split('T')[0],
      mennyiseg: 100 // gramm
    });
    localStorage.setItem('naplo', JSON.stringify(naplo));
    alert(`${etel.nev} hozzáadva a naplóhoz!`);
  };

  return (
    <div className="etel-keres-container">
      {/* Navigáció */}
      <nav className="app-nav">
        <div className="nav-brand">
          <span>🍽️ Menü</span>
        </div>
        <div className="nav-links">
          <a href="/">🏠 Főoldal</a>
          <a href="/naplo">📓 Napló</a>
          <a href="/ujetelfelvetel">➕ Új étel</a>
          <a href="/statisztika">📊 Statisztika</a>
        </div>
        <div className="auth-section">
          {isLoggedIn ? (
            <span>👤 Bejelentkezve</span>
          ) : (
            <>
              <a href="/bejelentkezes">Bejelentkezés</a> /
              <a href="/regisztracio"> Regisztráció</a>
            </>
          )}
        </div>
      </nav>

      <div className="keres-content">
        <div className="keres-header">
          <h1>Ételfindító</h1>
          <p>Keress ételeket név, kategória vagy tápanyag alapján</p>
        </div>

        {/* Kereső form */}
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Keresés étel nevére..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="minden">Minden kategória</option>
              <option value="feherje">Fehérje</option>
              <option value="hal">Hal</option>
              <option value="tojas">Tojás</option>
              <option value="szemar">Szénhidrát</option>
              <option value="zoldseg">Zöldség</option>
              <option value="zsir">Zsír</option>
            </select>
            <button type="submit" disabled={loading}>
              {loading ? '🔍 Keresés...' : '🔍 Keresés'}
            </button>
            <button type="button" onClick={clearSearch} className="clear-btn">
              🗑️ Törlés
            </button>
          </div>
        </form>

        {/* Eredmények */}
        <div className="results-section">
          <div className="results-header">
            <h3>Keresési találatok ({results.length} db)</h3>
          </div>

          {loading ? (
            <div className="loading">Keresés...</div>
          ) : results.length > 0 ? (
            <div className="results-grid">
              {results.map((etel) => (
                <div key={etel.id} className="etel-card">
                  <div className="etel-kep">
                    <img src={`/images/${etel.kep}`} alt={etel.nev} />
                  </div>
                  <div className="etel-info">
                    <h4>{etel.nev}</h4>
                    <div className="tapananyagok">
                      <div className="tapananyag">
                        <span className="label">Kalória</span>
                        <span className="ertek">{etel.kaloria} kcal</span>
                      </div>
                      <div className="tapananyag">
                        <span className="label">Fehérje</span>
                        <span className="ertek">{etel.feherje}g</span>
                      </div>
                      <div className="tapananyag">
                        <span className="label">Zsír</span>
                        <span className="ertek">{etel.zsir}g</span>
                      </div>
                      <div className="tapananyag">
                        <span className="label">Szénhidrát</span>
                        <span className="ertek">{etel.protein}g</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => addToNaplo(etel)}
                      className="add-btn"
                    >
                      ➕ Naplóba
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : searchTerm || category !== 'minden' ? (
            <div className="no-results">
              <p>❌ Nincs találat a megadott feltételeknek megfelelően.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default EtelKereses;
