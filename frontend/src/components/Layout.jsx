import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LayoutDashboard, Map, ClipboardCheck, LogOut, Shield, Mail } from 'lucide-react';

const Layout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = user?.role === 'admin' ? [
        { name: 'Analytics', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Road Segments', path: '/segments', icon: Map },
        { name: 'About Us', path: '/about', icon: Shield },
        { name: 'Contact', path: '/contact', icon: Mail },
    ] : [
        { name: 'Field Visit', path: '/visit', icon: ClipboardCheck },
        { name: 'About Us', path: '/about', icon: Shield },
        { name: 'Contact', path: '/contact', icon: Mail },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
            {/* Sidebar */}
            <aside style={{ width: '280px', background: 'rgba(15, 15, 20, 0.5)', borderRight: '1px solid var(--border)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ background: 'var(--accent)', padding: '0.5rem', borderRadius: '8px' }}>
                        <Shield size={24} color="white" />
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Road QC</h2>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                textDecoration: 'none',
                                color: location.pathname === item.path ? 'var(--accent)' : 'var(--text-secondary)',
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                background: location.pathname === item.path ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                transition: 'all 0.2s ease',
                                fontWeight: 600
                            }}
                        >
                            <item.icon size={20} />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <div style={{ width: '40px', height: '40px', background: 'var(--border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {user?.name?.charAt(0)}
                        </div>
                        <div>
                            <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user?.name}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            background: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontWeight: 600,
                            padding: '0.75rem 0'
                        }}
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem', height: '100vh', overflowY: 'auto' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
