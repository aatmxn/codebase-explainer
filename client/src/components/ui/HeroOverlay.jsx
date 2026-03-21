import React from 'react';

export default function HeroOverlay() {
    return (
        <section className="hero-section" style={{ paddingBottom: '20vh' }}>
            <h1 className="hero-title" style={{ maxWidth: '800px' }}>
                Codebase Explainer
            </h1>
            <h2 className="hero-subtitle" style={{ maxWidth: '800px' }}>
                <span className="text-gradient">See your code. Understand your architecture.</span>
            </h2>

            <p className="hero-subtitle mb-8" style={{ maxWidth: '700px', fontSize: '1.2rem' }}>
                Documentation gets outdated, and reading source code takes hours. Codebase Explainer visually maps your repository's structure, dependencies, and flow—giving you a human-readable 3D architecture diagram instantly.
            </p>

            <div style={{ position: 'absolute', bottom: '15%', left: '50%', transform: 'translateX(-50%)', opacity: 0.6, pointerEvents: 'none' }}>
                <div style={{ width: '1px', height: '40px', background: 'var(--text-secondary)', margin: '0 auto', animation: 'bounce 2s infinite' }}></div>
            </div>
        </section>
    );
}
