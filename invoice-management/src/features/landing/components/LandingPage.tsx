import React from 'react';
import Button from '@/shared/components/Button/Button';
import './LandingPage.css';

const LandingPage: React.FC = () => {
    return (
        <div className="landing-container">
            <div className="blobs">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            <main className="landing-content glass-panel animate-fade-in">
                <header className="landing-header">
                    <h1 className="gradient-text">Modern Vite + React</h1>
                    <p className="subtitle">Premium setup for scalable, high-performance applications</p>
                </header>

                <section className="features-grid">
                    <div className="feature-card">
                        <h3>Clean Architecture</h3>
                        <p>Feature-based structure with SRP and absolute imports.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Type Safety</h3>
                        <p>Strict TypeScript configuration with zero `any` types.</p>
                    </div>
                    <div className="feature-card">
                        <h3>Modern UI</h3>
                        <p>Dynamic design with glassmorphism and smooth animations.</p>
                    </div>
                </section>

                <footer className="landing-footer">
                    <Button size="lg" onClick={() => console.log('Get Started')}>
                        Get Started
                    </Button>
                </footer>
            </main>
        </div>
    );
};

export default LandingPage;
