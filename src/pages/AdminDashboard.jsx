import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [foodItems, setFoodItems] = useState([]);
    const [editingFood, setEditingFood] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalUsers: 0, totalFoods: 0 });

    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const headers = { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const [userRes, foodRes] = await Promise.all([
                fetch("https://localhost:7133/api/User/GetUsers", { headers }),
                fetch("https://localhost:7133/api/FoodItem/GetFoodItems", { headers })
            ]);

            let userData = [];
            let foodData = [];

            if (userRes.ok) {
                userData = await userRes.json();
                setUsers(userData);
            }
            
            if (foodRes.ok) {
                foodData = await foodRes.json();
                setFoodItems(foodData);
            }
            setStats({
                totalUsers: userData.length,
                totalFoods: foodData.length
            });

        } catch (error) {
            console.error("Hiba az adatok betöltésekor:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId) => {
        if (!window.confirm("Biztosan törölni szeretnéd ezt a felhasználót?")) return;

        try {
            const response = await fetch(`https://localhost:7133/api/User/DeleteUser/${userId}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
            });

            if (response.ok) {
                const updatedUsers = users.filter(u => u.userId !== userId);
                setUsers(updatedUsers);
                setStats(prev => ({ ...prev, totalUsers: updatedUsers.length }));
                alert("Felhasználó törölve!");
            } else {
                alert("Hiba történt a törlés során!");
            }
        } catch (error) {
            console.error("Hiba a törlésnél:", error);
        }
    };

    const deleteFood = async (foodId) => {
        if (!window.confirm("Biztosan törölni szeretnéd ezt az ételt?")) return;

        try {
            const response = await fetch(`https://localhost:7133/api/FoodItem/DeleteFoodItem/${foodId}`, {
                method: 'DELETE',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const updatedFoods = foodItems.filter(f => f.foodId !== foodId);
                setFoodItems(updatedFoods);
                setStats(prev => ({ ...prev, totalFoods: updatedFoods.length }));
                alert("Étel törölve!");
            }
        } catch (error) {
            alert("Hiba a törlés során!");
        }
    };

    const handleUpdate = async (e) => {
    e.preventDefault();
    console.log('editingFood:', editingFood);  // Ellenőrizd: foodId legyen ott
    if (!editingFood?.foodId) {
        alert("Hiányzó Food ID!");
        return;
    }
    try {
        const res = await fetch(`https://localhost:7133/api/FoodItem/UpdateFoodItem/${editingFood.foodId}`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
        name: editingFood.name,
        categoryId: editingFood.categoryId,
        caloriesPer100g: editingFood.caloriesPer100g,
        proteinPer100g: editingFood.proteinPer100g,
        carbsPer100g: editingFood.carbsPer100g,
        fatPer100g: editingFood.fatPer100g
         })
        });
        if (!res.ok) {
            const error = await res.text();
            console.error('Hiba:', res.status, error);
            alert(`Hiba: ${res.status} - ${error}`);
            return;
        }
        alert("Sikeres mentés!");
        setEditingFood(null);
        fetchAllData();
    } catch (err) {
        console.error(err);
        alert("Hálózati hiba!");
    }
};

    if (loading) return <div className="loader">Admin adatok betöltése...</div>;

    return (
        <div className="admin-container">
          <button className="back-to-main" onClick={() => navigate('/MainPage')}>
                ⬅ Vissza a főoldalra
            </button>
            <h1>⚙️ Adminisztrációs Panel</h1>

            <div className="stats-row">
                <div className="stat-card">
                    <h3>Összes felhasználó</h3>
                    <p className="stat-number">{stats.totalUsers}</p>
                </div>
                <div className="stat-card">
                    <h3>Összes étel</h3>
                    <p className="stat-number">{stats.totalFoods}</p>
                </div>
            </div>

            <div className="table-container">
                <h2>Regisztrált Felhasználók</h2>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Felhasználónév</th>
                            <th>Email</th>
                            <th>Jogosultság</th>
                            <th>Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.userId}>
                                <td>{user.userId}</td>
                                <td><strong>{user.username}</strong></td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`badge ${user.privilege === 3 ? 'badge-admin' : 'badge-user'}`}>
                                        {user.privilege === 3 ? 'Admin' : 'Tag'}
                                    </span>
                                </td>
                                <td>
                                    <button 
                                        onClick={() => deleteUser(user.userId)} 
                                        className="delete-btn"
                                        disabled={user.privilege === 3}
                                    >
                                        Törlés
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="section-header">
                <h2>Élelmiszer Adatbázis</h2>
            </div>

            {editingFood && (
                <div className="edit-form-container">
                    <h3>Étel szerkesztése: {editingFood.name}</h3>
                    <form onSubmit={handleUpdate}>
                        <div className="form-group">
                            <label>Étel neve</label>
                            <input 
                                type="text" 
                                value={editingFood.name} 
                                onChange={e => setEditingFood({...editingFood, name: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Kategória </label>
                                <input 
                                    type="number" 
                                    value={editingFood.categoryId} 
                                    onChange={e => setEditingFood({...editingFood, categoryId: Number(e.target.value)})} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Kalória (100g)</label>
                                <input 
                                    type="number" 
                                    value={editingFood.caloriesPer100g} 
                                    onChange={e => setEditingFood({...editingFood, caloriesPer100g: Number(e.target.value)})} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Fehérje (100g)</label>
                                <input 
                                    type="number" 
                                    value={editingFood.proteinPer100g} 
                                    onChange={e => setEditingFood({...editingFood, proteinPer100g: Number(e.target.value)})} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Szénhidrát (100g)</label>
                                <input 
                                    type="number" 
                                    value={editingFood.carbsPer100g} 
                                    onChange={e => setEditingFood({...editingFood, carbsPer100g: Number(e.target.value)})} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Zsír (100g)</label>
                                <input 
                                    type="number" 
                                    value={editingFood.fatPer100g} 
                                    onChange={e => setEditingFood({...editingFood, fatPer100g: Number(e.target.value)})} 
                                />
                            </div>
                        </div>
                        <div className="edit-actions">
                            <button type="submit" className="save-btn">Mentés</button>
                            <button type="button" className="cancel-btn" onClick={() => setEditingFood(null)}>Mégse</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Név</th>
                            <th>Kategória</th>
                            <th>Kalória (100g)</th>
                            <th>Fehérje</th>
                            <th>Szénhidrát</th>
                            <th>Zsír</th>
                            <th>Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        {foodItems.map(food => (
                            <tr key={food.foodId}>
                                <td>{food.foodId}</td>
                                <td>{food.name}</td>
                                <td>{food.categoryId}</td>
                                <td>{food.caloriesPer100g} kcal</td>
                                <td>{food.proteinPer100g}g</td>
                                <td>{food.carbsPer100g}g</td>
                                <td>{food.fatPer100g}g</td>
                                <td>
                                    <button className="edit-btn" onClick={() => setEditingFood(food)}>Szerkesztés</button>
                                    <button className="delete-btn" onClick={() => deleteFood(food.foodId)}>Törlés</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
