import React, { useState, useEffect, useCallback, useRef } from "react";
import { QUANTUM_FACTS } from "../data/quantumFacts";
import { Sparkles, RefreshCw, BookOpen, ExternalLink, ChevronDown, ChevronUp, Eye, Waves, Atom } from "lucide-react";

const STORAGE_KEY = "quantmix_seen_fact_ids_v1";

/**
 * DiscoverySection
 * - Heading: "Small things. Strange rules."
 * - Description: "The world we experience is built on quantum rules that are often very different from our everyday intuition."
 * - Strict non-repeating random selection with localStorage rotation memory
 * - Curated 22 facts with beginner summary, deep dive, formula, and authoritative source URLs
 * - Interactive double-slit wave interference & probability cloud simulator beside the fact card
 */
export default function DiscoverySection() {
  const [currentFact, setCurrentFact] = useState(null);
  const [seenCount, setSeenCount] = useState(0);
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [simMode, setSimMode] = useState("double-slit"); // "double-slit" | "orbital"
  const simCanvasRef = useRef(null);

  // Helper to safely read seen IDs from localStorage
  const getStoredSeenIds = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Filter only valid IDs in our current facts library
        return parsed.filter((id) => QUANTUM_FACTS.some((f) => f.id === id));
      }
    } catch {
      // Storage unavailable or corrupted
    }
    return [];
  }, []);

  // Helper to safely write seen IDs
  const saveSeenIds = (ids) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // Storage unavailable fallback
    }
  };

  // Select next fact adhering to strict non-repetition rules
  const pickNextFact = useCallback(() => {
    setIsTransitioning(true);
    setIsDeepDiveOpen(false);

    setTimeout(() => {
      let seenIds = getStoredSeenIds();

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
        // Fallback safety
        chosenFact = QUANTUM_FACTS[0];
      }

      // Update seen list
      const updatedSeen = [...seenIds, chosenFact.id];
      saveSeenIds(updatedSeen);

      setCurrentFact(chosenFact);
      setSeenCount(updatedSeen.length);
      setIsTransitioning(false);
    }, 200);
  }, [getStoredSeenIds]);

  // Initial load fact selection
  useEffect(() => {
    pickNextFact();
  }, [pickNextFact]);

  // Interactive Mini Scientific Canvas Simulation
  useEffect(() => {
    const canvas = simCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 380);
    let height = (canvas.height = 300);

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = 300;
      }
    };
    window.addEventListener("resize", handleResize);

    let t = 0;
    const renderSim = () => {
      t += 0.03;
      ctx.clearRect(0, 0, width, height);

      // Dark background with subtle grid
      ctx.fillStyle = "#0B1020";
      ctx.fillRect(0, 0, width, height);

      if (simMode === "double-slit") {
        // Double-slit wave interference simulation
        const slit1Y = height * 0.42;
        const slit2Y = height * 0.58;
        const barrierX = width * 0.32;

        // Incoming plane waves
        ctx.strokeStyle = "rgba(53, 214, 208, 0.25)";
        ctx.lineWidth = 1.5;
        for (let x = 10; x < barrierX; x += 18) {
          const shift = (x + t * 25) % barrierX;
          ctx.beginPath();
          ctx.moveTo(shift, 20);
          ctx.lineTo(shift, height - 20);
          ctx.stroke();
        }

        // Barrier with two slits
        ctx.fillStyle = "#16243D";
        ctx.fillRect(barrierX - 4, 15, 8, slit1Y - 25);
        ctx.fillRect(barrierX - 4, slit1Y + 10, 8, slit2Y - slit1Y - 20);
        ctx.fillRect(barrierX - 4, slit2Y + 10, 8, height - slit2Y - 25);

        // Circular wave fronts propagating from slits
        const maxR = width - barrierX;
        for (let r = 0; r < maxR; r += 16) {
          const radius = (r + t * 20) % maxR;
          const alpha = Math.max(0, (1 - radius / maxR) * 0.45);

          // Slit 1 wave
          ctx.beginPath();
          ctx.arc(barrierX, slit1Y, radius, -Math.PI * 0.45, Math.PI * 0.45);
          ctx.strokeStyle = `rgba(53, 214, 208, ${alpha})`;
          ctx.stroke();

          // Slit 2 wave
          ctx.beginPath();
          ctx.arc(barrierX, slit2Y, radius, -Math.PI * 0.45, Math.PI * 0.45);
          ctx.strokeStyle = `rgba(155, 140, 255, ${alpha})`;
          ctx.stroke();
        }

        // Target Detection Screen at right edge
        const screenX = width - 24;
        ctx.fillStyle = "rgba(17, 27, 46, 0.8)";
        ctx.fillRect(screenX, 20, 10, height - 40);

        // Intensity fringes on screen
        for (let y = 30; y < height - 30; y += 3) {
          const dy1 = y - slit1Y;
          const dy2 = y - slit2Y;
          const phaseDiff = (Math.sqrt(Math.pow(width - barrierX, 2) + dy1 * dy1) - Math.sqrt(Math.pow(width - barrierX, 2) + dy2 * dy2)) * 0.35;
          const intensity = Math.pow(Math.cos(phaseDiff), 2);
          ctx.fillStyle = `rgba(53, 214, 208, ${intensity * 0.9})`;
          ctx.fillRect(screenX - intensity * 26, y, intensity * 26, 2.5);
        }
      } else {
        // Quantum Orbital Probability Cloud
        const cx = width * 0.5;
        const cy = height * 0.5;

        // Orbital Probability cloud dots
        for (let i = 0; i < 280; i++) {
          const theta = (i / 280) * Math.PI * 2 + t * 0.2;
          const rBase = 65 * Math.sin(2 * theta);
          const r = Math.abs(rBase) + (Math.sin(i * 37 + t) * 14);
          const px = cx + Math.cos(theta) * r;
          const py = cy + Math.sin(theta) * r;

          const dotAlpha = 0.25 + (Math.sin(i * 12 + t * 2) * 0.2);
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? `rgba(53, 214, 208, ${dotAlpha})` : `rgba(155, 140, 255, ${dotAlpha})`;
          ctx.fill();
        }

        // Nucleus
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#FF8B78";
        ctx.shadowColor = "#FF8B78";
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
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

        {/* Discovery Workspace Grid */}
        <div className="discovery-grid">
          {/* Left Column: Visual Wave-Particle Simulator */}
          <div className="glass-card discovery-sim-card">
            <div className="sim-header">
              <div className="sim-title-group">
                <span className="sim-indicator-dot" />
                <span className="sim-label">Live Quantum Waveform Monitor</span>
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
                {simMode === "double-slit" ? "Interference Pattern ψ₁ + ψ₂" : "Orbital Density |ψ(r)|²"}
              </span>
              <p className="sim-mode-desc">
                {simMode === "double-slit"
                  ? "Wave interference fringes created by phase superpositions passing through dual apertures."
                  : "Continuous 3D probability cloud depicting where electrons are most likely to materialize."}
              </p>
            </div>
          </div>

          {/* Right Column: Curated Quantum Fact Card */}
          <div className="glass-card fact-card">
            {/* Rotation Progress & Tag */}
            <div className="fact-card-top">
              <span className="fact-concept-pill">
                {currentFact?.concept || "Quantum Principle"}
              </span>
              <div className="fact-progress-badge" title="Cycle resets after all 22 facts are discovered">
                <Eye size={13} color="var(--color-teal)" />
                <span>Fact {seenCount} of {QUANTUM_FACTS.length} Discovered</span>
              </div>
            </div>

            {/* Fact Content with Smooth Transition */}
            <div className={`fact-body ${isTransitioning ? "fade-out" : "fade-in"}`}>
              <h3 className="fact-title">{currentFact?.title}</h3>
              <p className="fact-summary">{currentFact?.summary}</p>

              {/* Mathematical / Formula Strip */}
              {currentFact?.formula && (
                <div className="fact-formula-box">
                  <span className="formula-label">{currentFact.formulaLabel}</span>
                  <code className="formula-code">{currentFact.formula}</code>
                </div>
              )}

              {/* Deep Dive Collapsible Section */}
              {isDeepDiveOpen && (
                <div className="fact-deep-dive" id="fact-deep-dive-panel">
                  <h4 className="deep-dive-heading">Scientific Mechanism</h4>
                  <p className="deep-dive-text">{currentFact?.deepDive}</p>
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
          background: rgba(17, 27, 46, 0.85);
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
          background: var(--color-teal);
          box-shadow: 0 0 8px var(--color-teal);
          animation: dotPulse 2s infinite;
        }

        .sim-label {
          font-family: var(--font-mono);
          font-size: 0.82rem;
          color: var(--color-text-main);
          font-weight: 600;
        }

        .sim-toggle-group {
          display: flex;
          background: rgba(11, 16, 32, 0.7);
          padding: 3px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
          gap: 4px;
        }

        .sim-toggle-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 0.76rem;
          font-family: var(--font-mono);
          color: var(--color-text-secondary);
          transition: all 0.2s ease;
        }

        .sim-toggle-btn.active {
          background: rgba(53, 214, 208, 0.15);
          color: var(--color-teal);
          border: 1px solid rgba(53, 214, 208, 0.3);
        }

        .sim-canvas-container {
          width: 100%;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #0B1020;
          border: 1px solid rgba(169, 182, 207, 0.1);
        }

        .sim-canvas {
          display: block;
          width: 100%;
          height: 250px;
        }

        .sim-caption {
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid var(--border-subtle);
        }

        .sim-mode-tag {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: var(--color-violet);
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
          background: rgba(17, 27, 46, 0.85);
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
          background: rgba(155, 140, 255, 0.12);
          border: 1px solid rgba(155, 140, 255, 0.3);
          color: var(--color-violet);
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
          color: var(--color-teal);
          background: rgba(53, 214, 208, 0.08);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(53, 214, 208, 0.2);
        }

        .fact-body {
          flex: 1;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .fact-body.fade-out {
          opacity: 0;
          transform: translateY(6px);
        }

        .fact-body.fade-in {
          opacity: 1;
          transform: translateY(0);
        }

        .fact-title {
          font-size: clamp(1.4rem, 2.5vw, 1.85rem);
          color: var(--color-text-main);
          font-weight: 700;
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
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          background: rgba(11, 16, 32, 0.75);
          border-radius: var(--radius-md);
          border: 1px solid rgba(53, 214, 208, 0.2);
          margin-bottom: 20px;
        }

        .formula-label {
          font-size: 0.78rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
          text-transform: uppercase;
        }

        .formula-code {
          font-family: var(--font-mono);
          font-size: 1rem;
          color: var(--color-teal);
          font-weight: 600;
        }

        .fact-deep-dive {
          margin-top: 16px;
          padding: 18px;
          background: rgba(155, 140, 255, 0.06);
          border-left: 3px solid var(--color-violet);
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
          animation: deepDiveSlide 0.3s ease;
        }

        @keyframes deepDiveSlide {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .deep-dive-heading {
          font-size: 0.88rem;
          font-family: var(--font-mono);
          color: var(--color-violet);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 8px;
        }

        .deep-dive-text {
          font-size: 0.95rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
        }

        .fact-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid var(--border-subtle);
          flex-wrap: wrap;
        }

        .btn-deep-dive {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: var(--radius-full);
          background: rgba(155, 140, 255, 0.1);
          border: 1px solid rgba(155, 140, 255, 0.3);
          color: var(--color-violet);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-deep-dive:hover {
          background: rgba(155, 140, 255, 0.2);
          border-color: var(--color-violet);
        }

        .btn-next-fact {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, rgba(53, 214, 208, 0.2), rgba(17, 27, 46, 0.8));
          border: 1px solid var(--color-teal);
          color: var(--color-text-main);
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 0 15px rgba(53, 214, 208, 0.2);
        }

        .btn-next-fact:hover {
          background: var(--color-teal);
          color: var(--color-midnight);
          box-shadow: 0 0 25px rgba(53, 214, 208, 0.4);
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
          color: var(--color-teal);
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
