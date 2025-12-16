import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import type { ReactNode } from 'react';

interface LayoutProps {
    children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1, padding: '1rem' }} className="container animate-fade-in">
                {children || <Outlet />}
            </main>
            <footer style={{
                textAlign: 'center',
                padding: '2rem',
                color: 'var(--text-muted)',
                borderTop: '1px solid var(--border)',
                marginTop: 'auto'
            }}>
                <p>&copy; Neuroverse Galaxy. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;
