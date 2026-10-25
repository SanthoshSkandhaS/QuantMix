import React, { useEffect, useRef } from "react";
import {
  X,
  Scale,
  Sparkles,
  RotateCcw
} from "lucide-react";
import {
  calculateRectangularBarrierTunneling,
  evaluateStationaryWavefunction
} from "../utils/quantumPhysics";

/**
 * ConfigComparisonModal
 * Side-by-side scientific comparison of two physical configurations (A and B).
 * Both states are computed in real time using the true stationary 1D Schrödinger boundary solver.
 */
export default function ConfigComparisonModal({
  isOpen,
  onClose,
  configA,
  configB,
  onClearComparison,
  onLoadConfig
}) {
  const canvasRefA = useRef(null);
  const canvasRefB = useRef(null);

  const dataA = configA
    ? calculateRectangularBarrierTunneling(
        configA.energyEv,
        configA.barrierHeightEv,
        configA.barrierWidthNm,
        configA.particleKey || "electron"
      )
    : null;

  const dataB = configB
    ? calculateRectangularBarrierTunneling(
        configB.energyEv,
        configB.barrierHeightEv,
        configB.barrierWidthNm,
        configB.particleKey || "electron"
      )
    : null;

  // Render 2D comparison probability curves
  useEffect(() => {
    if (!isOpen) return;

    const renderCurve = (canvas, physicsData) => {
      if (!canvas || !physicsData) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const points = evaluateStationaryWavefunction(physicsData, -2.0, 2.0, 200, 0);
      const L = physicsData.barrierWidthNm;

      // Draw barrier Region II
      const xToPixel = (x) => ((x - (-2.0)) / (2.0 - (-2.0))) * w;
      const x0Px = xToPixel(0);
      const xLPx = xToPixel(L);

      ctx.fillStyle = "rgba(198, 114, 72, 0.18)";
      ctx.fillRect(x0Px, 0, xLPx - x0Px, h);

      ctx.strokeStyle = "rgba(198, 114, 72, 0.6)";
      ctx.lineWidth = 1;
      ctx.strokeRect(x0Px, 0, xLPx - x0Px, h);

      // Max probability density for scaling
      const maxDensity = Math.max(1.5, ...points.map((p) => p.probDensity));
      const yToPixel = (d) => h - 15 - (d / maxDensity) * (h - 30);

      // Draw probability curve
      ctx.beginPath();
      ctx.strokeStyle = "#35D6D0";
      ctx.lineWidth = 2;

      points.forEach((pt, i) => {
        const px = xToPixel(pt.x);
        const py = yToPixel(pt.probDensity);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Zero axis line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.beginPath();
      ctx.moveTo(0, h - 15);
      ctx.lineTo(w, h - 15);
      ctx.stroke();
    };

    renderCurve(canvasRefA.current, dataA);
    renderCurve(canvasRefB.current, dataB);
  }, [isOpen, dataA, dataB]);

  if (!isOpen) return null;

  const deltaT =
    dataA && dataB
      ? (dataB.transmissionPercent - dataA.transmissionPercent).toFixed(2)
      : null;

  const ratioT =
    dataA && dataB && dataA.transmissionCoefficient > 1e-15
      ? (dataB.transmissionCoefficient / dataA.transmissionCoefficient).toExponential(2)
      : "—";

  return (
    <div className="comp-modal-backdrop" role="dialog" aria-modal="true" aria-label="Experiment Comparison">
      <div className="comp-modal-card">
        {/* Header */}
        <div className="comp-modal-header">
          <div className="comp-modal-title-row">
            <div className="comp-icon-badge">
              <Scale size={20} color="var(--color-teal, #35d6d0)" />
            </div>
            <div>
              <h3 className="comp-modal-title font-serif">Experiment Comparison: Configuration A vs. B</h3>
              <span className="comp-modal-subtitle">
                Side-by-side analytical Schrödinger evaluation &amp; transmission ratio
              </span>
            </div>
          </div>
          <button onClick={onClose} className="comp-modal-close" aria-label="Close Comparison">
            <X size={18} />
          </button>
        </div>

        {/* Comparison Content */}
        <div className="comp-modal-body">
          {(!configA || !configB) ? (
            <div className="comp-incomplete-notice">
              <Sparkles size={24} color="var(--color-copper, #c67248)" />
              <p>
                Please save both <strong>Config A</strong> and <strong>Config B</strong> from the Tweak panel to compare results.
              </p>
              <div className="incomplete-status">
                <span>Config A: {configA ? "Saved ✓" : "Missing ✕"}</span>
                <span>Config B: {configB ? "Saved ✓" : "Missing ✕"}</span>
              </div>
            </div>
          ) : (
            <>
              {/* Summary Delta Banner */}
              <div className="comp-summary-banner">
                <div className="summary-delta-item">
                  <span className="summary-label">Transmission Difference (ΔT):</span>
                  <strong className={`summary-delta ${Number(deltaT) >= 0 ? "positive" : "negative"}`}>
                    {Number(deltaT) >= 0 ? `+${deltaT}%` : `${deltaT}%`}
                  </strong>
                </div>
                <div className="summary-delta-item">
                  <span className="summary-label">Transmission Ratio (T_B / T_A):</span>
                  <strong className="summary-ratio">{ratioT}×</strong>
                </div>
              </div>

              {/* Two Column Side-by-Side Comparison Grid */}
              <div className="comp-grid">
                {/* Column A */}
                <div className="comp-card-col">
                  <div className="col-header">
                    <span className="col-badge badge-a">Configuration A</span>
                    <button onClick={() => onLoadConfig?.(configA)} className="load-config-btn">
                      Load Into Lab
                    </button>
                  </div>

                  {/* Canvas curve */}
                  <div className="mini-curve-wrap">
                    <canvas ref={canvasRefA} width={340} height={120} className="mini-curve-canvas" />
                    <span className="curve-label">Probability Density |ψ(x)|²</span>
                  </div>

                  {/* Parameters Table */}
                  <div className="comp-params-table">
                    <div className="param-row">
                      <span>Particle Species:</span>
                      <strong>{dataA.particle.name} ({dataA.particle.symbol})</strong>
                    </div>
                    <div className="param-row">
                      <span>Particle Mass:</span>
                      <strong>{dataA.particle.massRelative}</strong>
                    </div>
                    <div className="param-row">
                      <span>Particle Energy (E):</span>
                      <strong>{dataA.particleEnergyEv.toFixed(2)} eV</strong>
                    </div>
                    <div className="param-row">
                      <span>Barrier Height (V₀):</span>
                      <strong>{dataA.barrierHeightEv.toFixed(2)} eV</strong>
                    </div>
                    <div className="param-row">
                      <span>Barrier Width (L):</span>
                      <strong>{dataA.barrierWidthNm.toFixed(2)} nm</strong>
                    </div>
                    <div className="param-row highlight-row">
                      <span>Quantum Transmission (T):</span>
                      <strong className="teal-text">{dataA.formattedTransmission}</strong>
                    </div>
                    <div className="param-row">
                      <span>Quantum Reflection (R):</span>
                      <strong className="copper-text">{dataA.formattedReflection}</strong>
                    </div>
                    <div className="param-row">
                      <span>Classical Transmission:</span>
                      <strong>{dataA.classical.transmissionPct}</strong>
                    </div>
                    <div className="param-row">
                      <span>Decay Constant (κ):</span>
                      <strong>{dataA.kappaNm} nm⁻¹</strong>
                    </div>
                    <div className="param-row">
                      <span>De Broglie Wavelength (λ):</span>
                      <strong>{dataA.deBroglieWavelengthNm.toFixed(3)} nm</strong>
                    </div>
                  </div>
                </div>

                {/* Column B */}
                <div className="comp-card-col">
                  <div className="col-header">
                    <span className="col-badge badge-b">Configuration B</span>
                    <button onClick={() => onLoadConfig?.(configB)} className="load-config-btn">
                      Load Into Lab
                    </button>
                  </div>

                  {/* Canvas curve */}
                  <div className="mini-curve-wrap">
                    <canvas ref={canvasRefB} width={340} height={120} className="mini-curve-canvas" />
                    <span className="curve-label">Probability Density |ψ(x)|²</span>
                  </div>

                  {/* Parameters Table */}
                  <div className="comp-params-table">
                    <div className="param-row">
                      <span>Particle Species:</span>
                      <strong>{dataB.particle.name} ({dataB.particle.symbol})</strong>
                    </div>
                    <div className="param-row">
                      <span>Particle Mass:</span>
                      <strong>{dataB.particle.massRelative}</strong>
                    </div>
                    <div className="param-row">
                      <span>Particle Energy (E):</span>
                      <strong>{dataB.particleEnergyEv.toFixed(2)} eV</strong>
                    </div>
                    <div className="param-row">
                      <span>Barrier Height (V₀):</span>
                      <strong>{dataB.barrierHeightEv.toFixed(2)} eV</strong>
                    </div>
                    <div className="param-row">
                      <span>Barrier Width (L):</span>
                      <strong>{dataB.barrierWidthNm.toFixed(2)} nm</strong>
                    </div>
                    <div className="param-row highlight-row">
                      <span>Quantum Transmission (T):</span>
                      <strong className="teal-text">{dataB.formattedTransmission}</strong>
                    </div>
                    <div className="param-row">
                      <span>Quantum Reflection (R):</span>
                      <strong className="copper-text">{dataB.formattedReflection}</strong>
                    </div>
                    <div className="param-row">
                      <span>Classical Transmission:</span>
                      <strong>{dataB.classical.transmissionPct}</strong>
                    </div>
                    <div className="param-row">
                      <span>Decay Constant (κ):</span>
                      <strong>{dataB.kappaNm} nm⁻¹</strong>
                    </div>
                    <div className="param-row">
                      <span>De Broglie Wavelength (λ):</span>
                      <strong>{dataB.deBroglieWavelengthNm.toFixed(3)} nm</strong>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="comp-modal-footer">
          <button onClick={onClearComparison} className="comp-clear-btn">
            <RotateCcw size={14} />
            <span>Clear Saved Snapshots</span>
          </button>
          <button onClick={onClose} className="comp-dismiss-btn">
            Close Comparison
          </button>
        </div>
      </div>

      <style>{`
        .comp-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(4, 7, 14, 0.85);
          backdrop-filter: blur(14px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1200;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }

        .comp-modal-card {
          width: 820px;
          max-width: 100%;
          max-height: 90vh;
          background: #0b1020;
          border: 1px solid rgba(53, 214, 208, 0.3);
          border-radius: 14px;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.85);
          display: flex;
          flex-direction: column;
          color: #f4f7ff;
          overflow: hidden;
        }

        .comp-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 24px;
          background: rgba(17, 27, 46, 0.7);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .comp-modal-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .comp-icon-badge {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: rgba(53, 214, 208, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .comp-modal-title {
          font-size: 1.15rem;
          margin: 0;
          color: #ffffff;
        }

        .comp-modal-subtitle {
          font-size: 0.75rem;
          color: #a9b6cf;
          font-family: monospace;
          display: block;
        }

        .comp-modal-close {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #a9b6cf;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .comp-modal-body {
          padding: 22px 24px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .comp-incomplete-notice {
          padding: 40px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: #a9b6cf;
        }

        .incomplete-status {
          display: flex;
          gap: 20px;
          font-family: monospace;
          font-size: 0.85rem;
          margin-top: 8px;
        }

        .comp-summary-banner {
          display: flex;
          justify-content: space-around;
          background: rgba(17, 27, 46, 0.8);
          border: 1px solid rgba(53, 214, 208, 0.25);
          border-radius: 8px;
          padding: 14px;
        }

        .summary-delta-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .summary-label {
          font-size: 0.82rem;
          color: #a9b6cf;
        }

        .summary-delta {
          font-size: 1.25rem;
          font-family: monospace;
        }

        .summary-delta.positive {
          color: #35d6d0;
        }

        .summary-delta.negative {
          color: #c67248;
        }

        .summary-ratio {
          font-size: 1.25rem;
          font-family: monospace;
          color: #9b8cff;
        }

        .comp-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .comp-card-col {
          background: rgba(17, 27, 46, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .col-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .col-badge {
          font-size: 0.75rem;
          font-family: monospace;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 4px;
        }

        .badge-a {
          background: rgba(53, 214, 208, 0.15);
          color: #35d6d0;
          border: 1px solid rgba(53, 214, 208, 0.35);
        }

        .badge-b {
          background: rgba(155, 140, 255, 0.15);
          color: #9b8cff;
          border: 1px solid rgba(155, 140, 255, 0.35);
        }

        .load-config-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          padding: 3px 8px;
          color: #a9b6cf;
          font-size: 0.7rem;
          cursor: pointer;
        }

        .load-config-btn:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
        }

        .mini-curve-wrap {
          position: relative;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 6px;
          padding: 4px;
        }

        .mini-curve-canvas {
          width: 100%;
          height: 90px;
          display: block;
        }

        .curve-label {
          position: absolute;
          top: 6px;
          left: 8px;
          font-size: 0.65rem;
          font-family: monospace;
          color: #6b7c96;
        }

        .comp-params-table {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .param-row {
          display: flex;
          justify-content: space-between;
          padding: 4px 6px;
          border-radius: 4px;
          font-size: 0.76rem;
        }

        .param-row:nth-child(even) {
          background: rgba(255, 255, 255, 0.02);
        }

        .param-row span {
          color: #8c9bb3;
        }

        .param-row strong {
          font-family: monospace;
        }

        .highlight-row {
          background: rgba(53, 214, 208, 0.08) !important;
          border: 1px solid rgba(53, 214, 208, 0.2);
        }

        .comp-modal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 24px;
          background: rgba(17, 27, 46, 0.7);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
        }

        .comp-clear-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1px solid rgba(198, 114, 72, 0.3);
          color: #c67248;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 0.78rem;
          cursor: pointer;
        }

        .comp-dismiss-btn {
          background: #35d6d0;
          color: #0b1020;
          border: none;
          padding: 7px 18px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.84rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
