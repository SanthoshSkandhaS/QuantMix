import React, { useState } from "react";
import { Sliders, FlaskConical, ArrowRight, Info, CheckCircle2, AlertCircle } from "lucide-react";

/**
 * QuantumLabPreview
 * Section introducing the future interactive scientific laboratory.
 * Features:
 * - Intended first experiment: Quantum Tunnelling through a Potential Barrier
 * - Beginner-friendly question: “What happens if a particle encounters a narrower barrier?”
 * - Illustrative interface mockup with clear "Interface Preview" labels
 * - Interactive before-and-after comparison toggle (Wide vs Narrower Barrier)
 * - Educational wave transmission diagram showing incident, decayed, and transmitted waves
 */
export default function QuantumLabPreview() {
  const [selectedCase, setSelectedCase] = useState("narrow"); // "wide" | "narrow"

  // Parameter states for illustrative controls
  const [barrierWidth, setBarrierWidth] = useState(selectedCase === "narrow" ? 0.8 : 2.4);
  const [barrierHeight, setBarrierHeight] = useState(5.0);
  const [particleEnergy, setParticleEnergy] = useState(3.2);

  const handleCaseSelect = (caseType) => {
    setSelectedCase(caseType);
    if (caseType === "narrow") {
      setBarrierWidth(0.8);
    } else {
      setBarrierWidth(2.4);
    }
  };

  const transmissionRate = selectedCase === "narrow" ? "42.1%" : "0.04%";
  const decayDescription =
    selectedCase === "narrow"
      ? "Significant wave amplitude reaches the far boundary, allowing the particle to tunnel through with 42.1% probability."
      : "The exponential wave attenuation e^(-κx) absorbs virtually the entire wavepacket; transmission collapses to 0.04%.";

  return (
    <section id="lab" className="section-wrapper lab-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <FlaskConical size={14} />
            <span>Future Quantum Laboratory</span>
          </div>
          <h2 className="section-title">The Quantum Lab</h2>
          <p className="section-desc">
            In upcoming milestones, modify physical parameters, run scientific models, compare outcomes, and discover why changing microscopic constants alters our macroscopic universe.
          </p>
        </div>

        {/* First Experiment Feature Box */}
        <div className="glass-card lab-preview-card">
          {/* Top Banner Disclaimer */}
          <div className="lab-banner">
            <div className="lab-banner-info">
              <span className="lab-banner-badge">Planned Milestone 2 Feature</span>
              <span className="lab-banner-title">
                First Experiment: Quantum Tunnelling Through a Potential Barrier
              </span>
            </div>
            <div className="lab-banner-status">
              <Info size={14} />
              <span>Illustrative Interface Preview</span>
            </div>
          </div>

          {/* Beginner Question Callout */}
          <div className="beginner-question-box">
            <span className="question-prefix">Core Research Question:</span>
            <h3 className="question-title">“What happens if a particle encounters a narrower barrier?”</h3>
            <p className="question-explanation">
              Classically, a marble without enough energy to roll over a hill will 100% reflect back. But in quantum mechanics, an electron behaves like a wave: even when its energy (E) is less than the barrier height (V₀), its probability wave penetrates into the barrier. If the barrier is thin enough, it emerges on the other side!
            </p>
          </div>

          {/* Interactive Workspace Simulator Preview */}
          <div className="lab-workspace-grid">
            {/* Left: Illustrative Parameter Controls */}
            <div className="lab-controls-panel">
              <div className="panel-header">
                <Sliders size={16} color="var(--color-teal)" />
                <h4>Model Parameters</h4>
                <span className="preview-pill">Preview Mode</span>
              </div>

              {/* Quick Case Switcher */}
              <div className="case-switcher">
                <span className="switcher-label">Compare Scenarios:</span>
                <div className="switcher-buttons">
                  <button
                    onClick={() => handleCaseSelect("wide")}
                    className={`switcher-btn ${selectedCase === "wide" ? "active" : ""}`}
                    aria-label="Select Wide Barrier Scenario"
                  >
                    <span>Wide Barrier (2.4 nm)</span>
                  </button>
                  <button
                    onClick={() => handleCaseSelect("narrow")}
                    className={`switcher-btn ${selectedCase === "narrow" ? "active" : ""}`}
                    aria-label="Select Narrower Barrier Scenario"
                  >
                    <span>Narrower Barrier (0.8 nm)</span>
                  </button>
                </div>
              </div>

              {/* Sliders (Illustrative) */}
              <div className="control-item">
                <div className="control-label-row">
                  <span>Barrier Width (w)</span>
                  <span className="control-value">{barrierWidth} nm</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="3.0"
                  step="0.2"
                  value={barrierWidth}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setBarrierWidth(val);
                    setSelectedCase(val <= 1.2 ? "narrow" : "wide");
                  }}
                  className="quantum-slider"
                  aria-label="Barrier Width Slider"
                />
                <span className="control-help">Thickness of the repulsive electrostatic potential</span>
              </div>

              <div className="control-item">
                <div className="control-label-row">
                  <span>Barrier Potential (V₀)</span>
                  <span className="control-value">{barrierHeight.toFixed(1)} eV</span>
                </div>
                <input
                  type="range"
                  min="3.5"
                  max="7.0"
                  step="0.5"
                  value={barrierHeight}
                  onChange={(e) => setBarrierHeight(parseFloat(e.target.value))}
                  className="quantum-slider"
                  aria-label="Barrier Potential Slider"
                />
                <span className="control-help">Height of the energy barrier</span>
              </div>

              <div className="control-item">
                <div className="control-label-row">
                  <span>Incident Energy (E)</span>
                  <span className="control-value">{particleEnergy.toFixed(1)} eV</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="3.4"
                  step="0.2"
                  value={particleEnergy}
                  onChange={(e) => setParticleEnergy(parseFloat(e.target.value))}
                  className="quantum-slider"
                  aria-label="Incident Particle Energy Slider"
                />
                <span className="control-help">Kinetic energy of incoming electron (E &lt; V₀)</span>
              </div>

              {/* Mathematical Relation Box */}
              <div className="lab-formula-box">
                <span className="formula-tag">Transmission Coefficient</span>
                <code className="formula-text">T ≈ e^&#40;-2κw&#41;</code>
                <span className="formula-sub">where κ = √(2m(V₀ - E)) / ℏ</span>
              </div>
            </div>

            {/* Right: Wavefunction Visualization & Outcome Comparison */}
            <div className="lab-visualization-panel">
              <div className="viz-header">
                <span className="viz-title">Simulated Wavefunction ψ(x)</span>
                <span className={`viz-status-tag ${selectedCase === "narrow" ? "tag-high" : "tag-low"}`}>
                  Transmission T = {transmissionRate}
                </span>
              </div>

              {/* Dynamic SVG Wavefunction Diagram */}
              <div className="wave-diagram-container">
                <svg
                  viewBox="0 0 500 220"
                  className="wave-diagram-svg"
                  preserveAspectRatio="xMidYMid meet"
                  aria-label="Wavefunction Tunneling Diagram"
                >
                  <defs>
                    <linearGradient id="barrierGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(255, 139, 120, 0.4)" />
                      <stop offset="100%" stopColor="rgba(255, 139, 120, 0.05)" />
                    </linearGradient>
                    <linearGradient id="waveIncidentGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#35D6D0" />
                      <stop offset="100%" stopColor="#9B8CFF" />
                    </linearGradient>
                  </defs>

                  {/* Ground & Axis */}
                  <line x1="20" y1="180" x2="480" y2="180" stroke="rgba(169, 182, 207, 0.2)" strokeWidth="1.5" />
                  <text x="25" y="200" fill="#6E7E9E" fontSize="11" fontFamily="JetBrains Mono">x = 0</text>
                  <text x="440" y="200" fill="#6E7E9E" fontSize="11" fontFamily="JetBrains Mono">Region III</text>

                  {/* Potential Barrier Block */}
                  {selectedCase === "narrow" ? (
                    // Narrow Barrier (x=210 to 270)
                    <>
                      <rect x="210" y="50" width="60" height="130" fill="url(#barrierGradient)" stroke="#FF8B78" strokeWidth="2" strokeDasharray="4 2" />
                      <text x="220" y="40" fill="#FF8B78" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">
                        V₀ (0.8 nm)
                      </text>
                    </>
                  ) : (
                    // Wide Barrier (x=170 to 330)
                    <>
                      <rect x="170" y="50" width="160" height="130" fill="url(#barrierGradient)" stroke="#FF8B78" strokeWidth="2" strokeDasharray="4 2" />
                      <text x="210" y="40" fill="#FF8B78" fontSize="11" fontFamily="JetBrains Mono" fontWeight="600">
                        V₀ (2.4 nm)
                      </text>
                    </>
                  )}

                  {/* Wave Packet Paths */}
                  {selectedCase === "narrow" ? (
                    <>
                      {/* Region I: Incident & Reflected Sinusoidal Wave (x=20 to 210) */}
                      <path
                        d="M 20 115 Q 40 70, 60 115 T 100 115 T 140 115 T 180 115 T 210 115"
                        fill="none"
                        stroke="#35D6D0"
                        strokeWidth="3"
                      />
                      {/* Region II: Exponential Decay inside narrow barrier (x=210 to 270) */}
                      <path
                        d="M 210 115 Q 235 130, 270 140"
                        fill="none"
                        stroke="#FF8B78"
                        strokeWidth="2.5"
                      />
                      {/* Region III: Transmitted Wave with notable amplitude (x=270 to 480) */}
                      <path
                        d="M 270 140 Q 295 110, 320 140 T 370 140 T 420 140 T 470 140"
                        fill="none"
                        stroke="#9B8CFF"
                        strokeWidth="2.5"
                      />
                    </>
                  ) : (
                    <>
                      {/* Region I: Incident wave */}
                      <path
                        d="M 20 115 Q 40 70, 60 115 T 100 115 T 140 115 T 170 115"
                        fill="none"
                        stroke="#35D6D0"
                        strokeWidth="3"
                      />
                      {/* Region II: Deep exponential decay inside wide barrier (x=170 to 330) */}
                      <path
                        d="M 170 115 Q 210 145, 260 172 T 330 178"
                        fill="none"
                        stroke="#FF8B78"
                        strokeWidth="2.5"
                      />
                      {/* Region III: Transmitted Wave almost flat/zero */}
                      <path
                        d="M 330 178 Q 355 174, 380 178 T 430 178 T 470 178"
                        fill="none"
                        stroke="#9B8CFF"
                        strokeWidth="1.2"
                        strokeDasharray="3 3"
                        opacity="0.6"
                      />
                    </>
                  )}

                  {/* Labels on Diagram */}
                  <text x="50" y="80" fill="#35D6D0" fontSize="11" fontFamily="JetBrains Mono">
                    Incident Wave ψ_inc
                  </text>
                  <text x="360" y={selectedCase === "narrow" ? 100 : 160} fill="#9B8CFF" fontSize="11" fontFamily="JetBrains Mono">
                    Transmitted Wave ψ_trans
                  </text>
                </svg>
              </div>

              {/* Before vs After Outcome Analysis */}
              <div className="outcome-comparison-card">
                <div className="outcome-header">
                  {selectedCase === "narrow" ? (
                    <CheckCircle2 size={18} color="var(--color-teal)" />
                  ) : (
                    <AlertCircle size={18} color="var(--color-coral)" />
                  )}
                  <h5>Observation & Physical Insight</h5>
                </div>
                <p className="outcome-text">{decayDescription}</p>
                <div className="outcome-meta">
                  <span>Tunneling Status: <strong>{selectedCase === "narrow" ? "High Transmission" : "Heavy Attenuation"}</strong></span>
                  <span>Probability: <strong>{transmissionRate}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .lab-preview-card {
          padding: 32px;
          background: rgba(17, 27, 46, 0.85);
          border: 1px solid rgba(155, 140, 255, 0.25);
        }

        .lab-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-subtle);
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .lab-banner-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .lab-banner-badge {
          font-size: 0.76rem;
          font-family: var(--font-mono);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          background: rgba(155, 140, 255, 0.15);
          color: var(--color-violet);
          border: 1px solid rgba(155, 140, 255, 0.3);
          font-weight: 600;
          text-transform: uppercase;
        }

        .lab-banner-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-text-main);
        }

        .lab-banner-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
        }

        .beginner-question-box {
          background: rgba(11, 16, 32, 0.7);
          border-left: 3px solid var(--color-teal);
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
          padding: 20px 24px;
          margin-bottom: 32px;
        }

        .question-prefix {
          font-size: 0.78rem;
          font-family: var(--font-mono);
          color: var(--color-teal);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 6px;
        }

        .question-title {
          font-size: 1.35rem;
          color: var(--color-text-main);
          font-weight: 700;
          margin-bottom: 10px;
        }

        .question-explanation {
          font-size: 0.98rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
        }

        .lab-workspace-grid {
          display: grid;
          grid-template-columns: 1fr 1.35fr;
          gap: 28px;
        }

        .lab-controls-panel {
          background: rgba(11, 16, 32, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 4px;
        }

        .panel-header h4 {
          font-size: 1rem;
          color: var(--color-text-main);
          flex: 1;
        }

        .preview-pill {
          font-size: 0.72rem;
          font-family: var(--font-mono);
          padding: 2px 8px;
          background: rgba(169, 182, 207, 0.1);
          color: var(--color-text-muted);
          border-radius: 4px;
        }

        .case-switcher {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .switcher-label {
          font-size: 0.78rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
          text-transform: uppercase;
        }

        .switcher-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .switcher-btn {
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-family: var(--font-mono);
          background: rgba(17, 27, 46, 0.8);
          border: 1px solid var(--border-subtle);
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .switcher-btn.active {
          background: rgba(53, 214, 208, 0.15);
          border-color: var(--color-teal);
          color: var(--color-teal);
          font-weight: 600;
        }

        .control-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .control-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--color-text-main);
        }

        .control-value {
          font-family: var(--font-mono);
          color: var(--color-teal);
          font-weight: 600;
        }

        .quantum-slider {
          width: 100%;
          accent-color: var(--color-teal);
          cursor: pointer;
        }

        .control-help {
          font-size: 0.74rem;
          color: var(--color-text-muted);
        }

        .lab-formula-box {
          background: rgba(17, 27, 46, 0.7);
          border: 1px dashed rgba(53, 214, 208, 0.3);
          border-radius: var(--radius-sm);
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 6px;
        }

        .formula-tag {
          font-size: 0.72rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
          text-transform: uppercase;
        }

        .formula-text {
          font-family: var(--font-mono);
          font-size: 0.95rem;
          color: var(--color-teal);
          font-weight: 600;
        }

        .formula-sub {
          font-family: var(--font-mono);
          font-size: 0.74rem;
          color: var(--color-text-secondary);
        }

        .lab-visualization-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .viz-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .viz-title {
          font-family: var(--font-mono);
          font-size: 0.88rem;
          color: var(--color-text-secondary);
        }

        .viz-status-tag {
          font-family: var(--font-mono);
          font-size: 0.82rem;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-weight: 600;
        }

        .tag-high {
          background: rgba(53, 214, 208, 0.15);
          color: var(--color-teal);
          border: 1px solid rgba(53, 214, 208, 0.4);
        }

        .tag-low {
          background: rgba(255, 139, 120, 0.15);
          color: var(--color-coral);
          border: 1px solid rgba(255, 139, 120, 0.4);
        }

        .wave-diagram-container {
          background: #0B1020;
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          overflow: hidden;
          padding: 12px;
        }

        .wave-diagram-svg {
          width: 100%;
          height: auto;
          display: block;
        }

        .outcome-comparison-card {
          background: rgba(11, 16, 32, 0.6);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 18px;
        }

        .outcome-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .outcome-header h5 {
          font-size: 0.95rem;
          color: var(--color-text-main);
        }

        .outcome-text {
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          line-height: 1.55;
          margin-bottom: 12px;
        }

        .outcome-meta {
          display: flex;
          gap: 20px;
          font-size: 0.8rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
          border-top: 1px solid var(--border-subtle);
          padding-top: 10px;
          flex-wrap: wrap;
        }

        .outcome-meta strong {
          color: var(--color-text-main);
        }

        @media (max-width: 900px) {
          .lab-workspace-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
