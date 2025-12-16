import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus } from 'lucide-react';

const StudentRegister = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/student/register`, { name, email, password });
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            alert('Registration failed or email exists.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <div style={{ background: 'rgba(188, 19, 254, 0.1)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--secondary)', border: '1px solid var(--secondary)' }}>
                    <UserPlus size={30} />
                </div>
                <h1 style={{ marginBottom: '2rem', fontSize: '1.8rem' }}>Create Account</h1>

                <form onSubmit={handleRegister}>
                    <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Full Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.3)' }}
                            required
                        />
                    </div>
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
                            placeholder="Create Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{ padding: '0.8rem', background: 'rgba(0,0,0,0.3)' }}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', borderColor: 'var(--secondary)', color: 'var(--secondary)', boxShadow: '0 0 10px rgba(188, 19, 254, 0.2)' }} disabled={loading}>
                        {loading ? 'Processing...' : 'Register'}
                    </button>

                    <div style={{ marginTop: '1rem', paddingTop: '1rem' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentRegister;
