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


    const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
};

const faqData = [
    { q: "Hogyan működik a kalóriaszámítás?", a: "A megadott adataid alapján a Mifflin-St Jeor egyenletet használjuk az alapanyagcsere (BMR) kiszámításához." },
    { q: "Miért kell megadnom a cél súlyomat?", a: "Ez segít meghatározni, hogy napi kalóriadeficitre (fogyás) vagy többletre van-e szükséged." },
    { q: "Módosíthatom később az adataimat?", a: "Igen! A profilbeállítások bármikor újranyithatóak, ha változik a súlyod." },
    { q: "Mennyi vizet igyak naponta?", a: "A rendszerünk testsúlykilogrammonként kb. 35ml vízzel kalkulál." }
];
    // Állapotok betöltése
    const [isProfileDone, setIsProfileDone] = useState(() => localStorage.getItem('isProfileDone') === 'true');
    const [isCalorieDone, setIsCalorieDone] = useState(() => localStorage.getItem('isCalorieDone') === 'true');
    const [isFinalized, setIsFinalized] = useState(() => localStorage.getItem('isSetupFinalized') === 'true');

    const isAllComplete = isProfileDone && isCalorieDone;

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
        try {
            const response = await fetch('https://localhost:7133/api/Registry/complete-setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(setupData)
            });
            if (response.ok) {
                setIsProfileDone(true);
                localStorage.setItem('isProfileDone', 'true');
                setShowFirstSetup(false);
                alert("Profil mentve!");
            }
        } catch (error) { alert('Hiba történt!'); }
    };

    const handleFinalize = () => {
        setIsFinalized(true);
        localStorage.setItem('isSetupFinalized', 'true');
        alert("Minden kész!");
    };

    return (
    <Layout>
        <div className="page-content">
            {/* 1. Fejléc */}
            <div className="header-card">
                <h1>Üdvözöl az Ételnapló</h1>
                <p style={{ color: '#666', marginTop: '10px' }}>Tedd meg az első lépést az egészségesebb éned felé!</p>
            </div>

            <div className="content-grid">
                
                {/* BAL OLDAL - FŐ TARTALOM */}
                <div className="main-column" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    
                    {/* Setup Szekció */}
                    <div className="main-panel-card">
                        <h2 style={{ marginBottom: '30px' }}>🏁 Kezdő lépések</h2>
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
                                <p>✨ Gratulálunk! A rendszer készen áll a használatra.</p>
                            </div>
                        )}
                    </div>

                    {/* Rólunk Szekció - Ide került, hogy kitöltse a teret */}
                    <div className="about-container">
            <h2><span>🍎</span> Küldetésünk</h2>
            <div className="about-content">
                <p>Az Ételnapló nem csak egy kalóriaszámláló...</p>
            </div>
            <div className="about-stats">
                <div className="stat-item"><span>100%</span><label>Ingyenes</label></div>
                <div className="stat-item"><span>Gyors</span><label>Kezelés</label></div>
                <div className="stat-item"><span>Hiteles</span><label>Adatok</label></div>
            </div>
        </div>
                </div>

                {/* JOBB OLDAL - INFORMÁCIÓK */}
                <div className="side-column" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    
                    {/* Napi Tipp Kártya */}
                    <div className="side-card tip" style={{ borderLeft: '5px solid #ff7675' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>💡 Napi tipp</h3>
                        <p style={{ fontStyle: 'italic', color: '#4a5568' }}>"{tipText}"</p>
                    </div>

                    {/* GYIK Accordion */}
                    <div className="faq-container" style={{ marginTop: '0' }}>
                        <h3 style={{ marginBottom: '20px', fontSize: '1.3rem' }}>❓ Segítség</h3>
                        <div className="faq-accordion">
                            {faqData.map((item, index) => (
                                <div key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`}>
                                    <button className="faq-question" onClick={() => toggleFaq(index)} style={{ padding: '12px 15px' }}>
                                        <h4 style={{ fontSize: '0.95rem' }}>{item.q}</h4>
                                        <span className="faq-icon">{activeFaq === index ? '−' : '+'}</span>
                                    </button>
                                    <div className="faq-answer">
                                        <p style={{ fontSize: '0.9rem', padding: '0 15px 15px 15px' }}>{item.a}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>

        {/* Modal változatlan marad */}
        {showFirstSetup && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>👋 Alapadatok megadása</h3>
                        <form onSubmit={handleSetupSubmit}>
                            <div className="form-group">
                                <label>Magasság (cm)</label>
                                <input type="number" value={setupData.height} onChange={(e) => setSetupData({...setupData, height: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>Jelenlegi súly (kg)</label>
                                <input type="number" value={setupData.weight} onChange={(e) => setSetupData({...setupData, weight: e.target.value})} required />
                            </div>
                            <div className="form-group">
                                <label>Cél súly (kg)</label>
                                <input type="number" value={setupData.targetWeight} onChange={(e) => setSetupData({...setupData, targetWeight: e.target.value})} required />
                            </div>
                            <button type="submit" className="step-button calc" style={{width: '100%', marginTop: '10px'}}>Mentés</button>
                            <button type="button" onClick={() => setShowFirstSetup(false)} style={{width: '100%', marginTop: '10px', border: 'none', background: 'none'}}>Mégse</button>
                        </form>
                    </div>
                </div>
            )}
    </Layout>
);


};

export { Main };