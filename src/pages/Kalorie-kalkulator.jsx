import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import '../styles/Kalorie-kalkulator.css';

const Kalorie = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    activity: 'sedentary'
  });
  const [results, setResults] = useState(null);

  const activityOptions = [
    { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
    { value: 'light', label: 'Light (1-3 times a week)' },
    { value: 'moderate', label: 'Moderate (3-5 times a week)' },
    { value: 'very active', label: 'Very active (6-7 times a week)' },
    { value: 'extremely active', label: 'Extremely active (very hard exercise)' }
  ];

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    'very active': 1.725,
    'extremely active': 1.9
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateBMR = (weightKg, heightCm, age, gender) => {
    if (gender === 'male') {
      return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const ageNum = parseInt(formData.age);
    const heightNum = parseInt(formData.height);
    const weightNum = parseFloat(formData.weight);
    const multiplier = activityMultipliers[formData.activity];

    const bmr = calculateBMR(weightNum, heightNum, ageNum, formData.gender);
    const maintenance = Math.round(bmr * multiplier);

    setResults({
      gain: Math.round(maintenance + 500),
      maintain: maintenance,
      lose: Math.round(maintenance - 500)
    });
  };
  const saveDailyGoal = async (calories) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    alert("Kérjük, jelentkezzen be a cél mentéséhez!");
    return;
  }

  const calculatedWater = Math.round(formData.weight * 35);

  try {
    const response = await fetch('https://localhost:7133/api/Registry/save-daily-goals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        dailyCalories: calories, 
        dailyWater: calculatedWater
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData || "Hiba a mentés során");
    }

    alert(`Sikeresen beállítva: ${calories} kcal és ${calculatedWater} ml víz naponta!`);
    setResults(null); 
  } catch (err) {
    console.error("Mentési hiba:", err);
    alert("Nem sikerült elmenteni a célt: " + err.message);
  }
};

  return (
    <Layout>
    <div className="container">

      <div className="main-content">
        <div className="title">
          Calorie Needs Calculator
          
        </div>

     
    <div className="calorie-calculator p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Age (years)</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="1"
            max="120"
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border rounded-md">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Height (cm)</label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            min="100"
            max="250"
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Weight (kg)</label>
          <input
            type="number"
            step="0.1"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            min="30"
            max="300"
            required
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Activity Level</label>
          <select name="activity" value={formData.activity} onChange={handleChange} className="w-full p-2 border rounded-md">
            {activityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
          Calculate
        </button>
      </form>
      {results && (
  <>
    <div className="popup-overlay" onClick={() => setResults(null)}></div>
    <div className="popup-overlay">
      <div className="popup-window">
        <div className="popup-header">
          <h3 className="popup-title">Daily Calorie Recommendations</h3>
          <button className="popup-close" onClick={() => setResults(null)}>&times;</button>
        </div>
        
        <div className="popup-content">
          <ul className="popup-list">
            <li className="popup-item popup-gain" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span><strong>Weight gain:</strong> {results.gain} kcal</span>
              <button className="select-goal-btn" onClick={() => saveDailyGoal(results.gain)}>Kiválasztom</button>
            </li>
            
            <li className="popup-item popup-maintain" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span><strong>Maintain:</strong> {results.maintain} kcal</span>
              <button className="select-goal-btn" onClick={() => saveDailyGoal(results.maintain)}>Kiválasztom</button>
            </li>
            
            <li className="popup-item popup-lose" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span><strong>Losing weight:</strong> {results.lose} kcal</span>
              <button className="select-goal-btn" onClick={() => saveDailyGoal(results.lose)}>Kiválasztom</button>
            </li>
          </ul>
          
          <p className="popup-disclaimer">
            A gombra kattintva a választott érték lesz a napi kereted.
          </p>
        </div>
      </div>
    </div>
  </>
)}

    </div>
    </div>
     </div>
      </Layout>
  );
};

export {Kalorie};
