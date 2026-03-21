import React, { useState } from 'react';
import {
    Code2,
    GitBranch,
    RefreshCw,
    Layers,
    FolderTree,
    FileText,
    Network,
    ArrowRight,
    FileCode2
} from 'lucide-react';
import DependencyGraph from './DependencyGraph';

export default function Dashboard({ onBack }) {
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState('idle'); // idle | loading_github | loading_analysis | success | error
    const [errorMsg, setErrorMsg] = useState('');
    const [analysis, setAnalysis] = useState(null);

    const handleAnalyze = async () => {
        if (!url) return;
        try {
            setErrorMsg('');
            setStatus('loading_github');

            // 1. Fetch repo files from GitHub using relative proxy route
            const githubRes = await fetch('/api/github', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            if (!githubRes.ok) {
                const errData = await githubRes.json().catch(() => ({}));
                throw new Error(errData.error || 'Failed to fetch GitHub files. Make sure backend is running.');
            }
            const githubData = await githubRes.json();
            const { files } = githubData;

            if (!files || files.length === 0) {
                throw new Error('No supported files found in the repository.');
            }

            // 2. Transmit files to analyze endpoint
            setStatus('loading_analysis');
            const analyzeRes = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ files })
            });

            if (!analyzeRes.ok) {
                const errData = await analyzeRes.json().catch(() => ({}));
                throw new Error(errData.error || 'Failed to analyze codebase');
            }
            const analyzeData = await analyzeRes.json();

            setAnalysis(analyzeData.analysis);
            setStatus('success');

        } catch (err) {
            console.error(err);
            setErrorMsg(err.message);
            setStatus('error');
        }
    };

    const getTechColor = (tech) => {
        const t = tech?.toLowerCase() || '';
        if (t.includes('typescript') || t.includes('postgres') || t.includes('docker')) return '#3178c6';
        if (t.includes('react') || t.includes('tailwind')) return '#61dafb';
        if (t.includes('node')) return '#339933';
        if (t.includes('graphql')) return '#e10098';
        if (t.includes('redis')) return '#dc382d';
        if (t.includes('next') || t.includes('prisma')) return '#ffffff';
        return '#8b949e';
    };

    const getTechBg = (color) => {
        return `${color}1A`; // 10% opacity in hex
    };

    if (status === 'success' && analysis) {
        return (
            <div className="dashboard-success-view">
                <header className="dashboard-header">
                    <div className="header-left">
                        <Code2 size={24} className="header-icon" />
                        <div>
                            <h1 className="header-title">Codebase Analyzer</h1>
                            <p className="header-subtitle">Project structure analysis</p>
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="branch-badge">
                            <GitBranch size={16} /> GitHub
                        </div>
                        <button className="refresh-btn" onClick={() => { setStatus('idle'); setUrl(''); setAnalysis(null); setErrorMsg(''); }}>
                            <RefreshCw size={16} /> Analyze another repository
                        </button>
                    </div>
                </header>

                {/* Optional Summary Section */}
                <div className="dashboard-card" style={{ marginBottom: '24px', padding: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <h2 style={{ fontSize: '1.7rem', fontWeight: '700', color: '#a78bfa', marginBottom: '4px', textTransform: 'capitalize' }}>
                                {url ? url.split('/').pop().replace('.git', '').replace(/-/g, ' ') : 'Analyzed Project'}
                            </h2>
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.10rem', fontWeight: '600', color: '#38bdf8', marginBottom: '8px' }}>Project Summary</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: '1.6' }}>{analysis.project_summary}</p>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.10rem', fontWeight: '600', color: '#38bdf8', marginBottom: '8px' }}>Main Purpose</h3>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: '1.6' }}>{analysis.main_purpose}</p>
                        </div>
                    </div>
                </div>

                <div className="dashboard-grid">
                    <div className="dashboard-card tech-card">
                        <div className="card-header">
                            <div><Layers size={18} className="card-icon" /> TECHNOLOGIES</div>
                        </div>
                        <div className="tech-pills">
                            {analysis.technologies?.map((tech, i) => {
                                const color = getTechColor(tech);
                                return (
                                    <span key={i} className="tech-pill" style={{ borderColor: color, backgroundColor: getTechBg(color) }}>
                                        <span className="tech-dot" style={{ backgroundColor: color }}></span>
                                        {tech}
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    <div className="dashboard-card modules-card">
                        <div className="card-header">
                            <div><FolderTree size={18} className="card-icon" /> MODULES</div>
                        </div>
                        <div className="modules-list">
                            {analysis.modules?.map((m, i) => {

                                return (
                                    <div key={i} className="module-item">
                                        <div className="module-left">
                                            <span className="module-dot" style={{ backgroundColor: getTechColor(m.name) }}></span>
                                            <span className="module-name">{m.name}</span>
                                            {m.path && <span className="module-path">{m.path}</span>}
                                        </div>
                                        <div className="module-right">

                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="dashboard-card files-card">
                        <div className="card-header">
                            <div><FileText size={18} className="card-icon" /> KEY FILES</div>
                        </div>
                        <div className="files-grid">
                            {analysis.key_files?.map((file, i) => {

                                return (
                                    <div key={i} className="file-box">
                                        <div className="file-box-header">
                                            <FileCode2 size={16} className="file-icon" />
                                            <span className="file-name">{file.path}</span>
                                        </div>
                                        <div className="file-box-footer">
                                            <span className="file-desc">{file.description}</span>

                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="dashboard-card deps-card">
                        <div className="card-header" style={{ justifyContent: 'space-between', width: '100%', display: 'flex' }}>
                            <div><Network size={18} className="card-icon" /> DEPENDENCIES</div>
                            <div className="deps-legend">
                                <span><span className="legend-dot direct"></span> Direct</span>
                                <span><span className="legend-dot indirect"></span> Indirect</span>
                            </div>
                        </div>
                        <div className="deps-list">
                            {analysis.dependencies?.map((d, i) => (
                                <div key={i} className="dep-item">
                                    <span className="dep-pill">{d.from}</span>
                                    <ArrowRight size={16} className="dep-arrow" />
                                    <span className="dep-pill">{d.to}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="dashboard-card viz-card" style={{ marginTop: '24px' }}>
                    <div className="card-header">
                        <div><Code2 size={18} className="card-icon" /> 3D ARCHITECTURE GRAPH</div>
                    </div>
                    <div className="viz-placeholder">
                        <DependencyGraph dependencies={analysis.dependencies} />
                    </div>
                </div>

            </div>
        );
    }

    return (
        <div className="app-container" style={{ padding: '40px', background: 'var(--bg-color)', minHeight: '100vh', zIndex: 50, position: 'relative' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 className="hero-title" style={{ fontSize: '2rem', margin: 0 }}>Codebase Explainer</h1>

            </header>

            {(status === 'idle' || status === 'error') && (
                <div className="glass-panel" style={{ padding: '60px 40px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', fontWeight: 600 }}>Ready to analyze</h2>
                    <p className="text-secondary" style={{ fontSize: '1.1rem', marginBottom: '32px' }}>Enter a GitHub repository URL to generate the visual dependency graph.</p>

                    {status === 'error' && (
                        <div style={{ padding: '12px', background: 'rgba(255,0,0,0.1)', border: '1px solid red', borderRadius: '8px', marginBottom: '24px', color: '#ff8888' }}>
                            {errorMsg}
                        </div>
                    )}

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

            {(status === 'loading_github' || status === 'loading_analysis') && (
                <div className="glass-panel" style={{ padding: '80px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>
                        {status === 'loading_github' ? 'Fetching GitHub Files...' : 'Analyzing Codebase with AI...'}
                    </h2>
                    <div style={{ width: '50px', height: '50px', border: '3px solid var(--glass-border)', borderTop: '3px solid var(--accent-cyan)', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    <p className="text-secondary" style={{ marginTop: '24px' }}>
                        {status === 'loading_github' ? 'Downloading up to 50 core files.' : 'Building syntax trees and mapping dependencies...'}
                    </p>
                </div>
            )}

            {status === 'success' && (
                <div className="glass-panel" style={{ padding: '40px', textAlign: 'left', maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', color: 'var(--accent-cyan)', fontWeight: 600 }}>Analysis Complete</h2>

                    {/* User snippet: Exact UI implementation per user request */}
                    {analysis && (
                        <div className="analysis-details">

                            <h2>{analysis.project_summary}</h2>
                            <p>{analysis.main_purpose}</p>

                            <h3>Technologies</h3>
                            <div>
                                {analysis?.technologies?.map((tech, i) => (
                                    <span key={i}>{tech} </span>
                                ))}
                            </div>

                            <h3>Key Files</h3>
                            {analysis?.key_files?.map((file, i) => (
                                <div key={i}>
                                    <strong>{file.path}</strong>
                                    <p>{file.description}</p>
                                </div>
                            ))}

                            <h3>Modules</h3>
                            {analysis?.modules?.map((m, i) => (
                                <div key={i}>
                                    <strong>{m.name}</strong>
                                    <p>{m.description}</p>
                                </div>
                            ))}

                            <h3>Dependencies</h3>
                            {analysis?.dependencies?.map((d, i) => (
                                <div key={i}>
                                    {d.from} → {d.to} ({d.type})
                                </div>
                            ))}

                        </div>
                    )}

                    <div style={{ marginTop: '40px', textAlign: 'center' }}>
                        <button className="btn-secondary" onClick={() => { setStatus('idle'); setUrl(''); setAnalysis(null); setErrorMsg(''); }}>Analyze Another Repo</button>
                    </div>
                </div>
            )}
        </div>
    );
}
