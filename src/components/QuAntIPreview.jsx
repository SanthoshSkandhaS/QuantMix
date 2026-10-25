import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  MessageSquare,
  Sliders,
  Send,
  Atom,
  BookOpen,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { MathText } from "./MathView";
import { queryQuAntI } from "../utils/quantiEngine";

/**
 * QuAntIPreview
 * Interactive Scientific AI Assistant & Dialogue Console:
 * - Direct Name: QuAntI
 * - Heading: "Meet QuAntI."
 * - Description: "Ask anything. Understand the strange. Discover what to change next."
 * - Live real-time simulation parameter telemetry badge (E, V0, L, Particle species, Transmission T, Reflection R)
 * - Grounded deterministic retrieval engine anchored in OpenStax Vol 1 & 3, MIT 8.04, RevModPhys
 * - Active text input with prompt chips and dynamic conversation history
 * - KaTeX mathematical typesetting for equations and boundary conditions
 * - Deep obsidian, stone, copper, and teal styling matching QuantMix aesthetics
 */
export default function QuAntIPreview({
  simulationState = {},
  onOpenTweak,
  onOpenNotebook,
  onRestoreSimulation
}) {
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const chatBottomRef = useRef(null);
  const msgCounterRef = useRef(1);

  // Unpack live parameters with defaults
  const E = simulationState.energyEv ?? 3.8;
  const V0 = simulationState.barrierHeightEv ?? 4.5;
  const L = simulationState.barrierWidthNm ?? 0.35;
  const particleKey = simulationState.particleKey || "electron";
  const physicsData = simulationState.physicsData;
  const T_pct = physicsData?.formattedTransmission || "7.8%";
  const R_pct = physicsData?.formattedReflection || "92.2%";
  const kappa = physicsData?.kappaNm || "4.28";

  // Initial greeting message
  const [messages, setMessages] = useState(() => [
    {
      id: "init-0",
      role: "assistant",
      question: "System Initialization",
      answer: `Greetings. I am QuAntI, your scientific quantum intelligence guide. I am actively tracking your 1D Schrödinger simulation. Currently, an incident **${particleKey}** (E = ${E.toFixed(2)} eV) is scattering against a rectangular potential barrier (V₀ = ${V0.toFixed(2)} eV, L = ${L.toFixed(2)} nm). Quantum wave tunneling yields a transmission probability of **T = ${T_pct}** (decay constant κ = ${kappa} nm⁻¹). I can answer physics questions or manage your personal **Experiment Notebook** (save trials, compare, annotate, synthesize research summaries). How can I assist you?`,
      mathematicalBasis: "\\hat{H}\\psi(x) = E\\psi(x), \\quad R + T = 1.000000",
      source: "OpenStax University Physics Vol 3 & MIT 8.04 Quantum Physics I",
      mode: "Grounded Analytical Reasoning Engine (Live Simulation Telemetry)",
      parameterAction: null
    }
  ]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isThinking]);

  // Handle user question submission
  const handleSend = async (questionText) => {
    const q = (questionText || inputValue).trim();
    if (!q || isThinking) return;

    setInputValue("");
    setIsThinking(true);

    // Append user message immediately
    const userMsgId = `user-${msgCounterRef.current++}`;
    const newUserMsg = {
      id: userMsgId,
      role: "user",
      text: q
    };
    setMessages((prev) => [...prev, newUserMsg]);

    try {
      const response = await queryQuAntI(q, {
        energyEv: E,
        barrierHeightEv: V0,
        barrierWidthNm: L,
        particleKey,
        physicsData,
        activeEnvironment: simulationState.activeEnvironment || "bedroom",
        selectedObject: simulationState.selectedObject || "water"
      });

      const aiMsg = {
        id: `ai-${msgCounterRef.current++}`,
        role: "assistant",
        question: q,
        answer: response.answer,
        mathematicalBasis: response.mathematicalBasis,
        parameterAction: response.parameterAction,
        source: response.source,
        mode: response.mode,
        notebookAction: response.notebookAction
      };

      if (response.parameterAction?.type === "restoreConfig" && onRestoreSimulation) {
        onRestoreSimulation(response.parameterAction.config);
      }

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("Error querying QuAntI:", err);
      const errorMsg = {
        id: `err-${msgCounterRef.current++}`,
        role: "assistant",
        question: q,
        answer: "An error occurred while evaluating the quantum scattering context. Please verify your parameter inputs in the Tweak panel.",
        mathematicalBasis: null,
        source: "System Error Handler",
        mode: "Offline Diagnostic Mode"
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const samplePromptChips = [
    { label: "Save to Notebook", prompt: "Save this experiment to my notebook as Electron Tunnelling Trial" },
    { label: "Show Experiments", prompt: "Show me my last five experiments" },
    { label: "AI Research Summary", prompt: "Create a research summary of my saved experiments" },
    { label: "Compare Trials", prompt: "Compare my last two tunnelling experiments" },
    { label: "Why is T changing?", prompt: "Why is the transmission probability changing?" },
    { label: "Barrier width effect", prompt: "What happens when I increase the barrier width?" },
    { label: "Classical vs Quantum", prompt: "Why does the classical prediction differ from the quantum prediction?" },
    { label: "Which equation?", prompt: "Which equation is being solved in this simulation?" }
  ];

  return (
    <section id="quanti" className="section-wrapper quanti-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-tag">
            <Bot size={14} />
            <span>Interactive Scientific Intelligence</span>
          </div>
          <h2 className="section-title">Meet QuAntI.</h2>
          <p className="section-desc">
            Ask anything. Understand the strange. Discover what to change next.
          </p>
        </div>

        {/* QuAntI Main Console Card */}
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
                  <span className="quanti-badge">Active Scientific Guide</span>
                </div>
                <span className="quanti-subtext">
                  Quantum Intuition &amp; Analytical Scattering Engine
                </span>
              </div>
            </div>

            {/* Live Simulation Telemetry Pill */}
            <div className="quanti-telemetry-pill">
              <div className="telemetry-pill-row">
                <span className="pill-dot active" />
                <span className="pill-title">Live Lab Telemetry:</span>
              </div>
              <div className="telemetry-pill-values">
                <span className="pill-val">
                  <strong>{particleKey.toUpperCase()}</strong>
                </span>
                <span className="pill-sep">|</span>
                <span className="pill-val">E = {E.toFixed(2)} eV</span>
                <span className="pill-sep">|</span>
                <span className="pill-val">V₀ = {V0.toFixed(2)} eV</span>
                <span className="pill-sep">|</span>
                <span className="pill-val">L = {L.toFixed(2)} nm</span>
                <span className="pill-sep">|</span>
                <span className="pill-val teal">T = {T_pct}</span>
                <span className="pill-sep">|</span>
                <span className="pill-val copper">R = {R_pct}</span>
              </div>
            </div>
          </div>

          {/* Quick Scientific Question Chips */}
          <div className="quanti-chips-wrapper">
            <span className="chips-label">Inquire by Scientific Question:</span>
            <div className="chips-row">
              {samplePromptChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip.prompt)}
                  disabled={isThinking}
                  className="quanti-chip-btn"
                  aria-label={`Ask QuAntI: ${chip.label}`}
                >
                  <MessageSquare size={13} />
                  <span>“{chip.label}”</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dialogue Message Thread */}
          <div className="quanti-thread-container" role="log" aria-live="polite">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`quanti-msg-wrapper ${msg.role === "user" ? "user-msg" : "assistant-msg"}`}
              >
                {msg.role === "user" ? (
                  <div className="dialogue-block user-block">
                    <span className="block-label">Your Question</span>
                    <p className="block-text">{msg.text}</p>
                  </div>
                ) : (
                  <div className="dialogue-block ai-block">
                    <div className="ai-block-header">
                      <div className="ai-label-group">
                        <Atom size={14} color="var(--color-copper)" />
                        <span className="block-label ai-label">QuAntI Scientific Analysis</span>
                      </div>
                      <div className="ai-meta-pills">
                        <span className="verified-pill">
                          <CheckCircle2 size={11} />
                          <span>Strict Boundary Matching</span>
                        </span>
                        {msg.mode && (
                          <span className="mode-pill">{msg.mode}</span>
                        )}
                      </div>
                    </div>

                    <div className="block-text">
                      <MathText text={msg.answer} />
                    </div>

                    {/* Mathematical Basis Formula */}
                    {msg.mathematicalBasis && (
                      <div className="formula-box">
                        <div className="formula-label">
                          <BookOpen size={13} color="var(--color-teal)" />
                          <span>Analytical Formulation:</span>
                        </div>
                        <div className="formula-content">
                          <MathText text={`\\(${msg.mathematicalBasis}\\)`} />
                        </div>
                      </div>
                    )}

                    {/* Parameter Action Recommendation Tip */}
                    {msg.parameterAction && (
                      <div className="parameter-recommendation-box">
                        <div className="param-header">
                          <Sliders size={14} color="var(--color-copper)" />
                          <span className="param-title">Lab Action Recommendation:</span>
                        </div>
                        <div className="param-content">
                          <span className="param-key">{msg.parameterAction.param}:</span>
                          <span className="param-action">{msg.parameterAction.tip}</span>
                        </div>
                        {onOpenTweak && (
                          <button
                            type="button"
                            onClick={onOpenTweak}
                            className="open-tweak-action-btn"
                          >
                            <span>Open Tweak Panel [T]</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Notebook Action Synchronization Box */}
                    {msg.notebookAction && onOpenNotebook && (
                      <div
                        className="notebook-action-box"
                        style={{
                          marginTop: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          background: "rgba(198, 114, 72, 0.1)",
                          border: "1px solid rgba(198, 114, 72, 0.3)",
                          borderRadius: "6px",
                          padding: "8px 12px"
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "0.85rem",
                            color: "var(--color-copper)"
                          }}
                        >
                          <BookOpen size={14} />
                          <span>Notebook Record Synchronized</span>
                        </div>
                        <button
                          type="button"
                          onClick={onOpenNotebook}
                          style={{
                            background: "rgba(24, 28, 38, 0.9)",
                            border: "1px solid var(--border-stone)",
                            color: "var(--color-text-main)",
                            borderRadius: "4px",
                            padding: "4px 10px",
                            fontSize: "0.8rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                          }}
                        >
                          <span>Open Notebook [N]</span>
                        </button>
                      </div>
                    )}

                    {/* Grounded Textbook Citation */}
                    {msg.source && (
                      <div className="citation-row">
                        <span className="citation-label">Authoritative Source:</span>
                        <span className="citation-text">{msg.source}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="dialogue-block ai-block thinking-block">
                <div className="thinking-row">
                  <RefreshCw size={14} className="spinning-icon" color="var(--color-copper)" />
                  <span>QuAntI is evaluating Schrödinger boundary equations...</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Active Free-Form Question Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputValue);
            }}
            className="quanti-input-bar"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask QuAntI about tunneling, parameters, classical differences, or everyday solids..."
              className="active-input-field"
              aria-label="Ask QuAntI a scientific question"
              disabled={isThinking}
            />
            <button
              type="submit"
              className="active-send-btn"
              disabled={isThinking || !inputValue.trim()}
              aria-label="Send scientific question to QuAntI"
            >
              <Send size={15} />
              <span>Ask QuAntI</span>
            </button>
          </form>
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
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border-subtle);
          flex-wrap: wrap;
          gap: 16px;
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

        .quanti-telemetry-pill {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 8px 14px;
          border-radius: var(--radius-sm);
          background: rgba(18, 21, 29, 0.9);
          border: 1px solid var(--border-stone);
        }

        .telemetry-pill-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .pill-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .pill-dot.active {
          background: #20C4B4;
          box-shadow: 0 0 6px rgba(32, 196, 180, 0.6);
        }

        .pill-title {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--color-text-muted);
          text-transform: uppercase;
        }

        .telemetry-pill-values {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: var(--color-text-secondary);
        }

        .pill-val strong {
          color: var(--color-copper);
        }

        .pill-val.teal {
          color: var(--color-teal);
          font-weight: 600;
        }

        .pill-sep {
          color: rgba(255, 255, 255, 0.15);
        }

        /* Chips */
        .quanti-chips-wrapper {
          margin-top: 20px;
          margin-bottom: 20px;
        }

        .chips-label {
          display: block;
          font-size: 0.74rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
          text-transform: uppercase;
          margin-bottom: 8px;
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
          padding: 7px 13px;
          border-radius: var(--radius-full);
          background: rgba(24, 28, 38, 0.85);
          border: 1px solid var(--border-stone);
          color: var(--color-text-secondary);
          font-size: 0.8rem;
          font-family: var(--font-sans);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .quanti-chip-btn:hover:not(:disabled) {
          background: rgba(32, 38, 52, 0.95);
          color: var(--color-text-main);
          border-color: var(--color-copper);
        }

        .quanti-chip-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Dialogue Thread Container */
        .quanti-thread-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
          max-height: 480px;
          overflow-y: auto;
          padding-right: 6px;
        }

        .quanti-thread-container::-webkit-scrollbar {
          width: 6px;
        }

        .quanti-thread-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.12);
          border-radius: 4px;
        }

        .quanti-msg-wrapper {
          display: flex;
          flex-direction: column;
        }

        .dialogue-block {
          padding: 20px 24px;
          border-radius: var(--radius-md);
        }

        .user-block {
          background: rgba(18, 21, 29, 0.9);
          border: 1px solid var(--border-subtle);
          border-right: 3px solid var(--color-teal);
          align-self: flex-end;
          max-width: 85%;
        }

        .ai-block {
          background: rgba(24, 28, 38, 0.95);
          border: 1px solid var(--border-stone);
          border-left: 3px solid var(--color-copper);
          box-shadow: var(--shadow-sm);
        }

        .thinking-block {
          background: rgba(24, 28, 38, 0.7);
        }

        .thinking-row {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-mono);
          font-size: 0.84rem;
          color: var(--color-text-secondary);
        }

        .spinning-icon {
          animation: spin 1.2s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .block-label {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--color-text-muted);
          margin-bottom: 6px;
        }

        .ai-label {
          color: var(--color-copper);
          margin-bottom: 0;
        }

        .ai-label-group {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .ai-block-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 8px;
        }

        .ai-meta-pills {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .verified-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--color-teal);
          background: var(--color-teal-dim);
          padding: 2px 7px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-teal-border);
        }

        .mode-pill {
          font-family: var(--font-mono);
          font-size: 0.68rem;
          color: var(--color-text-muted);
          background: rgba(255, 255, 255, 0.04);
          padding: 2px 7px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-subtle);
        }

        .block-text {
          font-size: 0.94rem;
          color: var(--color-text-main);
          line-height: 1.62;
        }

        /* Formula Box */
        .formula-box {
          margin-top: 14px;
          padding: 10px 14px;
          background: rgba(14, 17, 23, 0.85);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
        }

        .formula-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--color-teal);
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .formula-content {
          font-size: 0.88rem;
          color: var(--color-text-main);
          overflow-x: auto;
        }

        /* Parameter Recommendation Box */
        .parameter-recommendation-box {
          margin-top: 14px;
          padding: 12px 16px;
          background: rgba(18, 21, 29, 0.8);
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-stone);
          display: flex;
          flex-direction: column;
          gap: 8px;
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
        }

        .param-content {
          font-size: 0.86rem;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .param-key {
          font-weight: 600;
          color: var(--color-text-main);
        }

        .param-action {
          color: var(--color-teal);
          font-family: var(--font-sans);
        }

        .open-tweak-action-btn {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          background: rgba(198, 114, 72, 0.15);
          border: 1px solid var(--color-copper);
          color: var(--color-copper);
          border-radius: var(--radius-sm);
          font-family: var(--font-mono);
          font-size: 0.74rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .open-tweak-action-btn:hover {
          background: var(--color-copper);
          color: #FFFFFF;
        }

        /* Citation Row */
        .citation-row {
          margin-top: 12px;
          padding-top: 8px;
          border-top: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.74rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
        }

        .citation-label {
          color: var(--color-text-secondary);
        }

        .citation-text {
          color: var(--color-text-muted);
          font-style: italic;
        }

        /* Active Input Bar */
        .quanti-input-bar {
          display: flex;
          gap: 10px;
          background: rgba(18, 21, 29, 0.95);
          padding: 8px 10px 8px 16px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-stone);
          transition: border-color 0.2s ease;
        }

        .quanti-input-bar:focus-within {
          border-color: var(--color-copper);
          box-shadow: 0 0 10px rgba(198, 114, 72, 0.2);
        }

        .active-input-field {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--color-text-main);
          font-size: 0.9rem;
          font-family: var(--font-sans);
        }

        .active-input-field::placeholder {
          color: var(--color-text-muted);
          font-size: 0.86rem;
        }

        .active-send-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 20px;
          border-radius: var(--radius-full);
          background: var(--color-copper);
          color: #FFFFFF;
          border: none;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s ease, transform 0.1s ease;
        }

        .active-send-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
        }

        .active-send-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .quanti-status-bar {
            flex-direction: column;
            align-items: flex-start;
          }
          .user-block {
            max-width: 95%;
          }
        }
      `}</style>
    </section>
  );
}
