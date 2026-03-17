import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import GovDashboard from './pages/GovDashboard.jsx';
import RoadSegmentManager from './pages/RoadSegmentManager.jsx';
import InspectorApp from './pages/InspectorApp.jsx';
import AboutUs from './pages/AboutUs.jsx';
import ContactUs from './pages/ContactUs.jsx';
import Layout from './components/Layout.jsx';
import { useAuth } from './context/AuthContext.jsx';

const ProtectedRoute = ({ children, roles }) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) return <div className="spinner" style={{ margin: '50vh auto' }}></div>;
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

    return children;
};

const IndexRedirect = () => {
    const { user } = useAuth();
    if (user?.role === 'admin') return <Navigate to="/dashboard" replace />;
    if (user?.role === 'operator') return <Navigate to="/visit" replace />;
    return <Navigate to="/login" replace />;
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route path="/" element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }>
                    <Route index element={<IndexRedirect />} />
                    <Route
                        path="dashboard"
                        element={
                            <ProtectedRoute roles={['admin']}>
                                <GovDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="segments"
                        element={
                            <ProtectedRoute roles={['admin']}>
                                <RoadSegmentManager />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="visit"
                        element={
                            <ProtectedRoute roles={['operator']}>
                                <InspectorApp />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="about" element={<AboutUs />} />
                    <Route path="contact" element={<ContactUs />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
