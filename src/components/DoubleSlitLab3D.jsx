import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  Play,
  Pause,
  RotateCcw,
  Info,
  Zap,
  Activity,
  BookOpen
} from "lucide-react";
import {
  PARTICLE_CONFIGS,
  calculateDoubleSlitPattern,
  sampleParticleImpact
} from "../utils/doubleSlitPhysics";
import MathView from "./MathView";

export default function DoubleSlitLab3D({ onSaveToNotebook }) {
  // Experiment Configuration State
  const [slitMode, setSlitMode] = useState("both"); // "both" | "left" | "right"
  const [particleKey, setParticleKey] = useState("photon_green");
  const [slitSeparationUm, setSlitSeparationUm] = useState(200); // d in micrometers
  const [slitWidthUm, setSlitWidthUm] = useState(40); // a in micrometers
  const [screenDistanceM, setScreenDistanceM] = useState(1.2); // D in meters
  const [fireRate, setFireRate] = useState("rapid"); // "single" | "slow" | "rapid" | "burst"
  const [isRunning, setIsRunning] = useState(true);

  // Particle Impact Accumulation State
  const [totalDetected, setTotalDetected] = useState(0);
  const particleHitsRef = useRef([]); // array of { xMm, yMm, time }
  const histogramBinsRef = useRef(new Array(60).fill(0));

  // Canvases and Three.js references
  const threeMountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const animFrameRef = useRef(null);

  const screenCanvasRef = useRef(null);
  const histogramCanvasRef = useRef(null);

  // Active particle config
  const activeParticle = PARTICLE_CONFIGS[particleKey] || PARTICLE_CONFIGS.photon_green;

  // Analytical physics pattern calculation
  const patternData = useMemo(() => {
    return calculateDoubleSlitPattern({
      slitMode,
      wavelengthNm: activeParticle.wavelengthNm,
      slitSeparationUm,
      slitWidthUm,
      screenDistanceM,
      screenSpanMm: 30,
      resolution: 600
    });
  }, [slitMode, activeParticle.wavelengthNm, slitSeparationUm, slitWidthUm, screenDistanceM]);

  // Reset accumulator when configuration changes
  const handleClearScreen = useCallback(() => {
    particleHitsRef.current = [];
    histogramBinsRef.current = new Array(60).fill(0);
    setTotalDetected(0);

    // Clear 2D detector canvas
    const screenCanvas = screenCanvasRef.current;
    if (screenCanvas) {
      const ctx = screenCanvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#080c14";
        ctx.fillRect(0, 0, screenCanvas.width, screenCanvas.height);
      }
    }
  }, []);

  const handleSelectSlitMode = useCallback((mode) => {
    setSlitMode(mode);
    handleClearScreen();
  }, [handleClearScreen]);

  const handleSelectParticleKey = useCallback((key) => {
    setParticleKey(key);
    handleClearScreen();
  }, [handleClearScreen]);

  // Add particles function
  const addParticles = useCallback(
    (count) => {
      const hits = [];
      const numBins = histogramBinsRef.current.length;
      const halfSpan = patternData.screenSpanMm / 2;

      for (let i = 0; i < count; i++) {
        const hit = sampleParticleImpact(patternData);
        hits.push(hit);

        // Update histogram bin
        const binIdx = Math.floor(((hit.xMm + halfSpan) / patternData.screenSpanMm) * numBins);
        if (binIdx >= 0 && binIdx < numBins) {
          histogramBinsRef.current[binIdx]++;
        }
      }

      particleHitsRef.current.push(...hits);
      // Cap memory to last 15,000 hits
      if (particleHitsRef.current.length > 15000) {
        particleHitsRef.current = particleHitsRef.current.slice(-15000);
      }

      setTotalDetected((prev) => prev + count);
    },
    [patternData]
  );

  // Particle emission ticker
  useEffect(() => {
    if (!isRunning) return;

    let intervalMs = 50;
    let batchSize = 1;

    if (fireRate === "slow") {
      intervalMs = 120;
      batchSize = 1;
    } else if (fireRate === "rapid") {
      intervalMs = 30;
      batchSize = 4;
    }

    const timer = setInterval(() => {
      addParticles(batchSize);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isRunning, fireRate, addParticles]);

  // Render 2D Detector Screen
  useEffect(() => {
    const canvas = screenCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const halfSpan = patternData.screenSpanMm / 2;

    // Dark phosphorescent screen background with subtle grid
    ctx.fillStyle = "#080c14";
    ctx.fillRect(0, 0, width, height);

    // Screen grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Centerline (x = 0)
    ctx.strokeStyle = "rgba(53, 214, 208, 0.25)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw particle impact blips
    const color = activeParticle.species === "matter" ? "#35d6d0" : activeParticle.wavelengthNm < 600 ? "#22c55e" : "#ef4444";
    const hits = particleHitsRef.current;
    const total = hits.length;

    // Draw dots with alpha
    ctx.fillStyle = color;
    for (let i = 0; i < total; i++) {
      const hit = hits[i];
      const px = ((hit.xMm + halfSpan) / patternData.screenSpanMm) * width;
      const py = height / 2 + (hit.yMm / 20) * (height / 2);

      if (px >= 0 && px <= width && py >= 0 && py <= height) {
        ctx.globalAlpha = 0.65;
        ctx.fillRect(px - 1, py - 1, 2, 2);
      }
    }
    ctx.globalAlpha = 1.0;

    // Scale bar in mm at bottom
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.fillText(`-${halfSpan.toFixed(0)} mm`, 10, height - 10);
    ctx.fillText("0 mm", width / 2 - 12, height - 10);
    ctx.fillText(`+${halfSpan.toFixed(0)} mm`, width - 50, height - 10);
  }, [totalDetected, patternData, activeParticle]);

  // Render Real-Time Histogram vs Analytical Curve
  useEffect(() => {
    const canvas = histogramCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = "rgba(11, 14, 22, 0.85)";
    ctx.fillRect(0, 0, width, height);

    const bins = histogramBinsRef.current;
    const numBins = bins.length;
    const binWidth = width / numBins;
    const maxBinCount = Math.max(1, ...bins);

    // 1. Draw Empirical Histogram Bars (Particles accumulated)
    const color = activeParticle.species === "matter" ? "rgba(53, 214, 208, 0.4)" : activeParticle.wavelengthNm < 600 ? "rgba(34, 197, 94, 0.4)" : "rgba(239, 68, 68, 0.4)";
    ctx.fillStyle = color;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";

    for (let i = 0; i < numBins; i++) {
      const barHeight = (bins[i] / maxBinCount) * (height - 30);
      const x = i * binWidth;
      const y = height - 20 - barHeight;
      ctx.fillRect(x + 1, y, binWidth - 2, barHeight);
    }

    // 2. Draw Exact Theoretical Analytical Curve
    const { positionsMm, normalizedIntensities, screenSpanMm } = patternData;
    const halfSpan = screenSpanMm / 2;

    ctx.beginPath();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;

    for (let i = 0; i < positionsMm.length; i++) {
      const xMm = positionsMm[i];
      const intensity = normalizedIntensities[i];
      const px = ((xMm + halfSpan) / screenSpanMm) * width;
      const py = height - 20 - intensity * (height - 30);

      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // 3. Legend & Scale
    ctx.fillStyle = "#ffffff";
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.fillText("— Theoretical Analytical Probability I(x)", 12, 18);

    ctx.fillStyle = activeParticle.species === "matter" ? "#35d6d0" : activeParticle.wavelengthNm < 600 ? "#22c55e" : "#ef4444";
    ctx.fillText(`■ Accumulated Particle Impacts (N = ${totalDetected.toLocaleString()})`, 280, 18);
  }, [totalDetected, patternData, activeParticle]);

  // Three.js 3D Apparatus Setup
  useEffect(() => {
    const container = threeMountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 360;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0d14);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 1.8, 3.8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0.4, 0);
    controlsRef.current = controls;

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(3, 4, 3);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Apparatus Optical Rail
    const railMat = new THREE.MeshStandardMaterial({ color: 0x181e2b, roughness: 0.3, metalness: 0.8 });
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 3.4), railMat);
    rail.position.set(0, 0, 0);
    scene.add(rail);

    // 1. Source Emitter (Laser / Electron Gun at z = 1.4)
    const sourceGroup = new THREE.Group();
    sourceGroup.position.set(0, 0.4, 1.4);

    const sourceMat = new THREE.MeshStandardMaterial({ color: 0x242d3d, metalness: 0.7, roughness: 0.3 });
    const sourceBody = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.3, 24), sourceMat);
    sourceBody.rotation.x = Math.PI / 2;
    sourceGroup.add(sourceBody);

    // Nozzle / Lens
    const nozzleMat = new THREE.MeshStandardMaterial({ color: 0x35d6d0, emissive: 0x35d6d0, emissiveIntensity: 0.6 });
    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.08, 16), nozzleMat);
    nozzle.rotation.x = Math.PI / 2;
    nozzle.position.set(0, 0, -0.16);
    sourceGroup.add(nozzle);

    // Source stand
    const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.38, 12), railMat);
    stand.position.set(0, -0.2, 0);
    sourceGroup.add(stand);

    scene.add(sourceGroup);

    // 2. Double-Slit Barrier Plate (at z = 0.2)
    const barrierGroup = new THREE.Group();
    barrierGroup.position.set(0, 0.4, 0.2);

    const barrierPlateMat = new THREE.MeshStandardMaterial({ color: 0x141822, metalness: 0.8, roughness: 0.2 });
    // Left plate
    const plateL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.6, 0.015), barrierPlateMat);
    plateL.position.set(-0.25, 0, 0);
    barrierGroup.add(plateL);

    // Center divider between slits
    const plateC = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.6, 0.015), barrierPlateMat);
    plateC.position.set(0, 0, 0);
    barrierGroup.add(plateC);

    // Right plate
    const plateR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.6, 0.015), barrierPlateMat);
    plateR.position.set(0.25, 0, 0);
    barrierGroup.add(plateR);

    // Mechanical Shutters for Slits
    const shutterMat = new THREE.MeshStandardMaterial({ color: 0xc67248, roughness: 0.4 });
    const shutterL = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.35, 0.018), shutterMat);
    shutterL.position.set(-0.05, 0, 0.005);
    shutterL.name = "shutterL";
    barrierGroup.add(shutterL);

    const shutterR = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.35, 0.018), shutterMat);
    shutterR.position.set(0.05, 0, 0.005);
    shutterR.name = "shutterR";
    barrierGroup.add(shutterR);

    // Barrier stand
    const barrierStand = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.38, 12), railMat);
    barrierStand.position.set(0, -0.2, 0);
    barrierGroup.add(barrierStand);

    scene.add(barrierGroup);

    // 3. Phosphorescent Detector Screen (at z = -1.2)
    const detectorGroup = new THREE.Group();
    detectorGroup.position.set(0, 0.4, -1.2);

    const screenFrameMat = new THREE.MeshStandardMaterial({ color: 0x1a2130, metalness: 0.6 });
    const screenFrame = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.7, 0.02), screenFrameMat);
    detectorGroup.add(screenFrame);

    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x080e18,
      roughness: 0.9,
      emissive: 0x35d6d0,
      emissiveIntensity: 0.08
    });
    const screenPlate = new THREE.Mesh(new THREE.PlaneGeometry(1.32, 0.62), screenMat);
    screenPlate.position.set(0, 0, 0.012);
    detectorGroup.add(screenPlate);

    // Detector stand
    const detStand = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.38, 12), railMat);
    detStand.position.set(0, -0.2, 0);
    detectorGroup.add(detStand);

    scene.add(detectorGroup);

    // Animation Loop
    let animTime = 0;
    const animate = () => {
      animTime += 0.016;

      // Update slit shutter positions based on slitMode
      if (shutterL && shutterR) {
        if (slitMode === "both") {
          shutterL.position.y = 0.5; // Open
          shutterR.position.y = 0.5; // Open
        } else if (slitMode === "left") {
          shutterL.position.y = 0.5; // Open
          shutterR.position.y = 0; // Closed
        } else if (slitMode === "right") {
          shutterL.position.y = 0; // Closed
          shutterR.position.y = 0.5; // Open
        }
      }

      controls.update();
      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (renderer) renderer.dispose();
    };
  }, [slitMode]);

  return (
    <div className="double-slit-lab-container">
      {/* Experiment Top Bar & Controls */}
      <div className="lab-controls-panel">
        <div className="controls-header">
          <div className="title-block">
            <span className="experiment-badge">EXPERIMENT 02</span>
            <h3 className="experiment-title">Double-Slit Wave-Particle Duality Accumulator</h3>
          </div>
          <div className="stats-badges">
            <div className="stat-pill">
              <span className="stat-label">Detected:</span>
              <strong className="stat-val font-mono">{totalDetected.toLocaleString()} particles</strong>
            </div>
            <div className="stat-pill">
              <span className="stat-label">Fringe Spacing (Δy):</span>
              <strong className="stat-val font-mono text-teal">
                {patternData.fringeSpacingMm > 0 ? `${patternData.fringeSpacingMm.toFixed(2)} mm` : "N/A"}
              </strong>
            </div>
          </div>
        </div>

        {/* Slit Configuration Switcher */}
        <div className="controls-row">
          <div className="control-group slit-mode-group">
            <span className="group-label">Slit Aperture Configuration:</span>
            <div className="slit-btn-group">
              <button
                type="button"
                onClick={() => handleSelectSlitMode("both")}
                className={`slit-btn ${slitMode === "both" ? "active" : ""}`}
              >
                <span>Two Slits Open (1 &amp; 2)</span>
                <span className="badge-interference">Wave Interference</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectSlitMode("left")}
                className={`slit-btn ${slitMode === "left" ? "active" : ""}`}
              >
                <span>Left Slit Only (1)</span>
                <span className="badge-diffraction">Single Diffraction</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectSlitMode("right")}
                className={`slit-btn ${slitMode === "right" ? "active" : ""}`}
              >
                <span>Right Slit Only (2)</span>
                <span className="badge-diffraction">Single Diffraction</span>
              </button>
            </div>
          </div>

          {/* Particle Beam Selection */}
          <div className="control-group">
            <span className="group-label">Beam Species &amp; Energy:</span>
            <select
              value={particleKey}
              onChange={(e) => handleSelectParticleKey(e.target.value)}
              className="species-select font-mono"
            >
              {Object.entries(PARTICLE_CONFIGS).map(([key, item]) => (
                <option key={key} value={key}>
                  {item.name} (λ = {item.wavelengthNm} nm)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Physical Sliders Row */}
        <div className="sliders-grid">
          <div className="slider-item">
            <div className="slider-label-row">
              <span className="slider-name">Slit Separation (d):</span>
              <span className="slider-val font-mono">{slitSeparationUm} μm</span>
            </div>
            <input
              type="range"
              min="80"
              max="400"
              step="10"
              value={slitSeparationUm}
              onChange={(e) => setSlitSeparationUm(Number(e.target.value))}
              className="lab-range-input"
            />
          </div>

          <div className="slider-item">
            <div className="slider-label-row">
              <span className="slider-name">Slit Width (a):</span>
              <span className="slider-val font-mono">{slitWidthUm} μm</span>
            </div>
            <input
              type="range"
              min="15"
              max="80"
              step="5"
              value={slitWidthUm}
              onChange={(e) => setSlitWidthUm(Number(e.target.value))}
              className="lab-range-input"
            />
          </div>

          <div className="slider-item">
            <div className="slider-label-row">
              <span className="slider-name">Detector Distance (D):</span>
              <span className="slider-val font-mono">{screenDistanceM.toFixed(1)} m</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={screenDistanceM}
              onChange={(e) => setScreenDistanceM(Number(e.target.value))}
              className="lab-range-input"
            />
          </div>

          {/* Emission Rate & Actions */}
          <div className="slider-item actions-item">
            <div className="action-buttons-group">
              <button
                type="button"
                onClick={() => setIsRunning(!isRunning)}
                className={`action-btn run-btn ${isRunning ? "running" : ""}`}
              >
                {isRunning ? <Pause size={14} /> : <Play size={14} />}
                <span>{isRunning ? "Pause" : "Resume"}</span>
              </button>

              <button
                type="button"
                onClick={() => setFireRate((prev) => (prev === "slow" ? "rapid" : "slow"))}
                className="action-btn rate-btn"
                title="Toggle emission rate between Slow (10/s) and Rapid (100/s)"
              >
                <span>{fireRate === "slow" ? "Rate: 10/s" : "Rate: 100/s"}</span>
              </button>

              <button
                type="button"
                onClick={() => addParticles(1)}
                className="action-btn step-btn"
                title="Fire a single quantum particle"
              >
                <Zap size={14} />
                <span>Single [1]</span>
              </button>

              <button
                type="button"
                onClick={() => addParticles(500)}
                className="action-btn burst-btn"
                title="Fire 500 particles in burst"
              >
                <Activity size={14} />
                <span>+500 Burst</span>
              </button>

              <button
                type="button"
                onClick={handleClearScreen}
                className="action-btn clear-btn"
                title="Clear screen and reset accumulator to N=0"
              >
                <RotateCcw size={14} />
                <span>Clear Screen</span>
              </button>

              {onSaveToNotebook && (
                <button
                  type="button"
                  onClick={() =>
                    onSaveToNotebook?.({
                      experimentType: "double_slit",
                      slitMode,
                      particleKey,
                      beamName: activeBeam.name,
                      slitSeparationUm,
                      slitWidthUm,
                      screenDistanceM,
                      detectedCount,
                      fringeSpacingMm
                    })
                  }
                  className="action-btn save-btn"
                  title="Save current experiment configuration to notebook"
                >
                  <BookOpen size={14} />
                  <span>Notebook</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Visual Display Grid: 3D Apparatus + 2D Phosphorescent Screen */}
      <div className="displays-grid">
        {/* Left: 3D Experimental Bench */}
        <div className="display-card three-card">
          <div className="card-header">
            <span className="card-title">3D Optical Bench Apparatus</span>
            <span className="card-hint">Drag to orbit • Scroll to zoom</span>
          </div>
          <div ref={threeMountRef} className="three-mount-viewport" />
          <div className="apparatus-legend">
            <span>Source Nozzle (z = 1.4 m)</span> &rarr;
            <span>Aperture Slits (z = 0.2 m)</span> &rarr;
            <span>Phosphorescent Detector (z = -1.2 m)</span>
          </div>
        </div>

        {/* Right: 2D Phosphorescent Impact Accumulator Canvas */}
        <div className="display-card screen-card">
          <div className="card-header">
            <span className="card-title">Phosphorescent Detector Screen (Individual Impacts)</span>
            <span className="impact-count-badge font-mono">N = {totalDetected.toLocaleString()}</span>
          </div>
          <div className="screen-canvas-container">
            <canvas ref={screenCanvasRef} width={500} height={320} className="phosphor-canvas" />
          </div>
          <div className="screen-footer-note">
            <span>
              {totalDetected < 50
                ? "At low counts, particles arrive at discrete, seemingly random points (Particle Behavior)."
                : slitMode === "both"
                ? "Fringes emerge through wave-particle duality: single particle probability waves self-interfere!"
                : "With only one slit open, interference is destroyed; only single-slit diffraction remains."}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Live Poisson Histogram vs Exact Theoretical Analytical Curve */}
      <div className="histogram-analysis-card">
        <div className="histogram-header">
          <div className="hist-title-row">
            <Activity size={16} color="var(--color-teal)" />
            <h4 className="hist-title">Empirical Particle Counts vs. Theoretical Probability Density <MathView math="I(x)" inline /></h4>
          </div>
          <div className="hist-meta">
            <span className="formula-tag font-mono">
              {slitMode === "both"
                ? "I(x) = I₀ [sin(β)/β]² cos²(α)"
                : "I(x) = (I₀/2) [sin(β)/β]²"}
            </span>
          </div>
        </div>
        <div className="histogram-canvas-wrapper">
          <canvas ref={histogramCanvasRef} width={900} height={180} className="hist-canvas" />
        </div>
      </div>

      {/* Scientific Principle Explainer */}
      <div className="scientific-explainer-card">
        <div className="explainer-header">
          <Info size={16} color="var(--color-copper)" />
          <h4 className="explainer-title">The Physical Principles of Wave-Particle Duality</h4>
        </div>
        <div className="explainer-content-grid">
          <div className="explainer-col">
            <h5 className="col-heading">1. Discrete Particle Measurement</h5>
            <p className="col-text">
              Every particle (whether photon or electron) deposits energy at a single localized point on the detector screen. You never detect a fraction of a particle or a smeared-out wave energy.
            </p>
          </div>
          <div className="explainer-col">
            <h5 className="col-heading">2. Statistical Wave Interference</h5>
            <p className="col-text">
              Even when particles are emitted one by one with minutes between firings, the statistical density of millions of impacts reproduces the wave interference pattern. Each particle’s quantum state is in a spatial superposition <MathView math="|\psi\rangle = \frac{1}{\sqrt{2}}(|\text{Slit 1}\rangle + |\text{Slit 2}\rangle)" inline />, undergoing self-interference.
            </p>
          </div>
          <div className="explainer-col">
            <h5 className="col-heading">3. One Slit vs. Two Slits</h5>
            <p className="col-text">
              Closing either slit eliminates the <MathView math="\cos^2(\alpha)" inline /> interference term entirely. The resulting pattern is smooth single-slit diffraction with NO alternating dark and bright fringes.
            </p>
          </div>
        </div>
        <div className="model-honesty-note">
          <strong>Physical Scope &amp; Model Transparency:</strong> Individual particle trajectories shown in the optical bench are schematic aids illustrating propagation paths. In quantum mechanics, a particle does not possess a definite trajectory prior to detection; the wavefunction evolves according to the Schrödinger wave equation until a localized measurement occurs at the detector plate.
        </div>
      </div>

      <style>{`
        .double-slit-lab-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          color: #f4f7ff;
          animation: fadeIn 0.25s ease-out;
        }

        .lab-controls-panel {
          background: rgba(18, 22, 32, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .controls-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .experiment-badge {
          display: inline-block;
          font-family: monospace;
          font-size: 0.72rem;
          color: #35d6d0;
          letter-spacing: 0.1em;
          margin-bottom: 4px;
        }

        .experiment-title {
          font-size: 1.25rem;
          margin: 0;
          color: #ffffff;
        }

        .stats-badges {
          display: flex;
          gap: 10px;
        }

        .stat-pill {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 6px 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
        }

        .stat-label {
          color: #8c9bb3;
        }

        .controls-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding-top: 16px;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .group-label {
          font-size: 0.76rem;
          color: #8c9bb3;
          font-weight: 600;
        }

        .slit-btn-group {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .slit-btn {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #d1d9ea;
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 2px;
          align-items: flex-start;
          transition: all 0.18s ease;
        }

        .slit-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .slit-btn.active {
          background: rgba(53, 214, 208, 0.15);
          border-color: #35d6d0;
          color: #ffffff;
        }

        .badge-interference {
          font-size: 0.68rem;
          color: #35d6d0;
          font-family: monospace;
        }

        .badge-diffraction {
          font-size: 0.68rem;
          color: #c67248;
          font-family: monospace;
        }

        .species-select {
          background: rgba(14, 18, 26, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #35d6d0;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 0.82rem;
          outline: none;
          cursor: pointer;
        }

        .sliders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          background: rgba(0, 0, 0, 0.25);
          border-radius: 8px;
          padding: 14px 16px;
        }

        .slider-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .slider-label-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
        }

        .slider-name {
          color: #8c9bb3;
        }

        .slider-val {
          color: #ffffff;
        }

        .lab-range-input {
          width: 100%;
          accent-color: #35d6d0;
          cursor: pointer;
        }

        .actions-item {
          justify-content: flex-end;
        }

        .action-buttons-group {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          color: #ffffff;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.76rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .action-btn.run-btn.running {
          background: rgba(53, 214, 208, 0.2);
          border-color: #35d6d0;
          color: #35d6d0;
        }

        .action-btn.clear-btn {
          background: rgba(198, 114, 72, 0.18);
          border-color: rgba(198, 114, 72, 0.4);
          color: #d1d9ea;
        }

        .displays-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 900px) {
          .displays-grid {
            grid-template-columns: 1fr;
          }
        }

        .display-card {
          background: rgba(18, 22, 32, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .card-header {
          padding: 10px 14px;
          background: rgba(14, 18, 26, 0.7);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-title {
          font-size: 0.82rem;
          font-weight: 600;
          color: #ffffff;
        }

        .card-hint {
          font-size: 0.72rem;
          color: #6b7c96;
        }

        .impact-count-badge {
          font-size: 0.76rem;
          color: #35d6d0;
          background: rgba(53, 214, 208, 0.15);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .three-mount-viewport {
          width: 100%;
          height: 320px;
          position: relative;
        }

        .apparatus-legend {
          padding: 8px 14px;
          background: rgba(0, 0, 0, 0.4);
          font-family: monospace;
          font-size: 0.7rem;
          color: #8c9bb3;
          display: flex;
          gap: 8px;
          align-items: center;
          justify-content: center;
        }

        .screen-canvas-container {
          width: 100%;
          height: 320px;
          background: #080c14;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .phosphor-canvas {
          width: 100%;
          height: 100%;
          display: block;
        }

        .screen-footer-note {
          padding: 8px 14px;
          background: rgba(0, 0, 0, 0.4);
          font-size: 0.72rem;
          color: #a9b6cf;
          line-height: 1.4;
        }

        .histogram-analysis-card {
          background: rgba(18, 22, 32, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .histogram-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .hist-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hist-title {
          font-size: 0.95rem;
          margin: 0;
          color: #ffffff;
        }

        .formula-tag {
          font-size: 0.78rem;
          color: #35d6d0;
          background: rgba(0, 0, 0, 0.4);
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .histogram-canvas-wrapper {
          width: 100%;
          height: 180px;
          background: #0b0e16;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .hist-canvas {
          width: 100%;
          height: 100%;
          display: block;
        }

        .scientific-explainer-card {
          background: rgba(18, 22, 32, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 18px 22px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .explainer-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .explainer-title {
          font-size: 0.95rem;
          margin: 0;
          color: #ffffff;
        }

        .explainer-content-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
        }

        .explainer-col {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .col-heading {
          font-size: 0.82rem;
          font-weight: 600;
          color: #35d6d0;
          margin: 0;
        }

        .col-text {
          font-size: 0.76rem;
          color: #a9b6cf;
          line-height: 1.5;
          margin: 0;
        }

        .model-honesty-note {
          background: rgba(0, 0, 0, 0.35);
          border-left: 3px solid #c67248;
          padding: 10px 14px;
          border-radius: 0 6px 6px 0;
          font-size: 0.74rem;
          color: #d1d9ea;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
