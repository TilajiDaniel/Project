import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import '../styles/Etel-kereso.css';

const EtelKereses = () => {
  const [allFoods, setAllFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // 🌍 Kategóriák
  const categoryNames = {
    1: 'Levesek', 2: 'Főtt ételek', 3: 'Gyorsétterem',
    4: 'Péksütemény', 5: 'Hús', 6: 'Zöldség',
    7: 'Gyümölcs', 8: 'Tejtermék', 9: 'Ital',
    10: 'Nassolnivaló', 11: 'Édesség'
  };

  // 🚀 Ételek betöltése
  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    try {
      setLoading(true);
      console.log('📡 API hívás...');
      const response = await fetch('https://localhost:7133/api/FoodItem/GetFoodItems');
      const data = await response.json();
      
      console.log('✅ Ételek:', data);
      console.log('📋 Első étel struktúra:', data[0]); // DEBUG
      setAllFoods(data || []);
      setFilteredFoods(data || []);
    } catch (error) {
      console.error('❌ API HIBA:', error);
      setFilteredFoods([]);
    } finally {
      setLoading(false);
    }
  };

  // 🧠 AUTOMATIKUS SZŰRÉS - ez kezeli MINDEN szűrést!
  useEffect(() => {
    console.log('🔄 Szűrés:', { activeCategory, searchTerm, allFoodsLength: allFoods.length });
    
    let filtered = allFoods;
    
    // 🎯 Kategória szűrés
    if (activeCategory !== 'all') {
      const categoryId = Object.entries(categoryNames)
        .find(([id, name]) => name === activeCategory)?.[0];
      
      console.log('🔍 Kategória ID:', categoryId); // DEBUG
      
      if (categoryId) {
        filtered = filtered.filter(food => {
          const foodCatId = food.category?.categoryId;
          const match = parseInt(foodCatId) === parseInt(categoryId);
          console.log('🍲 Ételenkénti egyezés:', food.name, foodCatId, '==', categoryId, match); // DEBUG
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
    console.log('🖱️ Kategória kattintás:', categoryName);
    setActiveCategory(categoryName === 'Összes' ? 'all' : categoryName);
  };

  // 🔍 Egyszerűsített keresés
  const handleSearch = (term) => {
    console.log('🔍 Keresés:', term);
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
      </div>
    ));
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
