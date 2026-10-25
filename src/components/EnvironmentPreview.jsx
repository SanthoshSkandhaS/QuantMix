import React, { useState } from "react";
import { ENVIRONMENTS } from "../data/environmentsData";
import {
  Home,
  CloudSun,
  Navigation,
  Trophy,
  Bus,
  HeartPulse,
  Sparkles,
  ArrowUpRight,
  X,
  Layers,
  Atom,
  ChevronRight,
  ShieldAlert
} from "lucide-react";

// Icon mapping helper
const iconMap = {
  Home,
  CloudSun,
  Navigation,
  Trophy,
  Bus,
  HeartPulse
};

/**
 * EnvironmentPreview
 * Heading: "Your everyday world, seen differently."
 * 6 Visual Destinations:
 * 1. Your Room (Primary in-development focus)
 * 2. The Sky
 * 3. The Street
 * 4. A Football Field
 * 5. Inside a Bus
 * 6. Inside the Human Body
 *
 * Clearly labeled status badges, subtle hover states, and an interactive
 * Architectural Preview Drawer (no broken 404 links or fake simulations).
 */
export default function EnvironmentPreview() {
  const [selectedEnv, setSelectedEnv] = useState(null);

  return (
    <section id="environments" className="section-wrapper environments-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Atom size={14} />
            <span>Exploration Environments</span>
          </div>
          <h2 className="section-title">Your everyday world, seen differently.</h2>
          <p className="section-desc">
            Step inside familiar physical spaces. Soon, you will be able to walk around, inspect everyday objects, and uncover the extraordinary quantum mechanics that make them possible.
          </p>
        </div>

        {/* 6 Destinations Grid */}
        <div className="environments-grid">
          {ENVIRONMENTS.map((env) => {
            const IconComponent = iconMap[env.icon] || Home;
            const isFirst = env.isFirstFocus;

            return (
              <div
                key={env.id}
                className={`glass-card env-card ${isFirst ? "env-card-featured" : ""}`}
                onClick={() => setSelectedEnv(env)}
                role="button"
                tabIndex={0}
                aria-label={`View architectural preview for ${env.title}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedEnv(env);
                  }
                }}
              >
                {/* Background Gradient & Ambient Glow */}
                <div
                  className="env-card-bg"
                  style={{
                    background: env.gradient
                  }}
                  aria-hidden="true"
                />

                {/* Top Badge: Status */}
                <div className="env-card-header">
                  <div
                    className="env-icon-wrapper"
                    style={{
                      borderColor: `rgba(${env.accent === "#35D6D0" ? "53, 214, 208" : env.accent === "#FF8B78" ? "255, 139, 120" : "155, 140, 255"}, 0.4)`
                    }}
                  >
                    <IconComponent size={22} color={env.accent} />
                  </div>
                  <span
                    className={`env-status-badge ${isFirst ? "badge-primary" : "badge-upcoming"}`}
                  >
                    {env.statusBadge}
                  </span>
                </div>

                {/* Main Card Content */}
                <div className="env-card-content">
                  <h3 className="env-card-title">{env.title}</h3>
                  <p className="env-card-subtitle">{env.subtitle}</p>
                  <p className="env-card-desc">{env.description}</p>
                </div>

                {/* Interactive Objects Preview Pills */}
                <div className="env-objects-preview">
                  <span className="objects-label">Quantum Phenomena:</span>
                  <div className="objects-tags">
                    {env.interactiveObjects.slice(0, 2).map((obj, idx) => (
                      <span key={idx} className="object-tag">
                        {obj.name}
                      </span>
                    ))}
                    {env.interactiveObjects.length > 2 && (
                      <span className="object-tag-more">
                        +{env.interactiveObjects.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Link */}
                <div className="env-card-footer">
                  <span className="preview-action-text">Inspect Planned Architecture</span>
                  <ArrowUpRight size={16} className="preview-arrow" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Informative Architectural Preview Drawer / Modal */}
        {selectedEnv && (
          <div
            className="env-modal-backdrop"
            onClick={() => setSelectedEnv(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-env-title"
          >
            <div
              className="glass-card env-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close-btn"
                onClick={() => setSelectedEnv(null)}
                aria-label="Close Preview"
              >
                <X size={20} />
              </button>

              <div className="modal-header">
                <span className="modal-tag">{selectedEnv.status}</span>
                <h3 id="modal-env-title" className="modal-title">
                  {selectedEnv.title}
                </h3>
                <p className="modal-desc">{selectedEnv.description}</p>
              </div>

              {/* Status Notice */}
              <div className="modal-notice">
                <ShieldAlert size={18} color="var(--color-teal)" className="notice-icon" />
                <div className="notice-content">
                  <strong>Architectural Blueprint:</strong> Full in-engine 3D interaction for this environment is part of upcoming project milestones. Below are the verified physical phenomena mapped to each interactive object.
                </div>
              </div>

              {/* Interactive Objects List */}
              <div className="modal-section">
                <h4 className="modal-section-title">
                  <Layers size={16} />
                  <span>Mapped Everyday Objects & Quantum Laws</span>
                </h4>
                <div className="modal-objects-grid">
                  {selectedEnv.interactiveObjects.map((obj, i) => (
                    <div key={i} className="modal-object-item">
                      <div className="modal-object-name">
                        <span className="bullet-dot" />
                        <strong>{obj.name}</strong>
                      </div>
                      <div className="modal-object-phenomenon">{obj.phenomenon}</div>
                      <p className="modal-object-detail">{obj.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Planned Features */}
              <div className="modal-section">
                <h4 className="modal-section-title">
                  <Sparkles size={16} />
                  <span>Planned 3D Mechanics & Controls</span>
                </h4>
                <ul className="modal-features-list">
                  {selectedEnv.plannedFeatures.map((feat, i) => (
                    <li key={i} className="modal-feature-item">
                      <ChevronRight size={14} color="var(--color-teal)" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="modal-footer">
                <button
                  className="modal-dismiss-btn"
                  onClick={() => setSelectedEnv(null)}
                >
                  Close Architecture Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .environments-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        .env-card {
          padding: 28px;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          position: relative;
          background: rgba(17, 27, 46, 0.7);
        }

        .env-card:hover {
          transform: translateY(-4px);
        }

        .env-card:hover .preview-arrow {
          transform: translate(3px, -3px);
        }

        .env-card-featured {
          border-color: rgba(53, 214, 208, 0.45);
          box-shadow: 0 0 30px rgba(53, 214, 208, 0.15);
        }

        .env-card-bg {
          position: absolute;
          inset: 0;
          opacity: 0.65;
          pointer-events: none;
          z-index: 0;
          transition: opacity 0.3s ease;
        }

        .env-card:hover .env-card-bg {
          opacity: 1;
        }

        .env-card-header {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .env-icon-wrapper {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(11, 16, 32, 0.85);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .env-status-badge {
          font-size: 0.74rem;
          font-family: var(--font-mono);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-weight: 600;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        .badge-primary {
          background: rgba(53, 214, 208, 0.15);
          color: var(--color-teal);
          border: 1px solid rgba(53, 214, 208, 0.35);
        }

        .badge-upcoming {
          background: rgba(169, 182, 207, 0.1);
          color: var(--color-text-secondary);
          border: 1px solid rgba(169, 182, 207, 0.2);
        }

        .env-card-content {
          position: relative;
          z-index: 1;
          flex: 1;
        }

        .env-card-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--color-text-main);
          margin-bottom: 4px;
        }

        .env-card-subtitle {
          font-size: 0.85rem;
          font-family: var(--font-mono);
          color: var(--color-teal);
          margin-bottom: 12px;
        }

        .env-card-desc {
          font-size: 0.94rem;
          color: var(--color-text-secondary);
          line-height: 1.55;
          margin-bottom: 20px;
        }

        .env-objects-preview {
          position: relative;
          z-index: 1;
          margin-bottom: 20px;
          padding-top: 14px;
          border-top: 1px solid var(--border-subtle);
        }

        .objects-label {
          display: block;
          font-size: 0.72rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .objects-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .object-tag {
          font-size: 0.78rem;
          padding: 3px 8px;
          border-radius: 6px;
          background: rgba(11, 16, 32, 0.6);
          border: 1px solid var(--border-subtle);
          color: var(--color-text-secondary);
        }

        .object-tag-more {
          font-size: 0.78rem;
          padding: 3px 8px;
          border-radius: 6px;
          background: rgba(155, 140, 255, 0.1);
          color: var(--color-violet);
        }

        .env-card-footer {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 14px;
          border-top: 1px solid var(--border-subtle);
        }

        .preview-action-text {
          font-size: 0.84rem;
          font-family: var(--font-mono);
          color: var(--color-teal);
          font-weight: 600;
        }

        .preview-arrow {
          color: var(--color-teal);
          transition: transform 0.2s ease;
        }

        /* Architectural Preview Modal */
        .env-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(11, 16, 32, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          z-index: 1000;
          animation: modalFadeIn 0.25s ease;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .env-modal {
          max-width: 680px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          padding: 36px;
          background: rgba(17, 27, 46, 0.95);
          border: 1px solid rgba(53, 214, 208, 0.3);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
        }

        .modal-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(11, 16, 32, 0.6);
          border: 1px solid var(--border-subtle);
          color: var(--color-text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-close-btn:hover {
          color: var(--color-text-main);
          border-color: var(--color-teal);
        }

        .modal-header {
          margin-bottom: 24px;
        }

        .modal-tag {
          display: inline-block;
          font-size: 0.78rem;
          font-family: var(--font-mono);
          color: var(--color-teal);
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .modal-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-text-main);
          margin-bottom: 8px;
        }

        .modal-desc {
          font-size: 1.05rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
        }

        .modal-notice {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 14px 18px;
          background: rgba(53, 214, 208, 0.08);
          border: 1px solid rgba(53, 214, 208, 0.25);
          border-radius: var(--radius-md);
          margin-bottom: 24px;
        }

        .notice-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .notice-content {
          font-size: 0.88rem;
          color: var(--color-text-main);
          line-height: 1.5;
        }

        .modal-section {
          margin-bottom: 24px;
        }

        .modal-section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          font-family: var(--font-mono);
          color: var(--color-violet);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 14px;
        }

        .modal-objects-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .modal-object-item {
          padding: 14px;
          background: rgba(11, 16, 32, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
        }

        .modal-object-name {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.95rem;
          color: var(--color-text-main);
          margin-bottom: 4px;
        }

        .bullet-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-teal);
        }

        .modal-object-phenomenon {
          font-size: 0.78rem;
          font-family: var(--font-mono);
          color: var(--color-teal);
          margin-bottom: 6px;
        }

        .modal-object-detail {
          font-size: 0.84rem;
          color: var(--color-text-secondary);
          line-height: 1.45;
        }

        .modal-features-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .modal-feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: var(--color-text-secondary);
        }

        .modal-footer {
          margin-top: 28px;
          display: flex;
          justify-content: flex-end;
        }

        .modal-dismiss-btn {
          padding: 10px 22px;
          border-radius: var(--radius-full);
          background: rgba(169, 182, 207, 0.15);
          color: var(--color-text-main);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .modal-dismiss-btn:hover {
          background: rgba(169, 182, 207, 0.25);
        }

        @media (max-width: 1024px) {
          .environments-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .environments-grid {
            grid-template-columns: 1fr;
          }
          .modal-objects-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
