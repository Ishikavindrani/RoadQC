import React, { useState, useEffect } from 'react';
import client from '../api/client';
import {
    MapPin,
    Camera,
    CheckCircle,
    History,
    Play,
    Square,
    AlertCircle,
    Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InspectorApp = () => {
    const [segments, setSegments] = useState([]);
    const [activeVisit, setActiveVisit] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recording, setRecording] = useState(false);

    // Form States
    const [selectedSegment, setSelectedSegment] = useState('');
    const [notes, setNotes] = useState('');
    const [cpNotes, setCpNotes] = useState('');
    const [gps, setGps] = useState({ lat: null, lng: null });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [segRes, histRes] = await Promise.all([
                client.get('/segments'),
                client.get('/visits/my')
            ]);
            setSegments(segRes.data);
            setHistory(histRes.data);

            // Check for active visit in history
            const active = histRes.data.find(v => v.status === 'active');
            if (active) setActiveVisit(active);
        } catch (err) {
            console.error('Fetch error', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getGPS = () => {
        setRecording(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setRecording(false);
            },
            (err) => {
                alert('Location access denied');
                setRecording(false);
            }
        );
    };

    const handleStartVisit = async () => {
        if (!selectedSegment) return alert('Select a road segment');
        try {
            const res = await client.post('/visits/start', {
                roadSegmentId: selectedSegment,
                startLat: gps.lat,
                startLng: gps.lng
            });
            setActiveVisit(res.data);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to start visit');
        }
    };

    const handleAddCheckpoint = async () => {
        if (!gps.lat) return alert('Acquire GPS coordinates first');
        try {
            await client.post(`/visits/${activeVisit._id}/checkpoint`, {
                lat: gps.lat,
                lng: gps.lng,
                notes: cpNotes,
                photoUrl: 'https://images.unsplash.com/photo-1590483734724-3881744a3363?w=400' // Mock Photo
            });
            setCpNotes('');
            setGps({ lat: null, lng: null });
            fetchData();
        } catch (err) {
            alert('Failed to save checkpoint');
        }
    };

    const handleEndVisit = async () => {
        if (notes.length < 30) return alert('Closure notes must be at least 30 characters');
        try {
            await client.post(`/visits/${activeVisit._id}/end`, { notes });
            setActiveVisit(null);
            setNotes('');
            fetchData();
        } catch (err) {
            alert('Failed to end visit');
        }
    };

    if (loading) return <div className="spinner" style={{ margin: '40vh auto' }}></div>;

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Active Session OR Start Selector */}
            {!activeVisit ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Play size={20} color="var(--accent)" /> Start New Inspection
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Select Target Road Segment</label>
                        <select
                            value={selectedSegment}
                            onChange={(e) => setSelectedSegment(e.target.value)}
                            style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: '8px' }}
                        >
                            <option value="">-- Choose Segment --</option>
                            {segments.map(s => (
                                <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
                            ))}
                        </select>
                        <button onClick={handleStartVisit} className="btn-primary" style={{ marginTop: '1rem' }}>Begin Field Visit</button>
                    </div>
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ borderLeft: '4px solid var(--accent)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.25rem' }}>Active Inspection</h2>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Road: {activeVisit.roadSegment?.name}</p>
                        </div>
                        <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                    </div>

                    {/* Checkpoint Recorder */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px dashed var(--border)' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>Record Live Checkpoint</p>
                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                            <button
                                onClick={getGPS}
                                disabled={recording}
                                className="btn-primary"
                                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <MapPin size={18} /> {gps.lat ? `${gps.lat.toFixed(4)}, ${gps.lng.toFixed(4)}` : (recording ? 'Locating...' : 'Auto-fill GPS')}
                            </button>
                            <button className="btn-primary" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <Camera size={18} /> Take Photo
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Checkpoint Observations (Optional)..."
                            value={cpNotes}
                            onChange={(e) => setCpNotes(e.target.value)}
                            style={{ width: '100%', marginBottom: '1rem' }}
                        />
                        <button onClick={handleAddCheckpoint} className="btn-primary" style={{ width: '100%' }}>Save Checkpoint</button>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>Session Closure</p>
                        <textarea
                            placeholder="Justification notes (Min 30 chars)..."
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            style={{ width: '100%', marginBottom: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: 'white', padding: '0.75rem', borderRadius: '8px' }}
                        />
                        <button onClick={handleEndVisit} className="btn-primary" style={{ width: '100%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <Square size={16} fill="white" /> Terminate & Submit
                        </button>
                    </div>
                </motion.div>
            )}

            {/* History Area */}
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                <History size={20} /> My Past Visits
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {history.filter(h => h.status === 'completed').map(h => (
                    <div key={h._id} className="glass-card" style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontWeight: 600 }}>{h.roadSegment?.name}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                    <Clock size={12} style={{ verticalAlign: 'middle' }} /> {new Date(h.startTime).toLocaleDateString()} • {h.checkpoints?.length} points
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontWeight: 800, color: h.coverage >= 80 ? 'var(--risk-low)' : (h.coverage >= 60 ? 'var(--risk-medium)' : 'var(--risk-high)') }}>
                                    {Math.round(h.coverage)}% Coverage
                                </p>
                                {h.isSuspicious && <p style={{ fontSize: '0.7rem', color: 'var(--risk-high)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><AlertCircle size={10} /> Flagged</p>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InspectorApp;
