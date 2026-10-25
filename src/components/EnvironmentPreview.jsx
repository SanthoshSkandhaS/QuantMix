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

// Window theme backgrounds per environment to create diverse visual depth
const windowAtmosphere = {
  "your-room": "radial-gradient(ellipse at 80% 20%, rgba(198, 114, 72, 0.16) 0%, rgba(18, 21, 29, 0.96) 70%)",
  "the-sky": "radial-gradient(ellipse at 50% 10%, rgba(32, 196, 180, 0.18) 0%, rgba(18, 21, 29, 0.96) 70%)",
  "the-street": "radial-gradient(ellipse at 20% 80%, rgba(198, 114, 72, 0.14) 0%, rgba(18, 21, 29, 0.96) 70%)",
  "football-field": "radial-gradient(ellipse at 50% 20%, rgba(32, 196, 180, 0.14) 0%, rgba(18, 21, 29, 0.96) 70%)",
  "inside-bus": "radial-gradient(ellipse at 70% 50%, rgba(198, 114, 72, 0.12) 0%, rgba(18, 21, 29, 0.96) 70%)",
  "human-body": "radial-gradient(ellipse at 30% 30%, rgba(220, 80, 70, 0.14) 0%, rgba(18, 21, 29, 0.96) 70%)"
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
 * - Architectural windows into different worlds, each with distinctive depth.
 * - Honest roadmap notice clarifying Milestone 2 Three.js 3D implementation.
 */
export default function EnvironmentPreview({ onOpenBedroom, onOpenStreet }) {
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
            Windows into six physical spaces. Explore our verified 3D Bedroom and 3D Street environments with realistic lighting, classical rigid-body collisions, and microscopic quantum experiments.
          </p>
        </div>

        {/* 3D Roadmap Transparency Notice */}
        <div className="roadmap-notice-box">
          <div className="roadmap-notice-icon">
            <Info size={18} color="var(--color-copper)" />
          </div>
          <div className="roadmap-notice-text">
            <strong>Active 3D Simulations:</strong> Both the <strong>3D Bedroom</strong> and <strong>3D Street</strong> environments are live and navigable in full WebGL with physical collisions, raycast inspection, and real-time quantum tunneling solvers.
          </div>
        </div>

        {/* 6 Destinations Grid (Architectural Windows) */}
        <div className="environments-grid">
          {ENVIRONMENTS.map((env) => {
            const IconComponent = iconMap[env.icon] || Home;
            const isFirst = env.isFirstFocus;
            const isStreet = env.id === "the-street";
            const windowBg = windowAtmosphere[env.id] || "rgba(18, 21, 29, 0.95)";

            return (
              <div
                key={env.id}
                className={`editorial-card env-card ${isFirst || isStreet ? "env-card-featured" : ""}`}
                style={{ background: windowBg }}
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
                  <div className={`env-icon-wrapper ${isFirst || isStreet ? "icon-copper" : "icon-teal"}`}>
                    <IconComponent size={20} />
                  </div>
                  <span className={`env-status-badge ${isFirst || isStreet ? "badge-primary" : "badge-upcoming"}`}>
                    {isFirst ? "Live 3D Bedroom" : isStreet ? "Live 3D Street" : env.statusBadge}
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
                  {isFirst ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: "8px" }}>
                      <button
                        type="button"
                        className="card-enter-3d-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenBedroom) onOpenBedroom();
                        }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          background: "var(--color-copper)",
                          color: "#FFFFFF",
                          border: "none",
                          borderRadius: "4px",
                          padding: "6px 12px",
                          fontSize: "0.78rem",
                          fontWeight: "600",
                          cursor: "pointer"
                        }}
                        aria-label="Enter Walkable 3D Bedroom Simulation"
                      >
                        <Sparkles size={13} />
                        <span>Enter 3D Room</span>
                      </button>
                      <span className="preview-action-text" style={{ fontSize: "0.76rem" }}>
                        Blueprint Details
                      </span>
                    </div>
                  ) : isStreet ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: "8px" }}>
                      <button
                        type="button"
                        className="card-enter-3d-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenStreet) onOpenStreet();
                        }}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          background: "var(--color-teal)",
                          color: "#0D1017",
                          border: "none",
                          borderRadius: "4px",
                          padding: "6px 12px",
                          fontSize: "0.78rem",
                          fontWeight: "600",
                          cursor: "pointer"
                        }}
                        aria-label="Enter Walkable 3D Street Simulation"
                      >
                        <Navigation size={13} />
                        <span>Enter 3D Street</span>
                      </button>
                      <span className="preview-action-text" style={{ fontSize: "0.76rem" }}>
                        Blueprint Details
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className="preview-action-text">Inspect Architectural Blueprint</span>
                      <ArrowUpRight size={15} className="preview-arrow" />
                    </>
                  )}
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

              <div className="modal-footer" style={{ display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                {selectedEnv.id === "your-room" && (
                  <button
                    type="button"
                    className="modal-enter-3d-btn"
                    onClick={() => {
                      setSelectedEnv(null);
                      if (onOpenBedroom) onOpenBedroom();
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "var(--color-copper)",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "6px",
                      padding: "10px 18px",
                      fontSize: "0.88rem",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    <Sparkles size={16} />
                    <span>Launch Walkable 3D Bedroom</span>
                  </button>
                )}
                {selectedEnv.id === "the-street" && (
                  <button
                    type="button"
                    className="modal-enter-3d-btn"
                    onClick={() => {
                      setSelectedEnv(null);
                      if (onOpenStreet) onOpenStreet();
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "var(--color-teal)",
                      color: "#0D1017",
                      border: "none",
                      borderRadius: "6px",
                      padding: "10px 18px",
                      fontSize: "0.88rem",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    <Navigation size={16} />
                    <span>Launch Walkable 3D Street</span>
                  </button>
                )}
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
          background: rgba(18, 21, 29, 0.9);
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
          color: var(--color-text-main);
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
          border: 1px solid var(--border-subtle);
          box-shadow: var(--shadow-card);
          transition: all 0.25s ease;
        }

        .env-card:hover {
          transform: translateY(-3px);
          border-color: var(--border-stone-hover);
          box-shadow: var(--shadow-float);
        }

        .env-card-featured {
          border-color: var(--color-copper-border);
          box-shadow: 0 4px 20px -2px rgba(198, 114, 72, 0.15);
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
          background: var(--color-copper-dim);
          color: var(--color-copper);
          border: 1px solid var(--color-copper-border);
        }

        .env-icon-wrapper.icon-teal {
          background: var(--color-teal-dim);
          color: var(--color-teal);
          border: 1px solid var(--color-teal-border);
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
          background: var(--color-copper-dim);
          color: var(--color-copper);
          border: 1px solid var(--color-copper-border);
        }

        .badge-upcoming {
          background: rgba(24, 28, 38, 0.85);
          color: var(--color-text-muted);
          border: 1px solid var(--border-subtle);
        }

        .env-card-content {
          flex: 1;
          margin-bottom: 18px;
        }

        .env-card-title {
          font-size: 1.35rem;
          color: var(--color-text-main);
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
          border-top: 1px solid var(--border-subtle);
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
          background: rgba(24, 28, 38, 0.9);
          border-radius: 4px;
          border: 1px solid var(--border-subtle);
          color: var(--color-text-main);
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
          color: var(--color-teal);
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
          background: rgba(7, 9, 13, 0.82);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .env-modal {
          background: #141720;
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
          background: rgba(24, 28, 38, 0.9);
          border: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-close-btn:hover {
          background: rgba(35, 42, 56, 0.9);
          color: var(--color-text-main);
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
          color: var(--color-text-main);
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
          background: rgba(24, 28, 38, 0.9);
          border-left: 3px solid var(--color-copper);
          padding: 12px 16px;
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
          font-size: 0.88rem;
          color: var(--color-text-secondary);
          margin-bottom: 24px;
        }

        .modal-notice strong {
          color: var(--color-text-main);
        }

        .modal-section {
          margin-bottom: 24px;
        }

        .modal-section-title {
          font-size: 0.86rem;
          font-family: var(--font-mono);
          color: var(--color-teal);
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
          background: rgba(24, 28, 38, 0.9);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
        }

        .modal-object-name {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--color-text-main);
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
          color: var(--color-teal);
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
          border-top: 1px solid var(--border-subtle);
          display: flex;
          justify-content: flex-end;
        }

        .modal-dismiss-btn {
          padding: 9px 22px;
          background: rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-stone);
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .modal-dismiss-btn:hover {
          background: rgba(255, 255, 255, 0.18);
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
