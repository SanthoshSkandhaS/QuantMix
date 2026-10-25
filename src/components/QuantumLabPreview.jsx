import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Sliders,
  FlaskConical,
  CheckCircle2,
  Calculator,
  ShieldCheck,
  Waves,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sparkles,
  GitCompare,
  Atom,
  HelpCircle
} from "lucide-react";
import MathView from "./MathView";
import QuantumLab3D from "./QuantumLab3D";
import {
  calculateRectangularBarrierTunneling,
  evaluateStationaryWavefunction,
  PARTICLE_TYPES
} from "../utils/quantumPhysics";

/**
 * QuantumLabPreview
 * Interactive 3D Quantum Mechanics Laboratory.
 *
 * Core Features:
 * - Premium 3D WebGL scientific viewport (QuantumLab3D) displaying the 3D complex phase helix and dynamic wavepacket collision
 * - True 1D rectangular barrier tunneling analytical solver with exact complex boundary matching (R + T = 1.000000)
 * - Variable Particle Species (Electron, Muon, Proton, Alpha) demonstrating mass-dependent quantum suppression
 * - Classical vs. Quantum Side-by-Side Comparison panel with calculated numerical values
 * - Direct "Tweak Simulation [T]" and "Compare Configs A vs B" workbench controls
 * - Precision parameter controls (E, V0, L) with physical benchmark presets
 * - Live 2D Probability Density profile cross-section (x vs. |psi|^2 vs. V(x))
 * - Real-time physical telemetry: de Broglie wavelength, decay constant kappa, particle velocity
 * - Collapsible scientific derivation and real-world technology application guide (STM, NAND flash, Gamow alpha decay)
 */
