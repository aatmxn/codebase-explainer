import React, { useState } from 'react';

export default function Dashboard({ onBack }) {
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState('idle');

    const handleAnalyze = () => {
        if (!url) return;
        setStatus('loading');
        setTimeout(() => {
            setStatus('success');
        }, 2500);
    };

    return (
        <div className="app-container" style={{ padding: '40px', background: 'var(--bg-color)', minHeight: '100vh', zIndex: 50, position: 'relative' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 className="hero-title" style={{ fontSize: '2rem', margin: 0 }}>Codebase Dashboard</h1>
                <button className="btn-secondary" onClick={onBack}>Back to Home</button>
            </header>

            {status === 'idle' && (
                <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', fontWeight: 600 }}>Ready to analyze</h2>
                    <p className="text-secondary" style={{ fontSize: '1.1rem', marginBottom: '32px' }}>Enter a GitHub repository URL to generate the visual dependency graph.</p>

                    <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', maxWidth: '600px', margin: '0 auto' }}>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://github.com/user/repo"
                            style={{
                                flex: 1,
                                padding: '16px 20px',
                                borderRadius: '8px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                color: 'white',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                        />
                        <button
                            className="btn-primary"
                            onClick={handleAnalyze}
                            disabled={!url}
                            style={{ padding: '16px 32px', opacity: url ? 1 : 0.5, cursor: url ? 'pointer' : 'not-allowed' }}
                        >
                            Analyze
                        </button>
                    </div>
                </div>
            )}

            {status === 'loading' && (
                <div className="glass-panel" style={{ padding: '80px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Analyzing Codebase...</h2>
                    <div style={{ width: '50px', height: '50px', border: '3px solid var(--glass-border)', borderTop: '3px solid var(--accent-cyan)', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    <p className="text-secondary" style={{ marginTop: '24px' }}>Building syntax trees and mapping dependencies</p>
                </div>
            )}

            {status === 'success' && (
                <div className="glass-panel" style={{ padding: '40px', textAlign: 'left' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '32px', color: 'var(--accent-cyan)', fontWeight: 600 }}>Analysis Complete</h2>
                    <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 300px', background: 'rgba(255,255,255,0.02)', padding: '32px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                            <h3 style={{ marginBottom: '24px', fontSize: '1.2rem', fontWeight: 500 }}>Repository Stats</h3>
                            <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-secondary)' }}>
                                <li style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Files</span> <strong style={{ color: 'white' }}>124</strong>
                                </li>
                                <li style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Languages</span> <strong style={{ color: 'white' }}>TypeScript, React, Python</strong>
                                </li>
                                <li style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Dependencies</span> <strong style={{ color: 'white' }}>42 nodes mapped</strong>
                                </li>
                            </ul>
                        </div>
                        <div style={{ flex: '2 1 500px', background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '12px', border: '1px solid var(--glass-border)', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '80px', height: '80px', border: '1px solid var(--accent-cyan)', borderRadius: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)' }}>
                                <span style={{ color: 'var(--accent-cyan)', fontSize: '2rem' }}>◈</span>
                            </div>
                            <p className="text-secondary" style={{ fontSize: '1.1rem' }}>[ Interactive 3D Architecture Graph Ready ]</p>
                        </div>
                    </div>
                    <div style={{ marginTop: '40px', textAlign: 'center' }}>
                        <button className="btn-secondary" onClick={() => { setStatus('idle'); setUrl(''); }}>Analyze Another Repo</button>
                    </div>
                </div>
            )}
        </div>
    );
}
