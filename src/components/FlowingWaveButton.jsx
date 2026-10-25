import React, { useState } from "react";
import { ArrowRight, Compass } from "lucide-react";

/**
 * FlowingWaveButton
 * Signature Quantum Start Button:
 * - Redesigned for the Scientific-Editorial identity:
 * - Burnished copper and deep forest wave ripples
 * - Tactile editorial surface with smooth organic wave disturbance on activation
 * - Smooth scroll navigation to exploration section
 * - Accessible focus and hover states
 */
export default function FlowingWaveButton({ targetSectionId = "environments", onExplore }) {
  const [isActivating, setIsActivating] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setIsActivating(true);

    if (onExplore) {
      onExplore();
    }

    // Brief delay to display expanding wave before scrolling
    setTimeout(() => {
      const target = document.getElementById(targetSectionId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setIsActivating(false);
    }, 240);
  };

  return (
    <div className="flowing-wave-button-container">
      {/* Concentric Quantum Field Wave Ripples */}
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
        <span className="btn-icon">
          <Compass size={19} className="compass-icon" />
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
          margin-top: 10px;
        }

        /* Flowing wave disturbance rings */
        .quantum-field-ripple {
          position: absolute;
          inset: -10px;
          border-radius: var(--radius-full);
          pointer-events: none;
          z-index: 1;
          transition: all 0.3s ease;
        }

        .quantum-field-ripple.ripple-1 {
          border: 1.5px solid rgba(189, 100, 60, 0.35);
          animation: wavePulse1 4s cubic-bezier(0.25, 1, 0.5, 1) infinite;
        }

        .quantum-field-ripple.ripple-2 {
          inset: -20px;
          border: 1px solid rgba(56, 73, 54, 0.25);
          animation: wavePulse2 4s cubic-bezier(0.25, 1, 0.5, 1) 0.9s infinite;
        }

        .quantum-field-ripple.ripple-3 {
          inset: -30px;
          border: 1px dashed rgba(189, 100, 60, 0.2);
          animation: wavePulse3 4s cubic-bezier(0.25, 1, 0.5, 1) 1.8s infinite;
        }

        @keyframes wavePulse1 {
          0% {
            transform: scale(0.96);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.04);
            opacity: 0.7;
          }
          100% {
            transform: scale(0.96);
            opacity: 0.3;
          }
        }

        @keyframes wavePulse2 {
          0% {
            transform: scale(0.95);
            opacity: 0.2;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.55;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.2;
          }
        }

        @keyframes wavePulse3 {
          0% {
            transform: scale(0.94);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.06);
            opacity: 0.35;
          }
          100% {
            transform: scale(0.94);
            opacity: 0.1;
          }
        }

        /* Activated expansion pulse on click */
        .quantum-field-ripple.activated {
          transform: scale(1.4) !important;
          opacity: 0 !important;
          transition: transform 0.4s ease-out, opacity 0.4s ease-out !important;
        }

        /* Core Button */
        .flowing-wave-btn {
          position: relative;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 34px;
          background: linear-gradient(135deg, #BD643C 0%, #A5532E 100%);
          color: #FFFFFF;
          font-family: var(--font-sans);
          font-size: 1.05rem;
          font-weight: 600;
          letter-spacing: 0.01em;
          border-radius: var(--radius-full);
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 4px 16px rgba(189, 100, 60, 0.3), 0 1px 3px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }

        .flowing-wave-btn:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, #C86F45 0%, #B05B34 100%);
          box-shadow: 0 8px 24px rgba(189, 100, 60, 0.38), 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .flowing-wave-btn:active, .flowing-wave-btn.btn-active {
          transform: translateY(1px);
          box-shadow: 0 2px 8px rgba(189, 100, 60, 0.3);
        }

        .btn-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFF0E6;
        }

        .compass-icon {
          transition: transform 0.5s ease;
        }

        .flowing-wave-btn:hover .compass-icon {
          transform: rotate(45deg);
        }

        .btn-label {
          position: relative;
          z-index: 2;
        }

        .arrow-icon {
          transition: transform 0.25s ease;
          color: #FFF0E6;
        }

        .flowing-wave-btn:hover .arrow-icon {
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}
