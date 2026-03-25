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
            const githubRes = await fetch('fetch(`${import.meta.env.VITE_API_URL}/api/github`)', {
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
            const analyzeRes = await fetch('fetch(`${import.meta.env.VITE_API_URL}/api/analyze`)', {
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
            <div className="min-h-screen bg-slate-50 text-slate-900 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-6xl space-y-6">
                    <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-sky-100 p-2.5 text-sky-700">
                                    <Code2 size={22} />
                                </div>
                                <div>
                                    <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Codebase Explainer</h1>
                                    <p className="text-sm text-slate-600">Project structure analysis</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 sm:text-sm">
                                    <GitBranch size={14} /> GitHub
                                </div>
                                <button
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 sm:w-auto"
                                    onClick={resetDashboard}
                                >
                                    <RefreshCw size={16} /> Analyze another repository
                                </button>
                            </div>
                        </div>
                    </header>

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <h2 className="text-2xl font-semibold capitalize text-slate-900">{repoName}</h2>
                        <div className="mt-4 space-y-4">
                            <div>
                                <h3 className="text-base font-semibold text-sky-700">Summary</h3>
                                <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700 sm:text-base">{analysis.project_summary}</p>
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-sky-700">Main Purpose</h3>
                                <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700 sm:text-base">{analysis.main_purpose}</p>
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
                            <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                                <Layers size={17} className="text-sky-700" /> Technologies
                            </div>
                            <div className="flex flex-wrap gap-2">
                            {analysis.technologies?.map((tech, i) => {
                                const color = getTechColor(tech);
                                return (
                                        <span
                                            key={i}
                                            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium sm:text-sm"
                                            style={{ borderColor: color, backgroundColor: getTechBg(color), color: '#334155' }}
                                        >
                                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }}></span>
                                        {tech}
                                    </span>
                                );
                            })}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
                            <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                                <FolderTree size={17} className="text-sky-700" /> Modules
                            </div>
                            <div className="space-y-3">
                                {analysis.modules?.map((m, i) => (
                                    <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: getTechColor(m.name) }}></span>
                                            <h3 className="break-words text-sm font-semibold text-slate-900 sm:text-base">{m.name}</h3>
                                        </div>
                                        {m.path && (
                                            <p className="mt-2 break-all rounded-md bg-white px-2 py-1 text-xs text-slate-600">
                                                {m.path}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
                            <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                                <FileText size={17} className="text-sky-700" /> Key Files
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {analysis.key_files?.map((file, i) => {
                                return (
                                    <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-3 transition-colors hover:bg-slate-100 sm:p-4">
                                        <div className="flex items-start gap-2">
                                            <FileCode2 size={16} className="mt-0.5 text-slate-500" />
                                            <span className="break-all text-xs font-semibold text-slate-800 sm:text-sm">{file.path}</span>
                                        </div>
                                        <div className="mt-2">
                                            <p className="whitespace-pre-wrap break-words text-xs leading-5 text-slate-600 sm:text-sm">{file.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            </div>
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6">
                            <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                                <Network size={17} className="text-sky-700" /> Dependencies
                            </div>
                            <div className="space-y-2">
                                {analysis.dependencies?.map((d, i) => (
                                    <div key={i} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                                        <span className="break-all rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-700 sm:text-sm">{d.from}</span>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <ArrowRight size={14} />
                                            <span className="text-xs uppercase tracking-wide">{d.type || 'link'}</span>
                                        </div>
                                        <span className="break-all rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-700 sm:text-sm">{d.to}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                        <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                            <Code2 size={17} className="text-sky-700" /> 3D Architecture Graph
                        </div>
                        <div className="overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 p-2">
                            <DependencyGraph dependencies={analysis.dependencies} />
                        </div>
                    </section>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-3xl">
                <header className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Codebase Explainer</h1>
                    <p className="mt-2 text-sm text-slate-600 sm:text-base">Analyze a GitHub repository and view its architecture clearly.</p>
                </header>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-300 sm:p-7">
                    <h2 className="text-xl font-semibold text-slate-900">Ready to analyze</h2>
                    <p className="mt-2 text-sm text-slate-600 sm:text-base">
                        Enter a GitHub repository URL to generate the project summary, technologies, key files, modules, and dependencies.
                    </p>

                    {status === 'error' && (
                        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {errorMsg}
                        </div>
                    )}

                    <div className="mt-6 space-y-3">
                        <label htmlFor="repo-url" className="block text-sm font-medium text-slate-700">
                            GitHub Repository URL
                        </label>
                        <input
                            id="repo-url"
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://github.com/owner/repository"
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 sm:text-base"
                        />
                        <button
                            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:text-base"
                            onClick={handleAnalyze}
                            disabled={!url || isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                    {status === 'loading_github' ? 'Fetching files...' : 'Analyzing...'}
                                </>
                            ) : (
                                'Analyze'
                            )}
                        </button>
                    </div>
                </div>
                {isLoading && (
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600"></div>
                        <h3 className="mt-4 text-lg font-semibold text-slate-900">
                            {status === 'loading_github' ? 'Fetching GitHub files...' : 'Analyzing codebase...'}
                        </h3>
                        <p className="mt-1 text-sm text-slate-600">
                            {status === 'loading_github' ? 'Downloading core files from the repository.' : 'Building project summary and dependency map.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
