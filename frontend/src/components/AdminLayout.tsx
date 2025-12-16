import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import AdminNavbar from './AdminNavbar';

interface Props {
    children: ReactNode;
}

const AdminLayout = ({ children }: Props) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('isAdmin') !== 'true') {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0a15' }}>
            <AdminNavbar />
            <main style={{ flex: 1, padding: '2rem' }} className="container animate-fade-in">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
