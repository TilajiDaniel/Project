// src/pages/AddFood.jsx - MEALS táblába mentéssel
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // ← Ha van auth
import Layout from '../components/Layout';
import '../styles/AddFood.css';

const AddFood = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth(); // ← Token a header-hez
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [saving, setSaving] = useState(false);

  // URL paraméterek kiolvasása
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const foodData = params.get('food');
    
    if (foodData) {
      try {
        const food = JSON.parse(decodeURIComponent(foodData));
        setSelectedFood(food);
      } catch (error) {
        console.error('Étel adat hiba:', error);
        navigate('/etel-kereses');
      }
    } else {
      navigate('/etel-kereses');
    }
  }, [location.search, navigate]);

  // 🔥 MEALS TÁBLÁBA MENTÉS
  const addToMeal = async (mealType) => {
    setSaving(true);
    
    const mealData = {
      user_id: 1, // ← Backend tokenből veszi ki
      meal_date: new Date().toISOString().split('T')[0],
      meal_type: mealType.charAt(0).toUpperCase() + mealType.slice(1), // Breakfast
      food_info: JSON.stringify({
        foodId: selectedFood.id,
        foodName: selectedFood.name,
        quantity: quantity,
        calories: Math.round((selectedFood.calories * quantity) / 100),
        protein: Math.round((selectedFood.protein * quantity) / 100),
        carbs: Math.round((selectedFood.carbs * quantity) / 100),
        fat: Math.round((selectedFood.fat * quantity) / 100)
      })
    };

    try {
      // 🔥 ADATBÁZIS FELTÖLTÉS - MEALS tábla
      const response = await fetch('https://localhost:7133/api/Meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || localStorage.getItem('token')}`
        },
        body: JSON.stringify(mealData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ MEALS táblába mentve:', result);

      // 🔥 LOCALSTORAGE BACKUP
      const today = new Date().toISOString().split('T')[0];
      const existingLog = JSON.parse(localStorage.getItem('dailyLog') || '{}');
      if (!existingLog[today]) existingLog[today] = [];
      
      existingLog[today].push({
        meal_id: result.meal_id,
        ...mealData,
        timestamp: new Date().toISOString()
      });
      
      localStorage.setItem('dailyLog', JSON.stringify(existingLog));
      console.log('💾 LocalStorage backup OK');

      // SIKER - NAPLÓRA IRÁNYÍT
      navigate('/naplo');
      
    } catch (error) {
      console.error('❌ ADATBÁZIS HIBA:', error);
      
      // FALLBACK: CSAK LOCALSTORAGE
      const today = new Date().toISOString().split('T')[0];
      const existingLog = JSON.parse(localStorage.getItem('dailyLog') || '{}');
      if (!existingLog[today]) existingLog[today] = [];
      
      existingLog[today].push({
        ...mealData,
        error: true,
        timestamp: new Date().toISOString()
      });
      
      localStorage.setItem('dailyLog', JSON.stringify(existingLog));
      console.log('⚠️ Csak localStorage-ba mentve');
      
      alert('Internet hiba! LocalStorage-ba mentve ✅');
      navigate('/naplo');
    } finally {
      setSaving(false);
    }
  };

  if (!selectedFood) {
    return (
      <Layout>
        <div className="container">
          <div className="main-content">
            <div className="title">🍽️ Étel hozzáadása</div>
            <div className="empty-state">
              Nincs kiválasztott étel 😔
              <br />
              <button onClick={() => navigate('/etel-kereses')} className="back-btn">
                ← Vissza a kereséshez
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container">
        <div className="main-content">
          <div className="title">
            🍽️ {selectedFood.name} hozzáadása
          </div>
          
          <div className="add-food-card">
            {/* Étel info */}
            <div className="food-preview">
              <div className="food-image">🍗</div>
              <div className="food-details">
                <h2>{selectedFood.name}</h2>
                <div className="base-nutrients">
                  <span>🔥 {selectedFood.calories} kcal/100g</span>
                  <span>💪 {selectedFood.protein}g protein</span>
                  <span>🍞 {selectedFood.carbs}g szénhidrát</span>
                  <span>🧈 {selectedFood.fat}g zsír</span>
                </div>
              </div>
            </div>

            {/* Mennyiség választó */}
            <div className="quantity-section">
              <label>Mennyiség:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(Math.max(10, quantity - 10))}
                  className="qty-btn"
                  disabled={saving}
                >
                  -
                </button>
                <span className="qty-display">{quantity}g</span>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="qty-slider"
                  disabled={saving}
                />
                <button 
                  onClick={() => setQuantity(Math.min(1000, quantity + 10))}
                  className="qty-btn"
                  disabled={saving}
                >
                  +
                </button>
              </div>
              <div className="total-calories">
                Összesen: {Math.round(selectedFood.calories * quantity / 100)} kcal
              </div>
            </div>

            {/* Étkezés választó */}
            <div className="meal-selector">
              <h3>Hová add hozzá?</h3>
              <div className="meal-buttons">
                <button 
                  className="meal-btn breakfast"
                  onClick={() => addToMeal('breakfast')}
                  disabled={saving}
                >
                  {saving ? '⏳ Mentés...' : '☀️ Reggeli'}
                </button>
                <button 
                  className="meal-btn lunch"
                  onClick={() => addToMeal('lunch')}
                  disabled={saving}
                >
                  {saving ? '⏳ Mentés...' : '🍲 Ebéd'}
                </button>
                <button 
                  className="meal-btn dinner"
                  onClick={() => addToMeal('dinner')}
                  disabled={saving}
                >
                  {saving ? '⏳ Mentés...' : '🌙 Vacsora'}
                </button>
              </div>
            </div>
          </div>

          <button 
            className="back-btn"
            onClick={() => navigate('/etel-kereses')}
            disabled={saving}
          >
            ← Vissza a kereséshez
          </button>
        </div>
      </div>
    </Layout>
  );
};

export { AddFood };
