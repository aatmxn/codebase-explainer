import React from 'react';

export default function HowItWorks() {
    const steps = [
        {
            title: 'Input Repository',
            description: 'Paste your GitHub URL or upload your local codebase. We support all major modern languages and frameworks.',
        },
        {
            title: 'Abstract Analysis',
            description: 'We thoroughly scan your code, building abstract syntax trees and tracing dependencies accurately to render a map.',
        },
        {
            title: 'Visual Output',
            description: 'Explore the 3D visual graph, structural documentation, and interactive flow charts to learn the code interactively.',
        }
    ];

    return (
        <section className="section-container">
            <h2 className="section-title" style={{ fontWeight: 600, letterSpacing: '-0.02em', fontSize: '2rem' }}>How It Works</h2>

            <div className="flow-container">
                {steps.map((step, index) => (
                    <div key={index} className="flow-step glass-panel" style={{ padding: '32px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.04)' }}>
                        <div className="flow-number" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'none' }}>
                            {index + 1}
                        </div>
                        <div className="flow-content">
                            <h3 className="flow-title" style={{ fontSize: '1.2rem', fontWeight: 500 }}>{step.title}</h3>
                            <p className="flow-desc" style={{ fontSize: '0.95rem' }}>{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
