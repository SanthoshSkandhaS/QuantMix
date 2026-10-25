import React, { useEffect, useRef } from "react";

/**
 * ParticleBackground
 * High-performance, lightweight scientific 2D canvas simulation.
 * Redesigned for the Scientific-Editorial identity:
 * - Subtle archival quantum wave contour lines (restrained olive & stone)
 * - Fine coherent particle nodes (copper & muted forest green)
 * - Gentle mouse-repulsion with smooth damping
 * - Automatically pauses when tab is hidden to conserve resources
 * - Honors prefers-reduced-motion
 */
export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Mouse coordinates with easing
    const mouse = {
      x: width * 0.5,
      y: height * 0.35,
      targetX: width * 0.5,
      targetY: height * 0.35,
      active: false
    };

    const handlePointerMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handlePointerLeave = () => {
      mouse.active = false;
      mouse.targetX = width * 0.5;
      mouse.targetY = height * 0.35;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener("resize", handleResize);

    // Particle pool setup (clean & restrained)
    const particleCount = Math.min(width < 768 ? 20 : 38, 45);
    let particles = [];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = 1.0 + Math.random() * 1.6;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.alpha = 0.15 + Math.random() * 0.35;
        this.phase = Math.random() * Math.PI * 2;
        this.colorType = Math.random() > 0.5 ? "copper" : "forest";
      }

      update() {
        if (!prefersReducedMotion) {
          this.x += this.vx;
          this.y += this.vy;

          // Wrap edges
          if (this.x < -20) this.x = width + 20;
          if (this.x > width + 20) this.x = -20;
          if (this.y < -20) this.y = height + 20;
          if (this.y > height + 20) this.y = -20;

          // Mouse gentle repulsion
          if (mouse.active) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = 160;
            if (dist < maxDist && dist > 0) {
              const force = (1 - dist / maxDist) * 1.2;
              this.x += (dx / dist) * force;
              this.y += (dy / dist) * force;
            }
          }
        }
      }

      draw(context, time) {
        const pulse = 0.85 + Math.sin(time * 0.0015 + this.phase) * 0.15;
        const currentAlpha = this.alpha * pulse;

        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        if (this.colorType === "copper") {
          context.fillStyle = `rgba(198, 114, 72, ${currentAlpha})`;
        } else {
          context.fillStyle = `rgba(32, 196, 180, ${currentAlpha})`;
        }
        context.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    initParticles();

    // Render loop
    const render = (time) => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // 1. Subtle Quantum Wave Interference Background contours
      if (!prefersReducedMotion) {
        ctx.save();
        ctx.lineWidth = 1;
        const waveCount = width < 768 ? 2 : 3;
        for (let w = 0; w < waveCount; w++) {
          ctx.beginPath();
          const baseOffsetY = height * (0.28 + w * 0.22);
          const freq = 0.0012 + w * 0.0004;
          const speed = (w % 2 === 0 ? 1 : -1) * (0.0004 + w * 0.0001);
          const amp = 24 + w * 10;

          for (let x = 0; x <= width; x += 35) {
            const y = baseOffsetY + Math.sin(x * freq + time * speed) * amp + Math.cos(x * freq * 0.4 - time * speed * 0.6) * (amp * 0.35);
            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.strokeStyle =
            w % 2 === 0
              ? `rgba(32, 196, 180, 0.04)`
              : `rgba(198, 114, 72, 0.035)`;
          ctx.stroke();
        }
        ctx.restore();
      }

      // 2. Coherence Lines between nearby particles
      const maxConnectDist = width < 768 ? 85 : 120;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            const alpha = (1 - dist / maxConnectDist) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(32, 196, 180, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // 3. Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(ctx, time);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.9
      }}
      aria-hidden="true"
    />
  );
}
