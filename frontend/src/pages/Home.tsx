import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { stalls } from '../data/stalls';

const Home = () => {
    const [settings, setSettings] = useState({
        stall1Revealed: false,
        stall2Revealed: false,
        stall3Revealed: false
    });


    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
        axios.get('http://localhost:5000/api/settings')
            .then(res => setSettings(res.data))
            .catch(err => console.error("Failed to fetch settings", err));

        // Fetch revenue stats (public endpoint)
        axios.get('http://localhost:5000/api/stats')
            .then(res => setTotalRevenue(res.data.totalRevenue || 0))
            .catch(err => console.error("Failed to fetch stats", err));
    }, []);

    const isRevealed = (id: string) => {
        if (id === 'stall-1') return settings.stall1Revealed;
        if (id === 'stall-2') return settings.stall2Revealed;
        if (id === 'stall-3') return settings.stall3Revealed;
        return false;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {/* Hero Section */}
            <section style={{
                textAlign: 'center',
                padding: '6rem 0',
                background: 'linear-gradient(rgba(5, 5, 16, 0.9), rgba(5, 5, 16, 0.8)), url(https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '2rem',
                border: '1px solid var(--primary)',
                boxShadow: '0 0 50px rgba(0, 243, 255, 0.15)'
            }}>
                <div style={{ marginBottom: '2rem' }}>
                    <img src="/sinthanai_logo.png" alt="SINTHANAI Logo" style={{ width: '120px', height: '120px', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))' }} />
                    <p style={{ color: '#ffd700', letterSpacing: '3px', marginTop: '0.5rem', fontWeight: 'bold' }}>ORGANIZED BY SINTHANAI</p>
                </div>

                <h1 style={{
                    fontSize: '4rem',
                    fontWeight: '900',
                    marginBottom: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    background: 'linear-gradient(to right, #00f3ff, #bc13fe)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 20px rgba(0, 243, 255, 0.5)'
                }}>
                    Neuroverse Galaxy
                </h1>
                <p style={{
                    fontSize: '1.2rem',
                    color: '#ffd700',
                    margin: '0 auto 1.5rem',
                    maxWidth: '800px',
                    fontWeight: '600',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                }}>
                    Fundraising for Karuppusamy B, who is fighting kidney failure
                </p>

                <Link to="/about" className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2.5rem' }}>
                    Initialize Sequence <ArrowRight size={20} />
                </Link>
            </section>

            {/* Stalls Section */}
            < section >
                <h2 className="page-title" style={{ fontSize: '2.5rem', textAlign: 'left', fontFamily: 'monospace' }}>
                    <span style={{ color: 'var(--primary)' }}>{'>'}</span> System Modules
                </h2>

                {/* Mission Power Gauge */}
                <div style={{ position: 'relative', margin: '0 auto 4rem', maxWidth: '600px', width: '90%' }}>
                    {/* Label */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontFamily: 'monospace', color: '#00f3ff', fontWeight: 'bold', letterSpacing: '1px' }}>
                        <span>{'>'}{'>'} LIFE SUPPORT SYSTEMS</span>
                        <span>{totalRevenue > 0 ? 'ONLINE' : 'CHARGING...'}</span>
                    </div>

                    {/* Bar Container */}
                    <div style={{ height: '40px', background: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(0, 243, 255, 0.3)', borderRadius: '4px', position: 'relative', overflow: 'hidden', padding: '4px' }}>
                        {/* Grid Background */}
                        <div style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            backgroundImage: 'linear-gradient(90deg, rgba(0,243,255,0.1) 1px, transparent 1px)',
                            backgroundSize: '20px 100%',
                            display: 'block'
                        }} />

                        {/* Fill */}
                        <div style={{
                            width: `${Math.min(((totalRevenue || 0) / 50000) * 100, 100)}%`, // Approx goal visual
                            height: '100%',
                            background: 'linear-gradient(90deg, #00f3ff, #bc13fe)',
                            boxShadow: '0 0 20px rgba(0, 243, 255, 0.5)',
                            borderRadius: '2px',
                            transition: 'width 2s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            minWidth: totalRevenue > 0 ? '5%' : '0%'
                        }}>
                            {/* Shimmer effect */}
                            <div style={{
                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                                transform: 'skewX(-20deg) translateX(-150%)',
                                animation: 'shimmer 2.5s infinite linear'
                            }} />
                        </div>
                    </div>

                    {/* Amount */}
                    <div style={{ marginTop: '1rem', textAlign: 'center', position: 'relative' }}>
                        <div style={{ fontSize: '3.5rem', fontWeight: '900', color: '#ffffff', textShadow: '0 0 10px #00f3ff, 0 0 20px #bc13fe', lineHeight: 1 }}>
                            ₹{totalRevenue.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#ffd700', letterSpacing: '3px', marginTop: '0.5rem', textTransform: 'uppercase', opacity: 0.8 }}>
                            Global Contributions
                        </div>
                    </div>
                </div>
                <style>{`
                    @keyframes shimmer {
                        0% { transform: skewX(-20deg) translateX(-150%); }
                        100% { transform: skewX(-20deg) translateX(400%); }
                    }
                `}</style>

                <div className="grid-3">
                    {stalls.map((stall) => (
                        isRevealed(stall.id) ? (
                            <div key={stall.id} className="glass-panel" style={{ overflow: 'hidden', transition: 'all 0.3s', border: '1px solid rgba(0, 243, 255, 0.1)' }}>
                                <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, padding: '0.5rem 1rem', background: 'var(--primary)', color: 'black', fontWeight: 'bold', zIndex: 10 }}>
                                        {stall.label}
                                    </div>
                                    <img
                                        src={stall.image}
                                        alt={stall.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', filter: 'grayscale(20%) contrast(120%)' }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.1)';
                                            e.currentTarget.style.filter = 'grayscale(0%) contrast(100%)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.filter = 'grayscale(20%) contrast(120%)';
                                        }}
                                    />
                                </div>
                                <div style={{ padding: '1.5rem', background: 'linear-gradient(180deg, rgba(20,20,30,0) 0%, rgba(0,243,255,0.05) 100%)' }}>
                                    <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--text)' }}>{stall.name}</h3>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>{stall.description}</p>
                                    <Link to={`/stalls/${stall.id}`} className="btn btn-secondary" style={{ width: '100%', border: '1px solid var(--primary)', color: 'var(--primary)' }}>
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ) : (

                            <div key={stall.id} className="glass-panel" style={{ overflow: 'hidden', transition: 'all 0.3s', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                                <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, padding: '0.5rem 1rem', background: 'var(--primary)', color: 'black', fontWeight: 'bold', zIndex: 10 }}>
                                        {stall.label}
                                    </div>
                                    <img
                                        src={stall.image}
                                        alt={stall.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(100%) brightness(0.7)' }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        background: 'rgba(0,0,0,0.7)',
                                        padding: '0.5rem 1rem',
                                        border: '1px solid #ffd700',
                                        color: '#ffd700',
                                        fontWeight: 'bold',
                                        letterSpacing: '1px'
                                    }}>
                                        COMING SOON
                                    </div>
                                </div>
                                <div style={{ padding: '1.5rem', background: 'linear-gradient(180deg, rgba(20,20,30,0) 0%, rgba(0,243,255,0.05) 100%)' }}>
                                    <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--text)' }}>{stall.name}</h3>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>{stall.description}</p>
                                    <button disabled className="btn" style={{
                                        width: '100%',
                                        border: '1px dashed #ffd700',
                                        color: '#ffd700',
                                        background: 'transparent',
                                        cursor: 'not-allowed',
                                        opacity: 0.8
                                    }}>
                                        Coming Soon...
                                    </button>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
