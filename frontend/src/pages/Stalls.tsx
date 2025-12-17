
import { Link } from 'react-router-dom';
import { stalls } from '../data/stalls';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Stalls = () => {
    const [settings, setSettings] = useState({
        stall1Revealed: false,
        stall2Revealed: false,
        stall3Revealed: false
    });

    useEffect(() => {
        axios.get('http://localhost:5000/api/settings')
            .then(res => setSettings(res.data))
            .catch(err => console.error("Failed to fetch settings", err));
    }, []);

    const isRevealed = (id: string) => {
        const key = `${id.replace('-', '')}Revealed` as keyof typeof settings;
        // stall-1 -> stall1Revealed
        return settings[key] !== undefined ? settings[key] : false;
    };

    return (
        <div>
            <h1 className="page-title">Explore All Stalls</h1>
            <div className="grid-3">
                {stalls.map((stall) => {
                    const revealed = isRevealed(stall.id);
                    return (
                        <div key={stall.id} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', border: revealed ? '1px solid rgba(0, 243, 255, 0.1)' : '1px solid rgba(255, 215, 0, 0.3)' }}>
                            <div style={{ height: '250px', overflow: 'hidden', position: 'relative' }}>
                                <img
                                    src={stall.image}
                                    alt={stall.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        filter: revealed ? 'none' : 'grayscale(100%) brightness(0.7)'
                                    }}
                                />
                                {revealed ? (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                        padding: '1rem'
                                    }}>
                                        <h3 style={{ fontSize: '1.5rem', color: 'white', fontFamily: 'var(--font-mono)' }}>
                                            {stall.label} <span style={{ fontSize: '0.9rem', opacity: 0.8, display: 'block', color: 'var(--primary)' }}>{stall.name}</span>
                                        </h3>
                                    </div>
                                ) : (
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
                                )}
                            </div>
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(180deg, rgba(20,20,30,0) 0%, rgba(0,243,255,0.05) 100%)' }}>
                                {revealed ? (
                                    <>
                                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{stall.description}</p>
                                        <Link to={`/stalls/${stall.id}`} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', border: '1px solid var(--primary)', color: 'var(--primary)' }}>
                                            View & Register
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--text)' }}>{stall.label}</h3>
                                            <p style={{ color: 'var(--text-muted)' }}>{stall.description}</p>
                                        </div>
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
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Stalls;
