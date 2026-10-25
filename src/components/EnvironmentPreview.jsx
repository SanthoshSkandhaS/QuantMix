import React, { useState } from "react";
import { ENVIRONMENTS } from "../data/environmentsData";
import {
  Home,
  CloudSun,
  Navigation,
  Trophy,
  Bus,
  HeartPulse,
  ArrowUpRight,
  X,
  Layers,
  Atom,
  Info,
  Calendar,
  Sparkles
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
 * 6 Exploratory Destinations:
 * 1. Your Room (Milestone 2 Dedicated Navigable 3D Bedroom)
 * 2. The Sky
 * 3. The Street
 * 4. A Football Field
 * 5. Inside a Bus
 * 6. Inside the Human Body
 *
 * Honest Representation:
 * - Accurately labels cards as Architectural Blueprints and Concept Previews.
 * - Outlines the upcoming Milestone 2 Three.js / React Three Fiber interactive bedroom.
 * - Restyled in the Scientific-Editorial design system.
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
            <span>Planned Exploratory Environments</span>
          </div>
          <h2 className="section-title">Your everyday world, seen differently.</h2>
          <p className="section-desc">
            Explore our architectural blueprints for six familiar environments. In our upcoming Milestone 2, we will launch a genuine, navigable 3D Bedroom using Three.js/React Three Fiber with realistic materials, perspective lighting, and quantum object interaction.
          </p>
        </div>

        {/* 3D Roadmap Transparency Notice */}
        <div className="roadmap-notice-box">
          <div className="roadmap-notice-icon">
            <Info size={18} color="var(--color-copper)" />
          </div>
          <div className="roadmap-notice-text">
            <strong>Simulation Roadmap Notice:</strong> The interactive cards and drawers below present verified physical phenomena mapped to planned spaces. Full 3D navigation and interactive physics are in active preparation for Milestone 2 (commencing with the interactive 3D Bedroom).
          </div>
        </div>

        {/* 6 Destinations Grid */}
        <div className="environments-grid">
          {ENVIRONMENTS.map((env) => {
            const IconComponent = iconMap[env.icon] || Home;
            const isFirst = env.isFirstFocus;

            return (
              <div
                key={env.id}
                className={`editorial-card env-card ${isFirst ? "env-card-featured" : ""}`}
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
                {/* Top Badge: Status */}
                <div className="env-card-header">
                  <div className={`env-icon-wrapper ${isFirst ? "icon-copper" : "icon-forest"}`}>
                    <IconComponent size={20} />
                  </div>
                  <span className={`env-status-badge ${isFirst ? "badge-primary" : "badge-upcoming"}`}>
                    {isFirst ? "Milestone 2: Navigable 3D Focus" : env.statusBadge}
                  </span>
                </div>

                {/* Main Card Content */}
                <div className="env-card-content">
                  <h3 className="env-card-title font-serif">{env.title}</h3>
                  <p className="env-card-subtitle">{env.subtitle}</p>
                  <p className="env-card-desc">{env.description}</p>
                </div>

                {/* Interactive Objects Preview */}
                <div className="env-objects-preview">
                  <span className="objects-label">Mapped Phenomena:</span>
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
                  <span className="preview-action-text">Inspect Architectural Blueprint</span>
                  <ArrowUpRight size={15} className="preview-arrow" />
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
              className="editorial-card env-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close-btn"
                onClick={() => setSelectedEnv(null)}
                aria-label="Close Preview"
              >
                <X size={18} />
              </button>

              <div className="modal-header">
                <span className="modal-tag">
                  {selectedEnv.isFirstFocus ? "Milestone 2 Primary 3D Target" : "Architectural Blueprint"}
                </span>
                <h3 id="modal-env-title" className="modal-title font-serif">
                  {selectedEnv.title}
                </h3>
                <p className="modal-desc">{selectedEnv.description}</p>
              </div>

              {/* Status Notice */}
              <div className="modal-notice">
                <Info size={18} color="var(--color-copper)" className="notice-icon" />
                <div className="notice-content">
                  <strong>Architectural Blueprint:</strong> Real-time 3D in-engine navigation for this space is scheduled for upcoming milestones. Below are the verified quantum phenomena mapped to each everyday object.
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
                  <Calendar size={16} />
                  <span>Planned Interactive Mechanics</span>
                </h4>
                <ul className="modal-planned-list">
                  {selectedEnv.plannedFeatures.map((feat, i) => (
                    <li key={i} className="planned-item">
                      <Sparkles size={13} color="var(--color-copper)" />
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
                  Close Blueprint
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        /* Transparency Notice Box */
        .roadmap-notice-box {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          background: var(--color-surface);
          border: 1px solid var(--border-stone);
          border-left: 4px solid var(--color-copper);
          border-radius: var(--radius-md);
          padding: 16px 20px;
          margin-bottom: 36px;
          box-shadow: var(--shadow-sm);
        }

        .roadmap-notice-icon {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .roadmap-notice-text {
          font-size: 0.92rem;
          color: var(--color-text-secondary);
          line-height: 1.55;
        }

        .roadmap-notice-text strong {
          color: var(--color-graphite);
        }

        /* 6 Destinations Grid */
        .environments-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .env-card {
          padding: 26px;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          background: var(--color-surface);
          border: 1px solid var(--border-stone);
          transition: all 0.25s ease;
        }

        .env-card:hover {
          transform: translateY(-3px);
          border-color: #C7C1B5;
          box-shadow: var(--shadow-float);
        }

        .env-card-featured {
          border-color: var(--color-copper-border);
          box-shadow: 0 4px 20px -2px rgba(189, 100, 60, 0.12);
        }

        .env-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .env-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .env-icon-wrapper.icon-copper {
          background: var(--color-copper-subtle);
          color: var(--color-copper);
          border: 1px solid var(--color-copper-border);
        }

        .env-icon-wrapper.icon-forest {
          background: var(--color-forest-subtle);
          color: var(--color-forest);
          border: 1px solid var(--color-forest-border);
        }

        .env-status-badge {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-weight: 600;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }

        .badge-primary {
          background: var(--color-copper-subtle);
          color: var(--color-copper);
          border: 1px solid var(--color-copper-border);
        }

        .badge-upcoming {
          background: var(--color-surface-muted);
          color: var(--color-text-muted);
          border: 1px solid var(--border-stone-light);
        }

        .env-card-content {
          flex: 1;
          margin-bottom: 18px;
        }

        .env-card-title {
          font-size: 1.35rem;
          color: var(--color-graphite);
          font-weight: 600;
          margin-bottom: 6px;
        }

        .env-card-subtitle {
          font-size: 0.84rem;
          font-family: var(--font-mono);
          color: var(--color-copper);
          margin-bottom: 10px;
          font-weight: 500;
        }

        .env-card-desc {
          font-size: 0.92rem;
          color: var(--color-text-secondary);
          line-height: 1.55;
        }

        .env-objects-preview {
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid var(--border-stone-light);
          margin-bottom: 14px;
        }

        .objects-label {
          display: block;
          font-size: 0.72rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .objects-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .object-tag {
          font-size: 0.76rem;
          padding: 3px 8px;
          background: var(--color-surface-muted);
          border-radius: 4px;
          border: 1px solid var(--border-stone-light);
          color: var(--color-graphite);
        }

        .object-tag-more {
          font-size: 0.76rem;
          padding: 3px 6px;
          color: var(--color-copper);
          font-family: var(--font-mono);
        }

        .env-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-copper);
          padding-top: 10px;
        }

        .preview-arrow {
          transition: transform 0.2s ease;
        }

        .env-card:hover .preview-arrow {
          transform: translate(2px, -2px);
        }

        /* Modal / Blueprint Drawer */
        .env-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(25, 28, 31, 0.6);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .env-modal {
          background: var(--color-surface);
          border: 1px solid var(--border-stone);
          max-width: 680px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          padding: 34px;
          position: relative;
          box-shadow: var(--shadow-float);
        }

        .modal-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--color-surface-muted);
          border: 1px solid var(--border-stone);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-close-btn:hover {
          background: var(--color-surface-stone);
          color: var(--color-graphite);
        }

        .modal-header {
          margin-bottom: 22px;
        }

        .modal-tag {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--color-copper);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 8px;
        }

        .modal-title {
          font-size: 1.85rem;
          color: var(--color-graphite);
          margin-bottom: 8px;
        }

        .modal-desc {
          font-size: 1rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
        }

        .modal-notice {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: var(--color-surface-muted);
          border-left: 3px solid var(--color-copper);
          padding: 12px 16px;
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
          font-size: 0.88rem;
          color: var(--color-text-secondary);
          margin-bottom: 24px;
        }

        .modal-notice strong {
          color: var(--color-graphite);
        }

        .modal-section {
          margin-bottom: 24px;
        }

        .modal-section-title {
          font-size: 0.86rem;
          font-family: var(--font-mono);
          color: var(--color-forest);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
        }

        .modal-objects-grid {
          display: grid;
          gap: 12px;
        }

        .modal-object-item {
          padding: 12px 16px;
          background: var(--color-surface-muted);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-stone-light);
        }

        .modal-object-name {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--color-graphite);
          font-size: 0.95rem;
          margin-bottom: 4px;
        }

        .bullet-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-copper);
        }

        .modal-object-phenomenon {
          font-size: 0.82rem;
          font-family: var(--font-mono);
          color: var(--color-forest);
          margin-bottom: 6px;
        }

        .modal-object-detail {
          font-size: 0.88rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        .modal-planned-list {
          list-style: none;
          display: grid;
          gap: 8px;
        }

        .planned-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          color: var(--color-text-secondary);
        }

        .modal-footer {
          margin-top: 28px;
          padding-top: 18px;
          border-top: 1px solid var(--border-stone-light);
          display: flex;
          justify-content: flex-end;
        }

        .modal-dismiss-btn {
          padding: 9px 20px;
          background: var(--color-graphite);
          color: #FFFFFF;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .modal-dismiss-btn:hover {
          background: #33383F;
        }

        @media (max-width: 990px) {
          .environments-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .environments-grid {
            grid-template-columns: 1fr;
          }
          .env-modal {
            padding: 22px;
          }
        }
      `}</style>
    </section>
  );
}
