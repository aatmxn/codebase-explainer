import React from 'react';
import { Cpu, Network, Map } from 'lucide-react';

export default function Features() {
    const features = [
        {
            icon: <Cpu size={24} />,
            title: 'Structural Breakdown',
            description: 'Get instant, high-level summaries of repositories, folders, and individual files clearly mapping out complex architectures.',
        },
        {
            icon: <Network size={24} />,
            title: 'Architecture Visualization',
            description: 'See the big picture with beautiful 3D node graphs representing the structural foundation of the entire project.',
        },
        {
            icon: <Map size={24} />,
            title: 'File Relationships Mapping',
            description: 'Follow the execution flow natively. Understand how different modules import and export dependencies securely and intelligently.',
        }
    ];

    return (
        <section className="section-container border-b transition-colors border-[var(--glass-border)]">
            <h2 className="section-title text-gradient" style={{ fontWeight: 600, letterSpacing: '-0.02em', fontSize: '2rem' }}>Core Capabilities</h2>

            <div className="features-grid">
                {features.map((feature, index) => (
                    <div key={index} className="feature-card glass-panel" style={{ border: '1px solid rgba(255,255,255,0.03)', background: 'rgba(255,255,255,0.02)' }}>
                        <div className="feature-icon-wrapper" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-primary)' }}>
                            {feature.icon}
                        </div>
                        <h3 className="feature-title" style={{ fontSize: '1.1rem', fontWeight: 500 }}>{feature.title}</h3>
                        <p className="feature-desc" style={{ fontSize: '0.95rem' }}>{feature.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
