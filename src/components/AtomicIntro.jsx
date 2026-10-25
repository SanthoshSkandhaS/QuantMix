import React, { useEffect, useRef, useState, useCallback } from "react";
import { FastForward, Sparkles } from "lucide-react";

/**
 * AtomicIntro
 * Approximately 2.5-second cinematic quantum opening.
 * Features:
 * - A dark cinematic opening with a small number of coherent wave particles converging into a quantum orbital harmonic.
 * - Restrained copper (#C67248) and teal (#20C4B4) luminescence against deep ink (#0B0D11).
 * - Scientifically inspired: de Broglie phase interference and coherent wavefunction collapse.
 * - Clean transition fade-out directly into the homepage hero.
 * - Prominent "Skip Intro" button and Escape key listener.
 * - Honors prefers-reduced-motion and session storage.
 */
export default function AtomicIntro({ onComplete, forceShow = false }) {
  const canvasRef = useRef(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const animFrameRef = useRef(null);
  const completedRef = useRef(false);

  const completeIntro = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    try {
      sessionStorage.setItem("quantmix_intro_seen", "true");
    } catch {
      // Storage unavailable fallback
    }
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete?.();
    }, 400);
  }, [onComplete]);

  // Handle keyboard shortcut: Escape or Space skips immediately
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.key === " ") {
        completeIntro();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [completeIntro]);

  useEffect(() => {
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion && !forceShow) {
      completeIntro();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const DURATION_MS = 2400; // Fast, punchy 2.4s intro
    const startTime = Date.now();

    // 16 coherent quantum wavepacket nodes
    const NODE_COUNT = 16;
    const nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const angle = (i / NODE_COUNT) * Math.PI * 2;
      const initialDist = Math.min(width, height) * 0.42;
      nodes.push({
        baseAngle: angle,
        initialDist,
        speedMultiplier: 0.8 + (i % 3) * 0.2,
        color: i % 2 === 0 ? "#C67248" : "#20C4B4"
      });
    }

    const render = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / DURATION_MS);

      // Deep Ink background
      ctx.fillStyle = "#0B0D11";
      ctx.fillRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.45;

      // Subtle atmospheric central glow
      const radialGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(width, height) * 0.4);
      radialGlow.addColorStop(0, "rgba(32, 196, 180, 0.08)");
      radialGlow.addColorStop(0.5, "rgba(198, 114, 72, 0.04)");
      radialGlow.addColorStop(1, "transparent");
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 0, width, height);

      // --- PHASE 1 & 2: Convergence & Orbital Coherence (0.0 -> 0.75) ---
      // Easing: cubic in-out
      const easeT = progress < 0.6
        ? Math.pow(progress / 0.6, 2)
        : 1 - Math.pow((1 - progress) / 0.4, 2);

      // Draw harmonic orbital path ellipses
      const orbitAlpha = Math.min(0.6, progress * 0.9);
      if (orbitAlpha > 0.02) {
        ctx.save();
        ctx.lineWidth = 1.2;

        // Ellipse 1: Copper slant
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(-0.45 + progress * 0.3);
        ctx.beginPath();
        ctx.ellipse(0, 0, 85, 32, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(198, 114, 72, ${orbitAlpha * 0.5})`;
        ctx.stroke();
        ctx.restore();

        // Ellipse 2: Teal slant
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(0.55 - progress * 0.3);
        ctx.beginPath();
        ctx.ellipse(0, 0, 85, 32, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(32, 196, 180, ${orbitAlpha * 0.5})`;
        ctx.stroke();
        ctx.restore();

        ctx.restore();
      }

      // Draw converging wavepacket nodes
      const currentDist = (1 - easeT) * (Math.min(width, height) * 0.38) + 38;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const rot = n.baseAngle + progress * Math.PI * 1.8 * n.speedMultiplier;
        const px = cx + Math.cos(rot) * currentDist;
        const py = cy + Math.sin(rot) * (currentDist * 0.55);

        // Node light trail to center
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(cx, cy);
        ctx.strokeStyle = n.color === "#C67248"
          ? "rgba(198, 114, 72, 0.12)"
          : "rgba(32, 196, 180, 0.12)";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Node particle
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();
      }

      // Central Quantum Core Node
      const corePulse = 4.5 + Math.sin(now * 0.01) * 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, corePulse, 0, Math.PI * 2);
      ctx.fillStyle = "#F4F5F7";
      ctx.shadowColor = "#20C4B4";
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Interference wave ring expanding outward
      if (progress > 0.45) {
        const waveP = (progress - 0.45) / 0.55;
        const waveRadius = waveP * 140;
        const waveAlpha = Math.max(0, (1 - waveP) * 0.5);

        ctx.beginPath();
        ctx.arc(cx, cy, waveRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(32, 196, 180, ${waveAlpha})`;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, waveRadius * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(198, 114, 72, ${waveAlpha * 0.8})`;
        ctx.lineWidth = 1.0;
        ctx.stroke();
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(render);
      } else {
        completeIntro();
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [completeIntro, forceShow]);

  return (
    <div
      role="dialog"
      aria-label="QuantMix Quantum Intro"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#0B0D11",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.4s ease-out",
        opacity: isFadingOut ? 0 : 1,
        pointerEvents: isFadingOut ? "none" : "auto"
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%"
        }}
      />

      {/* Top Header Bar with Prominent Skip Button */}
      <div
        style={{
          position: "absolute",
          top: "28px",
          left: "28px",
          right: "28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(18, 21, 29, 0.75)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "9999px",
            padding: "6px 14px",
            fontSize: "0.78rem",
            fontFamily: "var(--font-mono)",
            color: "#A3ACB9"
          }}
        >
          <Sparkles size={13} color="#20C4B4" />
          <span>Coherent State Convergence</span>
        </div>

        <button
          onClick={completeIntro}
          aria-label="Skip introduction animation and enter website"
          id="skip-intro-button"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(24, 28, 38, 0.9)",
            border: "1px solid rgba(198, 114, 72, 0.5)",
            borderRadius: "9999px",
            padding: "8px 20px",
            fontSize: "0.86rem",
            fontWeight: 600,
            fontFamily: "var(--font-sans)",
            color: "#F4F5F7",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.5)",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          <span>Skip Intro</span>
          <FastForward size={14} color="#C67248" />
        </button>
      </div>

      {/* Central Branding */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          textAlign: "center",
          maxWidth: "600px",
          padding: "0 20px",
          pointerEvents: "none",
          marginTop: "140px"
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2.4rem, 5vw, 3.4rem)",
            fontWeight: 600,
            color: "#F4F5F7",
            letterSpacing: "-0.03em",
            marginBottom: "6px"
          }}
        >
          QuantMix
        </h1>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.82rem",
            color: "#C67248",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontWeight: 500
          }}
        >
          Virtual Quantum Mechanics Explorer
        </p>
      </div>
    </div>
  );
}