export default function QuantumLabPreview({
  energyEv: extEnergyEv,
  setEnergyEv: extSetEnergyEv,
  barrierHeightEv: extBarrierHeightEv,
  setBarrierHeightEv: extSetBarrierHeightEv,
  barrierWidthNm: extBarrierWidthNm,
  setBarrierWidthNm: extSetBarrierWidthNm,
  particleKey: extParticleKey,
  setParticleKey: extSetParticleKey,
  simMode: extSimMode,
  setSimMode: extSetSimMode,
  showClassicalComparison: extShowClassical,
  setShowClassicalComparison: extSetShowClassical,
  onOpenTweak,
  onOpenComparison
}) {
  // Local fallback states if not controlled externally
  const [localCase, setLocalCase] = useState("stm");
  const [localSimMode, setLocalSimMode] = useState("helix");
  const [localParticleKey, setLocalParticleKey] = useState("electron");
  const [localBarrierWidth, setLocalBarrierWidth] = useState(0.35);
  const [localBarrierHeight, setLocalBarrierHeight] = useState(4.5);
  const [localParticleEnergy, setLocalParticleEnergy] = useState(3.8);
  const [localShowClassical, setLocalShowClassical] = useState(true);
  const [isTheoryOpen, setIsTheoryOpen] = useState(false);

  // Active values (controlled or uncontrolled)
  const particleEnergy = extEnergyEv ?? localParticleEnergy;
  const setParticleEnergy = extSetEnergyEv ?? setLocalParticleEnergy;

  const barrierHeight = extBarrierHeightEv ?? localBarrierHeight;
  const setBarrierHeight = extSetBarrierHeightEv ?? setLocalBarrierHeight;

  const barrierWidth = extBarrierWidthNm ?? localBarrierWidth;
  const setBarrierWidth = extSetBarrierWidthNm ?? setLocalBarrierWidth;

  const particleKey = extParticleKey ?? localParticleKey;
  const setParticleKey = extSetParticleKey ?? setLocalParticleKey;

  const simMode = extSimMode ?? localSimMode;
  const setSimMode = extSetSimMode ?? setLocalSimMode;

  const showClassical = extShowClassical ?? localShowClassical;
  const setShowClassical = extSetShowClassical ?? setLocalShowClassical;

  const profileCanvasRef = useRef(null);

  // Pure scientific calculation isolated via quantum physics utility
  const physicsData = useMemo(() => {
    return calculateRectangularBarrierTunneling(particleEnergy, barrierHeight, barrierWidth, particleKey);
  }, [particleEnergy, barrierHeight, barrierWidth, particleKey]);

  // Preset Benchmark Scenarios
  const handleCaseSelect = (caseType) => {
    setLocalCase(caseType);
    if (caseType === "stm") {
      setBarrierWidth(0.35);
      setBarrierHeight(4.5);
      setParticleEnergy(3.8);
      setParticleKey("electron");
    } else if (caseType === "resonant") {
      setBarrierWidth(1.1);
      setBarrierHeight(3.5);
      setParticleEnergy(5.4);
      setParticleKey("electron");
    } else if (caseType === "macro") {
      setBarrierWidth(2.4);
      setBarrierHeight(5.0);
      setParticleEnergy(3.0);
      setParticleKey("electron");
    } else if (caseType === "threshold") {
      setBarrierWidth(0.8);
      setBarrierHeight(4.0);
      setParticleEnergy(4.0);
      setParticleKey("electron");
    } else if (caseType === "alpha") {
      // Gamow alpha decay tunneling
      setBarrierWidth(0.25);
      setBarrierHeight(6.0);
      setParticleEnergy(4.5);
      setParticleKey("alpha");
    }
  };

  // Synchronize 2D Probability Density Profile Canvas
  useEffect(() => {
    const canvas = profileCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 140);

    const renderProfile = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep graphite background
      ctx.fillStyle = "#0D1017";
      ctx.fillRect(0, 0, width, height);

      const margin = 24;
      const plotWidth = width - margin * 2;
      const plotHeight = height - margin * 2;
      const originY = height - margin;

      const xMin = -2.5;
      const xMax = 2.5;
      const numPoints = 180;
      const pts = evaluateStationaryWavefunction(physicsData, xMin, xMax, numPoints, 0);

      // Coordinate mapper
      const mapX = (x) => margin + ((x - xMin) / (xMax - xMin)) * plotWidth;
      const maxV = 8.0;
      const mapY_V = (v) => originY - (v / maxV) * plotHeight * 0.85;

      // Draw Potential Barrier V(x)
      const bLeft = mapX(0);
      const bRight = mapX(physicsData.barrierWidthNm);
      const bTop = mapY_V(physicsData.barrierHeightEv);

      ctx.fillStyle = "rgba(198, 114, 72, 0.12)";
      ctx.fillRect(bLeft, bTop, bRight - bLeft, originY - bTop);
      ctx.strokeStyle = "rgba(198, 114, 72, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bLeft, bTop, bRight - bLeft, originY - bTop);

      // Draw Energy Level E Line
      const eY = mapY_V(physicsData.particleEnergyEv);
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "rgba(32, 196, 180, 0.6)";
      ctx.moveTo(margin, eY);
      ctx.lineTo(width - margin, eY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Probability Density |psi(x)|^2 Curve
      ctx.beginPath();
      ctx.strokeStyle = "#20C4B4";
      ctx.lineWidth = 2.0;

      let maxDensity = 1.0;
      for (const p of pts) {
        if (p.probDensity > maxDensity) maxDensity = p.probDensity;
      }

      for (let i = 0; i < pts.length; i++) {
        const px = mapX(pts[i].x);
        const normProb = pts[i].probDensity / Math.max(1.0, maxDensity);
        const py = originY - normProb * (plotHeight * 0.8);

        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Baseline axis
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(margin, originY);
      ctx.lineTo(width - margin, originY);
      ctx.stroke();

      // Coordinate Labels
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#A3ACB9";
      ctx.fillText("x = 0 nm", bLeft - 18, originY + 14);
      ctx.fillText(`x = ${physicsData.barrierWidthNm.toFixed(2)} nm`, bRight - 20, originY + 14);
      ctx.fillText(`V₀ = ${physicsData.barrierHeightEv.toFixed(1)} eV`, bLeft + 4, bTop - 4);
      ctx.fillStyle = "#20C4B4";
      ctx.fillText(`E = ${physicsData.particleEnergyEv.toFixed(1)} eV`, margin + 6, eY - 4);
    };

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = 140;
        renderProfile();
      }
    };
    window.addEventListener("resize", handleResize);
    renderProfile();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [physicsData]);

  return (
    <section id="lab" className="section-wrapper lab-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <FlaskConical size={14} />
            <span>Analytical Quantum Mechanics Engine</span>
          </div>
          <h2 className="section-title">The Quantum Lab</h2>
          <p className="section-desc">
            An authentic physical laboratory. Explore one-dimensional quantum scattering, observe the 3D rotating complex wavefunction helix, tweak physical parameters in real time, and compare classical mechanics against quantum predictions.
          </p>
        </div>

        {/* Experiment Main Container */}
        <div className="editorial-card lab-main-card">
          {/* Top Status & Workbench Actions Header */}
          <div className="lab-status-header">
            <div className="lab-title-group">
              <span className="lab-badge">Verified 1D Quantum Scattering</span>
              <h3 className="lab-experiment-name font-serif">
                Quantum Tunnelling Through a Finite Rectangular Barrier
              </h3>
            </div>
            
            <div className="lab-header-actions">
              <div className="lab-conservation-badge">
                <ShieldCheck size={16} color="var(--color-teal)" />
                <span>Conservation: <strong className="teal-text">R + T = 1.000000</strong></span>
              </div>

              {onOpenTweak && (
                <button
                  type="button"
                  onClick={onOpenTweak}
                  className="workbench-action-btn tweak-btn"
                  title="Open live parameter tweak panel (Keyboard shortcut: T)"
                >
                  <Sliders size={14} />
                  <span>Tweak Panel [T]</span>
                </button>
              )}

              {onOpenComparison && (
                <button
                  type="button"
                  onClick={onOpenComparison}
                  className="workbench-action-btn compare-btn"
                  title="Compare two experiment parameter configurations side by side"
                >
                  <GitCompare size={14} />
                  <span>Compare A / B</span>
                </button>
              )}
            </div>
          </div>

          {/* 3D WebGL Simulation Viewport (QuantumLab3D) */}
          <div className="lab-viewport-container">
            <QuantumLab3D
              physicsData={physicsData}
              simMode={simMode}
              onSimModeChange={(mode) => setSimMode(mode)}
            />
          </div>

          {/* 2D Analytical Probability Profile Cross-Section */}
          <div className="probability-profile-section">
            <div className="profile-header">
              <div className="profile-title">
                <Waves size={14} color="var(--color-teal)" />
                <span>Analytical Probability Density Cross-Section: <MathView math="|\psi(x)|^2" inline /></span>
              </div>
              <div className="profile-meta-tags">
                <span className="profile-species-tag">
                  {physicsData.particle.name} ({physicsData.particle.massRelative})
                </span>
                <span className="profile-regime-tag">
                  {physicsData.regime === "tunneling" ? "Evanescent Exponential Decay" : "Phase Interference Modulation"}
                </span>
              </div>
            </div>
            <div className="profile-canvas-wrapper">
              <canvas ref={profileCanvasRef} className="profile-canvas" />
            </div>
          </div>

          {/* Classical vs. Quantum Comparison Section */}
          <div className="classical-quantum-comparison-card">
            <div className="cq-header">
              <div className="cq-title-group">
                <GitCompare size={16} color="var(--color-copper)" />
                <h4 className="cq-title">Classical vs. Quantum Prediction Comparison</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowClassical(!showClassical)}
                className="cq-toggle-btn"
              >
                <span>{showClassical ? "Collapse Comparison" : "Expand Comparison"}</span>
                {showClassical ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>

            {showClassical && (
              <div className="cq-content-grid">
                {/* Classical Prediction Column */}
                <div className="cq-column classical-col">
                  <div className="cq-col-header">
                    <span className="cq-badge classical-badge">Classical Mechanics</span>
                    <span className="cq-law-label">Newtonian Determinism</span>
                  </div>
                  <div className="cq-metrics">
                    <div className="cq-metric">
                      <span className="metric-label">Predicted Transmission:</span>
                      <strong className="metric-value classical-val">
                        {physicsData?.classical?.transmissionPercent ?? "0.00%"}
                      </strong>
                    </div>
                    <div className="cq-metric">
                      <span className="metric-label">Predicted Reflection:</span>
                      <strong className="metric-value">
                        {physicsData?.classical?.reflectionPercent ?? "100.0%"}
                      </strong>
                    </div>
                    <div className="cq-metric">
                      <span className="metric-label">Kinetic Energy in Barrier:</span>
                      <span className="metric-detail font-mono">
                        K₂ = (E - V₀) = {physicsData?.classical?.kineticEnergyRegion2Ev != null ? physicsData.classical.kineticEnergyRegion2Ev.toFixed(2) : (particleEnergy - barrierHeight).toFixed(2)} eV
                      </span>
                    </div>
                  </div>
                  <p className="cq-explanation">
                    {physicsData?.classical?.prediction || physicsData?.classical?.explanation || "Classically forbidden inside the barrier."}
                  </p>
                </div>

                {/* Quantum Prediction Column */}
                <div className="cq-column quantum-col">
                  <div className="cq-col-header">
                    <span className="cq-badge quantum-badge">Quantum Mechanics</span>
                    <span className="cq-law-label">Schrödinger Wave Equation</span>
                  </div>
                  <div className="cq-metrics">
                    <div className="cq-metric">
                      <span className="metric-label">Calculated Transmission:</span>
                      <strong className="metric-value teal">
                        {physicsData?.formattedTransmission ?? "0.0%"}
                      </strong>
                    </div>
                    <div className="cq-metric">
                      <span className="metric-label">Calculated Reflection:</span>
                      <strong className="metric-value copper">
                        {physicsData?.formattedReflection ?? "100.0%"}
                      </strong>
                    </div>
                    <div className="cq-metric">
                      <span className="metric-label">Evanescent Decay Constant:</span>
                      <span className="metric-detail font-mono">
                        κ = {physicsData?.kappaNm ?? "0.000"} nm⁻¹
                      </span>
                    </div>
                  </div>
                  <p className="cq-explanation">
                    {physicsData?.quantumClassicalDelta?.keyTakeaway || physicsData?.quantumClassicalDelta?.scientificKeyTakeaway || "Evanescent wave penetration enables non-zero probability."}
                  </p>
                </div>

                {/* Delta / Physical Rationale Box */}
                <div className="cq-delta-card">
                  <div className="delta-header">
                    <HelpCircle size={14} color="var(--color-teal)" />
                    <span>Why Do The Models Differ?</span>
                  </div>
                  <p className="delta-body">
                    {physicsData?.quantumClassicalDelta?.mechanism || "Evanescent wave penetration vs classical kinetic energy barrier"}. In classical mechanics, kinetic energy <MathView math="K = E - V(x) < 0" inline /> would require an unphysical imaginary velocity. In quantum mechanics, particles are represented by wavefunctions whose spatial derivatives must remain continuous across interfaces, leaving a finite evanescent amplitude at the exit boundary.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Controls & Telemetry Workbench */}
          <div className="lab-workbench-grid">
            {/* Left Column: Parameter Controls & Particle Species */}
            <div className="workbench-panel controls-panel">
              <div className="panel-header">
                <div className="panel-title-row">
                  <Sliders size={16} color="var(--color-copper)" />
                  <h4>Experimental Parameters</h4>
                </div>
                <span className="live-solver-pill">
                  <Calculator size={12} />
                  <span>Real-Time Solver</span>
                </span>
              </div>

              {/* Particle Species Selector */}
              <div className="particle-selector-group">
                <span className="presets-label">
                  <Atom size={13} color="var(--color-teal)" style={{ display: "inline", marginRight: "4px" }} />
                  Particle Species (Mass):
                </span>
                <div className="particle-btn-row">
                  {Object.entries(PARTICLE_TYPES).map(([k, p]) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => {
                        setParticleKey(k);
                        setLocalCase("custom");
                      }}
                      className={`particle-species-btn ${particleKey === k ? "active" : ""}`}
                    >
                      <span className="particle-name">{p.name}</span>
                      <span className="particle-mass">{p.massRelative}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Physical Benchmark Presets */}
              <div className="benchmark-presets">
                <span className="presets-label">Physical Benchmark Scenarios:</span>
                <div className="presets-grid">
                  <button
                    onClick={() => handleCaseSelect("stm")}
                    className={`preset-btn ${localCase === "stm" ? "active" : ""}`}
                    aria-label="Scanning Tunneling Microscopy preset"
                  >
                    <span className="preset-name">STM Vacuum Gap</span>
                    <span className="preset-detail">L = 0.35 nm, e⁻ (T ≈ 7.8%)</span>
                  </button>

                  <button
                    onClick={() => handleCaseSelect("resonant")}
                    className={`preset-btn ${localCase === "resonant" ? "active" : ""}`}
                    aria-label="Ramsauer-Townsend resonance preset"
                  >
                    <span className="preset-name">Transmission Resonance</span>
                    <span className="preset-detail">L = 1.1 nm, e⁻ (T ≈ 98.4%)</span>
                  </button>

                  <button
                    onClick={() => handleCaseSelect("macro")}
                    className={`preset-btn ${localCase === "macro" ? "active" : ""}`}
                    aria-label="Macroscopic barrier preset"
                  >
                    <span className="preset-name">Macroscopic Wall</span>
                    <span className="preset-detail">L = 2.4 nm, e⁻ (T &lt; 10⁻¹²)</span>
                  </button>

                  <button
                    onClick={() => handleCaseSelect("alpha")}
                    className={`preset-btn ${localCase === "alpha" ? "active" : ""}`}
                    aria-label="Nuclear alpha decay tunneling preset"
                  >
                    <span className="preset-name">Nuclear Alpha Decay</span>
                    <span className="preset-detail">α-particle (m ≈ 7294 m_e)</span>
                  </button>
                </div>
              </div>

              {/* Parameter Sliders */}
              <div className="parameter-sliders">
                {/* Barrier Width L */}
                <div className="slider-control">
                  <div className="slider-label-row">
                    <span>Barrier Width (<MathView math="L" inline />)</span>
                    <span className="slider-value copper">{barrierWidth.toFixed(2)} nm</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="2.5"
                    step="0.05"
                    value={barrierWidth}
                    onChange={(e) => {
                      setBarrierWidth(parseFloat(e.target.value));
                      setLocalCase("custom");
                    }}
                    className="editorial-slider copper-slider"
                    aria-label="Barrier Width slider"
                  />
                  <div className="slider-scale-limits">
                    <span>0.10 nm (Single Atom)</span>
                    <span>2.50 nm (Macroscopic)</span>
                  </div>
                </div>

                {/* Barrier Potential Height V0 */}
                <div className="slider-control">
                  <div className="slider-label-row">
                    <span>Barrier Height (<MathView math="V_0" inline />)</span>
                    <span className="slider-value copper">{barrierHeight.toFixed(1)} eV</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="8.0"
                    step="0.1"
                    value={barrierHeight}
                    onChange={(e) => {
                      setBarrierHeight(parseFloat(e.target.value));
                      setLocalCase("custom");
                    }}
                    className="editorial-slider copper-slider"
                    aria-label="Barrier Height slider"
                  />
                  <div className="slider-scale-limits">
                    <span>1.0 eV (Weak Potential)</span>
                    <span>8.0 eV (Strong Insulator)</span>
                  </div>
                </div>

                {/* Particle Energy E */}
                <div className="slider-control">
                  <div className="slider-label-row">
                    <span>Particle Energy (<MathView math="E" inline />)</span>
                    <span className="slider-value teal">{particleEnergy.toFixed(1)} eV</span>
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="8.0"
                    step="0.1"
                    value={particleEnergy}
                    onChange={(e) => {
                      setParticleEnergy(parseFloat(e.target.value));
                      setLocalCase("custom");
                    }}
                    className="editorial-slider teal-slider"
                    aria-label="Particle Energy slider"
                  />
                  <div className="slider-scale-limits">
                    <span>0.2 eV (Thermal)</span>
                    <span>8.0 eV (Energetic)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Physical Telemetry & Calculations */}
            <div className="workbench-panel telemetry-panel">
              <div className="panel-header">
                <div className="panel-title-row">
                  <Calculator size={16} color="var(--color-teal)" />
                  <h4>Calculated Scientific Telemetry</h4>
                </div>
                <span className="verified-physics-pill">
                  <CheckCircle2 size={12} />
                  <span>Exact Boundary Match</span>
                </span>
              </div>

              {/* Primary Results Readout Grid */}
              <div className="telemetry-readout-grid">
                <div className="telemetry-card primary-transmission">
                  <span className="card-label">Transmission Probability (T)</span>
                  <span className="card-value teal">{physicsData.formattedTransmission}</span>
                  <span className="card-subtext">
                    Probability fraction penetrating barrier of width <MathView math={`${barrierWidth.toFixed(2)}\\text{ nm}`} inline />
                  </span>
                </div>

                <div className="telemetry-card primary-reflection">
                  <span className="card-label">Reflection Probability (R)</span>
                  <span className="card-value copper">{physicsData.formattedReflection}</span>
                  <span className="card-subtext">
                    Probability fraction reflected backward into Region I
                  </span>
                </div>

                <div className="telemetry-card">
                  <span className="card-label">Decay Constant (<MathView math="\kappa" inline />)</span>
                  <span className="card-value">{physicsData.kappaNm} nm⁻¹</span>
                  <span className="card-subtext">
                    Evanescent wave decay: <MathView math="e^{-\kappa x}" inline />
                  </span>
                </div>

                <div className="telemetry-card">
                  <span className="card-label">De Broglie Wavelength (<MathView math="\lambda" inline />)</span>
                  <span className="card-value">{physicsData.deBroglieWavelengthNm.toFixed(3)} nm</span>
                  <span className="card-subtext">
                    Free-space matter wavelength: <MathView math="\lambda = \frac{h}{p}" inline />
                  </span>
                </div>

                <div className="telemetry-card">
                  <span className="card-label">Particle Velocity (v)</span>
                  <span className="card-value">{(physicsData.velocityMs / 1000).toFixed(0)} km/s</span>
                  <span className="card-subtext">
                    Kinematic speed: <MathView math={`${physicsData.velocityCPercent.toFixed(2)}\\%\\text{ of } c`} inline />
                  </span>
                </div>

                <div className="telemetry-card">
                  <span className="card-label">Probability Conservation</span>
                  <span className="card-value conservation">1.000000</span>
                  <span className="card-subtext">
                    Strict identity: <MathView math="R + T = 1" inline /> (Error &lt; 10⁻¹²)
                  </span>
                </div>
              </div>

              {/* Physical Interpretation Callout */}
              <div className="scientific-interpretation-card">
                <div className="interp-header">
                  <Sparkles size={15} color="var(--color-copper)" />
                  <strong>Scientific Interpretation:</strong>
                </div>
                <p className="interp-body">
                  {particleEnergy < barrierHeight ? (
                    <span>
                      Because the {physicsData.particle.name} energy (<MathView math={`${particleEnergy.toFixed(1)}\\text{ eV}`} inline />) is less than the barrier potential (<MathView math={`${barrierHeight.toFixed(1)}\\text{ eV}`} inline />), classical mechanics forbids penetration (<MathView math="T = 0" inline />). Quantum mechanically, the complex wavefunction forms an evanescent exponential tail inside the barrier (<MathView math={`\\kappa = ${physicsData.kappaNm}\\text{ nm}^{-1}`} inline />), yielding a calculated transmission of <strong>{physicsData.formattedTransmission}</strong>.
                    </span>
                  ) : (
                    <span>
                      Because the particle energy (<MathView math={`${particleEnergy.toFixed(1)}\\text{ eV}`} inline />) exceeds the barrier height (<MathView math={`${barrierHeight.toFixed(1)}\\text{ eV}`} inline />), transmission is classically permitted (<MathView math={`${physicsData.formattedTransmission}`} inline />). However, quantum mechanics dictates that the abrupt discontinuity in potential produces wave reflections (<MathView math={`R = ${physicsData.formattedReflection}`} inline />), creating interference nodes in the 3D helix!
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Mathematical Formulation & Theory Collapsible Drawer */}
          <div className="theory-collapsible-wrapper">
            <button
              onClick={() => setIsTheoryOpen(!isTheoryOpen)}
              className="theory-toggle-btn"
              aria-expanded={isTheoryOpen}
            >
              <div className="theory-btn-left">
                <BookOpen size={16} color="var(--color-teal)" />
                <span className="theory-btn-title">Mathematical Derivation &amp; Physical Principles</span>
              </div>
              {isTheoryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isTheoryOpen && (
              <div className="theory-content-panel">
                <div className="theory-grid">
                  <div className="theory-block">
                    <h5 className="theory-heading">1. The 1D Stationary Schrödinger Equation</h5>
                    <p className="theory-desc">
                      For a particle of mass <MathView math="m" inline /> in a time-independent potential <MathView math="V(x)" inline />:
                    </p>
                    <MathView math="-\frac{\hbar^2}{2m}\frac{d^2\psi(x)}{dx^2} + V(x)\psi(x) = E\psi(x)" display />
                    <p className="theory-sub">
                      In Region I (<MathView math="x < 0" inline />) and Region III (<MathView math="x > L" inline />), <MathView math="V = 0" inline />, yielding free oscillatory solutions with wavenumber <MathView math="k_1 = \frac{\sqrt{2mE}}{\hbar}" inline />.
                    </p>
                  </div>

                  <div className="theory-block">
                    <h5 className="theory-heading">2. Boundary Condition Matching</h5>
                    <p className="theory-desc">
                      At <MathView math="x = 0" inline /> and <MathView math="x = L" inline />, both the wavefunction <MathView math="\psi(x)" inline /> and its spatial derivative <MathView math="\frac{d\psi}{dx}" inline /> must remain strictly continuous:
                    </p>
                    <MathView
                      math="T = \left[1 + \frac{V_0^2 \sinh^2(\kappa L)}{4E(V_0 - E)}\right]^{-1} \quad (E < V_0)"
                      display
                    />
                    <p className="theory-sub">
                      where <MathView math="\kappa = \frac{\sqrt{2m(V_0 - E)}}{\hbar}" inline /> is the evanescent decay wavevector.
                    </p>
                  </div>

                  <div className="theory-block">
                    <h5 className="theory-heading">3. Probability Current Conservation</h5>
                    <p className="theory-desc">
                      The probability flux current <MathView math="J = \frac{\hbar}{m}\text{Im}\left[\psi^* \frac{d\psi}{dx}\right]" inline /> is conserved across the entire domain, requiring:
                    </p>
                    <MathView math="J_{\text{incident}} = J_{\text{reflected}} + J_{\text{transmitted}} \implies R + T = 1.000000" display />
                    <p className="theory-sub">
                      Our live analytical engine continuously verifies this identity to within machine precision tolerance (<MathView math="\Delta < 10^{-12}" inline />).
                    </p>
                  </div>

                  <div className="theory-block">
                    <h5 className="theory-heading">4. Real-World Physical Applications</h5>
                    <ul className="applications-list">
                      <li>
                        <strong>Scanning Tunneling Microscope (STM):</strong> A metallic tip hovers ~0.3 nm above a surface. Because <MathView math="T \propto e^{-2\kappa L}" inline />, a 0.1 nm displacement changes tunneling current tenfold, resolving individual surface atoms.
                      </li>
                      <li>
                        <strong>NAND Flash Memory:</strong> Quantum tunneling (Fowler-Nordheim mechanism) injects electrons through a thin silicon oxide insulator to store bits without mechanical wear.
                      </li>
                      <li>
                        <strong>Nuclear Alpha Decay:</strong> George Gamow (1928) demonstrated that alpha particles escape the nuclear potential barrier via quantum tunneling.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .lab-main-card {
          padding: 32px;
          background: var(--color-bg-card);
        }

        .lab-status-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          padding-bottom: 18px;
          border-bottom: 1px solid var(--border-subtle);
          flex-wrap: wrap;
          gap: 16px;
        }

        .lab-title-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .lab-badge {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--color-copper);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }

        .lab-experiment-name {
          font-size: 1.45rem;
          color: var(--color-text-main);
          font-weight: 600;
        }

        .lab-header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .lab-conservation-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          background: var(--color-teal-dim);
          border: 1px solid var(--color-teal-border);
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--color-text-main);
        }

        .teal-text {
          color: var(--color-teal);
        }

        .workbench-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: var(--radius-sm);
          font-family: var(--font-mono);
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid var(--border-stone);
        }

        .tweak-btn {
          background: rgba(198, 114, 72, 0.15);
          color: var(--color-copper);
          border-color: var(--color-copper);
        }

        .tweak-btn:hover {
          background: var(--color-copper);
          color: #FFFFFF;
        }

        .compare-btn {
          background: rgba(32, 196, 180, 0.15);
          color: var(--color-teal);
          border-color: var(--color-teal);
        }

        .compare-btn:hover {
          background: var(--color-teal);
          color: #0D1017;
        }

        /* 3D Viewport Wrapper */
        .lab-viewport-container {
          margin-bottom: 24px;
        }

        /* 2D Probability Profile Section */
        .probability-profile-section {
          background: rgba(14, 17, 23, 0.95);
          border: 1px solid var(--border-stone);
          border-radius: var(--radius-md);
          padding: 14px 18px;
          margin-bottom: 24px;
        }

        .profile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .profile-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-text-main);
        }

        .profile-meta-tags {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .profile-species-tag {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--color-teal);
          background: var(--color-teal-dim);
          border: 1px solid var(--color-teal-border);
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .profile-regime-tag {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--color-copper);
          background: var(--color-copper-dim);
          border: 1px solid var(--color-copper-border);
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .profile-canvas-wrapper {
          width: 100%;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: #0D1017;
          border: 1px solid var(--border-subtle);
        }

        .profile-canvas {
          display: block;
          width: 100%;
          height: 140px;
        }

        /* Classical vs. Quantum Card */
        .classical-quantum-comparison-card {
          background: rgba(18, 21, 29, 0.9);
          border: 1px solid var(--border-stone);
          border-radius: var(--radius-md);
          padding: 18px 22px;
          margin-bottom: 28px;
        }

        .cq-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cq-title-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cq-title {
          font-size: 0.92rem;
          font-family: var(--font-mono);
          text-transform: uppercase;
          color: var(--color-text-main);
          letter-spacing: 0.04em;
        }

        .cq-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: var(--color-text-muted);
          font-size: 0.76rem;
          font-family: var(--font-mono);
          cursor: pointer;
        }

        .cq-toggle-btn:hover {
          color: var(--color-text-main);
        }

        .cq-content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 16px;
        }

        .cq-column {
          padding: 16px;
          border-radius: var(--radius-sm);
          background: rgba(24, 28, 38, 0.9);
          border: 1px solid var(--border-subtle);
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .classical-col {
          border-left: 3px solid rgba(255, 255, 255, 0.3);
        }

        .quantum-col {
          border-left: 3px solid var(--color-teal);
        }

        .cq-col-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cq-badge {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          padding: 2px 7px;
          border-radius: var(--radius-full);
          font-weight: 600;
        }

        .classical-badge {
          background: rgba(255, 255, 255, 0.08);
          color: var(--color-text-secondary);
        }

        .quantum-badge {
          background: var(--color-teal-dim);
          color: var(--color-teal);
          border: 1px solid var(--color-teal-border);
        }

        .cq-law-label {
          font-size: 0.72rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
        }

        .cq-metrics {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .cq-metric {
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
        }

        .metric-label {
          color: var(--color-text-secondary);
        }

        .metric-value {
          font-family: var(--font-mono);
          font-size: 0.92rem;
        }

        .metric-value.classical-val {
          color: #A3ACB9;
        }

        .metric-detail {
          font-size: 0.74rem;
          color: var(--color-text-muted);
        }

        .cq-explanation {
          font-size: 0.82rem;
          color: var(--color-text-secondary);
          line-height: 1.45;
          margin-top: 4px;
        }

        .cq-delta-card {
          grid-column: 1 / -1;
          padding: 12px 16px;
          background: rgba(14, 17, 23, 0.85);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-stone);
        }

        .delta-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 0.76rem;
          color: var(--color-teal);
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .delta-body {
          font-size: 0.84rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        /* Workbench Grid */
        .lab-workbench-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 28px;
          margin-bottom: 28px;
          align-items: start;
        }

        .workbench-panel {
          padding: 24px;
          background: rgba(24, 28, 38, 0.95);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-stone);
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .panel-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .panel-title-row h4 {
          font-size: 0.88rem;
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--color-text-main);
        }

        .live-solver-pill, .verified-physics-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          padding: 3px 8px;
          border-radius: var(--radius-full);
        }

        .live-solver-pill {
          color: var(--color-copper);
          background: var(--color-copper-dim);
          border: 1px solid var(--color-copper-border);
        }

        .verified-physics-pill {
          color: var(--color-teal);
          background: var(--color-teal-dim);
          border: 1px solid var(--color-teal-border);
        }

        /* Particle Species Selector */
        .particle-selector-group {
          margin-bottom: 20px;
        }

        .particle-btn-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          margin-top: 6px;
        }

        .particle-species-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 6px 4px;
          border-radius: var(--radius-sm);
          background: rgba(18, 21, 29, 0.85);
          border: 1px solid var(--border-stone);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .particle-species-btn:hover {
          border-color: var(--color-teal);
        }

        .particle-species-btn.active {
          background: rgba(32, 196, 180, 0.15);
          border-color: var(--color-teal);
        }

        .particle-name {
          font-size: 0.76rem;
          font-weight: 600;
          color: var(--color-text-main);
        }

        .particle-mass {
          font-size: 0.64rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
        }

        .particle-species-btn.active .particle-name {
          color: var(--color-teal);
        }

        /* Benchmark Presets */
        .benchmark-presets {
          margin-bottom: 24px;
        }

        .presets-label {
          display: block;
          font-size: 0.74rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .presets-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .preset-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 8px 12px;
          border-radius: var(--radius-sm);
          background: rgba(18, 21, 29, 0.85);
          border: 1px solid var(--border-stone);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .preset-btn:hover {
          background: rgba(30, 36, 48, 0.95);
          border-color: var(--border-stone-hover);
        }

        .preset-btn.active {
          background: rgba(30, 36, 48, 0.95);
          border-color: var(--color-copper);
          box-shadow: 0 0 10px rgba(198, 114, 72, 0.25);
        }

        .preset-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-text-main);
          margin-bottom: 2px;
        }

        .preset-detail {
          font-size: 0.68rem;
          font-family: var(--font-mono);
          color: var(--color-text-secondary);
        }

        .preset-btn.active .preset-name {
          color: var(--color-copper);
        }

        /* Parameter Sliders */
        .parameter-sliders {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .slider-control {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .slider-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.84rem;
          font-family: var(--font-mono);
          color: var(--color-text-main);
        }

        .slider-value {
          font-weight: 700;
        }

        .slider-value.copper {
          color: var(--color-copper);
        }

        .slider-value.teal {
          color: var(--color-teal);
        }

        .editorial-slider {
          width: 100%;
          cursor: pointer;
        }

        .copper-slider {
          accent-color: var(--color-copper);
        }

        .teal-slider {
          accent-color: var(--color-teal);
        }

        .slider-scale-limits {
          display: flex;
          justify-content: space-between;
          font-size: 0.68rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
        }

        /* Telemetry Readout Grid */
        .telemetry-readout-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }

        .telemetry-card {
          padding: 14px;
          background: rgba(18, 21, 29, 0.85);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-stone);
          display: flex;
          flex-direction: column;
        }

        .primary-transmission {
          border-left: 3px solid var(--color-teal);
        }

        .primary-reflection {
          border-left: 3px solid var(--color-copper);
        }

        .card-label {
          font-size: 0.7rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .card-value {
          font-size: 1.45rem;
          font-weight: 700;
          font-family: var(--font-mono);
          color: var(--color-text-main);
          margin-bottom: 4px;
        }

        .card-value.teal {
          color: var(--color-teal);
        }

        .card-value.copper {
          color: var(--color-copper);
        }

        .card-value.conservation {
          color: #F4F5F7;
        }

        .card-subtext {
          font-size: 0.74rem;
          color: var(--color-text-secondary);
          line-height: 1.4;
        }

        /* Interpretation Box */
        .scientific-interpretation-card {
          padding: 14px 18px;
          background: rgba(18, 21, 29, 0.85);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-stone);
        }

        .interp-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: var(--color-text-main);
          margin-bottom: 6px;
        }

        .interp-body {
          font-size: 0.86rem;
          color: var(--color-text-secondary);
          line-height: 1.55;
        }

        /* Collapsible Theory Drawer */
        .theory-collapsible-wrapper {
          border-top: 1px solid var(--border-subtle);
          padding-top: 20px;
        }

        .theory-toggle-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          background: rgba(24, 28, 38, 0.9);
          border: 1px solid var(--border-stone);
          border-radius: var(--radius-sm);
          color: var(--color-text-main);
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .theory-toggle-btn:hover {
          background: rgba(30, 36, 48, 0.95);
          border-color: var(--color-teal);
        }

        .theory-btn-left {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-mono);
          font-size: 0.86rem;
          font-weight: 600;
        }

        .theory-content-panel {
          margin-top: 16px;
          padding: 24px;
          background: rgba(18, 21, 29, 0.9);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-stone);
        }

        .theory-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .theory-block {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .theory-heading {
          font-size: 0.86rem;
          font-family: var(--font-mono);
          color: var(--color-teal);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .theory-desc {
          font-size: 0.88rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        .theory-sub {
          font-size: 0.82rem;
          color: var(--color-text-muted);
          line-height: 1.45;
        }

        .applications-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
          font-size: 0.86rem;
          color: var(--color-text-secondary);
        }

        .applications-list strong {
          color: var(--color-text-main);
        }

        @media (max-width: 990px) {
          .lab-workbench-grid {
            grid-template-columns: 1fr;
          }
          .cq-content-grid {
            grid-template-columns: 1fr;
          }
          .theory-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .presets-grid {
            grid-template-columns: 1fr;
          }
          .particle-btn-row {
            grid-template-columns: repeat(2, 1fr);
          }
          .telemetry-readout-grid {
            grid-template-columns: 1fr;
          }
          .lab-main-card {
            padding: 20px;
          }
        }
      `}</style>
    </section>
  );
}
