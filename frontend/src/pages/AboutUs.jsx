import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Map, Award } from 'lucide-react';

const AboutUs = () => {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <section style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Road QC Mission</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', lineHeight: '1.6' }}>
                    Standard road inspection processes across the country face issues like "ghost inspections"
                    and selective quality checking. Our mission is to ensure every kilometer of infrastructure
                    is built and audited with 100% transparency.
                </p>
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="glass-card">
                    <div style={{ color: 'var(--accent)', marginBottom: '1rem' }}><Shield size={32} /></div>
                    <h3 style={{ marginBottom: '0.5rem' }}>Trust through Data</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        Every checkpoint is geo-fenced and time-stamped, providing an immutable audit trail
                        that cannot be tampered with or retroactively edited.
                    </p>
                </div>
                <div className="glass-card">
                    <div style={{ color: 'var(--risk-low)', marginBottom: '1rem' }}><Target size={32} /></div>
                    <h3 style={{ marginBottom: '0.5rem' }}>Unbiased Sampling</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        Our system utilizes randomized GPS sampling along the construction alignment to
                        prevent inspectors from choosing only the highest quality spots.
                    </p>
                </div>
                <div className="glass-card">
                    <div style={{ color: 'var(--risk-medium)', marginBottom: '1rem' }}><Map size={32} /></div>
                    <h3 style={{ marginBottom: '0.5rem' }}>Real-time Monitoring</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        Senior authorities can track field visits as they happen, receiving instant
                        notifications for suspicious activity or low coverage.
                    </p>
                </div>
                <div className="glass-card">
                    <div style={{ color: 'var(--accent)', marginBottom: '1rem' }}><Award size={32} /></div>
                    <h3 style={{ marginBottom: '0.5rem' }}>Quality Assurance</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        Our automated fraud detection engine uses geographic variance and speed checks
                        to ensure each inspection was physically possible and thorough.
                    </p>
                </div>
            </div>

            <section className="glass-card" style={{ textAlign: 'center', border: '1px solid var(--accent-glow)' }}>
                <h2 style={{ marginBottom: '1rem' }}>Built for National Infrastructure</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Road QC is designed to be deployed across states and districts,
                    standardizing the inspection lifecycle from Planning to Lifecycle Completion.
                </p>
            </section>
        </div>
    );
};

export default AboutUs;
