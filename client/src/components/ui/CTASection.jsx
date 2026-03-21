import React, { useEffect, useState, useRef } from 'react';

export default function CTASection({ onAnalyze }) {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="section-container"
            style={{
                padding: '60px 20px',
                textAlign: 'center',
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
            }}
        >
            <div className="glass-panel" style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '60px 40px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)'
            }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '24px' }}>
                    Ready to map your architecture?
                </h2>
                <p className="text-secondary" style={{ fontSize: '1.2rem', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px auto' }}>
                    Stop guessing how files connect. Generate a stunning, interactive 3D map of your codebase and understand it instantly.
                </p>
                <button
                    className="btn-primary"
                    onClick={onAnalyze}
                    style={{ fontSize: '1.2rem', padding: '16px 40px' }}
                >
                    Analyze Repository
                </button>
            </div>
        </section>
    );
}
