import React, { useEffect, useRef, useState, useCallback } from "react";
import { FastForward, Sparkles } from "lucide-react";

/**
 * AtomicIntro
 * Approximately 4-second artistic quantum interaction animation.
 * Features:
 * - Two luminous quantum wave packets approaching, colliding/interfering, scattering with glowing trails.
 * - Coalesces into the QuantMix atomic emblem and subtitle.
 * - Immediate "Skip Intro" button and Escape key listener.
 * - Automatic transition into the homepage.
 * - Honors prefers-reduced-motion.
 * - Uses sessionStorage to prevent repeated plays during a browsing session unless explicitly requested.
 */
export default function AtomicIntro({ onComplete, forceShow = false }) {
  const canvasRef = useRef(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(4);
  const startTimeRef = useRef(Date.now());
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
    }, 450);
  }, [onComplete]);

  // Handle keyboard shortcut: Escape skips immediately
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

    const DURATION_MS = 4000;
    const startTime = Date.now();
    startTimeRef.current = startTime;

    // Particles for collision & scattering
    const centerX = width * 0.5;
    const centerY = height * 0.46;

    const scatteredParticles = [];
    const SCATTER_COUNT = width < 768 ? 36 : 60;
    for (let i = 0; i < SCATTER_COUNT; i++) {
      const angle = (i / SCATTER_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const speed = 1.2 + Math.random() * 3.8;
      scatteredParticles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.2 + Math.random() * 2.2,
        color: Math.random() > 0.4 ? "#35D6D0" : "#9B8CFF",
        alpha: 1,
        trail: []
      });
    }

    const ripples = [];

    const render = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / DURATION_MS, 1);

      // Update countdown display
      const remainingSec = Math.max(0, Math.ceil((DURATION_MS - elapsed) / 1000));
      setSecondsRemaining(remainingSec);

      // Deep cosmos clear with slight persistence for particle glow
      ctx.fillStyle = "#0B1020";
      ctx.fillRect(0, 0, width, height);

      // Subtle background ambient grid
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(17, 27, 46, 0.45)";
      const gridSize = 48;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // --- PHASE 1: Wave packets approach (0.0 -> 0.38) ---
      if (progress < 0.42) {
        const approachT = progress / 0.42;
        const dist = (1 - approachT) * (width * 0.38);

        // Packet 1 (Teal, incoming from left)
        const p1X = centerX - dist;
        const p1Y = centerY + Math.sin(approachT * Math.PI * 4) * 18;
        drawWavePacket(ctx, p1X, p1Y, "#35D6D0", 24 * (0.8 + approachT * 0.4), approachT);

        // Packet 2 (Violet, incoming from right)
        const p2X = centerX + dist;
        const p2Y = centerY - Math.sin(approachT * Math.PI * 4) * 18;
        drawWavePacket(ctx, p2X, p2Y, "#9B8CFF", 24 * (0.8 + approachT * 0.4), approachT);
      }

      // --- PHASE 2: Collision, Interference Ripples & Particle Scattering (0.35 -> 0.85) ---
      if (progress >= 0.35) {
        const collisionT = (progress - 0.35) / 0.65;

        // Trigger expanding interference ripples
        if (ripples.length < 5 && Math.random() < 0.25) {
          ripples.push({
            r: 5,
            maxR: Math.min(width, height) * 0.55,
            color: ripples.length % 2 === 0 ? "rgba(53, 214, 208," : "rgba(155, 140, 255,",
            alpha: 0.85
          });
        }

        // Draw and expand ripples
        for (let i = ripples.length - 1; i >= 0; i--) {
          const rip = ripples[i];
          rip.r += 3.2;
          rip.alpha *= 0.96;
          if (rip.alpha > 0.02 && rip.r < rip.maxR) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, rip.r, 0, Math.PI * 2);
            ctx.strokeStyle = `${rip.color}${rip.alpha})`;
            ctx.lineWidth = 2.2;
            ctx.stroke();
          } else {
            ripples.splice(i, 1);
          }
        }

        // Scatter particles outwards
        for (let p of scatteredParticles) {
          p.x += p.vx * (1 + collisionT * 0.5);
          p.y += p.vy * (1 + collisionT * 0.5);
          p.alpha = Math.max(0, 1 - collisionT * 0.95);

          // Store trail
          p.trail.push({ x: p.x, y: p.y });
          if (p.trail.length > 7) p.trail.shift();

          // Draw trail
          if (p.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(p.trail[0].x, p.trail[0].y);
            for (let pt of p.trail) {
              ctx.lineTo(pt.x, pt.y);
            }
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.radius * 0.6;
            ctx.globalAlpha = p.alpha * 0.3;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }

          // Draw particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        // Central core flash
        const coreFlashAlpha = Math.max(0, 1 - collisionT * 2.5);
        if (coreFlashAlpha > 0) {
          const grad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 80);
          grad.addColorStop(0, `rgba(255, 255, 255, ${coreFlashAlpha * 0.9})`);
          grad.addColorStop(0.3, `rgba(53, 214, 208, ${coreFlashAlpha * 0.7})`);
          grad.addColorStop(0.7, `rgba(155, 140, 255, ${coreFlashAlpha * 0.3})`);
          grad.addColorStop(1, "transparent");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // --- PHASE 3: Brand Coalescence (0.65 -> 1.0) ---
      if (progress >= 0.65) {
        const brandT = (progress - 0.65) / 0.35;
        const brandAlpha = Math.min(1, brandT * 2.2);

        ctx.save();
        ctx.globalAlpha = brandAlpha;

        // Draw quantum orbital rings
        const ringAngle = brandT * Math.PI * 0.8;
        drawOrbitalRing(ctx, centerX, centerY, 65, 24, -ringAngle, "#35D6D0");
        drawOrbitalRing(ctx, centerX, centerY, 65, 24, ringAngle + 0.6, "#9B8CFF");

        // Central glowing quantum core
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8 + Math.sin(now * 0.008) * 2, 0, Math.PI * 2);
        ctx.fillStyle = "#35D6D0";
        ctx.shadowColor = "#35D6D0";
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
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

  // Helper: Draw Gaussian wave packet
  function drawWavePacket(ctx, x, y, color, radius, phase) {
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, color);
    grad.addColorStop(0.4, color);
    grad.addColorStop(1, "transparent");

    ctx.save();
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Wave ring fringes
    for (let f = 1; f <= 3; f++) {
      ctx.beginPath();
      ctx.arc(x, y, radius * (0.4 + f * 0.28), 0, Math.PI * 2);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = (0.7 / f) * (0.6 + Math.sin(phase * 10 + f) * 0.4);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Helper: Draw rotated orbital ellipse
  function drawOrbitalRing(ctx, cx, cy, rx, ry, rotation, color) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.8;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.restore();
  }

  return (
    <div
      role="dialog"
      aria-label="QuantMix Atomic Introduction"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#0B1020",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s ease",
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

      {/* Top Bar: Intro Status & Skip Button */}
      <div
        style={{
          position: "absolute",
          top: "24px",
          left: "24px",
          right: "24px",
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
            background: "rgba(17, 27, 46, 0.7)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(53, 214, 208, 0.2)",
            borderRadius: "9999px",
            padding: "6px 14px",
            fontSize: "0.8rem",
            fontFamily: "var(--font-mono)",
            color: "var(--color-teal)"
          }}
        >
          <Sparkles size={14} className="spin-slow" />
          <span>Atomic Collision Intro ({secondsRemaining}s)</span>
        </div>

        <button
          onClick={completeIntro}
          aria-label="Skip introduction animation and enter website"
          id="skip-intro-button"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(17, 27, 46, 0.85)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(53, 214, 208, 0.4)",
            borderRadius: "9999px",
            padding: "8px 18px",
            fontSize: "0.88rem",
            fontWeight: 600,
            color: "var(--color-text-main)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            transition: "all 0.2s ease",
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-teal)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(53, 214, 208, 0.35)";
            e.currentTarget.style.transform = "scale(1.03)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(53, 214, 208, 0.4)";
            e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.4)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <span>Skip Intro</span>
          <FastForward size={15} color="var(--color-teal)" />
        </button>
      </div>

      {/* Center Cinematic Title overlay */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          marginTop: "160px",
          textAlign: "center",
          pointerEvents: "none",
          padding: "0 20px"
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.8rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            background: "linear-gradient(135deg, #F4F7FF 30%, #35D6D0 80%, #9B8CFF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "8px"
          }}
        >
          QuantMix
        </h1>
        <p
          style={{
            fontSize: "clamp(0.95rem, 2vw, 1.2rem)",
            fontFamily: "var(--font-mono)",
            color: "var(--color-text-secondary)",
            letterSpacing: "0.08em",
            textTransform: "uppercase"
          }}
        >
          Virtual Quantum Mechanics Explorer
        </p>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "24px",
          color: "var(--color-text-muted)",
          fontSize: "0.78rem",
          fontFamily: "var(--font-mono)"
        }}
      >
        Press <kbd style={{ background: "#111B2E", padding: "2px 6px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)" }}>Esc</kbd> to skip immediately
      </div>
    </div>
  );
}
