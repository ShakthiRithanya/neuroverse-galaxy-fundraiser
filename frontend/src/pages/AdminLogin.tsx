import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import axios from 'axios';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, { username, password });

            localStorage.setItem('isAdmin', 'true');
            navigate('/admin/dashboard');
        } catch (error) {
            alert('Invalid credentials');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <div style={{ background: 'rgba(79, 70, 229, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)' }}>
                    <Lock size={30} />
                </div>
                <h1 style={{ marginBottom: '2rem', fontSize: '1.8rem' }}>Admin Access</h1>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Username</label>
                        <input
                            type="text"
                            placeholder="Enter Admin Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.3)' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Password</label>
                        <input
                            type="password"
                            placeholder="Enter Admin Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.3)' }}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Authenticating...' : 'Access Mainframe'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
