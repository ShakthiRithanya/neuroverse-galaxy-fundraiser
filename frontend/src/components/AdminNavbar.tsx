import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Shield } from 'lucide-react';

const AdminNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isAdmin');
        navigate('/');
    };

    return (
        <nav style={{
            padding: '1rem 2rem',
            background: 'rgba(5, 5, 16, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--primary)',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link to="/admin/dashboard" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                    <Shield />
                    Admin Console
                </Link>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                        {localStorage.getItem('adminName')}
                    </span>
                    <Link to="/admin/dashboard" style={{ color: 'var(--text)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <LayoutDashboard size={18} />
                        Overview
                    </Link>
                    {/* Future specific routes can differ, for now Dashboard has tabs */}

                    <button
                        onClick={handleLogout}
                        className="btn btn-secondary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
