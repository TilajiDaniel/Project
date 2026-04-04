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
// Fetch users and food items on component mount
    useEffect(() => {
        fetchAllData();
    }, []);
// Function to fetch all necessary data for the dashboard
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
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };
// Function to handle user deletion
    const deleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

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
                alert("User deleted!");
            } else {
                alert("Error occurred during deletion!");
            }
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };
// Function to handle food deletion
    const deleteFood = async (foodId) => {
        if (!window.confirm("Are you sure you want to delete this food item?")) return;

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
                alert("Food item deleted!");
            }
        } catch (error) {
            alert("Error during deletion!");
        }
    };
// Function to handle food updates
    const handleUpdate = async (e) => {
        e.preventDefault();
        
        const payload = {
            foodId: Number(editingFood.foodId),
            name: editingFood.name.trim(),
            categoryId: Number(editingFood.categoryId),
            caloriesPer100g: Number(editingFood.caloriesPer100g) || 0,
            proteinPer100g: Number(editingFood.proteinPer100g) || 0,
            carbsPer100g: Number(editingFood.carbsPer100g) || 0,
            fatPer100g: Number(editingFood.fatPer100g) || 0,
            category: {
                categoryId: Number(editingFood.categoryId),
                categoryName: "Updated category",
                description: "Updated by admin"
            },
            mealFoodItems: [] 
        };

        try {
            const res = await fetch(`https://localhost:7133/api/FoodItem/UpdateFoodItem/${editingFood.foodId}`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorText = await res.text();
                return;
            }

            setEditingFood(null);
            fetchAllData();
        } catch (err) {
        }
    };

    if (loading) return <div className="loader">Loading admin data...</div>;

    return (
        <div className="admin-container">
            <button className="back-to-main" onClick={() => navigate('/MainPage')}>
                ⬅ Back to Home
            </button>
            <h1>⚙️ Admin Dashboard</h1>

            <div className="stats-row">
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p className="stat-number">{stats.totalUsers}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Foods</h3>
                    <p className="stat-number">{stats.totalFoods}</p>
                </div>
            </div>

            <div className="table-container">
                <h2>Registered Users</h2>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
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
                                        {user.privilege === 3 ? 'Admin' : 'User'}
                                    </span>
                                </td>
                                <td>
                                    <button 
                                        onClick={() => deleteUser(user.userId)} 
                                        className="delete-btn"
                                        disabled={user.privilege === 3}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="section-header">
                <h2>Food Database</h2>
            </div>

            {editingFood && (
                <div className="edit-form-container">
                    <h3>Edit Food: {editingFood.name}</h3>
                    <form onSubmit={handleUpdate}>
                        <div className="form-group">
                            <label>Food Name</label>
                            <input 
                                type="text" 
                                value={editingFood.name} 
                                onChange={e => setEditingFood({...editingFood, name: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                
                            </div>
                            <div className="form-group">
                                <label>Calories (100g)</label>
                                <input 
                                    type="number" 
                                    value={editingFood.caloriesPer100g} 
                                    onChange={e => setEditingFood({...editingFood, caloriesPer100g: Number(e.target.value)})} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Protein (100g)</label>
                                <input 
                                    type="number" 
                                    value={editingFood.proteinPer100g} 
                                    onChange={e => setEditingFood({...editingFood, proteinPer100g: Number(e.target.value)})} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Carbs (100g)</label>
                                <input 
                                    type="number" 
                                    value={editingFood.carbsPer100g} 
                                    onChange={e => setEditingFood({...editingFood, carbsPer100g: Number(e.target.value)})} 
                                />
                            </div>
                            <div className="form-group">
                                <label>Fat (100g)</label>
                                <input 
                                    type="number" 
                                    value={editingFood.fatPer100g} 
                                    onChange={e => setEditingFood({...editingFood, fatPer100g: Number(e.target.value)})} 
                                />
                            </div>
                        </div>
                        <div className="edit-actions">
                            <button type="submit" className="save-btn">Save</button>
                            <button type="button" className="cancel-btn" onClick={() => setEditingFood(null)}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Calories (100g)</th>
                            <th>Protein</th>
                            <th>Carbs</th>
                            <th>Fat</th>
                            <th>Actions</th>
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
                                    <button className="edit-btn" onClick={() => setEditingFood(food)}>Edit</button>
                                    <button className="delete-btn" onClick={() => deleteFood(food.foodId)}>Delete</button>
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
