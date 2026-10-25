import React from "react";
import FlowingWaveButton from "./FlowingWaveButton";
import { ChevronDown, Sparkles, Orbit, Layers, Binary } from "lucide-react";

/**
 * Hero
 * Prominent landing section featuring:
 * - Subtitle: Virtual Quantum Mechanics Explorer
 * - Exact Tagline: “What if our world behaved according to the laws of Quantum Mechanics”
 * - Supporting text: “Step into the familiar. Discover the extraordinary hidden within it.”
 * - Signature FlowingWaveButton ("Start Exploring")
 * - Quantum constant badges & telemetry
 * - Atmospheric scroll indicator
 */
export default function Hero({ onExplore }) {
  const handleScrollDown = () => {
    const nextSection = document.getElementById("discovery");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
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

        {/* Main Headline - Exact Tagline */}
        <h1 className="hero-headline">
          “What if our world behaved according to the laws of Quantum Mechanics”
        </h1>

        {/* Supporting Copy */}
        <p className="hero-supporting">
          Step into the familiar. Discover the extraordinary hidden within it.
        </p>

        {/* Signature Start Exploring Flowing Wave Button */}
        <div className="hero-cta-wrapper">
          <FlowingWaveButton targetSectionId="environments" onExplore={onExplore} />
        </div>

        {/* Quantum Metrics / Telemetry Strip */}
        <div className="hero-telemetry-grid">
          <div className="telemetry-item">
            <div className="telemetry-icon">
              <Binary size={16} color="var(--color-teal)" />
            </div>
            <div className="telemetry-info">
              <span className="telemetry-label">Reduced Planck Constant</span>
              <span className="telemetry-val">ℏ = 1.054 × 10⁻³⁴ J·s</span>
            </div>
          </div>

          <div className="telemetry-item">
            <div className="telemetry-icon">
              <Orbit size={16} color="var(--color-violet)" />
            </div>
            <div className="telemetry-info">
              <span className="telemetry-label">Exploratory Environments</span>
              <span className="telemetry-val">6 Familiar Worlds</span>
            </div>
          </div>

          <div className="telemetry-item">
            <div className="telemetry-icon">
              <Layers size={16} color="var(--color-coral)" />
            </div>
            <div className="telemetry-info">
              <span className="telemetry-label">Planned Companion</span>
              <span className="telemetry-val">QuAntI AI Guide</span>
            </div>
          </div>
        </div>

        {/* Subtle Scroll Indicator */}
        <button
          onClick={handleScrollDown}
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
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-top: 140px;
          padding-bottom: 80px;
          z-index: 10;
        }

        .hero-content {
          text-align: center;
          max-width: 980px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Pill Badge */
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 20px;
          border-radius: var(--radius-full);
          background: rgba(17, 27, 46, 0.8);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(53, 214, 208, 0.3);
          box-shadow: 0 0 20px rgba(53, 214, 208, 0.15);
          margin-bottom: 28px;
          animation: badgeFloat 4s ease-in-out infinite;
        }

        @keyframes badgeFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .badge-glow-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-teal);
          box-shadow: 0 0 10px var(--color-teal);
          animation: dotPulse 2s infinite;
        }

        @keyframes dotPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }

        .badge-text {
          font-family: var(--font-mono);
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--color-teal);
        }

        /* Hero Headline */
        .hero-headline {
          font-size: clamp(2.4rem, 5.2vw, 4.4rem);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.03em;
          color: var(--color-text-main);
          margin-bottom: 24px;
          text-wrap: balance;
          background: linear-gradient(180deg, #FFFFFF 0%, #E2E8F8 65%, #A9B6CF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        /* Supporting Copy */
        .hero-supporting {
          font-size: clamp(1.15rem, 2.2vw, 1.45rem);
          font-weight: 400;
          color: var(--color-text-secondary);
          max-width: 680px;
          margin-bottom: 42px;
          line-height: 1.6;
        }

        .hero-cta-wrapper {
          margin-bottom: 56px;
        }

        /* Telemetry Row */
        .hero-telemetry-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          width: 100%;
          max-width: 860px;
          margin-bottom: 48px;
        }

        .telemetry-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          background: rgba(17, 27, 46, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          text-align: left;
          transition: border-color var(--transition-normal);
        }

        .telemetry-item:hover {
          border-color: rgba(53, 214, 208, 0.3);
        }

        .telemetry-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(11, 16, 32, 0.8);
          border: 1px solid rgba(169, 182, 207, 0.15);
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
          font-size: 0.74rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .telemetry-val {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--color-text-main);
          font-family: var(--font-mono);
        }

        /* Scroll Indicator */
        .hero-scroll-indicator {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: var(--color-text-muted);
          font-size: 0.8rem;
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
          color: var(--color-teal);
        }

        .scroll-arrow {
          animation: arrowBounce 2s infinite;
        }

        @keyframes arrowBounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(6px); }
          60% { transform: translateY(3px); }
        }

        @media (max-width: 768px) {
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
