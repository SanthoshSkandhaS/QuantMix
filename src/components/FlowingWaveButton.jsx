import React, { useState } from "react";
import { ArrowRight, Compass } from "lucide-react";

/**
 * FlowingWaveButton
 * Signature Quantum Start Button:
 * - Fluid undulating quantum field wave ripples behind & around the button
 * - Teal (#35D6D0) to Violet (#9B8CFF) glowing interference transitions
 * - Interactive expanding disturbance wave on click/activation
 * - Smooth scroll navigation to exploration section
 * - Fully accessible (keyboard Enter/Space, visible focus state)
 */
export default function FlowingWaveButton({ targetSectionId = "environments", onExplore }) {
  const [isActivating, setIsActivating] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setIsActivating(true);

    if (onExplore) {
      onExplore();
    }

    // Brief delay to display expanding quantum wave before scrolling
    setTimeout(() => {
      const target = document.getElementById(targetSectionId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setIsActivating(false);
    }, 280);
  };

  return (
    <div className="flowing-wave-button-container">
      {/* Concentric Quantum Field Wave Ripples (Idle & Hover animation) */}
      <div className={`quantum-field-ripple ripple-1 ${isActivating ? "activated" : ""}`} aria-hidden="true" />
      <div className={`quantum-field-ripple ripple-2 ${isActivating ? "activated" : ""}`} aria-hidden="true" />
      <div className={`quantum-field-ripple ripple-3 ${isActivating ? "activated" : ""}`} aria-hidden="true" />

      {/* Interactive Core Button */}
      <button
        id="start-exploring-button"
        onClick={handleClick}
        className={`flowing-wave-btn ${isActivating ? "btn-active" : ""}`}
        aria-label="Start Exploring QuantMix Environments"
      >
        <span className="btn-wave-glow" aria-hidden="true" />
        <span className="btn-icon">
          <Compass size={20} className="compass-icon" />
        </span>
        <span className="btn-label">Start Exploring</span>
        <ArrowRight size={18} className="arrow-icon" />
      </button>

      <style>{`
        .flowing-wave-button-container {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 12px;
        }

        /* Flowing wave disturbance rings */
        .quantum-field-ripple {
          position: absolute;
          inset: -12px;
          border-radius: var(--radius-full);
          pointer-events: none;
          z-index: 1;
          transition: all 0.3s ease;
        }

        .quantum-field-ripple.ripple-1 {
          border: 1.5px solid rgba(53, 214, 208, 0.4);
          animation: wavePulse1 4s cubic-bezier(0.25, 1, 0.5, 1) infinite;
        }

        .quantum-field-ripple.ripple-2 {
          inset: -22px;
          border: 1px solid rgba(155, 140, 255, 0.3);
          animation: wavePulse2 4s cubic-bezier(0.25, 1, 0.5, 1) 0.8s infinite;
        }

        .quantum-field-ripple.ripple-3 {
          inset: -34px;
          border: 1px dashed rgba(53, 214, 208, 0.2);
          animation: wavePulse3 4s cubic-bezier(0.25, 1, 0.5, 1) 1.6s infinite;
        }

        @keyframes wavePulse1 {
          0% {
            transform: scale(0.96);
            opacity: 0.35;
            box-shadow: 0 0 10px rgba(53, 214, 208, 0.2);
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
            box-shadow: 0 0 25px rgba(53, 214, 208, 0.4);
          }
          100% {
            transform: scale(0.96);
            opacity: 0.35;
            box-shadow: 0 0 10px rgba(53, 214, 208, 0.2);
          }
        }

        @keyframes wavePulse2 {
          0% {
            transform: scale(0.95);
            opacity: 0.2;
            border-color: rgba(155, 140, 255, 0.2);
          }
          50% {
            transform: scale(1.07);
            opacity: 0.6;
            border-color: rgba(155, 140, 255, 0.5);
            box-shadow: 0 0 28px rgba(155, 140, 255, 0.3);
          }
          100% {
            transform: scale(0.95);
            opacity: 0.2;
            border-color: rgba(155, 140, 255, 0.2);
          }
        }

        @keyframes wavePulse3 {
          0% {
            transform: scale(0.92);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.08);
            opacity: 0.4;
          }
          100% {
            transform: scale(0.92);
            opacity: 0.1;
          }
        }

        /* Hover acceleration */
        .flowing-wave-button-container:hover .ripple-1 {
          animation-duration: 2.2s;
          border-color: rgba(53, 214, 208, 0.7);
        }
        .flowing-wave-button-container:hover .ripple-2 {
          animation-duration: 2.2s;
          border-color: rgba(155, 140, 255, 0.6);
        }

        /* Click disturbance burst */
        .quantum-field-ripple.activated {
          transform: scale(1.4) !important;
          opacity: 0 !important;
          transition: transform 0.45s ease-out, opacity 0.45s ease-out;
        }

        /* Core Button Styling */
        .flowing-wave-btn {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 18px 38px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, #111B2E 0%, #16243D 50%, #0B1020 100%);
          border: 1.5px solid var(--color-teal);
          color: var(--color-text-main);
          font-size: 1.15rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 25px rgba(53, 214, 208, 0.35);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        .btn-wave-glow {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(53, 214, 208, 0.15) 0%, rgba(155, 140, 255, 0.25) 50%, rgba(53, 214, 208, 0.15) 100%);
          opacity: 0.5;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .flowing-wave-btn:hover {
          transform: translateY(-2px) scale(1.02);
          border-color: #35D6D0;
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.7), 0 0 35px rgba(53, 214, 208, 0.55), 0 0 15px rgba(155, 140, 255, 0.4);
        }

        .flowing-wave-btn:hover .btn-wave-glow {
          opacity: 0.9;
        }

        .flowing-wave-btn:hover .arrow-icon {
          transform: translateX(4px);
        }

        .flowing-wave-btn:hover .compass-icon {
          transform: rotate(45deg);
        }

        .flowing-wave-btn:active,
        .flowing-wave-btn.btn-active {
          transform: scale(0.98);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.8), 0 0 45px rgba(53, 214, 208, 0.8);
        }

        .btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-teal);
        }

        .compass-icon {
          transition: transform 0.3s ease;
        }

        .btn-label {
          position: relative;
          z-index: 2;
          color: var(--color-text-main);
          font-family: var(--font-main);
        }

        .arrow-icon {
          color: var(--color-teal);
          transition: transform 0.25s ease;
        }

        @media (prefers-reduced-motion: reduce) {
          .quantum-field-ripple {
            animation: none !important;
          }
          .flowing-wave-btn {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
