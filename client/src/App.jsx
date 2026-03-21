import React, { useState } from 'react';
import Scene from './components/3d/Scene';
import HeroOverlay from './components/ui/HeroOverlay';
import Features from './components/ui/Features';
import CTASection from './components/ui/CTASection';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  const [isAppView, setIsAppView] = useState(false);

  if (isAppView) {
    return <Dashboard onBack={() => setIsAppView(false)} />;
  }

  return (
    <div className="app-container">
      {/* 3D Background Canvas Fixed */}
      <div className="canvas-container">
        <Scene />
      </div>

      {/* Foreground Content Scrollable */}
      <div className="content-container">
        <HeroOverlay />
        <Features />

        {/* Analyze Button Section -> The last user-facing section */}
        <CTASection onAnalyze={() => setIsAppView(true)} />

        {/* Footer */}
        <footer className="footer-container glass-panel">
          <p className="text-secondary">© 2026 Codebase Explainer. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
