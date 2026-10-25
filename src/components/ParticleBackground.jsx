import React, { useEffect, useRef } from "react";

/**
 * ParticleBackground
 * High-performance, lightweight scientific 2D canvas simulation.
 * Features:
 * - Ambient quantum probability field with faint sinusoidal wave interference contours
 * - Luminous floating particles with state-coherence threads
 * - Gentle mouse-repulsion / interaction with smooth damping
 * - Automatically pauses when document is hidden to conserve CPU/GPU
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

    // Particle pool setup (scaled appropriately for mobile vs desktop)
    const particleCount = Math.min(width < 768 ? 28 : 55, 65);
    let particles = [];

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = 1.2 + Math.random() * 2.2;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.alpha = 0.2 + Math.random() * 0.55;
        this.phase = Math.random() * Math.PI * 2;
        this.colorType = Math.random() > 0.45 ? "teal" : "violet";
      }

      update(time) {
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
            const maxDist = 180;
            if (dist < maxDist && dist > 0) {
              const force = (1 - dist / maxDist) * 1.5;
              this.x += (dx / dist) * force;
              this.y += (dy / dist) * force;
            }
          }
        }
      }

      draw(context, time) {
        const pulse = 0.8 + Math.sin(time * 0.002 + this.phase) * 0.2;
        const currentAlpha = this.alpha * pulse;

        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        if (this.colorType === "teal") {
          context.fillStyle = `rgba(53, 214, 208, ${currentAlpha})`;
        } else {
          context.fillStyle = `rgba(155, 140, 255, ${currentAlpha})`;
        }
        context.fill();

        // Subtle glow aura around larger particles
        if (this.radius > 2.2) {
          context.beginPath();
          context.arc(this.x, this.y, this.radius * 2.8, 0, Math.PI * 2);
          context.fillStyle =
            this.colorType === "teal"
              ? `rgba(53, 214, 208, ${currentAlpha * 0.15})`
              : `rgba(155, 140, 255, ${currentAlpha * 0.15})`;
          context.fill();
        }
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
    let lastTime = 0;
    const render = (time) => {
      if (document.hidden) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      ctx.clearRect(0, 0, width, height);

      // 1. Subtle Quantum Wave Interference Background lines
      if (!prefersReducedMotion) {
        ctx.save();
        ctx.lineWidth = 1;
        const waveCount = width < 768 ? 2 : 4;
        for (let w = 0; w < waveCount; w++) {
          ctx.beginPath();
          const baseOffsetY = height * (0.25 + w * 0.2);
          const freq = 0.0018 + w * 0.0006;
          const speed = (w % 2 === 0 ? 1 : -1) * (0.0008 + w * 0.0002);
          const amp = 30 + w * 14;

          for (let x = 0; x <= width; x += 30) {
            const y = baseOffsetY + Math.sin(x * freq + time * speed) * amp + Math.cos(x * freq * 0.5 - time * speed * 0.8) * (amp * 0.4);
            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.strokeStyle =
            w % 2 === 0
              ? `rgba(53, 214, 208, 0.035)`
              : `rgba(155, 140, 255, 0.035)`;
          ctx.stroke();
        }
        ctx.restore();
      }

      // 2. Coherence Lines between nearby particles
      const maxConnectDist = width < 768 ? 95 : 130;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            const alpha = (1 - dist / maxConnectDist) * 0.16;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(155, 140, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // 3. Particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(time);
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
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.95
      }}
    />
  );
}
