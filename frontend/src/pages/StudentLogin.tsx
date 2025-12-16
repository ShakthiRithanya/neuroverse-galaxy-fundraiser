import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserCircle } from 'lucide-react';

const StudentLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/student/login`, { email, password });

            if (res.data.role === 'admin') {
                localStorage.setItem('isAdmin', 'true');
                localStorage.setItem('adminName', res.data.username);
                navigate('/admin/dashboard');
            } else {
                localStorage.setItem('student', JSON.stringify(res.data.user));
                navigate('/');
            }
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
                <div style={{ background: 'rgba(0, 243, 255, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
                    <UserCircle size={30} />
                </div>
                <h1 style={{ marginBottom: '2rem', fontSize: '1.8rem' }}>Event Login</h1>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Email</label>
                        <input
                            type="email"
                            placeholder="student@college.edu"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.3)' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Password</label>
                        <input
                            type="password"
                            placeholder="Current Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.3)' }}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>

                    <div style={{ marginTop: '1rem', paddingTop: '1rem' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            New here? <Link to="/register" style={{ color: 'var(--primary)' }}>Create Account</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentLogin;
