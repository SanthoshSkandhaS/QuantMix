import React from "react";
import { Atom, PlayCircle, ArrowUp, ExternalLink, Code2 } from "lucide-react";

/**
 * Footer
 * Features:
 * - Exact identity copy: “QuantMix — Explore the quantum world hidden within the familiar.”
 * - Navigation links
 * - GitHub repo link: https://github.com/SanthoshSkandhaS/QuantMix
 * - Replay Intro trigger
 * - Back to top button
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
                <Atom size={20} color="var(--color-teal)" />
              </div>
              <span className="footer-brand-name">QuantMix</span>
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
            <h4 className="footer-heading">Project Roadmap</h4>
            <ul className="footer-links">
              <li>
                <span className="status-dot green" />
                <span>Milestone 1: Homepage V1 (Active)</span>
              </li>
              <li>
                <span className="status-dot purple" />
                <span>Milestone 2: Bedroom 3D &amp; Lab</span>
              </li>
              <li>
                <span className="status-dot purple" />
                <span>Milestone 3: QuAntI Assistant Integration</span>
              </li>
              <li>
                <span className="status-dot purple" />
                <span>Milestones 4–6: Macro Environments</span>
              </li>
            </ul>
          </div>

          {/* Quick Actions & Repository */}
          <div className="footer-col">
            <h4 className="footer-heading">Open Source &amp; Controls</h4>
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
                aria-label="Replay 4s Atomic Intro Animation"
              >
                <PlayCircle size={16} color="var(--color-violet)" />
                <span>Replay Atomic Intro</span>
              </button>

              <button
                onClick={scrollToTop}
                className="footer-btn top-btn"
                aria-label="Scroll back to top"
              >
                <ArrowUp size={16} color="var(--color-teal)" />
                <span>Back to Top</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-copy">
            © {new Date().getFullYear()} QuantMix. Built for open science and interactive quantum education.
          </div>
          <div className="footer-badges">
            <span className="footer-badge">React 19 + Vite</span>
            <span className="footer-badge">Canvas 2D Wave Mechanics</span>
            <span className="footer-badge">Vanilla Design Tokens</span>
          </div>
        </div>
      </div>

      <style>{`
        .footer-wrapper {
          position: relative;
          z-index: 10;
          background: #080D1A;
          border-top: 1px solid rgba(169, 182, 207, 0.1);
          padding-top: 80px;
          padding-bottom: 40px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1.2fr 1.2fr;
          gap: 40px;
          margin-bottom: 60px;
        }

        .brand-col {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .footer-brand-title {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .footer-logo-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(53, 214, 208, 0.15);
          border: 1px solid rgba(53, 214, 208, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .footer-brand-name {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--color-text-main);
        }

        .footer-identity-tagline {
          font-size: 0.98rem;
          font-weight: 600;
          color: var(--color-teal);
          line-height: 1.5;
        }

        .footer-vision-note {
          font-size: 0.88rem;
          color: var(--color-text-muted);
          line-height: 1.6;
        }

        .footer-heading {
          font-size: 0.82rem;
          font-family: var(--font-mono);
          color: var(--color-text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 18px;
        }

        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-links a {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          transition: color 0.2s ease, transform 0.2s ease;
          display: inline-block;
        }

        .footer-links a:hover {
          color: var(--color-teal);
          transform: translateX(3px);
        }

        .footer-links li {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .status-dot.green {
          background: var(--color-teal);
          box-shadow: 0 0 6px var(--color-teal);
        }

        .status-dot.purple {
          background: var(--color-violet);
          opacity: 0.7;
        }

        .footer-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-family: var(--font-mono);
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .github-btn {
          background: rgba(17, 27, 46, 0.8);
          border: 1px solid var(--border-subtle);
          color: var(--color-text-main);
        }

        .github-btn:hover {
          border-color: var(--color-teal);
          background: rgba(53, 214, 208, 0.1);
        }

        .replay-btn {
          background: rgba(155, 140, 255, 0.1);
          border: 1px solid rgba(155, 140, 255, 0.3);
          color: var(--color-text-main);
        }

        .replay-btn:hover {
          background: rgba(155, 140, 255, 0.2);
          border-color: var(--color-violet);
        }

        .top-btn {
          background: rgba(17, 27, 46, 0.5);
          border: 1px solid var(--border-subtle);
          color: var(--color-text-secondary);
        }

        .top-btn:hover {
          color: var(--color-text-main);
          border-color: var(--color-teal);
        }

        .footer-bottom-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 30px;
          border-top: 1px solid rgba(169, 182, 207, 0.08);
          font-size: 0.82rem;
          color: var(--color-text-muted);
          flex-wrap: wrap;
          gap: 16px;
        }

        .footer-badges {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .footer-badge {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          padding: 3px 8px;
          border-radius: 4px;
          background: rgba(17, 27, 46, 0.6);
          border: 1px solid rgba(169, 182, 207, 0.1);
          color: var(--color-text-muted);
        }

        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
          .footer-bottom-bar {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </footer>
  );
}
