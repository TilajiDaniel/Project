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

        setMeals(data.meals || data.Meals || []);
        setTotalCalories(data.summary?.totalCalories || 0);
        setTotalProtein(data.summary?.totalProtein || 0);
      } 
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const deleteMealItem = async (mealId, foodId) => {
    if (!confirm('Are you sure you want to delete this food item?')) return;

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
        fetchTodayMeals();
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container">
          <div className="main-content">
            <div className="title">Today's Meals</div>
            <div className="loading">Loading...</div>
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

  const mealOrder = ["Breakfast", "Lunch", "Dinner", "Snack"];

  return (
    <Layout>
      <div className="container">
        <div className="main-content">
          <div className="title">Today's Meals</div>

          {meals.length > 0 && (
            <div className="summary-cards">
              <div className="summary-card">
                <span>Total Calories</span>
                <strong>{totalCalories.toLocaleString()} kcal</strong>
              </div>
              <div className="summary-card">
                <span>Total Protein</span>
                <strong>{totalProtein.toFixed(1)}g</strong>
              </div>
              <div className="summary-card">
                <span>Food Items</span>
                <strong>{meals.length}</strong>
              </div>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          {meals.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🍽️</div>
              <p>No meals saved today yet</p>
              <button className="primary-btn" onClick={fetchTodayMeals}>
                 Refresh
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
                              disabled={loading}
                            >
                              Delete
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

          <div className="actions">
            <button 
              className="primary-btn"
              onClick={() => window.location.href = '/naplo'}
              disabled={loading}
            >
               Back
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export { EtelkElrendezese };
