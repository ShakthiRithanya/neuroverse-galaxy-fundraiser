import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, MessageSquare, Info, CreditCard } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/stalls', label: 'Stalls', icon: ShoppingBag },
        { path: '/feedback', label: 'Feedback', icon: MessageSquare },
        { path: '/about', label: 'About', icon: Info },
        { path: '/booking', label: 'Book Now', icon: CreditCard },
    ];

    return (
        <nav className="glass-panel" style={{
            position: 'sticky',
            top: '1rem',
            zIndex: 50,
            margin: '1rem',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <img src="/sinthanai_logo.png" alt="SIAI" style={{ height: '40px', width: 'auto' }} />
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1' }}>
                    <span style={{ fontSize: '0.8rem', color: '#ffd700', letterSpacing: '1px' }}>SINTHANAI PRESENTS</span>
                    <span><span style={{ color: 'var(--primary)' }}>Neuroverse</span> Galaxy</span>
                </div>
            </Link>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: isActive(item.path) ? 'var(--primary)' : 'var(--text-muted)',
                            fontWeight: isActive(item.path) ? 600 : 400
                        }}
                    >
                        <item.icon size={18} />
                        {item.label}
                    </Link>
                ))}


                {/* Auth Buttons */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {localStorage.getItem('isAdmin') === 'true' ? (
                        <>
                            <Link to="/admin/dashboard" className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                                Dashboard
                            </Link>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('isAdmin');
                                    window.location.href = '/';
                                }}
                                className="btn btn-secondary"
                                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                            >
                                Logout
                            </button>
                        </>
                    ) : localStorage.getItem('student') ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontFamily: 'var(--font-mono)' }}>
                                {JSON.parse(localStorage.getItem('student') || '{}').name}
                            </span>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('student');
                                    window.location.href = '/';
                                }}
                                className="btn btn-secondary"
                                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};
export default Navbar;
