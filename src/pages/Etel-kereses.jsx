import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../styles/Etel-kereso.css';

const EtelKereses = () => {
  const [allFoods, setAllFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  const categoryNames = {
    1: 'Soups', 2: 'Cooked meals', 3: 'Fast food',
    4: 'Bakery', 5: 'Meat', 6: 'Vegetables',
    7: 'Fruits', 8: 'Dairy', 9: 'Drinks',
    10: 'Snacks', 11: 'Desserts'
  };

  useEffect(() => {
    loadFoods();
  }, []);
// Function to load food items from the API
  const loadFoods = async () => {
    setLoading(true);
    try {
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      const response = await fetch('https://localhost:7133/api/FoodItem/GetFoodItems', { headers });

      if (response.ok) {
        const foods = await response.json();
        setAllFoods(foods);
      }
      setFilteredFoods(foods || []);
    } catch (error) {
      setFilteredFoods([]);
    } finally {
      setLoading(false);
    }
  };
// Effect to filter foods based on search term and active category
  useEffect(() => {
    let filtered = allFoods;
    
    if (activeCategory !== 'all') {
      const categoryId = Object.entries(categoryNames)
        .find(([id, name]) => name === activeCategory)?.[0];
      
      if (categoryId) {
        filtered = filtered.filter(food => {
          const foodCatId = food.category?.categoryId;
          const match = parseInt(foodCatId) === parseInt(categoryId);
          return match;
        });
      }
    }
    
    if (searchTerm.trim()) {
      filtered = filtered.filter(food => 
        food.name?.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
    }
    
    setFilteredFoods(filtered);
  }, [allFoods, activeCategory, searchTerm]);
// Function to handle category filtering
  const filterByCategory = (categoryName) => {
    setActiveCategory(categoryName === 'All' ? 'all' : categoryName);
  };
// Function to handle search term changes
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  
  const categories = ['All', ...Object.entries(categoryNames).map(([id, name]) => name)];
// Function to render food cards based on the current state
  const renderFoodCards = () => {
    if (loading) {
      return <div style={{textAlign: 'center', color: '#666', gridColumn: '1/-1'}}> Loading...</div>;
    }

    if (filteredFoods.length === 0) {
      return <div style={{textAlign: 'center', color: '#666', gridColumn: '1/-1'}}> No results found</div>;
    }

    return filteredFoods.map((food, index) => (
      <div key={food.id || food.foodItemId || index} className="food-card">
        <h3>{food.name || 'No name'}</h3>
        <div className="nutrients">
          <span> Calories: {food.caloriesPer100g || 0} kcal</span>
          <span> Protein: {food.proteinPer100g || 0}g</span>
          <span> Carbs: {food.carbsPer100g || 0}g</span>
          <span> Fat: {food.fatPer100g || 0}g</span>
        </div>
        <small>Category: {food.category?.categoryName || food.category?.CategoryName || 'Other'}</small>
        <button onClick={() => addFoodToNaplo(food)} className="add-food-btn">Add</button>
      </div>
    ));
  };
// Function to handle adding a food item to the daily log
  const addFoodToNaplo = (food) => {
    console.log("Clicked food raw data from API:", food);
    const foodData = encodeURIComponent(JSON.stringify({
      foodId: food.foodId || food.FoodId || food.id || food.food_id,
      name: food.name,
      calories: food.caloriesPer100g,
      protein: food.proteinPer100g,
      carbs: food.carbsPer100g,
      fat: food.fatPer100g,
      category: food.category?.categoryName
    }));
    
    window.location.href = `/addfood?food=${foodData}&from=search`;
  };

  return (
    <Layout>
      <div className="container">
        <div className="main-content">
          <div className="title">Food Search</div>
          
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search food..." 
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <div className="category-cards" id="categoryCards">
              {categories.map(cat => {
                const catKey = cat === 'All' ? 'all' : cat;
                return (
                  <div 
                    key={cat}
                    className={`category-card ${activeCategory === catKey ? 'active' : ''}`}
                    onClick={() => filterByCategory(cat)}
                    style={{cursor: 'pointer'}}
                  >
                    {cat}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="results-wrapper">
            <div className="results-panel">
              <div className="food-grid" id="foodCards">
                {renderFoodCards()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export { EtelKereses };
