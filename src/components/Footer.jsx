import React from "react";
import { Atom, PlayCircle, ArrowUp, ExternalLink } from "lucide-react";

const CURRENT_YEAR = 2026;

/**
 * Footer
 * Features:
 * - Exact identity copy: “QuantMix — Explore the quantum world hidden within the familiar.”
 * - Navigation links & verified repository link
 * - Editorial roadmap overview
 * - Replay Intro trigger & Back to Top button
 * - Deep cinematic ink styling
 */
export default function Footer({ onReplayIntro }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer-wrapper">
      <div className="container">
        {/* Main Footer Row */}
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-col brand-col">
            <div className="footer-brand-title">
              <div className="footer-logo-icon">
                <Atom size={20} color="var(--color-copper)" />
              </div>
              <span className="footer-brand-name font-serif">QuantMix</span>
            </div>
            <p className="footer-identity-tagline">
              QuantMix — Explore the quantum world hidden within the familiar.
            </p>
            <p className="footer-vision-note">
              An interactive educational exploration platform transforming everyday life into an intuitive gateway to quantum mechanics.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="footer-col">
            <h4 className="footer-heading">Platform Architecture</h4>
            <ul className="footer-links">
              <li><a href="#hero">Overview &amp; Principles</a></li>
              <li><a href="#discovery">Quantum Discoveries</a></li>
              <li><a href="#environments">6 Familiar Environments</a></li>
              <li><a href="#lab">The Quantum Lab</a></li>
              <li><a href="#quanti">Meet QuAntI AI</a></li>
            </ul>
          </div>

          {/* Future Milestones */}
          <div className="footer-col">
            <h4 className="footer-heading">Verified Project Roadmap</h4>
            <ul className="footer-links">
              <li>
                <span className="status-dot teal" />
                <span>Milestone 1: Scientific Web Engine</span>
              </li>
              <li>
                <span className="status-dot copper" />
                <span>Milestone 2: Navigable 3D Bedroom</span>
              </li>
              <li>
                <span className="status-dot copper" />
                <span>Milestone 3: Interactive Quantum Lab</span>
              </li>
              <li>
                <span className="status-dot copper" />
                <span>Milestone 4: QuAntI Assistant</span>
              </li>
            </ul>
          </div>

          {/* Quick Actions & Repository */}
          <div className="footer-col">
            <h4 className="footer-heading">Open Science &amp; Source</h4>
            <div className="footer-actions">
              <a
                href="https://github.com/SanthoshSkandhaS/QuantMix"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-btn github-btn"
                aria-label="View QuantMix repository on GitHub"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub Repository</span>
                <ExternalLink size={12} />
              </a>

              <button
                onClick={onReplayIntro}
                className="footer-btn replay-btn"
                aria-label="Replay Cinematic Quantum Intro"
              >
                <PlayCircle size={16} color="var(--color-copper)" />
                <span>Replay Intro</span>
              </button>

              <button
                onClick={scrollToTop}
                className="footer-btn top-btn"
                aria-label="Scroll back to top of the page"
              >
                <ArrowUp size={16} />
                <span>Back to Top</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="footer-bottom">
          <div className="copyright-text">
            © {CURRENT_YEAR} QuantMix. Built for open science, authentic mathematical rigor, and interactive physics exploration.
          </div>
          <div className="disclaimer-text">
            All models use certified quantum formulations (de Broglie, Schrödinger, Pauli). Milestone 2 Three.js 3D navigation in active development.
          </div>
        </div>
      </div>

      <style>{`
        .footer-wrapper {
          background: #0E1015;
          border-top: 1px solid var(--border-subtle);
          padding-top: 80px;
          padding-bottom: 48px;
          position: relative;
          z-index: 10;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
          gap: 40px;
          margin-bottom: 60px;
        }

        .brand-col {
          display: flex;
          flex-direction: column;
        }

        .footer-brand-title {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .footer-logo-icon {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          background: rgba(24, 28, 38, 0.95);
          border: 1px solid var(--border-stone);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .footer-brand-name {
          font-size: 1.45rem;
          font-weight: 700;
          color: var(--color-text-main);
        }

        .footer-identity-tagline {
          font-size: 0.95rem;
          color: var(--color-copper);
          font-weight: 600;
          margin-bottom: 12px;
          line-height: 1.45;
        }

        .footer-vision-note {
          font-size: 0.88rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
        }

        .footer-heading {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-teal);
          margin-bottom: 20px;
          font-weight: 600;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-links li {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: var(--color-text-secondary);
        }

        .footer-links a {
          transition: color 0.2s ease;
        }

        .footer-links a:hover {
          color: var(--color-copper);
        }

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .status-dot.teal {
          background: var(--color-teal);
        }

        .status-dot.copper {
          background: var(--color-copper);
        }

        .footer-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-btn {
          display: inline-flex;
          align-items: center;
          justify-content: flex-start;
          gap: 10px;
          padding: 10px 16px;
          border-radius: var(--radius-sm);
          background: rgba(24, 28, 38, 0.9);
          border: 1px solid var(--border-stone);
          color: var(--color-text-main);
          font-size: 0.86rem;
          font-family: var(--font-sans);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: var(--shadow-sm);
        }

        .footer-btn:hover {
          background: rgba(32, 38, 52, 0.95);
          border-color: var(--color-copper);
          color: var(--color-copper);
          transform: translateY(-1px);
        }

        .footer-bottom {
          padding-top: 32px;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 0.82rem;
          color: var(--color-text-muted);
        }

        .copyright-text {
          font-family: var(--font-sans);
        }

        .disclaimer-text {
          font-family: var(--font-mono);
          font-size: 0.76rem;
        }

        @media (max-width: 990px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
