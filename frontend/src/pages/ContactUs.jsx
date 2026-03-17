import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactUs = () => {
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '2rem' }}>Audit Support & Inquiries</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-card">
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ color: 'var(--accent)' }}><Mail size={24} /></div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Support Email</p>
                                <p style={{ fontWeight: 600 }}>support@roadqc.gov.in</p>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card">
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ color: 'var(--accent)' }}><Phone size={24} /></div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Helpline</p>
                                <p style={{ fontWeight: 600 }}>1800-AUDIT-ROAD</p>
                            </div>
                        </div>
                    </div>
                    <div className="glass-card">
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ color: 'var(--accent)' }}><MapPin size={24} /></div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Headquarters</p>
                                <p style={{ fontWeight: 600 }}>IT Park, New Delhi, India</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-card">
                    {sent ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{ color: 'var(--risk-low)', marginBottom: '1rem' }}><Send size={48} style={{ margin: '0 auto' }} /></div>
                            <h3>Message Received</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>We will respond to your audit inquiry shortly.</p>
                            <button className="btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setSent(false)}>Send Another</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem' }}>Full Name</label>
                                <input required placeholder="Your name" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem' }}>Official Identity/Organization</label>
                                <input required placeholder="Department / Contractor Name" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem' }}>Subject of Audit Support</label>
                                <select>
                                    <option>Technical Issue with Inspector App</option>
                                    <option>Request for New Segment Creation</option>
                                    <option>Suspicious Activity Report</option>
                                    <option>General Support</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem' }}>Message</label>
                                <textarea rows={4} required placeholder="Explain your request in detail..." style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border)', padding: '0.75rem', borderRadius: '8px' }} />
                            </div>
                            <button type="submit" className="btn-primary">Submit Inquiry</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
