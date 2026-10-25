import React, { useState, useMemo, useEffect, useRef } from "react";
import { Sliders, FlaskConical, CheckCircle2, Calculator } from "lucide-react";
import MathView from "./MathView";
import { calculateRectangularBarrierTunneling } from "../utils/quantumPhysics";

/**
 * QuantumLabPreview
 * Section introducing the future interactive scientific laboratory.
 * Features:
 * - Scientifically genuine 1D rectangular barrier tunneling calculation
 * - Fully reactive controls (Barrier Width, Barrier Height, Particle Energy)
 * - Live KaTeX-typeset quantum tunneling equations
 * - Live-updating 2D wavepacket attenuation diagram
 * - Clear distinction: separates physics calculation from visual rendering
 */
export default function QuantumLabPreview() {
  // Preset scenarios
  const [selectedCase, setSelectedCase] = useState("narrow"); // "narrow" | "wide" | "custom"

  // Parameter states (scientifically meaningful units: eV and nm)
  const [barrierWidth, setBarrierWidth] = useState(0.8); // nm
  const [barrierHeight, setBarrierHeight] = useState(5.0); // eV
  const [particleEnergy, setParticleEnergy] = useState(3.2); // eV

  // Canvas ref for wavepacket visualization
  const waveCanvasRef = useRef(null);

  // Pure scientific calculation isolated via quantum physics utility
  const physicsData = useMemo(() => {
    return calculateRectangularBarrierTunneling(particleEnergy, barrierHeight, barrierWidth);
  }, [particleEnergy, barrierHeight, barrierWidth]);

  const handleCaseSelect = (caseType) => {
    setSelectedCase(caseType);
    if (caseType === "narrow") {
      setBarrierWidth(0.8);
      setBarrierHeight(5.0);
      setParticleEnergy(3.2);
    } else if (caseType === "wide") {
      setBarrierWidth(2.2);
      setBarrierHeight(5.0);
      setParticleEnergy(3.2);
    }
  };

  // Synchronize 2D Wave attenuation diagram with actual calculated transmission
  useEffect(() => {
    const canvas = waveCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = 240);

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = 240;
      }
    };
    window.addEventListener("resize", handleResize);

    let phase = 0;
    const render = () => {
      phase += 0.05;
      ctx.clearRect(0, 0, width, height);

      // Clean editorial canvas background
      ctx.fillStyle = "#F5F3EC";
      ctx.fillRect(0, 0, width, height);

      const midY = height * 0.52;
      const barrierNormWidth = Math.min(width * 0.45, Math.max(30, (barrierWidth / 3.0) * (width * 0.35)));
      const barrierStartX = width * 0.42 - barrierNormWidth * 0.5;
      const barrierEndX = barrierStartX + barrierNormWidth;

      // Draw Potential Barrier Rect
      ctx.fillStyle = "rgba(42, 46, 51, 0.08)";
      ctx.strokeStyle = "rgba(42, 46, 51, 0.4)";
      ctx.lineWidth = 1.5;
      const barrierHeightPx = Math.min(height * 0.75, (barrierHeight / 8.0) * (height * 0.65));
      ctx.fillRect(barrierStartX, midY - barrierHeightPx, barrierNormWidth, barrierHeightPx);
      ctx.strokeRect(barrierStartX, midY - barrierHeightPx, barrierNormWidth, barrierHeightPx);

      // Barrier Label
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#191C1F";
      ctx.fillText(`V₀ = ${barrierHeight.toFixed(1)} eV`, barrierStartX + 6, midY - barrierHeightPx - 8);
      ctx.fillText(`w = ${barrierWidth.toFixed(1)} nm`, barrierStartX + 6, midY + 20);

      // Incident Energy Level Dotted Line
      const energyLevelPx = midY - (particleEnergy / 8.0) * (height * 0.65);
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "rgba(189, 100, 60, 0.6)";
      ctx.moveTo(20, energyLevelPx);
      ctx.lineTo(width - 20, energyLevelPx);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#BD643C";
      ctx.fillText(`E = ${particleEnergy.toFixed(1)} eV`, 24, energyLevelPx - 6);

      // Incident & Reflected Wave (Region I: x < barrierStartX)
      ctx.beginPath();
      ctx.strokeStyle = "#384936";
      ctx.lineWidth = 2;
      const kIncident = 0.08;
      const incAmp = 28;

      for (let x = 20; x <= barrierStartX; x += 2) {
        const y = midY + Math.sin(x * kIncident - phase) * incAmp;
        if (x === 20) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Evanescent Wave inside Barrier (Region II: barrierStartX < x < barrierEndX)
      ctx.beginPath();
      ctx.strokeStyle = "#BD643C";
      ctx.lineWidth = 2.2;
      const decayCoeff = Math.min(0.08, Math.max(0.005, Number(physicsData.kappaNm) * 0.015));

      for (let x = barrierStartX; x <= barrierEndX; x += 2) {
        const distInside = x - barrierStartX;
        const decayFactor = Math.exp(-distInside * decayCoeff);
        const y = midY + Math.sin(barrierStartX * kIncident - phase) * (incAmp * decayFactor);
        if (x === barrierStartX) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Transmitted Wave (Region III: x > barrierEndX)
      ctx.beginPath();
      ctx.strokeStyle = "#384936";
      ctx.lineWidth = 2;
      // Transmitted amplitude is proportional to sqrt(T)
      const transAmp = Math.max(1.5, incAmp * Math.sqrt(physicsData.transmissionCoefficient));

      for (let x = barrierEndX; x <= width - 20; x += 2) {
        const transPhase = (barrierEndX * kIncident - phase) + (x - barrierEndX) * kIncident;
        const y = midY + Math.sin(transPhase) * transAmp;
        if (x === barrierEndX) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [barrierWidth, barrierHeight, particleEnergy, physicsData]);

  return (
    <section id="lab" className="section-wrapper lab-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <FlaskConical size={14} />
            <span>Analytical Quantum Mechanics</span>
          </div>
          <h2 className="section-title">The Quantum Lab</h2>
          <p className="section-desc">
            Explore genuine quantum calculations. Modify physical constants, observe exponential wavefunction attenuation, and verify how barrier thickness alters particle transmission.
          </p>
        </div>

        {/* First Experiment Feature Box */}
        <div className="editorial-card lab-preview-card">
          {/* Top Banner Status */}
          <div className="lab-banner">
            <div className="lab-banner-info">
              <span className="lab-banner-badge">Verified 1D Scientific Model</span>
              <span className="lab-banner-title">
                Quantum Tunnelling Through a Finite Rectangular Barrier
              </span>
            </div>
            <div className="lab-banner-status">
              <Calculator size={14} color="var(--color-copper)" />
              <span>Real-Time Analytical Solver</span>
            </div>
          </div>

          {/* Core Research Question */}
          <div className="beginner-question-box">
            <span className="question-prefix">Governing Scientific Principle:</span>
            <h3 className="question-title font-serif">
              “What happens if a particle encounters a narrower barrier?”
            </h3>
            <p className="question-explanation">
              Classically, a particle with energy <MathView math="E < V_0" inline /> is completely reflected by a potential barrier. But quantum mechanics dictates that the matter wave penetrates into the barrier with exponential decay constant <MathView math="\kappa" inline />. As the barrier width <MathView math="w" inline /> decreases, the transmitted amplitude increases exponentially.
            </p>
          </div>

          {/* Interactive Workspace Simulator */}
          <div className="lab-workspace-grid">
            {/* Left: Parameter Controls */}
            <div className="lab-controls-panel">
              <div className="panel-header">
                <div className="panel-title-row">
                  <Sliders size={16} color="var(--color-copper)" />
                  <h4>Model Parameters</h4>
                </div>
                <span className="preview-pill">Active Solver</span>
              </div>

              {/* Quick Case Switcher */}
              <div className="case-switcher">
                <span className="switcher-label">Benchmark Scenarios:</span>
                <div className="switcher-buttons">
                  <button
                    onClick={() => handleCaseSelect("narrow")}
                    className={`switcher-btn ${selectedCase === "narrow" ? "active" : ""}`}
                    aria-label="Select Narrower Barrier Scenario"
                  >
                    <span>Narrow (0.8 nm)</span>
                  </button>
                  <button
                    onClick={() => handleCaseSelect("wide")}
                    className={`switcher-btn ${selectedCase === "wide" ? "active" : ""}`}
                    aria-label="Select Wide Barrier Scenario"
                  >
                    <span>Wide (2.2 nm)</span>
                  </button>
                </div>
              </div>

              {/* Sliders connected to real calculations */}
              <div className="control-item">
                <div className="control-label-row">
                  <span>Barrier Width (w)</span>
                  <span className="control-value">{barrierWidth.toFixed(1)} nm</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.1"
                  value={barrierWidth}
                  onChange={(e) => {
                    setBarrierWidth(parseFloat(e.target.value));
                    setSelectedCase("custom");
                  }}
                  className="editorial-slider"
                  aria-label="Barrier Width slider"
                />
                <span className="slider-hint">Exponential sensitivity to barrier thickness</span>
              </div>

              <div className="control-item">
                <div className="control-label-row">
                  <span>Barrier Height (V₀)</span>
                  <span className="control-value">{barrierHeight.toFixed(1)} eV</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="8.0"
                  step="0.2"
                  value={barrierHeight}
                  onChange={(e) => {
                    setBarrierHeight(parseFloat(e.target.value));
                    setSelectedCase("custom");
                  }}
                  className="editorial-slider"
                  aria-label="Barrier Height slider"
                />
              </div>

              <div className="control-item">
                <div className="control-label-row">
                  <span>Particle Energy (E)</span>
                  <span className="control-value">{particleEnergy.toFixed(1)} eV</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="7.5"
                  step="0.1"
                  value={particleEnergy}
                  onChange={(e) => {
                    setParticleEnergy(parseFloat(e.target.value));
                    setSelectedCase("custom");
                  }}
                  className="editorial-slider"
                  aria-label="Particle Energy slider"
                />
              </div>

              {/* Governing Mathematical Formulation */}
              <div className="lab-formula-card">
                <span className="lab-formula-title">Exact Transmission Law:</span>
                <MathView
                  math="T = \frac{1}{1 + \frac{V_0^2 \sinh^2(\kappa a)}{4E(V_0-E)}}"
                  display
                />
                <span className="lab-formula-sub">
                  where <MathView math="\kappa = \frac{\sqrt{2m(V_0-E)}}{\hbar}" inline />
                </span>
              </div>
            </div>

            {/* Right: Visual Wave Output & Calculated Telemetry */}
            <div className="lab-visualization-panel">
              {/* Telemetry Readout Cards */}
              <div className="lab-results-grid">
                <div className="result-card result-primary">
                  <span className="result-label">Calculated Transmission (T)</span>
                  <span className="result-value">{physicsData.formattedTransmission}</span>
                  <span className="result-desc">
                    {particleEnergy < barrierHeight
                      ? `Quantum tunneling probability through ${barrierWidth.toFixed(1)} nm`
                      : "Over-barrier transmission with quantum reflections"}
                  </span>
                </div>

                <div className="result-card">
                  <span className="result-label">Decay Parameter (κ)</span>
                  <span className="result-value">{physicsData.kappaNm} nm⁻¹</span>
                  <span className="result-desc">Wavefunction attenuation inside barrier</span>
                </div>
              </div>

              {/* 2D Schematic Wave Canvas */}
              <div className="wave-canvas-wrapper">
                <div className="wave-canvas-header">
                  <span className="canvas-title">Wavepacket Attenuation Schematic</span>
                  <span className="canvas-badge">
                    {particleEnergy < barrierHeight ? "Tunneling Regime" : "Over-Barrier"}
                  </span>
                </div>
                <canvas ref={waveCanvasRef} className="wave-canvas" />
                <div className="canvas-footer-legend">
                  <span className="legend-item">
                    <span className="legend-dot green" />
                    <span>Propagating Wave</span>
                  </span>
                  <span className="legend-item">
                    <span className="legend-dot copper" />
                    <span>Evanescent Decay inside Barrier</span>
                  </span>
                </div>
              </div>

              {/* Physical Interpretation Callout */}
              <div className="lab-interpretation-card">
                <div className="interpretation-header">
                  <CheckCircle2 size={16} color="var(--color-forest)" />
                  <strong>Scientific Interpretation:</strong>
                </div>
                <p className="interpretation-body">
                  {particleEnergy < barrierHeight
                    ? `Because tunneling probability decays exponentially as e^(-2κw), increasing width from 0.8 nm to 2.2 nm reduces transmission by several orders of magnitude. The current calculated value is ${physicsData.formattedTransmission}.`
                    : `Since particle energy exceeds the barrier height (E > V₀), transmission is classically allowed (${physicsData.formattedTransmission}), yet quantum reflections still occur at the discontinuous potential boundaries.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .lab-preview-card {
          padding: 34px;
          background: var(--color-surface);
        }

        .lab-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          background: var(--color-surface-muted);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-stone);
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
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--color-copper);
          background: var(--color-surface);
          border: 1px solid var(--color-copper-border);
          padding: 3px 8px;
          border-radius: var(--radius-full);
          font-weight: 600;
          text-transform: uppercase;
        }

        .lab-banner-title {
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--color-graphite);
        }

        .lab-banner-status {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 0.76rem;
          color: var(--color-copper);
          font-weight: 600;
        }

        .beginner-question-box {
          margin-bottom: 28px;
          padding-bottom: 22px;
          border-bottom: 1px solid var(--border-stone-light);
        }

        .question-prefix {
          font-size: 0.76rem;
          font-family: var(--font-mono);
          color: var(--color-forest);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 6px;
        }

        .question-title {
          font-size: 1.55rem;
          color: var(--color-graphite);
          margin-bottom: 10px;
        }

        .question-explanation {
          font-size: 0.98rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
        }

        .lab-workspace-grid {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 28px;
          align-items: start;
        }

        /* Controls Panel */
        .lab-controls-panel {
          padding: 22px;
          background: var(--color-surface-muted);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-stone);
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .panel-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .panel-title-row h4 {
          font-size: 0.92rem;
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--color-graphite);
        }

        .preview-pill {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--color-forest);
          background: var(--color-forest-subtle);
          padding: 2px 8px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-forest-border);
        }

        .case-switcher {
          margin-bottom: 20px;
        }

        .switcher-label {
          display: block;
          font-size: 0.74rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .switcher-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .switcher-btn {
          padding: 7px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-family: var(--font-mono);
          background: var(--color-surface);
          border: 1px solid var(--border-stone);
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .switcher-btn.active {
          background: var(--color-copper);
          color: #FFFFFF;
          border-color: var(--color-copper);
          font-weight: 600;
        }

        .control-item {
          margin-bottom: 18px;
        }

        .control-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.84rem;
          font-family: var(--font-mono);
          color: var(--color-graphite);
          margin-bottom: 6px;
        }

        .control-value {
          font-weight: 600;
          color: var(--color-copper);
        }

        .editorial-slider {
          width: 100%;
          accent-color: var(--color-copper);
          cursor: pointer;
        }

        .slider-hint {
          display: block;
          font-size: 0.72rem;
          color: var(--color-text-muted);
          margin-top: 4px;
        }

        .lab-formula-card {
          margin-top: 20px;
          padding: 14px;
          background: var(--color-surface);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-stone);
          text-align: center;
        }

        .lab-formula-title {
          display: block;
          font-size: 0.72rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .lab-formula-sub {
          display: block;
          font-size: 0.78rem;
          color: var(--color-text-secondary);
          margin-top: 6px;
        }

        /* Results & Visualization */
        .lab-visualization-panel {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .lab-results-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .result-card {
          padding: 16px;
          background: var(--color-surface-muted);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-stone);
          display: flex;
          flex-direction: column;
        }

        .result-primary {
          border-left: 3px solid var(--color-copper);
        }

        .result-label {
          font-size: 0.72rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .result-value {
          font-size: 1.6rem;
          font-weight: 700;
          font-family: var(--font-mono);
          color: var(--color-copper);
          margin-bottom: 4px;
        }

        .result-desc {
          font-size: 0.78rem;
          color: var(--color-text-secondary);
          line-height: 1.4;
        }

        .wave-canvas-wrapper {
          border: 1px solid var(--border-stone);
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #F5F3EC;
        }

        .wave-canvas-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 14px;
          background: var(--color-surface);
          border-bottom: 1px solid var(--border-stone-light);
        }

        .canvas-title {
          font-size: 0.76rem;
          font-family: var(--font-mono);
          color: var(--color-graphite);
          font-weight: 600;
        }

        .canvas-badge {
          font-size: 0.7rem;
          font-family: var(--font-mono);
          color: var(--color-forest);
          background: var(--color-forest-subtle);
          padding: 1px 6px;
          border-radius: 4px;
        }

        .wave-canvas {
          display: block;
          width: 100%;
          height: 220px;
        }

        .canvas-footer-legend {
          display: flex;
          gap: 16px;
          padding: 8px 14px;
          background: var(--color-surface);
          border-top: 1px solid var(--border-stone-light);
          font-size: 0.74rem;
          font-family: var(--font-mono);
          color: var(--color-text-secondary);
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .legend-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .legend-dot.green {
          background: var(--color-forest);
        }

        .legend-dot.copper {
          background: var(--color-copper);
        }

        .lab-interpretation-card {
          padding: 14px 18px;
          background: var(--color-surface-muted);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-stone-light);
        }

        .interpretation-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: var(--color-graphite);
          margin-bottom: 6px;
        }

        .interpretation-body {
          font-size: 0.88rem;
          color: var(--color-text-secondary);
          line-height: 1.55;
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
