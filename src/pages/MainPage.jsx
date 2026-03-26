import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import '../styles/index.css';

const Main = () => {
    const navigate = useNavigate();
    const [tipText, setTipText] = useState('Üdvözöl az Ételnapló!');
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
        { q: "Hogyan működik a kalóriaszámítás?", a: "A megadott adataid alapján a Mifflin-St Jeor egyenletet használjuk az alapanyagcsere (BMR) kiszámításához." },
        { q: "Miért kell megadnom a cél súlyomat?", a: "Ez segít meghatározni, hogy napi kalóriadeficitre (fogyás) vagy többletre van-e szükséged." },
        { q: "Módosíthatom később az adataimat?", a: "Igen! A profilbeállítások bármikor újranyithatóak, ha változik a súlyod." },
        { q: "Mennyi vizet igyak naponta?", a: "A rendszerünk testsúlykilogrammonként kb. 35ml vízzel kalkulál." }
    ];

    // Felhasználói állapot lekérése
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
                console.error("Hiba az állapot lekérésekor:", error);
            }
        };

        fetchUserStatus();
    }, []);

    // Napi tipp rotáció
    useEffect(() => {
        const tips = ['Írd fel minden étkezést!', 'Figyelj a Portion méretekre!', 'Igyál elég vizet!', 'Mozogj naponta!'];
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
                alert("Profil mentve!");
            }
        } catch (error) { 
            alert('Hiba történt!'); 
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
                alert("Sikeres befejezés!");
            }
        } catch (error) {
            console.error("Hiba:", error);
        }
    };

    return (
        <Layout>
            <div className="page-content">
                <div className="header-card">
                    <h1>Üdvözöl az Ételnapló</h1>
                    <p style={{ color: '#666', marginTop: '10px' }}>Tedd meg az első lépést az egészségesebb éned felé!</p>
                </div>

                <div className="content-grid">
                    <div className="main-column">
                        <div className="main-panel-card">
                            <h2>Kezdő lépések</h2>
                            <div className="stepper-container">
                                <button 
                                    className="step-button profile"
                                    onClick={() => setShowFirstSetup(true)}
                                    disabled={isProfileDone}
                                >
                                    {isProfileDone ? 'Profil kész ✓' : 'Profil beállítás'}
                                </button>

                                <div className="step-separator"></div>

                                <button 
                                    className="step-button calc"
                                    onClick={() => navigate('/Kalorie-kalkulator', { state: { fromMain: true } })}
                                    disabled={isCalorieDone || !isProfileDone}
                                >
                                    {isCalorieDone ? 'Kalkulátor kész ✓' : 'Kalóriakalkulátor'}
                                </button>

                                <div className="step-separator"></div>

                                <button 
                                    className="step-button finalize"
                                    onClick={handleFinalize}
                                    disabled={!isProfileDone || !isCalorieDone || isFinalized}
                                >
                                    {isFinalized ? 'Minden kész ✓' : 'Befejezés'}
                                </button>
                            </div>

                            {isFinalized && (
                                <div className="success-message">
                                    <p>Gratulálunk! A rendszer készen áll a használatra.</p>
                                </div>
                            )}
                        </div>

                        <div className="about-container">
                            <h2>Küldetésünk</h2>
                            <div className="about-content">
                                <p>Az Ételnapló nem csak egy kalóriaszámláló...</p>
                            </div>
                            <div className="about-stats">
                                <div className="stat-item">
                                    <span>100%</span>
                                    <label>Ingyenes</label>
                                </div>
                                <div className="stat-item">
                                    <span>Gyors</span>
                                    <label>Kezelés</label>
                                </div>
                                <div className="stat-item">
                                    <span>Hiteles</span>
                                    <label>Adatok</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="side-column">
                        <div className="side-card tip">
                            <h3>💡 Napi tipp</h3>
                            <p style={{ fontStyle: 'italic', color: '#4a5568' }}>"{tipText}"</p>
                        </div>

                        <div className="faq-container">
                            <h3>Segítség</h3>
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
                            <h3>👋 Alapadatok megadása</h3>
                            <form onSubmit={handleSetupSubmit}>
                                <div className="form-group">
                                    <label>Magasság (cm)</label>
                                    <input 
                                        type="number" 
                                        value={setupData.height} 
                                        onChange={(e) => setSetupData({...setupData, height: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Jelenlegi súly (kg)</label>
                                    <input 
                                        type="number" 
                                        value={setupData.weight} 
                                        onChange={(e) => setSetupData({...setupData, weight: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Cél súly (kg)</label>
                                    <input 
                                        type="number" 
                                        value={setupData.targetWeight} 
                                        onChange={(e) => setSetupData({...setupData, targetWeight: e.target.value})} 
                                        required 
                                    />
                                </div>
                                <button type="submit" className="step-button calc">Mentés</button>
                                <button type="button" className="cancel-btn" onClick={() => setShowFirstSetup(false)}>
                                    Mégse
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
