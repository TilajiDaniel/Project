import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import Layout from '../components/Layout';
import '../styles/AddFood.css';

const AddFood = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth(); 
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(100);
  const [saving, setSaving] = useState(false);
// Retrieve food data from query parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const foodData = params.get('food');
    
    if (foodData) {
      try {
        const food = JSON.parse(decodeURIComponent(foodData));
        setSelectedFood(food);
      } catch (error) {
        console.error('Food data error:', error);
        navigate('/etel-kereses');
      }
    } else {
      navigate('/etel-kereses');
    }
  }, [location.search, navigate]);
// Function to handle adding food to a meal
  const addToMeal = async (mealType) => {
    setSaving(true);
    
    const authToken = token || localStorage.getItem('token') || localStorage.getItem('Token');
    
    const formattedMealType = mealType.charAt(0).toUpperCase() + mealType.slice(1);

    const now = new Date();
    const localIsoDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString();

    const userIdFromStorage = localStorage.getItem('userId');

    const payload = {
      userId: userIdFromStorage ? parseInt(userIdFromStorage) : 0, 
      mealDate: localIsoDate,
      mealType: formattedMealType,
      foodItems: [
        {
          foodId: selectedFood.foodId,
          quantityGrams: parseInt(quantity)
        }
      ]
    };

    try {
      const response = await fetch('https://localhost:7133/api/Meal/CreateMeal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}` 
        },
        body: JSON.stringify(payload)
      });

    } catch (error) {
      console.error('Network error during save:', error);
    } finally {
      setSaving(false);
    }
  };

  if (!selectedFood) {
    return (
      <Layout>
        <div className="container">
          <div className="main-content">
            <div className="title">🍽️ Add Food</div>
            <div className="empty-state">
              No food selected 😔
              <br />
              <button onClick={() => navigate('/etel-kereses')} className="back-btn">
                ← Back to search
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
             Add {selectedFood.name}
          </div>
          
          <div className="add-food-card">
            <div className="food-preview">
              <div className="food-image">🍗</div>
              <div className="food-details">
                <h2>{selectedFood.name}</h2>
                <div className="base-nutrients">
                  <span> {selectedFood.calories} kcal/100g</span>
                  <span> {selectedFood.protein}g protein</span>
                  <span> {selectedFood.carbs}g carbs</span>
                  <span> {selectedFood.fat}g fat</span>
                </div>
              </div>
            </div>

            <div className="quantity-section">
              <label>Quantity:</label>
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
                Total: {Math.round(selectedFood.calories * quantity / 100)} kcal
              </div>
            </div>

            <div className="meal-selector">
              <h3>Where to add?</h3>
              <div className="meal-buttons">
                <button 
                  className="meal-btn breakfast"
                  onClick={() => addToMeal('breakfast')}
                  disabled={saving}
                >
                  {saving ? ' Saving...' : ' Breakfast'}
                </button>
                <button 
                  className="meal-btn lunch"
                  onClick={() => addToMeal('lunch')}
                  disabled={saving}
                >
                  {saving ? ' Saving...' : ' Lunch'}
                </button>
                <button 
                  className="meal-btn dinner"
                  onClick={() => addToMeal('dinner')}
                  disabled={saving}
                >
                  {saving ? ' Saving...' : ' Dinner'}
                </button>
              </div>
            </div>
          </div>

          <button 
            className="back-btn"
            onClick={() => navigate('/Etel-kereses')}
            disabled={saving}
          >
            ← Back to search
          </button>
        </div>
      </div>
    </Layout>
  );
};

export {AddFood};
