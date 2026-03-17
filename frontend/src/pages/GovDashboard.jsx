import React, { useState, useEffect } from 'react';
import client from '../api/client';
import {
    AlertTriangle,
    CheckCircle,
    RefreshCcw,
    Search,
    User as UserIcon,
    MapPin,
    FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GovDashboard = () => {
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [onlySuspicious, setOnlySuspicious] = useState(false);
    const [stats, setStats] = useState({ total: 0, suspicious: 0, avgCoverage: 0 });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await client.get(`/visits?onlySuspicious=${onlySuspicious}`);
            setVisits(res.data);

            // Calculate Stats
            const total = res.data.length;
            const suspicious = res.data.filter(v => v.isSuspicious).length;
            const avgCoverage = total > 0
                ? res.data.reduce((acc, v) => acc + (v.coverage || 0), 0) / total
                : 0;

            setStats({ total, suspicious, avgCoverage: Math.round(avgCoverage) });
        } catch (err) {
            console.error('Failed to fetch visits', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [onlySuspicious]);

    const getCoverageColor = (val) => {
        if (val >= 80) return 'var(--risk-low)';
        if (val >= 50) return 'var(--risk-medium)';
        return 'var(--risk-high)';
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Intelligence Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Real-time inspector monitoring & audit trail</p>
                </div>
                <button onClick={fetchData} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid var(--border)', boxShadow: 'none' }}>
                    <RefreshCcw size={18} className={loading ? 'spin' : ''} /> Refresh
                </button>
            </header>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                <div className="glass-card">
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Visits</p>
                    <p style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.total}</p>
                </div>
                <div className="glass-card" style={{ borderLeft: stats.suspicious > 0 ? '4px solid var(--risk-high)' : '1px solid var(--border)' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Suspicious Alerts</p>
                    <p style={{ fontSize: '2.5rem', fontWeight: 800, color: stats.suspicious > 0 ? 'var(--risk-high)' : 'white' }}>{stats.suspicious}</p>
                </div>
                <div className="glass-card">
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Avg. Coverage</p>
                    <p style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stats.avgCoverage}%</p>
                </div>
            </div>

            {/* Visits Table */}
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.125rem' }}>Detailed Audit Log</h3>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}>
                        <input
                            type="checkbox"
                            checked={onlySuspicious}
                            onChange={(e) => setOnlySuspicious(e.target.checked)}
                        />
                        Show Suspicious Only
                    </label>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                <th style={{ padding: '1rem 1.5rem' }}>Date / Officer</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Road Segment</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Coverage</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Flags</th>
                                <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {visits.map((visit) => (
                                    <motion.tr
                                        key={visit._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        style={{
                                            borderBottom: '1px solid var(--border)',
                                            background: visit.isSuspicious ? 'rgba(239, 68, 68, 0.05)' : 'transparent',
                                            transition: 'background 0.2s'
                                        }}
                                    >
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ fontWeight: 600 }}>{new Date(visit.startTime).toLocaleDateString()}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <UserIcon size={12} /> {visit.officer?.name}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ fontWeight: 600 }}>{visit.roadSegment?.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{visit.roadSegment?.district}, {visit.roadSegment?.state}</div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', width: '200px' }}>
                                            <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                                                <span>{Math.round(visit.coverage)}%</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{visit.checkpoints?.length} pts</span>
                                            </div>
                                            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${visit.coverage}%` }}
                                                    style={{ height: '100%', background: getCoverageColor(visit.coverage) }}
                                                />
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            {visit.isSuspicious ? (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                    {visit.reasons?.map((r, i) => (
                                                        <span key={i} title={r} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem' }}>
                                                            <AlertTriangle size={10} style={{ marginRight: '0.25rem' }} /> {r.split(':')[0]}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span style={{ color: 'var(--risk-low)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <CheckCircle size={14} /> Clear
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '4px',
                                                fontSize: '0.75rem',
                                                textTransform: 'capitalize',
                                                background: visit.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                                color: visit.status === 'completed' ? 'var(--risk-low)' : 'var(--accent)'
                                            }}>
                                                {visit.status}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GovDashboard;
