import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import '../styles/etelek-elrendezese.css'; 

const EtelkElrendezese = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);

  const authToken = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodayMeals();
  }, []);

  const fetchTodayMeals = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('https://localhost:7133/api/Meal/today', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();

        console.log("Backend válasz:", data);

        setMeals(data.meals || data.Meals || []);
        setTotalCalories(data.summary?.totalCalories || 0);
        setTotalProtein(data.summary?.totalProtein || 0);
      } else {
        setError('Nem sikerült betölteni a mai ételeket');
      }
    } catch (error) {
      console.error(' Hiba meals lekérdezés:', error);
      setError('Hálózati hiba történt');
    } finally {
      setLoading(false);
    }
  };

  const deleteMealItem = async (mealId, foodId) => {
    if (!confirm('Biztosan törölni szeretnéd ezt az ételt?')) return;

    try {
      setLoading(true);
      const response = await fetch(
        `https://localhost:7133/api/Meal/item/${mealId}/${foodId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );

      if (response.ok) {
        alert('Ételt töröltük!');
        fetchTodayMeals();
      } else {
        throw new Error('Törlés sikertelen');
      }
    } catch (error) {
      console.error(' Törlési hiba:', error);
      alert(' Törlés sikertelen!');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container">
          <div className="main-content">
            <div className="title"> Mai ételek</div>
            <div className="loading">Betöltés...</div>
          </div>
        </div>
      </Layout>
    );
  }

const groupedMeals = meals.reduce((acc, meal) => {
  const type = meal.mealType; 
  if (!acc[type]) acc[type] = [];
  acc[type].push(meal);
  return acc;
}, {});

const mealOrder = ["Breakfast", "Lunch", "Dinner", "Uzsonna/Nasi"];

  return (
    <Layout>
      <div className="container">
        <div className="main-content">
          <div className="title"> Mai ételek</div>

          {/* ÖSSZESÍTŐ KÁRTYÁK */}
          {meals.length > 0 && (
            <div className="summary-cards">
              <div className="summary-card">
                <span> Összes kalória</span>
                <strong>{totalCalories.toLocaleString()} kcal</strong>
              </div>
              <div className="summary-card">
                <span> Összes fehérje</span>
                <strong>{totalProtein.toFixed(1)}g</strong>
              </div>
              <div className="summary-card">
                <span> Ételek száma</span>
                <strong>{meals.length}</strong>
              </div>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          {meals.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🍽️</div>
              <p>Nincs még ma elmentett étel</p>
              <button className="primary-btn" onClick={fetchTodayMeals}>
                 Frissítés
              </button>
            </div>
          ) : (
            <div className="meal-columns-container">
  {mealOrder.map((type) => (
    groupedMeals[type] && groupedMeals[type].length > 0 && (
      <div key={type} className="meal-column">
        <h3 className="column-title">{type}</h3>
        
        <div className="foods-stack">
          {groupedMeals[type].map((meal) => (
            <div key={meal.itemKey} className="food-card">
              <div className="food-header">
                <div className="meal-type-badge">
                      {meal.mealType}
                    </div>
                <h4>{meal.foodName}</h4>
                <span className="calories-badge">{meal.calories} kcal</span>
              </div>

              <div className="food-details">
                <div className="nutrient-row">
                  <span>quantity: {meal.quantityGrams}g</span>
                </div>
              </div>

              <div className="food-actions">
                <button 
                  className="delete-btn"
                  onClick={() => deleteMealItem(meal.mealId, meal.foodId)} 
                  disabled={loading}>
                  Törlés
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  ))}
</div>
          )}

          {/* AKCIÓ GOMBOK */}
          <div className="actions">
            <button 
              className="primary-btn"
              onClick={() => window.location.href = '/naplo'}
              disabled={loading}
            >
               Vissza
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export { EtelkElrendezese };
