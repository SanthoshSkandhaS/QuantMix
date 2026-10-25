import React, { useState } from "react";
import { Sparkles, Bot, MessageSquare, ArrowRight, CornerDownRight, HelpCircle, Check, Sliders } from "lucide-react";

/**
 * QuAntIPreview
 * Section introducing future AI Companion:
 * - Exact Name: QuAntI
 * - Heading: "Meet QuAntI."
 * - Description: "Ask anything. Understand the strange. Discover what to change next."
 * - Example Question Chips:
 *   1. “Why is this quantum?”
 *   2. “Explain it simply.”
 *   3. “What should I change?”
 *   4. “Show me the deeper physics.”
 * - Sample Dialogue preview demonstrating respectful, 1-3 sentence concise answers
 *   and model parameter recommendations.
 * - Clean component boundary for future server-side AI integration.
 */
export default function QuAntIPreview() {
  const [selectedChipIndex, setSelectedChipIndex] = useState(0);

  const sampleConversations = [
    {
      chip: "Why is this quantum?",
      question: "Why is my bedroom chair solid if atoms are 99.999% empty space?",
      answer:
        "Your chair feels solid because electrons are fermions that obey the Pauli exclusion principle. When atoms are pressed together, their electron clouds cannot share the same quantum state, producing a powerful quantum degeneracy resistance that pushes back against your weight.",
      followUp: "In future milestones, QuAntI will let you dial down the Pauli exclusion resistance to see the chair compress!",
      parameterTip: null
    },
    {
      chip: "Explain it simply.",
      question: "What actually happens during quantum tunneling?",
      answer:
        "Imagine tossing a tennis ball at a brick wall. In our everyday world, it bounces back every time; but if the ball were an electron behaving like a wave, a small fraction of the wave leaks through to the other side, giving the particle a real chance of simply appearing on the far side of the wall.",
      followUp: "This is how USB flash drives store memories and how the Sun produces sunlight.",
      parameterTip: null
    },
    {
      chip: "What should I change?",
      question: "I want to increase the tunneling transmission rate in the lab. What should I change?",
      answer:
        "I recommend decreasing the barrier width (w) or lowering the barrier potential (V₀). Because quantum tunneling probability decays exponentially with thickness (T ∝ e^(-2κw)), narrowing the barrier from 2.0 nm to 0.8 nm will boost your transmission rate by over a thousand-fold.",
      followUp: null,
      parameterTip: {
        param: "Barrier Width (w)",
        suggestion: "Reduce from 2.0 nm → 0.8 nm",
        expectedOutcome: "Transmission jumps from 0.04% to ~42%"
      }
    },
    {
      chip: "Show me the deeper physics.",
      question: "Where does the exponential decay inside a potential barrier come from mathematically?",
      answer:
        "Inside a potential barrier where V₀ > E, the time-independent Schrödinger equation becomes d²ψ/dx² = κ²ψ, where κ = √(2m(V₀ - E)) / ℏ. Because the kinetic energy is classically negative, the wavevector k becomes imaginary (k = iκ), transforming oscillating complex exponentials e^(ikx) into real decaying exponentials e^(-κx).",
      followUp: "When the boundary conditions at x=0 and x=w are matched, the transmitted flux retains amplitude proportional to e^(-2κw).",
      parameterTip: null
    }
  ];

  const currentSample = sampleConversations[selectedChipIndex];

  return (
    <section id="quanti" className="section-wrapper quanti-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag" style={{ borderColor: "rgba(155, 140, 255, 0.4)", color: "var(--color-violet)" }}>
            <Bot size={14} />
            <span>AI Companion Architecture</span>
          </div>
          <h2 className="section-title">Meet QuAntI.</h2>
          <p className="section-desc">
            Ask anything. Understand the strange. Discover what to change next.
          </p>
        </div>

        {/* QuAntI Interactive Interface Box */}
        <div className="glass-card quanti-card">
          {/* Top Assistant Status Strip */}
          <div className="quanti-status-bar">
            <div className="quanti-identity">
              {/* Animated Quantum Orbital Avatar */}
              <div className="quanti-avatar">
                <span className="quanti-core-dot" />
                <span className="quanti-ring ring-1" />
                <span className="quanti-ring ring-2" />
              </div>
              <div className="quanti-info">
                <div className="quanti-name-row">
                  <span className="quanti-name">QuAntI</span>
                  <span className="quanti-badge">Planned AI Guide</span>
                </div>
                <span className="quanti-subtext">Quantum Intuition & Scientific Exploration Engine</span>
              </div>
            </div>

            <div className="quanti-planned-tag">
              <Sparkles size={13} color="var(--color-violet)" />
              <span>Future AI Integration Preview</span>
            </div>
          </div>

          {/* Interactive Question Chips */}
          <div className="chips-container">
            <span className="chips-label">Sample Questions & Prompts:</span>
            <div className="chips-list" role="tablist">
              {sampleConversations.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedChipIndex(idx)}
                  className={`question-chip ${selectedChipIndex === idx ? "active" : ""}`}
                  role="tab"
                  aria-selected={selectedChipIndex === idx}
                >
                  <MessageSquare size={13} />
                  <span>“{item.chip}”</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sample Dialogue Box */}
          <div className="dialogue-box">
            {/* User Message */}
            <div className="chat-bubble user-bubble">
              <div className="bubble-author">You</div>
              <p className="bubble-text">“{currentSample.question}”</p>
            </div>

            {/* QuAntI Response */}
            <div className="chat-bubble quanti-bubble">
              <div className="bubble-author">
                <Bot size={14} color="var(--color-teal)" />
                <span>QuAntI</span>
              </div>
              <p className="bubble-text">{currentSample.answer}</p>

              {/* Parameter Recommendation Card if present */}
              {currentSample.parameterTip && (
                <div className="parameter-recommendation-card">
                  <div className="param-rec-header">
                    <Sliders size={14} color="var(--color-teal)" />
                    <span>Experimental Parameter Suggestion</span>
                  </div>
                  <div className="param-rec-grid">
                    <div>
                      <span className="param-k">Target Constant:</span>
                      <strong className="param-v">{currentSample.parameterTip.param}</strong>
                    </div>
                    <div>
                      <span className="param-k">Action:</span>
                      <strong className="param-v" style={{ color: "var(--color-teal)" }}>{currentSample.parameterTip.suggestion}</strong>
                    </div>
                    <div>
                      <span className="param-k">Anticipated Result:</span>
                      <span className="param-v">{currentSample.parameterTip.expectedOutcome}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Follow-up / Deeper Insight */}
              {currentSample.followUp && (
                <div className="bubble-followup">
                  <CornerDownRight size={13} color="var(--color-violet)" className="followup-icon" />
                  <span>{currentSample.followUp}</span>
                </div>
              )}
            </div>
          </div>

          {/* QuAntI Core Capabilities Cards */}
          <div className="quanti-features-strip">
            <div className="q-feature">
              <span className="q-feat-num">01</span>
              <h5>Context-Aware Physics</h5>
              <p>Understands your active 3D environment, the object in your hand, and current quantum model parameters.</p>
            </div>

            <div className="q-feature">
              <span className="q-feat-num">02</span>
              <h5>Crisp Explanations</h5>
              <p>Defaults to 1–3 sentence clarity. Explains deeper mathematical mechanisms only when asked.</p>
            </div>

            <div className="q-feature">
              <span className="q-feat-num">03</span>
              <h5>Actionable Parameter Tips</h5>
              <p>Tells you exactly which physical variable to adjust in the Quantum Lab to achieve your target outcome.</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .quanti-card {
          padding: 36px;
          background: rgba(17, 27, 46, 0.85);
          border: 1px solid rgba(155, 140, 255, 0.3);
        }

        .quanti-status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--border-subtle);
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .quanti-identity {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        /* Animated Avatar */
        .quanti-avatar {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(11, 16, 32, 0.9);
          border: 1.5px solid var(--color-teal);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(53, 214, 208, 0.35);
        }

        .quanti-core-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--color-teal);
          box-shadow: 0 0 10px var(--color-teal);
          animation: corePulse 2.5s infinite;
        }

        @keyframes corePulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }

        .quanti-ring {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          pointer-events: none;
        }

        .ring-1 {
          border: 1px dashed rgba(155, 140, 255, 0.5);
          animation: ringSpin 8s linear infinite;
        }

        .ring-2 {
          inset: -8px;
          border: 1px solid rgba(53, 214, 208, 0.25);
          animation: ringSpin 12s linear infinite reverse;
        }

        @keyframes ringSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .quanti-name-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .quanti-name {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--color-text-main);
          letter-spacing: -0.01em;
        }

        .quanti-badge {
          font-size: 0.72rem;
          font-family: var(--font-mono);
          padding: 2px 8px;
          border-radius: var(--radius-full);
          background: rgba(155, 140, 255, 0.15);
          color: var(--color-violet);
          border: 1px solid rgba(155, 140, 255, 0.3);
          font-weight: 600;
        }

        .quanti-subtext {
          font-size: 0.82rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
        }

        .quanti-planned-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-family: var(--font-mono);
          padding: 6px 12px;
          border-radius: var(--radius-full);
          background: rgba(11, 16, 32, 0.7);
          border: 1px solid var(--border-subtle);
          color: var(--color-text-secondary);
        }

        /* Chips */
        .chips-container {
          margin-bottom: 24px;
        }

        .chips-label {
          display: block;
          font-size: 0.78rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .chips-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .question-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          background: rgba(11, 16, 32, 0.6);
          border: 1px solid var(--border-subtle);
          color: var(--color-text-secondary);
          font-size: 0.88rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .question-chip:hover {
          color: var(--color-text-main);
          border-color: rgba(53, 214, 208, 0.4);
          background: rgba(17, 27, 46, 0.8);
        }

        .question-chip.active {
          background: rgba(53, 214, 208, 0.12);
          border-color: var(--color-teal);
          color: var(--color-teal);
          font-weight: 600;
          box-shadow: 0 0 15px rgba(53, 214, 208, 0.2);
        }

        /* Dialogue */
        .dialogue-box {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 32px;
        }

        .chat-bubble {
          padding: 20px 24px;
          border-radius: var(--radius-md);
        }

        .user-bubble {
          background: rgba(11, 16, 32, 0.7);
          border: 1px solid var(--border-subtle);
          align-self: flex-start;
          max-width: 85%;
        }

        .quanti-bubble {
          background: rgba(22, 36, 61, 0.75);
          border: 1px solid rgba(53, 214, 208, 0.25);
          border-left: 3px solid var(--color-teal);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .bubble-author {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .bubble-text {
          font-size: 1.05rem;
          color: var(--color-text-main);
          line-height: 1.6;
        }

        .parameter-recommendation-card {
          margin-top: 16px;
          padding: 14px 18px;
          background: rgba(11, 16, 32, 0.85);
          border: 1px solid rgba(53, 214, 208, 0.3);
          border-radius: var(--radius-sm);
        }

        .param-rec-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          font-family: var(--font-mono);
          color: var(--color-teal);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 10px;
        }

        .param-rec-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          font-size: 0.84rem;
        }

        .param-k {
          display: block;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
          font-size: 0.72rem;
        }

        .param-v {
          color: var(--color-text-main);
        }

        .bubble-followup {
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid rgba(169, 182, 207, 0.1);
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.9rem;
          color: var(--color-text-secondary);
        }

        .followup-icon {
          flex-shrink: 0;
          margin-top: 3px;
        }

        /* 3 feature boxes below dialogue */
        .quanti-features-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          padding-top: 24px;
          border-top: 1px solid var(--border-subtle);
        }

        .q-feature {
          background: rgba(11, 16, 32, 0.5);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          padding: 18px;
        }

        .q-feat-num {
          font-family: var(--font-mono);
          font-size: 0.74rem;
          color: var(--color-violet);
          font-weight: 700;
          display: block;
          margin-bottom: 6px;
        }

        .q-feature h5 {
          font-size: 0.96rem;
          color: var(--color-text-main);
          margin-bottom: 6px;
        }

        .q-feature p {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .quanti-features-strip {
            grid-template-columns: 1fr;
          }
          .param-rec-grid {
            grid-template-columns: 1fr;
          }
          .user-bubble {
            max-width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
