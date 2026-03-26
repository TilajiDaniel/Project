import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../styles/index.css';

const Main = () => {
    const navigate = useNavigate();
    const [tipText, setTipText] = useState('Welcome to Food Diary!');
    const [showFirstSetup, setShowFirstSetup] = useState(false);
    const [setupData, setSetupData] = useState({ height: '', weight: '', targetWeight: '' });
    const [activeFaq, setActiveFaq] = useState(null);
    const [isProfileDone, setIsProfileDone] = useState(false);
    const [isCalorieDone, setIsCalorieDone] = useState(false);
    const [isFinalized, setIsFinalized] = useState(false);

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    const faqData = [
        { q: "How does calorie calculation work?", a: "We use the Mifflin-St Jeor equation to calculate your Basal Metabolic Rate (BMR) based on your data." },
        { q: "Why do I need to enter my target weight?", a: "This helps determine whether you need a daily calorie deficit (weight loss) or surplus." },
        { q: "Can I change my data later?", a: "Yes! Profile settings can be reopened anytime if your weight changes." },
        { q: "How much water should I drink daily?", a: "Our system calculates approximately 35ml of water per kilogram of body weight." },
       { 
        q: "Do I need to complete the Calorie Calculator to finish registration?", 
        a: "Yes, it's required. The calculator data feeds into your Statistics page and Diary dashboard, providing personalized daily calorie and water goals." 
        }
    ];

    useEffect(() => {
        const fetchUserStatus = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch('https://localhost:7133/api/Registry/get-setup-status', {
                    method: 'GET',
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json' 
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsProfileDone(data.setupCompletion >= 1);
                    setIsCalorieDone(data.setupCompletion >= 2);
                    setIsFinalized(data.setupCompletion >= 3);
                }
            } catch (error) {
                console.error("Error fetching status:", error);
            }
        };

        fetchUserStatus();
    }, []);

    useEffect(() => {
        const tips = ['Log every meal!', 'Watch your portion sizes!', 'Drink enough water!', 'Exercise daily!'];
        let index = 0;
        const interval = setInterval(() => {
            setTipText(tips[index]);
            index = (index + 1) % tips.length;
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleSetupSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const payload = {
            height: parseFloat(setupData.height),
            currentWeight: parseFloat(setupData.weight),
            targetWeight: parseFloat(setupData.targetWeight)
        };
        
        try {
            const response = await fetch('https://localhost:7133/api/Registry/complete-setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            
            if (response.ok) {
                setIsProfileDone(true);
                localStorage.setItem('isProfileDone', 'true');
                setShowFirstSetup(false);
            }
        } catch (error) { 
        }
    };

    const handleFinalize = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('https://localhost:7133/api/Registry/BefejezesGomb', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setIsFinalized(true);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <Layout>
            <div className="page-content">
                <div className="header-card">
                    <h1>Welcome to Food Diary</h1>
                    <p style={{ color: '#666', marginTop: '10px' }}>Take the first step toward a healthier you!</p>
                </div>

                <div className="content-grid">
                    <div className="main-column">
                        <div className="main-panel-card">
                            <h2>First Steps</h2>
                            <div className="stepper-container">
                                <button 
                                    className="step-button profile"
                                    onClick={() => setShowFirstSetup(true)}
                                    disabled={isProfileDone}
                                >
                                    {isProfileDone ? 'Profile Complete ✓' : 'Set Up Profile'}
                                </button>

                                <div className="step-separator"></div>

                                <button 
                                    className="step-button calc"
                                    onClick={() => navigate('/Kalorie-kalkulator', { state: { fromMain: true } })}
                                    disabled={isCalorieDone || !isProfileDone}
                                >
                                    {isCalorieDone ? 'Calculator Complete ✓' : 'Calorie Calculator'}
                                </button>

                                <div className="step-separator"></div>

                                <button 
                                    className="step-button finalize"
                                    onClick={handleFinalize}
                                    disabled={!isProfileDone || !isCalorieDone || isFinalized}
                                >
                                    {isFinalized ? 'All Set ✓' : 'Complete Setup'}
                                </button>
                            </div>

                            {isFinalized && (
                                <div className="success-message">
                                    <p>Congratulations! The system is ready to use.</p>
                                </div>
                            )}
                        </div>

                        <div className="about-container">
                            <h2>Our Mission</h2>
                            <div className="about-content">
                                <p>Our mission is to help people build healthier lifestyles through simple and accessible technology. With NutriTrack, we aim to provide users with an easy-to-use platform where they can track their daily habits, understand their nutritional intake, and stay motivated to reach their goals.

We believe that maintaining a healthy lifestyle should not be complicated. By combining clear data, intuitive design, and personalized insights, NutriTrack empowers users to make better decisions about their health every day.</p>
                            </div>
                            <div className="about-stats">
                                <div className="stat-item">
                                    <span>100%</span>
                                    <label>Free</label>
                                </div>
                                <div className="stat-item">
                                    <span>Fast</span>
                                    <label>Tracking</label>
                                </div>
                                <div className="stat-item">
                                    <span>Accurate</span>
                                    <label>Data</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="side-column">
                        <div className="side-card tip">
                            <h3>💡 Daily Tip</h3>
                            <p style={{ fontStyle: 'italic', color: '#4a5568' }}>"{tipText}"</p>
                        </div>

                        <div className="faq-container">
                            <h3>Help</h3>
                            <div className="faq-accordion">
                                {faqData.map((item, index) => (
                                    <div key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`}>
                                        <button className="faq-question" onClick={() => toggleFaq(index)}>
                                            <h4>{item.q}</h4>
                                            <span className="faq-icon">{activeFaq === index ? '−' : '+'}</span>
                                        </button>
                                        <div className="faq-answer">
                                            <p>{item.a}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {showFirstSetup && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>👋 Basic Data Entry</h3>
                            <form onSubmit={handleSetupSubmit}>
                                <div className="form-group">
                                    <label>Height (cm)</label>
                                    <input 
                                        type="number" 
                                        value={setupData.height} 
                                        onChange={(e) => setSetupData({...setupData, height: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Current Weight (kg)</label>
                                    <input 
                                        type="number" 
                                        value={setupData.weight} 
                                        onChange={(e) => setSetupData({...setupData, weight: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Target Weight (kg)</label>
                                    <input 
                                        type="number" 
                                        value={setupData.targetWeight} 
                                        onChange={(e) => setSetupData({...setupData, targetWeight: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <button type="submit" className="step-button calc">Save</button>
                                <button type="button" className="cancel-btn" onClick={() => setShowFirstSetup(false)}>
                                    Cancel
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export { Main };
