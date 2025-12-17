
import { useState, useEffect } from 'react';
import { BarChart3, Users, MessageSquare, IndianRupee, Trash2, CheckCircle, XCircle, Settings, Eye, EyeOff } from 'lucide-react';

import axios from 'axios';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<'stats' | 'registrations' | 'feedback' | 'settings'>('stats');
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [feedback, setFeedback] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalRegistrations: 0,
        totalFeedback: 0,
        totalRevenue: 0
    });
    const [eventSettings, setEventSettings] = useState({
        stall1Revealed: false,
        stall2Revealed: false,
        stall3Revealed: false
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        try {
            if (activeTab === 'stats') {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/stats`);
                setStats(res.data);
            } else if (activeTab === 'registrations') {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/registrations`);
                setRegistrations(res.data);
            } else if (activeTab === 'feedback') {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/feedback`);
                setFeedback(res.data);
            } else if (activeTab === 'settings') {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/settings`);
                setEventSettings(res.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const togglePayment = async (id: string) => {
        try {
            const reg = registrations.find(r => r.id === id);
            const newStatus = reg.paymentStatus === 'Paid' ? 'Pending' : 'Paid';
            await axios.patch(`${import.meta.env.VITE_API_URL}/api/registrations/${id}/payment`, { status: newStatus });
            fetchData(); // Refresh
        } catch (error) {
            console.error(error);
        }
    };

    const deleteRegistration = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this registration?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/registrations/${id}`);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const deleteFeedback = async (id: string) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/feedback/${id}`);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const toggleStallReveal = async (key: string, currentValue: boolean) => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/api/settings`, {
                [key]: !currentValue
            });
            fetchData(); // Refresh settings
        } catch (error) {
            console.error("Failed to update settings", error);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="page-title" style={{ marginBottom: 0 }}>Admin Dashboard</h1>
                <button
                    onClick={() => { localStorage.removeItem('isAdmin'); window.location.href = '/admin'; }}
                    className="btn btn-secondary"
                >
                    Logout
                </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('stats')}
                    className={`btn ${activeTab === 'stats' ? 'btn-primary' : 'btn-secondary'}`}
                >
                    <BarChart3 size={18} /> Overview
                </button>
                <button
                    onClick={() => setActiveTab('registrations')}
                    className={`btn ${activeTab === 'registrations' ? 'btn-primary' : 'btn-secondary'}`}
                >
                    <Users size={18} /> Registrations
                </button>
                <button
                    onClick={() => setActiveTab('feedback')}
                    className={`btn ${activeTab === 'feedback' ? 'btn-primary' : 'btn-secondary'}`}
                >
                    <MessageSquare size={18} /> Feedback
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-secondary'}`}
                >
                    <Settings size={18} /> Event Controls
                </button>
            </div>

            {/* Content */}
            <div className="animate-fade-in">
                {activeTab === 'stats' && (
                    <div className="grid-3">
                        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Users size={40} color="var(--primary)" />
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalRegistrations}</div>
                                <div style={{ color: 'var(--text-muted)' }}>Total Registrations</div>
                            </div>
                        </div>
                        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <MessageSquare size={40} color="var(--secondary)" />
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalFeedback}</div>
                                <div style={{ color: 'var(--text-muted)' }}>Feedback Received</div>
                            </div>
                        </div>
                        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <IndianRupee size={40} color="var(--success)" />
                            <div>
                                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>₹{stats.totalRevenue}</div>
                                <div style={{ color: 'var(--text-muted)' }}>Total Revenue (Est.)</div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'registrations' && (
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                    <th style={{ padding: '1rem' }}>Name</th>
                                    <th style={{ padding: '1rem' }}>Stall</th>
                                    <th style={{ padding: '1rem' }}>Contact</th>
                                    <th style={{ padding: '1rem' }}>Status</th>
                                    <th style={{ padding: '1rem' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.map(reg => (
                                    <tr key={reg.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem' }}>{reg.name}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                background: 'rgba(255,255,255,0.1)',
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '1rem',
                                                fontSize: '0.8rem'
                                            }}>
                                                {reg.stallName}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{reg.email}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                color: reg.paymentStatus === 'Paid' ? 'var(--success)' : 'var(--warning)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.4rem'
                                            }}>
                                                {reg.paymentStatus === 'Paid' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                                {reg.paymentStatus}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <button
                                                onClick={() => togglePayment(reg.id)}
                                                className={reg.paymentStatus === 'Paid' ? 'btn btn-secondary' : 'btn btn-primary'}
                                                style={{
                                                    padding: '0.4rem 0.8rem',
                                                    fontSize: '0.8rem',
                                                    marginRight: '0.5rem',
                                                    background: reg.paymentStatus === 'Paid' ? 'rgba(255,255,255,0.1)' : 'var(--success)',
                                                    borderColor: reg.paymentStatus === 'Paid' ? 'var(--border)' : 'transparent'
                                                }}
                                            >
                                                {reg.paymentStatus === 'Paid' ? 'Mark Pending' : 'Mark Paid'}
                                            </button>
                                            <button
                                                onClick={() => deleteRegistration(reg.id)}
                                                className="btn btn-secondary"
                                                style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem', color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'feedback' && (
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {feedback.map(item => (
                                <div key={item.id} style={{ padding: '1rem', background: 'var(--background)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: 600 }}>{item.name}</span>
                                            <div style={{ display: 'flex', gap: '0.2rem' }}>
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i} style={{ color: i < item.rating ? 'var(--warning)' : 'var(--border)' }}>★</span>
                                                ))}
                                            </div>
                                        </div>
                                        <p style={{ color: 'var(--text-muted)' }}>"{item.comment}"</p>
                                    </div>
                                    <button
                                        onClick={() => deleteFeedback(item.id)}
                                        className="btn btn-secondary"
                                        style={{ color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Stall Reveal Controls</h2>

                        <div className="grid-3">
                            {['stall1', 'stall2', 'stall3'].map((stallKey, index) => {
                                const key = `${stallKey}Revealed` as keyof typeof eventSettings;
                                const isRevealed = eventSettings[key];
                                return (
                                    <div key={stallKey} style={{
                                        padding: '2rem',
                                        background: isRevealed ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
                                        border: `1px solid ${isRevealed ? 'green' : 'red'}`,
                                        borderRadius: '0.5rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        transition: 'all 0.3s'
                                    }}>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                            {['Echo Mandalam', 'Cosmic Mandalam', 'AI Mandalam'][index]} (Stall {index + 1})
                                        </h3>
                                        <div style={{ fontSize: '3rem', color: isRevealed ? 'green' : 'red' }}>
                                            {isRevealed ? <Eye /> : <EyeOff />}
                                        </div>
                                        <p style={{ fontWeight: 500 }}>
                                            Status: {isRevealed ? 'REVEALED' : 'HIDDEN'}
                                        </p>
                                        <button
                                            className={`btn ${isRevealed ? 'btn-secondary' : 'btn-primary'}`}
                                            onClick={() => toggleStallReveal(`${stallKey}Revealed`, isRevealed)}
                                            style={{ width: '100%' }}
                                        >
                                            {isRevealed ? 'Hide Stall' : 'Reveal Stall'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
