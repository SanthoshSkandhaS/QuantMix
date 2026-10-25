import React, { useState } from "react";
import { Sparkles, Bot, MessageSquare, CornerDownRight, Sliders } from "lucide-react";
import { MathText } from "./MathView";

/**
 * QuAntIPreview
 * Section introducing future AI Companion:
 * - Exact Name: QuAntI
 * - Heading: "Meet QuAntI."
 * - Description: "Ask anything. Understand the strange. Discover what to change next."
 * - KaTeX mathematical typesetting for explanations
 * - Scientifically consistent numerical claims matching the 1D barrier solver
 * - Restyled in the Scientific-Editorial design system
 */
export default function QuAntIPreview() {
  const [selectedChipIndex, setSelectedChipIndex] = useState(0);

  const sampleConversations = [
    {
      chip: "Why is this quantum?",
      question: "Why is my bedroom chair solid if atoms are 99.999% empty space?",
      answer:
        "Your chair feels solid because electrons are fermions that obey the Pauli exclusion principle. When atoms are pressed together, their electron wavefunctions cannot occupy identical quantum states, producing a powerful quantum degeneracy pressure that supports your weight.",
      followUp: "In future milestones, QuAntI will allow you to dial down the Pauli exclusion resistance to observe how everyday matter compresses.",
      parameterTip: null
    },
    {
      chip: "Explain it simply.",
      question: "What actually happens during quantum tunneling?",
      answer:
        "Imagine throwing a tennis ball at a concrete wall. In classical physics, it reflects every time. But when an electron behaves like a wave, its probability amplitude does not abruptly end at the surface; a finite evanescent tail penetrates through the barrier, giving the particle a non-zero chance of appearing on the far side.",
      followUp: "This wave property enables NAND flash memory cells in smartphones to trap charge without mechanical wear.",
      parameterTip: null
    },
    {
      chip: "What should I change?",
      question: "I want to increase the tunneling transmission rate in the lab. What should I change?",
      answer:
        "Reduce the barrier width \\(w\\) or decrease the barrier potential \\(V_0\\). Because quantum transmission decays exponentially as \\(T \\approx e^{-2\\kappa w}\\), decreasing width from 2.2 nm to 0.8 nm increases transmission by over a thousand-fold.",
      followUp: null,
      parameterTip: {
        param: "Barrier Width (w)",
        suggestion: "Reduce from 2.2 nm → 0.8 nm",
        expectedOutcome: "Transmission jumps from 0.04% to ~42%"
      }
    },
    {
      chip: "Show me the deeper physics.",
      question: "Where does the exponential decay inside a potential barrier come from mathematically?",
      answer:
        "Inside a rectangular barrier where \\(V_0 > E\\), the stationary Schrödinger equation is \\(\\frac{d^2\\psi}{dx^2} = \\kappa^2\\psi\\), where \\(\\kappa = \\frac{\\sqrt{2m(V_0 - E)}}{\\hbar}\\). Because kinetic energy is classically negative, the wavenumber becomes imaginary (\\(k = i\\kappa\\)), converting oscillating phase exponentials \\(e^{ikx}\\) into real decaying exponentials \\(e^{-\\kappa x}\\).",
      followUp: "When matching boundary wavefunctions at \\(x=0\\) and \\(x=w\\), the transmitted probability current retains an amplitude proportional to \\(e^{-2\\kappa w}\\).",
      parameterTip: null
    }
  ];

  const currentSample = sampleConversations[selectedChipIndex];

  return (
    <section id="quanti" className="section-wrapper quanti-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Bot size={14} />
            <span>AI Companion Architecture</span>
          </div>
          <h2 className="section-title">Meet QuAntI.</h2>
          <p className="section-desc">
            Ask anything. Understand the strange. Discover what to change next.
          </p>
        </div>

        {/* QuAntI Interactive Interface Box */}
        <div className="editorial-card quanti-card">
          {/* Top Assistant Status Strip */}
          <div className="quanti-status-bar">
            <div className="quanti-identity">
              {/* Editorial Scientific Emblem Avatar */}
              <div className="quanti-avatar">
                <span className="quanti-core-dot" />
                <span className="quanti-ring ring-1" />
                <span className="quanti-ring ring-2" />
              </div>
              <div className="quanti-info">
                <div className="quanti-name-row">
                  <span className="quanti-name">QuAntI</span>
                  <span className="quanti-badge">Planned Companion Guide</span>
                </div>
                <span className="quanti-subtext">Quantum Intuition & Scientific Dialogue Engine</span>
              </div>
            </div>

            <div className="quanti-planned-tag">
              <Sparkles size={13} color="var(--color-copper)" />
              <span>Future AI Integration Preview</span>
            </div>
          </div>

          {/* Sample Prompts Chips */}
          <div className="quanti-chips-wrapper">
            <span className="chips-label">Sample Questions:</span>
            <div className="chips-row">
              {sampleConversations.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedChipIndex(idx)}
                  className={`quanti-chip-btn ${selectedChipIndex === idx ? "active" : ""}`}
                  aria-label={`Show dialogue for ${item.chip}`}
                >
                  <MessageSquare size={13} />
                  <span>“{item.chip}”</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dialogue Display Box */}
          <div className="quanti-dialogue-panel">
            {/* User Question Bubble */}
            <div className="dialogue-row user-row">
              <div className="dialogue-bubble user-bubble">
                <span className="bubble-speaker">You</span>
                <p className="bubble-text">{currentSample.question}</p>
              </div>
            </div>

            {/* QuAntI Answer Bubble */}
            <div className="dialogue-row ai-row">
              <div className="dialogue-bubble ai-bubble">
                <div className="ai-bubble-header">
                  <span className="bubble-speaker">QuAntI</span>
                  <span className="verified-pill">Physics Grounded</span>
                </div>
                <div className="bubble-text">
                  <MathText text={currentSample.answer} />
                </div>

                {/* Follow-up Note */}
                {currentSample.followUp && (
                  <div className="dialogue-followup">
                    <CornerDownRight size={14} className="followup-icon" />
                    <span><MathText text={currentSample.followUp} /></span>
                  </div>
                )}

                {/* Recommended Model Parameter Action Tip */}
                {currentSample.parameterTip && (
                  <div className="parameter-recommendation-box">
                    <div className="param-header">
                      <Sliders size={14} color="var(--color-copper)" />
                      <span className="param-title">Lab Parameter Recommendation:</span>
                    </div>
                    <div className="param-content">
                      <div className="param-detail">
                        <span className="param-key">{currentSample.parameterTip.param}:</span>
                        <span className="param-action">{currentSample.parameterTip.suggestion}</span>
                      </div>
                      <span className="param-outcome">
                        Expected Result: {currentSample.parameterTip.expectedOutcome}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Interactive Mock Input Bar */}
          <div className="quanti-input-mock">
            <input
              type="text"
              readOnly
              value="QuAntI conversational interface is scheduled for release in Milestone 4."
              className="mock-input-field"
              aria-label="Planned QuAntI AI input field"
            />
            <button className="mock-send-btn" disabled aria-label="Send query">
              <span>Ask</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .quanti-card {
          padding: 34px;
          background: var(--color-surface);
        }

        .quanti-status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 22px;
          border-bottom: 1px solid var(--border-stone-light);
          flex-wrap: wrap;
          gap: 14px;
        }

        .quanti-identity {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .quanti-avatar {
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--color-surface-muted);
          border: 1px solid var(--border-stone);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .quanti-core-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--color-copper);
        }

        .quanti-ring {
          position: absolute;
          inset: 4px;
          border-radius: 50%;
          border: 1px solid rgba(189, 100, 60, 0.35);
        }

        .quanti-info {
          display: flex;
          flex-direction: column;
        }

        .quanti-name-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .quanti-name {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--color-graphite);
        }

        .quanti-badge {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--color-forest);
          background: var(--color-forest-subtle);
          padding: 2px 8px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-forest-border);
        }

        .quanti-subtext {
          font-size: 0.82rem;
          color: var(--color-text-muted);
        }

        .quanti-planned-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 0.76rem;
          color: var(--color-copper);
          font-weight: 600;
        }

        .quanti-chips-wrapper {
          margin-top: 22px;
          margin-bottom: 24px;
        }

        .chips-label {
          display: block;
          font-size: 0.75rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .chips-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .quanti-chip-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: var(--radius-full);
          background: var(--color-surface-muted);
          border: 1px solid var(--border-stone);
          color: var(--color-text-secondary);
          font-size: 0.84rem;
          font-family: var(--font-sans);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .quanti-chip-btn:hover {
          background: var(--color-surface-stone);
          color: var(--color-graphite);
        }

        .quanti-chip-btn.active {
          background: var(--color-surface);
          border-color: var(--color-copper);
          color: var(--color-copper);
          font-weight: 600;
          box-shadow: 0 1px 4px rgba(189, 100, 60, 0.15);
        }

        .quanti-dialogue-panel {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-bottom: 24px;
        }

        .dialogue-row {
          display: flex;
          width: 100%;
        }

        .user-row {
          justify-content: flex-end;
        }

        .ai-row {
          justify-content: flex-start;
        }

        .dialogue-bubble {
          max-width: 82%;
          padding: 18px 22px;
          border-radius: var(--radius-md);
        }

        .user-bubble {
          background: var(--color-surface-muted);
          border: 1px solid var(--border-stone);
          border-bottom-right-radius: 2px;
        }

        .ai-bubble {
          background: var(--color-surface);
          border: 1px solid var(--border-stone);
          border-left: 3px solid var(--color-copper);
          border-bottom-left-radius: 2px;
          box-shadow: var(--shadow-sm);
        }

        .ai-bubble-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .bubble-speaker {
          font-family: var(--font-mono);
          font-size: 0.74rem;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--color-text-muted);
        }

        .verified-pill {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--color-forest);
          background: var(--color-forest-subtle);
          padding: 1px 6px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-forest-border);
        }

        .bubble-text {
          font-size: 0.96rem;
          color: var(--color-graphite);
          line-height: 1.6;
        }

        .dialogue-followup {
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px solid var(--border-stone-light);
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.88rem;
          color: var(--color-text-secondary);
        }

        .followup-icon {
          flex-shrink: 0;
          margin-top: 3px;
          color: var(--color-copper);
        }

        .parameter-recommendation-box {
          margin-top: 14px;
          padding: 12px 16px;
          background: var(--color-surface-muted);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-stone-light);
        }

        .param-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 0.74rem;
          color: var(--color-copper);
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .param-content {
          display: flex;
          flex-direction: column;
          gap: 3px;
          font-size: 0.86rem;
        }

        .param-key {
          font-weight: 600;
          color: var(--color-graphite);
          margin-right: 6px;
        }

        .param-action {
          color: var(--color-forest);
          font-family: var(--font-mono);
        }

        .param-outcome {
          font-size: 0.82rem;
          color: var(--color-text-muted);
        }

        .quanti-input-mock {
          display: flex;
          gap: 10px;
          background: var(--color-surface-muted);
          padding: 8px 12px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-stone);
        }

        .mock-input-field {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--color-text-muted);
          font-size: 0.88rem;
          font-family: var(--font-sans);
          padding-left: 10px;
        }

        .mock-send-btn {
          padding: 8px 18px;
          border-radius: var(--radius-full);
          background: var(--color-surface-stone);
          color: var(--color-text-muted);
          font-size: 0.84rem;
          font-weight: 600;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .dialogue-bubble {
            max-width: 95%;
          }
        }
      `}</style>
    </section>
  );
}
