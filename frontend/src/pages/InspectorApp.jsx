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
    Clock,
    RefreshCw
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
        console.log('--- OPERATOR DATA FETCH START ---');

        // 1. Fetch Segments separately to be safer
        try {
            console.log('Fetching /api/segments...');
            const segRes = await client.get('/segments');
            console.log('Segments API Success:', segRes.data);
            setSegments(segRes.data || []);
        } catch (err) {
            console.error('Segments API Failed:', err.response?.data || err.message);
            alert('Failed to load road segments. Are you connected to the server?');
        }

        // 2. Fetch History separately
        try {
            console.log('Fetching /api/visits/my...');
            const histRes = await client.get('/visits/my');
            console.log('History API Success:', histRes.data);
            setHistory(histRes.data || []);

            const active = (histRes.data || []).find(v => v.status === 'active');
            if (active) {
                console.log('Found Active Visit:', active);
                setActiveVisit(active);
            }
        } catch (err) {
            console.error('History API Failed:', err.response?.data || err.message);
        }

        setLoading(false);
        console.log('--- OPERATOR DATA FETCH END ---');
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
                alert('Location access denied. Please enable GPS.');
                setRecording(false);
            }
        );
    };

    const handleStartVisit = async () => {
        if (!selectedSegment) return alert('Select a road segment from the list');
        try {
            const res = await client.post('/visits/start', {
                roadSegmentId: selectedSegment,
                startLat: gps.lat,
                startLng: gps.lng
            });
            setActiveVisit(res.data);
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Could not start visit. Check if server is running.');
        }
    };

    const handleAddCheckpoint = async () => {
        if (!gps.lat) return alert('Acquire GPS coordinates first');
        try {
            await client.post(`/visits/${activeVisit._id}/checkpoint`, {
                lat: gps.lat,
                lng: gps.lng,
                notes: cpNotes,
                photoUrl: 'https://images.unsplash.com/photo-1590483734724-3881744a3363?w=400'
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

    if (loading) return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Syncing with Infrastructure Base...</p>
        </div>
    );

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={fetchData} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                    <RefreshCw size={14} /> Refresh System
                </button>
            </div>

            {/* Active Session OR Start Selector */}
            {!activeVisit ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <Play size={24} color="var(--accent)" /> Start New Inspection
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Select Target Road Segment</label>
                            <select
                                value={selectedSegment}
                                onChange={(e) => setSelectedSegment(e.target.value)}
                                style={{ width: '100%', padding: '0.875rem', background: 'rgba(255,255,255,0.05)', color: 'white', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '1rem' }}
                            >
                                <option value="">-- Choose Segment --</option>
                                {segments.map(s => (
                                    <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
                                ))}
                            </select>
                            {segments.length === 0 && (
                                <div style={{ color: 'var(--risk-high)', fontSize: '0.875rem', marginTop: '1rem', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                    <AlertCircle size={16} style={{ marginBottom: '-3px', marginRight: '5px' }} />
                                    <b>System Empty:</b> No roads found in database.
                                    <p style={{ marginTop: '0.5rem', opacity: 0.8 }}>Run 'node seed.js' in the backend to populate the list.</p>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleStartVisit}
                            className="btn-primary"
                            style={{ marginTop: '0.5rem', height: '3.5rem', fontSize: '1.1rem' }}
                            disabled={segments.length === 0}
                        >
                            Begin Field Visit
                        </button>
                    </div>
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ borderLeft: '5px solid var(--accent)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inspection In Progress</p>
                            <h2 style={{ fontSize: '1.4rem', marginTop: '0.25rem' }}>{activeVisit.roadSegment?.name}</h2>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>ID: {activeVisit.roadSegment?.code}</p>
                        </div>
                        <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                    </div>

                    {/* Checkpoint Recorder */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px dashed var(--border)' }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>Record Live Sampling Point</p>
                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                            <button
                                onClick={getGPS}
                                disabled={recording}
                                className="btn-primary"
                                style={{ flex: 1.5, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <MapPin size={18} /> {gps.lat ? `${gps.lat.toFixed(4)}, ${gps.lng.toFixed(4)}` : (recording ? 'Acquiring...' : 'Auto-fill GPS')}
                            </button>
                            <button className="btn-primary" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <Camera size={18} /> Take Photo
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Observations (e.g., Mix quality check)..."
                            value={cpNotes}
                            onChange={(e) => setCpNotes(e.target.value)}
                            style={{ width: '100%', marginBottom: '1rem' }}
                        />
                        <button onClick={handleAddCheckpoint} className="btn-primary" style={{ width: '100%', background: 'var(--risk-low)' }}>Save Checkpoint</button>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem' }}>Final Submission</p>
                        <textarea
                            placeholder="Audit summary / Justification (Min 30 chars)..."
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            style={{ width: '100%', marginBottom: '1rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', color: 'white', padding: '0.75rem', borderRadius: '10px' }}
                        />
                        <button onClick={handleEndVisit} className="btn-primary" style={{ width: '100%', background: 'var(--risk-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <Square size={16} fill="white" /> Terminate & Submit Audit
                        </button>
                    </div>
                </motion.div>
            )}

            {/* History Area */}
            <div style={{ marginTop: '1rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                    <History size={22} /> My Recent Audit Trail
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {history.filter(h => h.status === 'completed').length === 0 && (
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem', border: '1px dashed var(--border)', borderRadius: '12px' }}>No past visits recorded yet.</p>
                    )}
                    {history.filter(h => h.status === 'completed').map(h => (
                        <div key={h._id} className="glass-card" style={{ padding: '1.25rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{h.roadSegment?.name}</p>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            <Clock size={12} style={{ verticalAlign: 'middle', marginRight: '3px' }} /> {new Date(h.startTime).toLocaleDateString()}
                                        </p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            <MapPin size={12} style={{ verticalAlign: 'middle', marginRight: '3px' }} /> {h.checkpoints?.length} points
                                        </p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: 800, fontSize: '1.2rem', color: h.coverage >= 80 ? 'var(--risk-low)' : (h.coverage >= 60 ? 'var(--risk-medium)' : 'var(--risk-high)') }}>
                                        {Math.round(h.coverage)}%
                                    </p>
                                    {h.isSuspicious && <p style={{ fontSize: '0.75rem', color: 'var(--risk-high)', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end', fontWeight: 600 }}><AlertCircle size={12} /> Flagged</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InspectorApp;
