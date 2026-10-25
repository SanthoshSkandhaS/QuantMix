import React, { useState, useEffect, useCallback, useRef } from "react";
import { QUANTUM_FACTS } from "../data/quantumFacts";
import MathView, { MathText } from "./MathView";
import {
  Sparkles,
  RefreshCw,
  BookOpen,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Eye,
  Waves,
  Atom,
  CheckCircle2
} from "lucide-react";

const STORAGE_KEY = "quantmix_seen_fact_ids_v1";

// Helper to safely read seen IDs from storage
function readStoredSeenIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((id) => QUANTUM_FACTS.some((f) => f.id === id));
    }
  } catch {
    // Storage unavailable
  }
  return [];
}

// Helper to safely write seen IDs
function writeStoredSeenIds(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage unavailable fallback
  }
}

// Initial fact selector to ensure zero-delay first paint
function getInitialFact() {
  const seenIds = readStoredSeenIds();
  const unseen = QUANTUM_FACTS.filter((f) => !seenIds.includes(f.id));
  if (unseen.length > 0) {
    return { fact: unseen[0], seenCount: seenIds.length + 1 };
  }
  return { fact: QUANTUM_FACTS[0], seenCount: 1 };
}

/**
 * DiscoverySection
 * - Heading: "Small things. Strange rules."
 * - Description: "The world we experience is built on quantum rules that are often very different from our everyday intuition."
 * - Immediate visible access on initial page load (zero null-flash)
 * - Strict non-repeating random selection with localStorage rotation memory
 * - Curated 22 facts with beginner summary, deep dive, KaTeX-typeset formula, and authoritative source URLs
 * - Mathematical Typesetting Verification banner (testing benchmark equations)
 * - Restyled with Scientific-Editorial identity
 */
