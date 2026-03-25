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
import Scene from './3d/Scene';

export default function Dashboard({ onBack }) {
    const [url, setUrl] = useState('');
    const [status, setStatus] = useState('idle'); // idle | loading_github | loading_analysis | success | error
    const [errorMsg, setErrorMsg] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const API_BASE = import.meta.env.VITE_API_URL || '';

    const handleAnalyze = async () => {
        if (!url) return;
        try {
            setErrorMsg('');
            setStatus('loading_github');

            // 1. Fetch repo files from GitHub using relative proxy route
            const githubRes = await fetch(`${API_BASE}/api/github`, {
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
            const analyzeRes = await fetch(`${API_BASE}/api/analyze`, {
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

    const isLoading = status === 'loading_github' || status === 'loading_analysis';
    const repoName = url ? url.split('/').pop()?.replace('.git', '').replace(/-/g, ' ') : 'Analyzed Project';
    const resetDashboard = () => {
        setStatus('idle');
        setUrl('');
        setAnalysis(null);
        setErrorMsg('');
    };

    if (status === 'success' && analysis) {
        return (
            <div className="app-container">
                <div className="canvas-container">
                    <Scene showFloatingCubes={false} />
                </div>

                <div className="content-container">
                    <section className="section-container" style={{ paddingTop: '60px' }}>
                        <header className="glass-panel" style={{ padding: '28px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(56, 189, 248, 0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Code2 size={22} color="var(--accent-cyan)" />
                                </div>
                                <div>
                                    <h1 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: 2 }}>Codebase Explainer</h1>
                                    <p className="text-secondary" style={{ fontSize: '0.95rem' }}>Project structure analysis</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                <div className="branch-badge" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                    <GitBranch size={16} /> GitHub
                                </div>
                                {typeof onBack === 'function' && (
                                    <button className="btn-secondary" onClick={onBack} style={{ padding: '10px 16px', fontSize: '0.95rem' }}>
                                        Back
                                    </button>
                                )}
                                <button className="btn-primary" onClick={resetDashboard} style={{ padding: '10px 18px', fontSize: '0.95rem' }}>
                                    <RefreshCw size={16} style={{ marginRight: 8 }} />
                                    Analyze another repository
                                </button>
                            </div>
                        </header>

                        <div style={{ marginTop: 24 }} className="glass-panel">
                            <div style={{ padding: '28px 24px' }}>
                                <h2 style={{ fontSize: '1.7rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'capitalize' }}>
                                    {repoName}
                                </h2>
                                <div style={{ marginTop: 16, display: 'grid', gap: 14 }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: 8 }}>Summary</h3>
                                        <p className="text-secondary" style={{ lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                            {analysis.project_summary}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: 8 }}>Main Purpose</h3>
                                        <p className="text-secondary" style={{ lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                            {analysis.main_purpose}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-grid" style={{ marginTop: 24 }}>
                            <div className="dashboard-card tech-card" style={{ background: 'rgba(255,255,255,0.02)' }}>
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

                            <div className="dashboard-card modules-card" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                <div className="card-header">
                                    <div><FolderTree size={18} className="card-icon" /> MODULES</div>
                                </div>
                                <div className="modules-list">
                                    {analysis.modules?.map((m, i) => (
                                        <div key={i} className="module-item">
                                            <div className="module-left" style={{ flexWrap: 'wrap' }}>
                                                <span className="module-dot" style={{ backgroundColor: getTechColor(m.name) }}></span>
                                                <span className="module-name" style={{ wordBreak: 'break-word' }}>{m.name}</span>
                                                {m.path && <span className="module-path" style={{ wordBreak: 'break-all' }}>{m.path}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="dashboard-card files-card" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                <div className="card-header">
                                    <div><FileText size={18} className="card-icon" /> KEY FILES</div>
                                </div>
                                <div className="files-grid">
                                    {analysis.key_files?.map((file, i) => (
                                        <div key={i} className="file-box">
                                            <div className="file-box-header">
                                                <FileCode2 size={16} className="file-icon" />
                                                <span className="file-name" style={{ wordBreak: 'break-all' }}>{file.path}</span>
                                            </div>
                                            <div className="file-box-footer" style={{ alignItems: 'flex-start' }}>
                                                <span className="file-desc" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{file.description}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="dashboard-card deps-card" style={{ background: 'rgba(255,255,255,0.02)' }}>
                                <div className="card-header" style={{ justifyContent: 'space-between', width: '100%', display: 'flex' }}>
                                    <div><Network size={18} className="card-icon" /> DEPENDENCIES</div>
                                </div>
                                <div className="deps-list">
                                    {analysis.dependencies?.map((d, i) => (
                                        <div key={i} className="dep-item" style={{ flexWrap: 'wrap' }}>
                                            <span className="dep-pill" style={{ wordBreak: 'break-all' }}>{d.from}</span>
                                            <ArrowRight size={16} className="dep-arrow" />
                                            <span className="dep-pill" style={{ wordBreak: 'break-all' }}>{d.to}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ marginTop: 24, padding: 24 }}>
                            <div className="card-header" style={{ marginBottom: 18 }}>
                                <div><Code2 size={18} className="card-icon" /> 3D ARCHITECTURE GRAPH</div>
                            </div>
                            <div className="viz-placeholder" style={{ background: 'rgba(255,255,255,0.01)' }}>
                                <DependencyGraph dependencies={analysis.dependencies} />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <div className="canvas-container">
                <Scene showFloatingCubes={false} />
            </div>

            <div className="content-container">
                <section className="hero-section" style={{ minHeight: '100vh', paddingTop: '18vh', paddingBottom: '10vh' }}>
                    <h1 className="hero-title" style={{ fontSize: 'clamp(2.2rem, 4.2vw, 3.6rem)', marginBottom: 16 }}>Analyze a GitHub repository</h1>
                    <p className="hero-subtitle" style={{ maxWidth: '760px', marginBottom: 34 }}>
                        Paste a repository URL and get a clean summary, technologies, key files, modules, and a visual dependency graph—styled consistently with the landing page.
                    </p>

                    <div className="glass-panel" style={{ width: '100%', maxWidth: 860, padding: '28px 22px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left' }}>
                            <label htmlFor="repo-url" style={{ fontWeight: 600, fontSize: '0.95rem' }}>GitHub Repository URL</label>
                            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                                <input
                                    id="repo-url"
                                    type="text"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://github.com/owner/repository"
                                    style={{
                                        flex: 1,
                                        minWidth: 240,
                                        padding: '14px 16px',
                                        borderRadius: 12,
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid var(--glass-border)',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem',
                                        outline: 'none',
                                    }}
                                />
                                <button
                                    className="btn-primary"
                                    onClick={handleAnalyze}
                                    disabled={!url || isLoading}
                                    style={{
                                        fontSize: '1rem',
                                        padding: '14px 22px',
                                        opacity: (!url || isLoading) ? 0.6 : 1,
                                        cursor: (!url || isLoading) ? 'not-allowed' : 'pointer',
                                        width: '100%',
                                        maxWidth: 220,
                                    }}
                                >
                                    {isLoading ? (
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                                            <span style={{ width: 16, height: 16, borderRadius: 999, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                                            {status === 'loading_github' ? 'Fetching…' : 'Analyzing…'}
                                        </span>
                                    ) : (
                                        'Analyze'
                                    )}
                                </button>
                            </div>

                            {status === 'error' && (
                                <div style={{ marginTop: 10, padding: 12, background: 'rgba(255,0,0,0.08)', border: '1px solid rgba(255,0,0,0.25)', borderRadius: 12, color: '#ffb4b4' }}>
                                    {errorMsg}
                                </div>
                            )}

                            {isLoading && (
                                <p className="text-secondary" style={{ marginTop: 6 }}>
                                    {status === 'loading_github' ? 'Downloading core files from the repository…' : 'Building project summary and dependency map…'}
                                </p>
                            )}
                        </div>

                        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                </section>
            </div>
        </div>
    );
}
