import React from "react";
import {
  Sliders,
  X,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Scale,
  Layers,
  ArrowRight,
  Split,
  Atom,
  BookOpen
} from "lucide-react";
import { PARTICLE_TYPES } from "../utils/quantumPhysics";

/**
 * TweakPanel
 * First-class physical simulation parameter controller.
 *
 * Supported features:
 * - Particle selection (Electron, Muon, Proton, Alpha) with true mass scaling
 * - Energy E, Barrier Height V0, Barrier Width L sliders with numeric sync
 * - Physical benchmark presets with instantaneous recalculation
 * - Classical-vs-Quantum side-by-side live comparison toggle
 * - Configuration Snapshotting & Comparison (Config A vs Config B)
 * - Safe numeric bounds and error handling
 */
export default function TweakPanel({
  isOpen,
  onClose,
  physicsData,
  energyEv,
  setEnergyEv,
  barrierHeightEv,
  setBarrierHeightEv,
  barrierWidthNm,
  setBarrierWidthNm,
  particleKey,
  setParticleKey,
  simMode,
  setSimMode,
  showClassicalComparison,
  setShowClassicalComparison,
  onResetDefaults,
  configA,
  configB,
  onSaveConfigA,
  onSaveConfigB,
  onClearComparison,
  onApplyPreset,
  onSaveToNotebook,
  onOpenNotebook
}) {
  if (!isOpen) return null;

  const currentParticle = PARTICLE_TYPES[particleKey] || PARTICLE_TYPES.electron;
  const isTunneling = energyEv < barrierHeightEv;

  return (
    <div className="tweak-panel-drawer" role="dialog" aria-modal="true" aria-label="Simulation Tweak Panel">
      {/* Header */}
      <div className="tweak-header">
        <div className="tweak-title-row">
          <div className="tweak-icon-badge">
            <Sliders size={18} color="var(--color-teal, #35d6d0)" />
          </div>
          <div>
            <h3 className="tweak-title font-serif">Simulation Tweak Panel</h3>
            <span className="tweak-subtitle">Real-Time Schrödinger Solver Controls [T]</span>
          </div>
        </div>
        <div className="tweak-header-actions">
          {onSaveToNotebook && (
            <button
              onClick={onSaveToNotebook}
              className="tweak-icon-btn"
              style={{ color: "var(--color-copper)" }}
              title="Save current parameters to Experiment Notebook"
              aria-label="Save to Notebook"
            >
              <BookOpen size={15} />
            </button>
          )}
          {onOpenNotebook && (
            <button
              onClick={() => {
                onClose();
                onOpenNotebook();
              }}
              className="tweak-icon-btn"
              title="Open Experiment Notebook [N]"
              aria-label="Open Experiment Notebook"
            >
              <BookOpen size={15} />
            </button>
          )}
          <button
            onClick={onResetDefaults}
            className="tweak-icon-btn"
            title="Reset to Calibrated STM Defaults [R]"
            aria-label="Reset to default values"
          >
            <RotateCcw size={15} />
          </button>
          <button
            onClick={onClose}
            className="tweak-icon-btn tweak-close-btn"
            title="Close Tweak Panel [Esc or T]"
            aria-label="Close tweak panel"
          >
            <X size={17} />
          </button>
        </div>
      </div>

      <div className="tweak-body">
        {/* Live Status Pill */}
        <div className="tweak-status-card">
          <div className="status-top">
            <span className={`regime-pill ${isTunneling ? "pill-tunneling" : "pill-overbarrier"}`}>
              {isTunneling ? "Quantum Tunnelling (E < V₀)" : "Over-Barrier Transmission (E > V₀)"}
            </span>
            <div className="conservation-tag">
              <ShieldCheck size={14} color="var(--color-teal, #35d6d0)" />
              <span>R + T = 1.000000</span>
            </div>
          </div>
          <div className="status-metrics-row">
            <div className="metric-box">
              <span className="metric-label">Transmission (T)</span>
              <strong className="metric-val teal-text">{physicsData?.formattedTransmission || "0.00%"}</strong>
            </div>
            <div className="metric-box">
              <span className="metric-label">Reflection (R)</span>
              <strong className="metric-val copper-text">{physicsData?.formattedReflection || "100.0%"}</strong>
            </div>
            <div className="metric-box">
              <span className="metric-label">Decay (κ)</span>
              <strong className="metric-val">{physicsData?.kappaNm || "0.00"} nm⁻¹</strong>
            </div>
          </div>
        </div>

        {/* Physical Benchmark Presets */}
        <div className="tweak-section">
          <label className="section-label">
            <Sparkles size={14} color="var(--color-copper, #c67248)" />
            <span>Physical Benchmark Presets</span>
          </label>
          <div className="preset-grid">
            <button
              onClick={() => onApplyPreset?.("stm")}
              className="preset-btn"
              title="Scanning Tunneling Microscope vacuum gap (e⁻, 4.0 eV, 4.8 eV, 0.35 nm)"
            >
              <strong>STM Vacuum Gap</strong>
              <small>Electron • 0.35 nm</small>
            </button>
            <button
              onClick={() => onApplyPreset?.("resonant")}
              className="preset-btn"
              title="Quantum Transmission Resonance (e⁻, 6.25 eV, 4.0 eV, 0.62 nm)"
            >
              <strong>Resonance Peak</strong>
              <small>k₂L = nπ (T = 1.0)</small>
            </button>
            <button
              onClick={() => onApplyPreset?.("proton")}
              className="preset-btn"
              title="Proton Mass Suppression (p⁺, 1.0 eV, 4.0 eV, 0.5 nm)"
            >
              <strong>Proton Tunneling</strong>
              <small>1836× m_e Mass</small>
            </button>
            <button
              onClick={() => onApplyPreset?.("macro")}
              className="preset-btn"
              title="Macroscopic Barrier (e⁻, 1.0 eV, 5.0 eV, 2.0 nm)"
            >
              <strong>Macroscopic Limit</strong>
              <small>T ≈ 0.00%</small>
            </button>
          </div>
        </div>

        {/* 1. Particle Type Selection */}
        <div className="tweak-section">
          <label className="section-label">
            <Atom size={14} color="var(--color-teal, #35d6d0)" />
            <span>Particle Mass &amp; Species</span>
          </label>
          <div className="particle-selector-grid">
            {Object.values(PARTICLE_TYPES).map((p) => {
              const active = particleKey === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setParticleKey(p.id)}
                  className={`particle-pill ${active ? "active" : ""}`}
                  aria-pressed={active}
                >
                  <span className="particle-symbol">{p.symbol}</span>
                  <span className="particle-name">{p.name}</span>
                  <span className="particle-mass">{p.massRelative}</span>
                </button>
              );
            })}
          </div>
          <p className="param-hint">{currentParticle.description}</p>
        </div>

        {/* 2. Particle Energy E Slider */}
        <div className="tweak-section">
          <div className="param-header-row">
            <span className="param-name">Particle Energy (E)</span>
            <div className="param-input-wrap">
              <input
                type="number"
                min="0.05"
                max="15.0"
                step="0.05"
                value={energyEv}
                onChange={(e) => setEnergyEv(Math.max(0.05, Math.min(15.0, parseFloat(e.target.value) || 0.05)))}
                className="param-num-input"
                aria-label="Particle Energy in electron-volts"
              />
              <span className="unit-tag">eV</span>
            </div>
          </div>
          <input
            type="range"
            min="0.1"
            max="12.0"
            step="0.05"
            value={energyEv}
            onChange={(e) => setEnergyEv(parseFloat(e.target.value))}
            className="tweak-slider"
            aria-label="Adjust particle energy"
          />
          <div className="slider-limits">
            <span>0.10 eV</span>
            <span className="center-val">λ = {physicsData?.deBroglieWavelengthNm ? `${physicsData.deBroglieWavelengthNm.toFixed(3)} nm` : "—"}</span>
            <span>12.00 eV</span>
          </div>
        </div>

        {/* 3. Barrier Height V0 Slider */}
        <div className="tweak-section">
          <div className="param-header-row">
            <span className="param-name">Barrier Height (V₀)</span>
            <div className="param-input-wrap">
              <input
                type="number"
                min="0.1"
                max="15.0"
                step="0.1"
                value={barrierHeightEv}
                onChange={(e) => setBarrierHeightEv(Math.max(0.1, Math.min(15.0, parseFloat(e.target.value) || 0.1)))}
                className="param-num-input"
                aria-label="Barrier Height in electron-volts"
              />
              <span className="unit-tag">eV</span>
            </div>
          </div>
          <input
            type="range"
            min="0.5"
            max="10.0"
            step="0.1"
            value={barrierHeightEv}
            onChange={(e) => setBarrierHeightEv(parseFloat(e.target.value))}
            className="tweak-slider"
            aria-label="Adjust barrier height"
          />
          <div className="slider-limits">
            <span>0.50 eV</span>
            <span className="center-val">ΔV = {Math.abs(barrierHeightEv - energyEv).toFixed(2)} eV</span>
            <span>10.00 eV</span>
          </div>
        </div>

        {/* 4. Barrier Width L Slider */}
        <div className="tweak-section">
          <div className="param-header-row">
            <span className="param-name">Barrier Width (L)</span>
            <div className="param-input-wrap">
              <input
                type="number"
                min="0.05"
                max="2.5"
                step="0.02"
                value={barrierWidthNm}
                onChange={(e) => setBarrierWidthNm(Math.max(0.05, Math.min(2.5, parseFloat(e.target.value) || 0.05)))}
                className="param-num-input"
                aria-label="Barrier Width in nanometers"
              />
              <span className="unit-tag">nm</span>
            </div>
          </div>
          <input
            type="range"
            min="0.05"
            max="1.5"
            step="0.02"
            value={barrierWidthNm}
            onChange={(e) => setBarrierWidthNm(parseFloat(e.target.value))}
            className="tweak-slider"
            aria-label="Adjust barrier width"
          />
          <div className="slider-limits">
            <span>0.05 nm (0.5 Å)</span>
            <span className="center-val">κ·L = {(parseFloat(physicsData?.kappaNm || 0) * barrierWidthNm).toFixed(2)}</span>
            <span>1.50 nm (15 Å)</span>
          </div>
        </div>

        {/* Visualization Settings */}
        <div className="tweak-section">
          <label className="section-label">
            <Layers size={14} color="var(--color-teal, #35d6d0)" />
            <span>3D Viewport Display Mode</span>
          </label>
          <div className="sim-mode-toggle">
            <button
              onClick={() => setSimMode?.("helix")}
              className={`mode-btn ${simMode === "helix" ? "active" : ""}`}
            >
              <span>3D Complex Helix</span>
            </button>
            <button
              onClick={() => setSimMode?.("wavepacket")}
              className={`mode-btn ${simMode === "wavepacket" ? "active" : ""}`}
            >
              <span>Dynamic Wavepacket</span>
            </button>
          </div>
        </div>

        {/* Classical vs Quantum Comparison Mode Toggle */}
        <div className="tweak-section comparison-toggle-box">
          <div className="toggle-info">
            <div className="toggle-title-row">
              <Scale size={16} color="var(--color-copper, #c67248)" />
              <strong className="toggle-title">Classical vs. Quantum Mode</strong>
            </div>
            <p className="toggle-desc">
              Compare quantum wave probabilities with deterministic Newtonian trajectories side by side.
            </p>
          </div>
          <button
            onClick={() => setShowClassicalComparison?.(!showClassicalComparison)}
            className={`comparison-switch ${showClassicalComparison ? "on" : "off"}`}
            role="switch"
            aria-checked={showClassicalComparison}
          >
            <span>{showClassicalComparison ? "Active" : "Hidden"}</span>
          </button>
        </div>

        {/* Live Classical vs Quantum Comparison Details */}
        {showClassicalComparison && (
          <div className="classical-comparison-card">
            <div className="comp-col quantum-col">
              <span className="comp-badge quantum-badge">Quantum Model</span>
              <div className="comp-val">{physicsData?.formattedTransmission || "0.0%"}</div>
              <p className="comp-text">
                {physicsData?.quantumClassicalDelta?.scientificKeyTakeaway ||
                  "Evanescent decay permits non-zero tunneling."}
              </p>
            </div>
            <div className="comp-divider">
              <ArrowRight size={14} />
            </div>
            <div className="comp-col classical-col">
              <span className="comp-badge classical-badge">Classical Model</span>
              <div className="comp-val">{physicsData?.classical?.transmissionPct || "0.0%"}</div>
              <p className="comp-text">
                {physicsData?.classical?.explanation ||
                  "Rigid reflection at potential threshold."}
              </p>
            </div>
          </div>
        )}

        {/* Snapshot & Compare: Config A vs Config B */}
        <div className="tweak-section snapshot-section">
          <label className="section-label">
            <Split size={14} color="var(--color-teal, #35d6d0)" />
            <span>Save &amp; Compare Configurations</span>
          </label>
          <div className="snapshot-buttons">
            <button onClick={onSaveConfigA} className={`snap-btn ${configA ? "saved" : ""}`}>
              <span>{configA ? "Update Config A ✓" : "Snapshot as Config A"}</span>
            </button>
            <button onClick={onSaveConfigB} className={`snap-btn ${configB ? "saved" : ""}`}>
              <span>{configB ? "Update Config B ✓" : "Snapshot as Config B"}</span>
            </button>
          </div>

          {(configA || configB) && (
            <div className="comparison-preview-strip">
              <div className="strip-item">
                <span className="strip-label">Config A:</span>
                <strong>
                  {configA
                    ? `${configA.energyEv}eV, ${configA.barrierWidthNm}nm → ${configA.transmissionPct}`
                    : "Not saved"}
                </strong>
              </div>
              <div className="strip-item">
                <span className="strip-label">Config B:</span>
                <strong>
                  {configB
                    ? `${configB.energyEv}eV, ${configB.barrierWidthNm}nm → ${configB.transmissionPct}`
                    : "Not saved"}
                </strong>
              </div>
              <button onClick={onClearComparison} className="strip-clear-btn">
                Clear Snapshots
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .tweak-panel-drawer {
          position: fixed;
          top: 70px;
          right: 20px;
          width: 380px;
          max-width: calc(100vw - 30px);
          max-height: calc(100vh - 90px);
          background: rgba(11, 16, 32, 0.96);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(53, 214, 208, 0.25);
          border-radius: 12px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
          z-index: 1000;
          color: #f4f7ff;
          animation: slideInRight 0.22s ease-out;
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .tweak-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(17, 27, 46, 0.6);
          border-radius: 12px 12px 0 0;
        }

        .tweak-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .tweak-icon-badge {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(53, 214, 208, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tweak-title {
          font-size: 1rem;
          margin: 0;
          color: #ffffff;
          font-weight: 600;
        }

        .tweak-subtitle {
          font-size: 0.72rem;
          color: #a9b6cf;
          font-family: monospace;
          display: block;
        }

        .tweak-header-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .tweak-icon-btn {
          width: 30px;
          height: 30px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #a9b6cf;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .tweak-icon-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
        }

        .tweak-close-btn:hover {
          background: rgba(198, 114, 72, 0.25);
          color: #c67248;
          border-color: rgba(198, 114, 72, 0.4);
        }

        .tweak-body {
          padding: 16px 18px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .tweak-status-card {
          background: rgba(17, 27, 46, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 12px;
        }

        .status-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .regime-pill {
          font-size: 0.72rem;
          font-family: monospace;
          padding: 3px 8px;
          border-radius: 4px;
          font-weight: 600;
        }

        .pill-tunneling {
          background: rgba(53, 214, 208, 0.15);
          color: #35d6d0;
          border: 1px solid rgba(53, 214, 208, 0.3);
        }

        .pill-overbarrier {
          background: rgba(198, 114, 72, 0.15);
          color: #c67248;
          border: 1px solid rgba(198, 114, 72, 0.3);
        }

        .conservation-tag {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          font-family: monospace;
          color: #a9b6cf;
        }

        .status-metrics-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
        }

        .metric-box {
          background: rgba(0, 0, 0, 0.25);
          padding: 8px;
          border-radius: 6px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .metric-label {
          font-size: 0.68rem;
          color: #8c9bb3;
          margin-bottom: 2px;
        }

        .metric-val {
          font-size: 0.88rem;
          font-family: monospace;
        }

        .teal-text {
          color: #35d6d0;
        }

        .copper-text {
          color: #c67248;
        }

        .tweak-section {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .section-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #e2e8f5;
        }

        .preset-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .preset-btn {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 8px 10px;
          text-align: left;
          color: #e2e8f5;
          cursor: pointer;
          transition: all 0.15s ease;
          display: flex;
          flex-direction: column;
        }

        .preset-btn:hover {
          background: rgba(53, 214, 208, 0.1);
          border-color: rgba(53, 214, 208, 0.35);
        }

        .preset-btn strong {
          font-size: 0.78rem;
        }

        .preset-btn small {
          font-size: 0.68rem;
          color: #8c9bb3;
          font-family: monospace;
        }

        .particle-selector-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .particle-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 6px 10px;
          border-radius: 6px;
          color: #e2e8f5;
          cursor: pointer;
          font-size: 0.78rem;
          transition: all 0.15s ease;
        }

        .particle-pill:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .particle-pill.active {
          background: rgba(53, 214, 208, 0.16);
          border-color: #35d6d0;
          color: #ffffff;
        }

        .particle-symbol {
          font-weight: 700;
          color: #35d6d0;
        }

        .particle-mass {
          margin-left: auto;
          font-size: 0.65rem;
          color: #8c9bb3;
          font-family: monospace;
        }

        .param-hint {
          font-size: 0.7rem;
          color: #8c9bb3;
          margin: 0;
          line-height: 1.35;
        }

        .param-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .param-name {
          font-size: 0.8rem;
          color: #e2e8f5;
          font-weight: 500;
        }

        .param-input-wrap {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .param-num-input {
          width: 60px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 4px;
          color: #35d6d0;
          font-family: monospace;
          font-size: 0.82rem;
          padding: 3px 6px;
          text-align: right;
        }

        .unit-tag {
          font-size: 0.75rem;
          color: #8c9bb3;
          font-family: monospace;
        }

        .tweak-slider {
          width: 100%;
          accent-color: #35d6d0;
          cursor: pointer;
        }

        .slider-limits {
          display: flex;
          justify-content: space-between;
          font-size: 0.68rem;
          color: #6b7c96;
          font-family: monospace;
        }

        .slider-limits .center-val {
          color: #8c9bb3;
        }

        .sim-mode-toggle {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .mode-btn {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 7px;
          color: #a9b6cf;
          font-size: 0.76rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .mode-btn.active {
          background: rgba(53, 214, 208, 0.18);
          border-color: #35d6d0;
          color: #ffffff;
          font-weight: 600;
        }

        .comparison-toggle-box {
          background: rgba(17, 27, 46, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .toggle-title-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .toggle-title {
          font-size: 0.82rem;
          color: #ffffff;
        }

        .toggle-desc {
          font-size: 0.7rem;
          color: #8c9bb3;
          margin: 3px 0 0 0;
          max-width: 250px;
        }

        .comparison-switch {
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.72rem;
          font-weight: 600;
          cursor: pointer;
          border: 1px solid transparent;
        }

        .comparison-switch.on {
          background: rgba(53, 214, 208, 0.2);
          color: #35d6d0;
          border-color: #35d6d0;
        }

        .comparison-switch.off {
          background: rgba(255, 255, 255, 0.06);
          color: #8c9bb3;
          border-color: rgba(255, 255, 255, 0.1);
        }

        .classical-comparison-card {
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .comp-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .comp-badge {
          font-size: 0.65rem;
          padding: 2px 6px;
          border-radius: 3px;
          font-weight: 600;
          width: fit-content;
        }

        .quantum-badge {
          background: rgba(53, 214, 208, 0.18);
          color: #35d6d0;
        }

        .classical-badge {
          background: rgba(198, 114, 72, 0.18);
          color: #c67248;
        }

        .comp-val {
          font-size: 1.05rem;
          font-family: monospace;
          font-weight: 700;
        }

        .quantum-col .comp-val {
          color: #35d6d0;
        }

        .classical-col .comp-val {
          color: #c67248;
        }

        .comp-text {
          font-size: 0.68rem;
          color: #8c9bb3;
          margin: 0;
          line-height: 1.3;
        }

        .comp-divider {
          color: #6b7c96;
        }

        .snapshot-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .snap-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 8px;
          font-size: 0.74rem;
          color: #e2e8f5;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .snap-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .snap-btn.saved {
          background: rgba(53, 214, 208, 0.15);
          border-color: #35d6d0;
          color: #35d6d0;
          font-weight: 600;
        }

        .comparison-preview-strip {
          background: rgba(17, 27, 46, 0.85);
          border: 1px solid rgba(53, 214, 208, 0.2);
          border-radius: 6px;
          padding: 8px 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 6px;
        }

        .strip-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          font-family: monospace;
        }

        .strip-label {
          color: #8c9bb3;
        }

        .strip-clear-btn {
          background: transparent;
          border: none;
          color: #c67248;
          font-size: 0.68rem;
          cursor: pointer;
          text-align: right;
          padding: 2px 0 0 0;
        }
      `}</style>
    </div>
  );
}
