import React from "react";
import FlowingWaveButton from "./FlowingWaveButton";
import MathView from "./MathView";
import { ChevronDown, Orbit, Layers, Binary, Compass } from "lucide-react";

/**
 * Hero
 * Prominent landing section featuring:
 * - Subtitle: Virtual Quantum Mechanics Explorer
 * - Exact Tagline: “What if our world behaved according to the laws of Quantum Mechanics”
 * - Supporting text: “Step into the familiar. Discover the extraordinary hidden within it.”
 * - Signature FlowingWaveButton ("Start Exploring")
 * - Quantum constant badges & telemetry with KaTeX mathematical typesetting
 * - Direct navigation to the interesting facts section (#discovery)
 */
export default function Hero({ onExplore }) {
  const handleScrollToDiscovery = () => {
    const nextSection = document.getElementById("discovery");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScrollToEnvironments = () => {
    const envSection = document.getElementById("environments");
    if (envSection) {
      envSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="hero-section">
      <div className="container hero-content">
        {/* Scientific Badge */}
        <div className="hero-badge" data-testid="hero-badge">
          <span className="badge-glow-dot" aria-hidden="true" />
          <span className="badge-text">Virtual Quantum Mechanics Explorer</span>
        </div>

        {/* Main Headline - Exact Tagline in Editorial Serif */}
        <h1 className="hero-headline font-serif">
          “What if our world behaved according to the laws of Quantum Mechanics”
        </h1>

        {/* Supporting Copy */}
        <p className="hero-supporting">
          Step into the familiar. Discover the extraordinary hidden within it.
        </p>

        {/* Action CTAs */}
        <div className="hero-cta-wrapper">
          <FlowingWaveButton
            targetSectionId="discovery"
            onExplore={() => {
              if (onExplore) onExplore();
              handleScrollToDiscovery();
            }}
          />
          <button
            onClick={handleScrollToEnvironments}
            className="hero-secondary-btn"
            aria-label="View planned exploratory environments"
          >
            <Compass size={17} />
            <span>Planned Environments</span>
          </button>
        </div>

        {/* Quantum Metrics / Telemetry Strip */}
        <div className="hero-telemetry-grid">
          <div className="telemetry-item">
            <div className="telemetry-icon">
              <Binary size={18} color="var(--color-copper)" />
            </div>
            <div className="telemetry-info">
              <span className="telemetry-label">Reduced Planck Constant</span>
              <span className="telemetry-val">
                <MathView math="\hbar = 1.054 \times 10^{-34}\text{ J}\cdot\text{s}" inline />
              </span>
            </div>
          </div>

          <div className="telemetry-item">
            <div className="telemetry-icon">
              <Orbit size={18} color="var(--color-forest)" />
            </div>
            <div className="telemetry-info">
              <span className="telemetry-label">Exploratory Environments</span>
              <span className="telemetry-val">6 Familiar Worlds (Milestone 2 3D)</span>
            </div>
          </div>

          <div className="telemetry-item">
            <div className="telemetry-icon">
              <Layers size={18} color="var(--color-copper)" />
            </div>
            <div className="telemetry-info">
              <span className="telemetry-label">Planned Companion</span>
              <span className="telemetry-val">QuAntI AI Scientific Guide</span>
            </div>
          </div>
        </div>

        {/* Subtle Scroll Indicator */}
        <button
          onClick={handleScrollToDiscovery}
          className="hero-scroll-indicator"
          aria-label="Scroll to Quantum Discovery Section"
        >
          <span className="scroll-indicator-text">Discover the Strange</span>
          <ChevronDown size={18} className="scroll-arrow" />
        </button>
      </div>

      <style>{`
        .hero-section {
          position: relative;
          min-height: 94vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 140px;
          padding-bottom: 70px;
          z-index: 10;
        }

        .hero-content {
          text-align: center;
          max-width: 960px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Pill Badge */
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 6px 18px;
          border-radius: var(--radius-full);
          background: var(--color-surface);
          border: 1px solid var(--border-stone);
          box-shadow: var(--shadow-sm);
          margin-bottom: 26px;
        }

        .badge-glow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--color-copper);
        }

        .badge-text {
          font-family: var(--font-mono);
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--color-forest);
        }

        /* Hero Headline */
        .hero-headline {
          font-size: clamp(2.4rem, 5.2vw, 4.2rem);
          font-weight: 600;
          line-height: 1.14;
          letter-spacing: -0.025em;
          color: var(--color-graphite);
          margin-bottom: 22px;
          text-wrap: balance;
        }

        /* Supporting Copy */
        .hero-supporting {
          font-size: clamp(1.12rem, 2vw, 1.35rem);
          font-weight: 400;
          color: var(--color-text-secondary);
          max-width: 660px;
          margin-bottom: 38px;
          line-height: 1.6;
        }

        .hero-cta-wrapper {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 50px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .hero-secondary-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 15px 24px;
          border-radius: var(--radius-full);
          background: var(--color-surface);
          border: 1px solid var(--border-stone);
          color: var(--color-graphite);
          font-family: var(--font-sans);
          font-size: 0.98rem;
          font-weight: 600;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          transition: all 0.2s ease;
        }

        .hero-secondary-btn:hover {
          background: var(--color-surface-muted);
          border-color: var(--color-copper);
          color: var(--color-copper);
          transform: translateY(-1px);
        }

        /* Telemetry Row */
        .hero-telemetry-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          width: 100%;
          max-width: 880px;
          margin-bottom: 40px;
        }

        .telemetry-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          background: var(--color-surface);
          border: 1px solid var(--border-stone);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
          text-align: left;
          transition: border-color var(--transition-normal);
        }

        .telemetry-item:hover {
          border-color: var(--color-copper-border);
        }

        .telemetry-icon {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: var(--color-surface-muted);
          border: 1px solid var(--border-stone-light);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .telemetry-info {
          display: flex;
          flex-direction: column;
        }

        .telemetry-label {
          font-size: 0.72rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .telemetry-val {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--color-graphite);
          font-family: var(--font-mono);
        }

        /* Scroll Indicator */
        .hero-scroll-indicator {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: var(--color-text-muted);
          font-size: 0.78rem;
          font-family: var(--font-mono);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.2s ease;
          background: none;
          border: none;
          padding: 8px;
        }

        .hero-scroll-indicator:hover {
          color: var(--color-copper);
        }

        .scroll-arrow {
          animation: arrowBounce 2s infinite;
        }

        @keyframes arrowBounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(5px); }
          60% { transform: translateY(2px); }
        }

        @media (max-width: 820px) {
          .hero-telemetry-grid {
            grid-template-columns: 1fr;
            max-width: 420px;
          }
          .hero-section {
            padding-top: 110px;
            padding-bottom: 50px;
          }
        }
      `}</style>
    </section>
  );
}
