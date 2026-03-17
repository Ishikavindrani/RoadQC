import React, { useState, useEffect } from 'react';
import client from '../api/client';
import {
    Plus,
    Map as MapIcon,
    Database,
    ChevronRight,
    Loader2,
    Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RoadSegmentManager = () => {
    const [segments, setSegments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        project: '',
        district: '',
        state: '',
        lengthKm: '',
        requiredCheckpoints: ''
    });

    const fetchSegments = async () => {
        setLoading(true);
        try {
            const res = await client.get('/segments');
            setSegments(res.data);
        } catch (err) {
            console.error('Failed to fetch segments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSegments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await client.post('/segments', formData);
            setFormData({ name: '', code: '', project: '', district: '', state: '', lengthKm: '', requiredCheckpoints: '' });
            setShowForm(false);
            fetchSegments();
        } catch (err) {
            alert('Failed to create segment. Code might be duplicate.');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'planned': return 'var(--accent)';
            case 'in-progress': return 'var(--risk-medium)';
            case 'completed': return 'var(--risk-low)';
            default: return 'var(--text-secondary)';
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Infrastructure Assets</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage Road Segments and Inspection Parameters</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {showForm ? 'Cancel' : <><Plus size={18} /> New Segment</>}
                </button>
            </header>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass-card"
                    >
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem' }}>Road Name</label>
                                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. NH-44 Northern Bypass" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem' }}>Segment Code</label>
                                <input required value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} placeholder="e.g. RJ-01-SEC2" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem' }}>Project Name</label>
                                <input required value={formData.project} onChange={e => setFormData({ ...formData, project: e.target.value })} placeholder="PMGSY Phase III" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem' }}>District</label>
                                <input required value={formData.district} onChange={e => setFormData({ ...formData, district: e.target.value })} placeholder="Jaipur" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem' }}>State</label>
                                <input required value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })} placeholder="Rajasthan" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem' }}>Length (km)</label>
                                <input required type="number" value={formData.lengthKm} onChange={e => setFormData({ ...formData, lengthKm: e.target.value })} placeholder="12.5" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem' }}>Required Checkpoints</label>
                                <input required type="number" value={formData.requiredCheckpoints} onChange={e => setFormData({ ...formData, requiredCheckpoints: e.target.value })} placeholder="10" />
                            </div>
                            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                <button type="submit" className="btn-primary">Register Asset</button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {loading ? (
                    <div style={{ gridColumn: 'span 3', display: 'flex', justifyContent: 'center' }}><Loader2 className="spin" /></div>
                ) : segments.map(seg => (
                    <motion.div
                        key={seg._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass-card"
                        style={{ position: 'relative' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)' }}>
                                <MapIcon size={20} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em' }}>{seg.code}</span>
                            </div>
                            <span style={{
                                fontSize: '0.7rem',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '4px',
                                background: `${getStatusColor(seg.status)}20`,
                                color: getStatusColor(seg.status),
                                fontWeight: 700,
                                textTransform: 'uppercase'
                            }}>
                                {seg.status}
                            </span>
                        </div>

                        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{seg.name}</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>{seg.project}</p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Region</p>
                                <p style={{ fontSize: '0.875rem' }}>{seg.district}, {seg.state}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Logistics</p>
                                <p style={{ fontSize: '0.875rem' }}>{seg.lengthKm}km • {seg.requiredCheckpoints} pts</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default RoadSegmentManager;
