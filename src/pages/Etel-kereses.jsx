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

  // 🌍 Kategóriák
  const categoryNames = {
    1: 'Soups', 2: 'Cooked meals', 3: 'Fast food',
    4: 'Bakery', 5: 'Meat', 6: 'Vegetables',
    7: 'Fruits', 8: 'Dairy', 9: 'Drinks',
    10: 'Snacks', 11: 'Desserts'
  };

  // 🚀 Ételek betöltése
  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    setLoading(true);
    try {
      const headers = { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
      
      const response = await fetch('https://localhost:7133/api/FoodItem/GetFoodItems', { headers });

 
      if (response.ok)
      {
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

  // 🧠 AUTOMATIKUS SZŰRÉS - ez kezeli MINDEN szűrést!
  useEffect(() => {
    
    let filtered = allFoods;
    
    // 🎯 Kategória szűrés
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
    
    // 🔍 Szöveges keresés
    if (searchTerm.trim()) {
      filtered = filtered.filter(food => 
        food.name?.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
    }
    
    console.log('✅ Szűrés eredménye:', filtered.length, 'étel'); // DEBUG
    setFilteredFoods(filtered);
  }, [allFoods, activeCategory, searchTerm]);

  // 📱 Egyszerűsített kategória kattintás
  const filterByCategory = (categoryName) => {

    setActiveCategory(categoryName === 'Összes' ? 'all' : categoryName);
  };

  // 🔍 Egyszerűsített keresés
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  // 📱 Kategória kártyák
  const categories = ['Összes', ...Object.entries(categoryNames).map(([id, name]) => name)];


  // 🖼️ Étel kártyák renderelése
  const renderFoodCards = () => {
    if (loading) {
      return <div style={{textAlign: 'center', color: '#666', gridColumn: '1/-1'}}>⏳ Betöltés...</div>;
    }

    if (filteredFoods.length === 0) {
      return <div style={{textAlign: 'center', color: '#666', gridColumn: '1/-1'}}>🔍 Nincs találat</div>;
    }

    return filteredFoods.map((food, index) => (
      <div key={food.id || food.foodItemId || index} className="food-card">
        <h3>{food.name || 'Nincs név'}</h3>
        <div className="nutrients">
          <span>🔥 Kalória: {food.caloriesPer100g || 0} kcal</span>
          <span>💪 Protein: {food.proteinPer100g || 0}g</span>
          <span>🍞 Szénhidrát: {food.carbsPer100g || 0}g</span>
          <span>🧈 Zsír: {food.fatPer100g || 0}g</span>
        </div>
        <small>Kategória: {food.category?.categoryName || food.category?.CategoryName || 'Egyéb'}</small>
        <button onClick={() => addFoodToNaplo(food)} className="add-food-btn">Hozzáadás</button>
      </div>
    ));
  };



  
const addFoodToNaplo = (food) => {
  console.log("Kattintott étel nyers adatai az API-ból:", food);
  const foodData = encodeURIComponent(JSON.stringify({
    foodId: food.foodId || food.FoodId || food.id || food.food_id,
    name: food.name,
    calories: food.caloriesPer100g,
    protein: food.proteinPer100g,
    carbs: food.carbsPer100g,
    fat: food.fatPer100g,
    category: food.category?.categoryName
  }));
  
  // ÁTIRÁNYÍTÁS AddFood.jsx-be
  window.location.href = `/addfood?food=${foodData}&from=search`;
};



  return (
    <Layout>
    <div className="container">
      
      <div className="main-content">
        <div className="title">Étel keresése</div>
        
        {/* KERESŐ SÁV */}
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Étel keresése..." 
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div className="category-cards" id="categoryCards">
            {categories.map(cat => {
              const catKey = cat === 'Összes' ? 'all' : cat;
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

        {/* EREDMÉNYEK */}
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
