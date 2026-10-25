import React, { useState } from "react";
import { Sparkles, Bot, MessageSquare, CornerDownRight, Sliders } from "lucide-react";
import { MathText } from "./MathView";

/**
 * QuAntIPreview
 * Section introducing future AI Companion:
 * - Scientific Dialogue Console (distinct identity, NOT a generic chatbot)
 * - Exact Name: QuAntI
 * - Heading: "Meet QuAntI."
 * - Description: "Ask anything. Understand the strange. Discover what to change next."
 * - KaTeX mathematical typesetting for explanations
 * - Scientifically consistent numerical claims matching the 1D barrier solver
 * - Deep obsidian and stone styling with restrained copper & teal accents
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

        {/* QuAntI Interactive Scientific Console */}
        <div className="editorial-card quanti-card">
          {/* Top Assistant Status Strip */}
          <div className="quanti-status-bar">
            <div className="quanti-identity">
              {/* Scientific Emblem Avatar */}
              <div className="quanti-avatar">
                <span className="quanti-core-dot" />
                <span className="quanti-ring ring-1" />
                <span className="quanti-ring ring-2" />
              </div>
              <div className="quanti-info">
                <div className="quanti-name-row">
                  <span className="quanti-name font-serif">QuAntI</span>
                  <span className="quanti-badge">Scientific Guide Console</span>
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
            <span className="chips-label">Inquire by Scientific Topic:</span>
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
            {/* User Inquiry Box */}
            <div className="dialogue-block user-block">
              <span className="block-label">Your Question</span>
              <p className="block-text">{currentSample.question}</p>
            </div>

            {/* QuAntI Response Box */}
            <div className="dialogue-block ai-block">
              <div className="ai-block-header">
                <span className="block-label ai-label">QuAntI Scientific Analysis</span>
                <span className="verified-pill">Physics Grounded</span>
              </div>
              <div className="block-text">
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
          background: var(--color-bg-card);
        }

        .quanti-status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 22px;
          border-bottom: 1px solid var(--border-subtle);
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
          background: rgba(24, 28, 38, 0.95);
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
          border: 1px solid rgba(198, 114, 72, 0.4);
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
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--color-text-main);
        }

        .quanti-badge {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--color-teal);
          background: var(--color-teal-dim);
          padding: 2px 8px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-teal-border);
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
          background: rgba(24, 28, 38, 0.9);
          border: 1px solid var(--border-stone);
          color: var(--color-text-secondary);
          font-size: 0.84rem;
          font-family: var(--font-sans);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .quanti-chip-btn:hover {
          background: rgba(32, 38, 52, 0.9);
          color: var(--color-text-main);
        }

        .quanti-chip-btn.active {
          background: rgba(24, 28, 38, 0.95);
          border-color: var(--color-copper);
          color: var(--color-copper);
          font-weight: 600;
          box-shadow: 0 1px 6px rgba(198, 114, 72, 0.2);
        }

        .quanti-dialogue-panel {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .dialogue-block {
          padding: 20px 24px;
          border-radius: var(--radius-md);
        }

        .user-block {
          background: rgba(18, 21, 29, 0.85);
          border: 1px solid var(--border-subtle);
        }

        .ai-block {
          background: rgba(24, 28, 38, 0.95);
          border: 1px solid var(--border-stone);
          border-left: 3px solid var(--color-copper);
          box-shadow: var(--shadow-sm);
        }

        .block-label {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--color-text-muted);
          margin-bottom: 8px;
        }

        .ai-label {
          color: var(--color-copper);
        }

        .ai-block-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }

        .verified-pill {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--color-teal);
          background: var(--color-teal-dim);
          padding: 1px 6px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-teal-border);
        }

        .block-text {
          font-size: 0.96rem;
          color: var(--color-text-main);
          line-height: 1.6;
        }

        .dialogue-followup {
          margin-top: 14px;
          padding-top: 10px;
          border-top: 1px solid var(--border-subtle);
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
          background: rgba(18, 21, 29, 0.8);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-subtle);
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
          color: var(--color-text-main);
          margin-right: 6px;
        }

        .param-action {
          color: var(--color-teal);
          font-family: var(--font-mono);
        }

        .param-outcome {
          font-size: 0.82rem;
          color: var(--color-text-muted);
        }

        .quanti-input-mock {
          display: flex;
          gap: 10px;
          background: rgba(18, 21, 29, 0.85);
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
          padding: 8px 20px;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.08);
          color: var(--color-text-muted);
          font-size: 0.84rem;
          font-weight: 600;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
}