export default function DiscoverySection() {
  const [currentFact, setCurrentFact] = useState(() => getInitialFact().fact);
  const [seenCount, setSeenCount] = useState(() => getInitialFact().seenCount);
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [simMode, setSimMode] = useState("double-slit"); // "double-slit" | "orbital"
  const simCanvasRef = useRef(null);

  // Pick next fact adhering to strict non-repetition rules
  const pickNextFact = useCallback(() => {
    setIsTransitioning(true);
    setIsDeepDiveOpen(false);

    let seenIds = readStoredSeenIds();

    // If all facts have been seen, reset cycle
    if (seenIds.length >= QUANTUM_FACTS.length) {
      seenIds = [];
    }

    // Filter available unviewed facts
    const unseenFacts = QUANTUM_FACTS.filter((fact) => !seenIds.includes(fact.id));

    let chosenFact;
    if (unseenFacts.length > 0) {
      const randomIndex = Math.floor(Math.random() * unseenFacts.length);
      chosenFact = unseenFacts[randomIndex];
    } else {
      chosenFact = QUANTUM_FACTS[0];
    }

    const updatedSeen = [...seenIds, chosenFact.id];
    writeStoredSeenIds(updatedSeen);

    setCurrentFact(chosenFact);
    setSeenCount(updatedSeen.length);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 150);
  }, []);

  // Scientific 2D Waveform Monitor Simulation
  useEffect(() => {
    const canvas = simCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 380);
    let height = (canvas.height = 290);

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = 290;
      }
    };
    window.addEventListener("resize", handleResize);

    let t = 0;
    const renderSim = () => {
      t += 0.03;
      ctx.clearRect(0, 0, width, height);

      // Editorial warm parchment background for simulator
      ctx.fillStyle = "#F5F3EC";
      ctx.fillRect(0, 0, width, height);

      // Architectural grid lines
      ctx.strokeStyle = "rgba(40, 44, 49, 0.05)";
      ctx.lineWidth = 1;
      for (let x = 20; x < width; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 20; y < height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      if (simMode === "double-slit") {
        // Double-slit wave interference simulation
        const slit1Y = height * 0.42;
        const slit2Y = height * 0.58;
        const barrierX = width * 0.32;

        // Incoming plane waves
        ctx.strokeStyle = "rgba(56, 73, 54, 0.3)";
        ctx.lineWidth = 1.4;
        for (let x = 10; x < barrierX; x += 18) {
          const shift = (x + t * 24) % barrierX;
          ctx.beginPath();
          ctx.moveTo(shift, 20);
          ctx.lineTo(shift, height - 20);
          ctx.stroke();
        }

        // Barrier with two slits (warm slate charcoal)
        ctx.fillStyle = "#2A2E33";
        ctx.fillRect(barrierX - 4, 15, 8, slit1Y - 24);
        ctx.fillRect(barrierX - 4, slit1Y + 10, 8, slit2Y - slit1Y - 20);
        ctx.fillRect(barrierX - 4, slit2Y + 10, 8, height - slit2Y - 25);

        // Circular wave fronts propagating from slits
        const maxR = width - barrierX;
        for (let r = 0; r < maxR; r += 16) {
          const radius = (r + t * 20) % maxR;
          const alpha = Math.max(0, (1 - radius / maxR) * 0.4);

          // Slit 1 wave (forest green)
          ctx.beginPath();
          ctx.arc(barrierX, slit1Y, radius, -Math.PI * 0.45, Math.PI * 0.45);
          ctx.strokeStyle = `rgba(56, 73, 54, ${alpha})`;
          ctx.stroke();

          // Slit 2 wave (burnished copper)
          ctx.beginPath();
          ctx.arc(barrierX, slit2Y, radius, -Math.PI * 0.45, Math.PI * 0.45);
          ctx.strokeStyle = `rgba(189, 100, 60, ${alpha})`;
          ctx.stroke();
        }

        // Target Detection Screen at right edge
        const screenX = width - 24;
        ctx.fillStyle = "#2A2E33";
        ctx.fillRect(screenX, 20, 8, height - 40);

        // Intensity fringes on screen
        for (let y = 26; y < height - 26; y += 3) {
          const dy1 = y - slit1Y;
          const dy2 = y - slit2Y;
          const phaseDiff =
            (Math.sqrt(Math.pow(width - barrierX, 2) + dy1 * dy1) -
              Math.sqrt(Math.pow(width - barrierX, 2) + dy2 * dy2)) *
            0.35;
          const intensity = Math.pow(Math.cos(phaseDiff), 2);
          ctx.fillStyle = `rgba(189, 100, 60, ${intensity * 0.9})`;
          ctx.fillRect(screenX - intensity * 26, y, intensity * 26, 2.5);
        }
      } else {
        // Quantum Orbital Probability Cloud
        const cx = width * 0.5;
        const cy = height * 0.5;

        // Orbital Probability cloud dots
        for (let i = 0; i < 280; i++) {
          const theta = (i / 280) * Math.PI * 2 + t * 0.18;
          const rBase = 65 * Math.sin(2 * theta);
          const r = Math.abs(rBase) + Math.sin(i * 37 + t) * 14;
          const px = cx + Math.cos(theta) * r;
          const py = cy + Math.sin(theta) * r;

          const dotAlpha = 0.22 + Math.sin(i * 12 + t * 2) * 0.18;
          ctx.beginPath();
          ctx.arc(px, py, 1.4, 0, Math.PI * 2);
          ctx.fillStyle =
            i % 2 === 0
              ? `rgba(56, 73, 54, ${dotAlpha})`
              : `rgba(189, 100, 60, ${dotAlpha})`;
          ctx.fill();
        }

        // Nucleus
        ctx.beginPath();
        ctx.arc(cx, cy, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = "#BD643C";
        ctx.fill();
      }

      animId = requestAnimationFrame(renderSim);
    };

    animId = requestAnimationFrame(renderSim);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [simMode]);

  return (
    <section id="discovery" className="section-wrapper discovery-section">
      <div className="container">
        {/* Section Heading & Copy */}
        <div className="section-header">
          <div className="section-tag">
            <Sparkles size={14} />
            <span>Interactive Quantum Discovery</span>
          </div>
          <h2 className="section-title">Small things. Strange rules.</h2>
          <p className="section-desc">
            The world we experience is built on quantum rules that are often very different from our everyday intuition.
          </p>
        </div>

        {/* Mathematical Typesetting Benchmark Verification Strip */}
        <div className="math-benchmark-banner">
          <div className="math-benchmark-header">
            <span className="math-benchmark-title">
              <CheckCircle2 size={16} color="var(--color-copper)" />
              KaTeX Mathematical Typesetting Engine
            </span>
            <span className="math-benchmark-tag">Live Verified Equations</span>
          </div>
          <div className="math-benchmark-grid">
            <div className="math-benchmark-item">
              <span className="math-benchmark-label">Inline Mass–Energy</span>
              <MathView math="E = mc^2" inline />
            </div>
            <div className="math-benchmark-item">
              <span className="math-benchmark-label">Stationary Schrödinger Equation</span>
              <MathView math="\hat{H}\psi(x) = E\psi(x)" display />
            </div>
            <div className="math-benchmark-item">
              <span className="math-benchmark-label">Tunneling Wavevector Decay</span>
              <MathView math="\kappa = \frac{\sqrt{2m(V_0-E)}}{\hbar}" display />
            </div>
            <div className="math-benchmark-item">
              <span className="math-benchmark-label">Transmission Probability Ratio</span>
              <MathView math="T = \frac{J_{\mathrm{transmitted}}}{J_{\mathrm{incident}}}" display />
            </div>
          </div>
        </div>

        {/* Discovery Workspace Grid */}
        <div className="discovery-grid">
          {/* Left Column: Visual Wave-Particle 2D Monitor */}
          <div className="editorial-card discovery-sim-card">
            <div className="sim-header">
              <div className="sim-title-group">
                <span className="sim-indicator-dot" />
                <span className="sim-label">2D Theoretical Waveform Monitor</span>
              </div>
              <div className="sim-toggle-group">
                <button
                  onClick={() => setSimMode("double-slit")}
                  className={`sim-toggle-btn ${simMode === "double-slit" ? "active" : ""}`}
                  aria-label="Switch to Double Slit Interference"
                >
                  <Waves size={14} />
                  <span>Double-Slit Wave</span>
                </button>
                <button
                  onClick={() => setSimMode("orbital")}
                  className={`sim-toggle-btn ${simMode === "orbital" ? "active" : ""}`}
                  aria-label="Switch to Orbital Probability Cloud"
                >
                  <Atom size={14} />
                  <span>Probability Cloud</span>
                </button>
              </div>
            </div>

            <div className="sim-canvas-container">
              <canvas ref={simCanvasRef} className="sim-canvas" />
            </div>

            <div className="sim-caption">
              <span className="sim-mode-tag">
                {simMode === "double-slit" ? (
                  <span>Interference Waveform: <MathView math="\psi_1 + \psi_2" inline /></span>
                ) : (
                  <span>Probability Density: <MathView math="|\psi(r)|^2" inline /></span>
                )}
              </span>
              <p className="sim-mode-desc">
                {simMode === "double-slit"
                  ? "Wave interference fringes created by phase superpositions passing through dual apertures. (Illustrative 2D Model)"
                  : "Continuous 2D cross-section depicting where bound electrons are statistically predicted to localize."}
              </p>
            </div>
          </div>

          {/* Right Column: Curated Quantum Fact Card */}
          <div className="editorial-card fact-card">
            {/* Rotation Progress & Concept Pill */}
            <div className="fact-card-top">
              <span className="fact-concept-pill">
                {currentFact?.concept || "Quantum Principle"}
              </span>
              <div className="fact-progress-badge" title="Cycle resets after all 22 facts are discovered">
                <Eye size={13} color="var(--color-copper)" />
                <span>Fact {seenCount} of {QUANTUM_FACTS.length} Discovered</span>
              </div>
            </div>

            {/* Fact Content */}
            <div className={`fact-body ${isTransitioning ? "fade-transition" : ""}`}>
              <h3 className="fact-title font-serif">{currentFact?.title}</h3>
              <p className="fact-summary">{currentFact?.summary}</p>

              {/* KaTeX Mathematical Formula Box */}
              {currentFact?.formula && (
                <div className="fact-formula-box">
                  <div className="formula-header-row">
                    <span className="formula-label">{currentFact.formulaLabel}</span>
                    <span className="formula-engine-tag">KaTeX Rendered</span>
                  </div>
                  <div className="formula-render-area">
                    <MathView math={currentFact.formula} display />
                  </div>
                </div>
              )}

              {/* Deep Dive Collapsible Section */}
              {isDeepDiveOpen && (
                <div className="fact-deep-dive" id="fact-deep-dive-panel">
                  <h4 className="deep-dive-heading">Scientific Mechanism</h4>
                  <div className="deep-dive-text">
                    <MathText text={currentFact?.deepDive} />
                  </div>
                </div>
              )}
            </div>

            {/* Fact Card Actions */}
            <div className="fact-actions">
              <button
                onClick={() => setIsDeepDiveOpen(!isDeepDiveOpen)}
                className="btn-deep-dive"
                aria-expanded={isDeepDiveOpen}
                aria-controls="fact-deep-dive-panel"
              >
                <BookOpen size={16} />
                <span>{isDeepDiveOpen ? "Show Less" : "Explore deeper"}</span>
                {isDeepDiveOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              <button
                onClick={pickNextFact}
                className="btn-next-fact"
                id="discover-another-fact-btn"
                aria-label="Discover another quantum fact without repetition"
              >
                <RefreshCw size={15} className={isTransitioning ? "spin-fast" : ""} />
                <span>Discover another fact</span>
              </button>
            </div>

            {/* Authoritative Reference Link */}
            {currentFact?.reference && (
              <div className="fact-reference-bar">
                <span className="ref-prefix">Authoritative Source:</span>
                <a
                  href={currentFact.reference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ref-link"
                >
                  <span>{currentFact.reference.name}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .discovery-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 28px;
          align-items: stretch;
        }

        /* Sim Card */
        .discovery-sim-card {
          padding: 24px;
          display: flex;
          flex-direction: column;
          background: var(--color-surface);
        }

        .sim-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .sim-title-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sim-indicator-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-copper);
        }

        .sim-label {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--color-graphite);
          font-weight: 600;
        }

        .sim-toggle-group {
          display: flex;
          background: var(--color-surface-muted);
          padding: 3px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-stone);
          gap: 4px;
        }

        .sim-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          border-radius: 5px;
          font-size: 0.76rem;
          font-family: var(--font-mono);
          color: var(--color-text-secondary);
          transition: all 0.2s ease;
        }

        .sim-toggle-btn.active {
          background: var(--color-surface);
          color: var(--color-graphite);
          border: 1px solid var(--border-stone);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .sim-canvas-container {
          width: 100%;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #F5F3EC;
          border: 1px solid var(--border-stone);
        }

        .sim-canvas {
          display: block;
          width: 100%;
          height: 250px;
        }

        .sim-caption {
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid var(--border-stone-light);
        }

        .sim-mode-tag {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: var(--color-copper);
          margin-bottom: 4px;
          font-weight: 600;
        }

        .sim-mode-desc {
          font-size: 0.88rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        /* Fact Card */
        .fact-card {
          padding: 32px;
          display: flex;
          flex-direction: column;
          background: var(--color-surface);
        }

        .fact-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .fact-concept-pill {
          padding: 4px 12px;
          border-radius: var(--radius-full);
          background: var(--color-forest-subtle);
          border: 1px solid var(--color-forest-border);
          color: var(--color-forest);
          font-size: 0.78rem;
          font-family: var(--font-mono);
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .fact-progress-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-family: var(--font-mono);
          color: var(--color-copper);
          background: var(--color-copper-subtle);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-copper-border);
        }

        .fact-body {
          flex: 1;
          transition: opacity 0.15s ease;
        }

        .fact-body.fade-transition {
          opacity: 0.35;
        }

        .fact-title {
          font-size: clamp(1.4rem, 2.5vw, 1.85rem);
          color: var(--color-graphite);
          font-weight: 600;
          margin-bottom: 14px;
          line-height: 1.25;
        }

        .fact-summary {
          font-size: 1.05rem;
          color: var(--color-text-secondary);
          line-height: 1.65;
          margin-bottom: 20px;
        }

        .fact-formula-box {
          padding: 16px 20px;
          background: var(--color-surface-muted);
          border-radius: var(--radius-md);
          border: 1px solid var(--border-stone);
          margin-bottom: 20px;
        }

        .formula-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .formula-label {
          font-size: 0.75rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .formula-engine-tag {
          font-size: 0.7rem;
          font-family: var(--font-mono);
          color: var(--color-copper);
          background: var(--color-surface);
          border: 1px solid var(--border-stone-light);
          padding: 1px 6px;
          border-radius: 4px;
        }

        .formula-render-area {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 8px 0;
        }

        .fact-deep-dive {
          margin-top: 16px;
          padding: 18px;
          background: var(--color-surface-muted);
          border-left: 3px solid var(--color-forest);
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
        }

        .deep-dive-heading {
          font-size: 0.82rem;
          font-family: var(--font-mono);
          color: var(--color-forest);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }

        .deep-dive-text {
          font-size: 0.95rem;
          color: var(--color-text-secondary);
          line-height: 1.65;
        }

        .fact-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid var(--border-stone-light);
          flex-wrap: wrap;
        }

        .btn-deep-dive {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: var(--radius-full);
          background: var(--color-surface-muted);
          border: 1px solid var(--border-stone);
          color: var(--color-forest);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-deep-dive:hover {
          background: var(--color-forest-subtle);
          border-color: var(--color-forest);
        }

        .btn-next-fact {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: var(--radius-full);
          background: var(--color-copper);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(189, 100, 60, 0.25);
        }

        .btn-next-fact:hover {
          background: var(--color-copper-hover);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(189, 100, 60, 0.35);
        }

        .fact-reference-bar {
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
        }

        .ref-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: var(--color-copper);
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: opacity 0.2s ease;
        }

        .ref-link:hover {
          opacity: 0.8;
        }

        .spin-fast {
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 900px) {
          .discovery-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
