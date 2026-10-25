import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  X,
  Compass,
  Sun,
  Moon,
  Sunset,
  RotateCcw,
  Atom,
  Sparkles,
  HelpCircle,
  ExternalLink
} from "lucide-react";

// Check WebGL hardware support
function checkWebGLSupport() {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl2") || canvas.getContext("webgl")));
  } catch {
    return false;
  }
}

/**
 * Generates an oak parquet wood plank procedural texture canvas.
 */
function createWoodTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Base background
  ctx.fillStyle = "#2c1d13";
  ctx.fillRect(0, 0, 1024, 1024);

  const plankHeight = 64;
  const plankWidth = 256;

  const woodTones = ["#3e281b", "#473021", "#362215", "#4b3425", "#392418", "#503828"];

  for (let y = 0; y < 1024; y += plankHeight) {
    const rowOffset = (Math.floor(y / plankHeight) % 2) * (plankWidth / 2);
    for (let x = -plankWidth; x < 1024 + plankWidth; x += plankWidth) {
      const px = x + rowOffset;
      const toneIndex = Math.floor(Math.sin(x * 13 + y * 7) * 1000) % woodTones.length;
      ctx.fillStyle = woodTones[Math.abs(toneIndex)];
      ctx.fillRect(px, y, plankWidth - 2, plankHeight - 2);

      // Fine grain streaks
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      for (let g = 0; g < 6; g++) {
        const gy = y + Math.random() * (plankHeight - 4);
        ctx.fillRect(px, gy, plankWidth - 2, 1 + Math.random() * 2);
      }
      ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
      for (let g = 0; g < 4; g++) {
        const gy = y + Math.random() * (plankHeight - 4);
        ctx.fillRect(px, gy, plankWidth - 2, 1);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

/**
 * Generates an active laptop screen texture displaying QuantMix Quantum Lab telemetry.
 */
function createLaptopScreenTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Dark graphite UI background
  ctx.fillStyle = "#0B0D12";
  ctx.fillRect(0, 0, 512, 320);

  // Top header bar
  ctx.fillStyle = "#141822";
  ctx.fillRect(0, 0, 512, 40);

  ctx.fillStyle = "#20C4B4";
  ctx.font = "bold 16px 'JetBrains Mono', monospace";
  ctx.fillText("QUANTMIX // LAB CONSOLE", 20, 26);

  ctx.fillStyle = "#C67248";
  ctx.font = "12px 'JetBrains Mono', monospace";
  ctx.fillText("1D TUNNELING: ACTIVE", 340, 26);

  // Waveform graph area
  ctx.fillStyle = "#0F131C";
  ctx.fillRect(20, 56, 472, 160);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;

  for (let x = 20; x <= 492; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 56);
    ctx.lineTo(x, 216);
    ctx.stroke();
  }

  // Barrier block
  ctx.fillStyle = "rgba(198, 114, 72, 0.25)";
  ctx.fillRect(220, 70, 70, 146);
  ctx.strokeStyle = "#C67248";
  ctx.strokeRect(220, 70, 70, 146);

  // Animated wave
  ctx.beginPath();
  ctx.strokeStyle = "#20C4B4";
  ctx.lineWidth = 2.5;
  for (let x = 20; x <= 492; x += 3) {
    let y = 136;
    if (x < 220) {
      y += Math.sin((x - 20) * 0.08) * 35;
    } else if (x <= 290) {
      const decay = Math.exp(-(x - 220) * 0.04);
      y += Math.sin((220 - 20) * 0.08) * 35 * decay;
    } else {
      y += Math.sin((290 - 20) * 0.08 + (x - 290) * 0.08) * 12;
    }
    if (x === 20) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Bottom telemetry readouts
  ctx.fillStyle = "#A3ACB9";
  ctx.font = "12px 'JetBrains Mono', monospace";
  ctx.fillText("T = 10.4%   |   R = 89.6%   |   Conservation: R+T = 1.000", 24, 250);
  ctx.fillText("L = 0.35 nm |   V0 = 4.5 eV |   E = 3.8 eV", 24, 275);
  ctx.fillText("Pauli Pressure Status: STABLE MACROSCOPIC LATTICE", 24, 300);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Interactive object physical quantum facts
const OBJECT_QUANTUM_FACTS = {
  laptop: {
    title: "Quantum Computer Terminal (Laptop)",
    phenomenon: "Bandgap Semiconductors & Tunneling Memory",
    summary:
      "Inside this laptop, billions of nanoscale MOSFET transistors operate by quantum bandgap tuning. Furthermore, NAND flash storage traps charge carriers through quantum mechanical tunneling across a 1.2 nm dielectric oxide barrier without mechanical wear.",
    actionPrompt: "Inspect Quantum Lab Console"
  },
  water: {
    title: "Glass of Water",
    phenomenon: "Pauli Exclusion & Zero-Point Energy",
    summary:
      "Why does water stay liquid and refuse to collapse into an infinitely dense singularity? Because electrons are fermions obeying Pauli's Exclusion Principle. Quantum degeneracy pressure holds the atomic electron clouds apart, while zero-point energy prevents molecular motion from freezing at absolute zero.",
    actionPrompt: "Observe Degeneracy Pressure"
  },
  chair: {
    title: "Ergonomic Desk Chair",
    phenomenon: "Electron Degeneracy & Electrostatic Repulsion",
    summary:
      "Even though atoms are 99.999% empty space, you never fall through this chair. When you sit, the electron wavefunctions of your body overlap with the chair's fabric, causing overlapping fermion states to push back with macroscopic force.",
    actionPrompt: "Examine Solid State Physics"
  },
  desk: {
    title: "Solid Walnut Desk",
    phenomenon: "Covalent Bonding & Crystal Lattices",
    summary:
      "The rigidity of this wooden desk arises from shared quantum electron pairs forming covalent sp³ molecular orbitals in cellulose polymers. Quantum mechanics alone explains why solid matter holds its shape.",
    actionPrompt: "Study Molecular Orbitals"
  },
  window: {
    title: "Architectural Window",
    phenomenon: "Photon Absorption & Bandgap Transparency",
    summary:
      "Why is silicate glass transparent to visible light while wood is opaque? Glass has an electronic energy bandgap (> 3.5 eV) larger than visible photon energies (~1.8–3.1 eV). Visible photons cannot excite electrons across the gap and pass through unabsorbed.",
    actionPrompt: "Analyze Optical Bandgap"
  },
  books: {
    title: "Quantum Physics Textbooks",
    phenomenon: "Wavefunction Formalism & Mathematical Rigor",
    summary:
      "A curated collection of theoretical physics literature: 'Griffiths Quantum Mechanics', 'The Feynman Lectures on Physics', and 'Dirac's Principles of Quantum Mechanics'.",
    actionPrompt: "Browse Literature"
  },
  bed: {
    title: "Platform Bed & Bedding",
    phenomenon: "Thermal Phonons & Blackbody Radiation",
    summary:
      "The warmth of the bedding radiates electromagnetic blackbody spectrum photons directly obeying Max Planck's 1900 quantization law E = hν, the historical birth of quantum physics.",
    actionPrompt: "Inspect Thermal Physics"
  }
};

/**
 * Bedroom3D
 * Milestone 2 Navigable 3D Bedroom Environment.
 */
export default function Bedroom3D({ onClose, onOpenLab }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const [isWebGLSupported] = useState(checkWebGLSupport);
  const [timeOfDay, setTimeOfDay] = useState("twilight"); // "twilight" | "day" | "night"
  const [selectedObject, setSelectedObject] = useState(null);
  const [hoveredObjectName, setHoveredObjectName] = useState(null);
  const [showHelp, setShowHelp] = useState(true);

  // Three.js internal references
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const interactiveMeshesRef = useRef([]);
  const animFrameIdRef = useRef(null);

  // Lighting references for Time of Day switching
  const sunLightRef = useRef(null);
  const ambientLightRef = useRef(null);
  const deskLampLightRef = useRef(null);
  const windowGlowRef = useRef(null);

  // First-person keyboard movement state
  const keysPressedRef = useRef({});

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressedRef.current[e.key.toLowerCase()] = true;
      if (e.key === "Escape") {
        if (selectedObject) setSelectedObject(null);
        else onClose();
      }
    };
    const handleKeyUp = (e) => {
      keysPressedRef.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [selectedObject, onClose]);

  // Update Time of Day Lighting
  const applyTimeOfDay = useCallback((tod) => {
    setTimeOfDay(tod);
    const scene = sceneRef.current;
    const sun = sunLightRef.current;
    const ambient = ambientLightRef.current;
    const deskLamp = deskLampLightRef.current;
    const windowGlow = windowGlowRef.current;

    if (!scene || !sun || !ambient || !deskLamp) return;

    if (tod === "day") {
      scene.background = new THREE.Color("#88a6d4");
      sun.color.setHex(0xfff7e6);
      sun.intensity = 2.4;
      sun.position.set(-8, 6, -2);
      ambient.color.setHex(0x556677);
      ambient.intensity = 1.2;
      deskLamp.intensity = 0.6;
      if (windowGlow) windowGlow.material.color.setHex(0xb0d0ff);
    } else if (tod === "twilight") {
      scene.background = new THREE.Color("#0d121c");
      sun.color.setHex(0xe88a5a);
      sun.intensity = 1.6;
      sun.position.set(-7, 3, -1);
      ambient.color.setHex(0x182030);
      ambient.intensity = 0.8;
      deskLamp.intensity = 2.8;
      if (windowGlow) windowGlow.material.color.setHex(0xc67248);
    } else {
      // Night
      scene.background = new THREE.Color("#05070a");
      sun.color.setHex(0x334466);
      sun.intensity = 0.4;
      sun.position.set(-6, 8, 2);
      ambient.color.setHex(0x0e131d);
      ambient.intensity = 0.5;
      deskLamp.intensity = 3.2;
      if (windowGlow) windowGlow.material.color.setHex(0x203048);
    }
  }, []);

  // Reset Camera View
  const handleResetCamera = useCallback(() => {
    setSelectedObject(null);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    camera.position.set(0, 2.2, 4.4);
    controls.target.set(0, 1.1, 0);
    controls.update();
  }, []);

  // Focus Camera onto Selected Object
  const focusOnObject = useCallback((objKey) => {
    setSelectedObject(objKey);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    const targets = {
      laptop: { pos: [-0.65, 1.15, -0.6], target: [-0.65, 0.88, -1.05] },
      water: { pos: [-0.2, 1.1, -0.75], target: [-0.2, 0.88, -1.0] },
      chair: { pos: [-0.65, 1.2, 0.6], target: [-0.65, 0.6, -0.2] },
      desk: { pos: [-0.65, 1.6, 0.8], target: [-0.65, 0.75, -1.0] },
      window: { pos: [-0.5, 1.8, 1.2], target: [-3.18, 1.8, -0.8] },
      books: { pos: [-1.15, 1.15, -0.7], target: [-1.15, 0.85, -1.05] },
      bed: { pos: [1.8, 1.6, 1.5], target: [1.8, 0.6, -0.6] }
    };

    const targetConfig = targets[objKey];
    if (targetConfig) {
      camera.position.set(...targetConfig.pos);
      controls.target.set(...targetConfig.target);
      controls.update();
    }
  }, []);

  // 3D Scene Initialization
  useEffect(() => {
    if (!isWebGLSupported) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color("#0d121c");

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 80);
    camera.position.set(0, 2.2, 4.4);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.03;
    controls.minDistance = 1.0;
    controls.maxDistance = 8.5;
    controls.target.set(0, 1.1, 0);
    controlsRef.current = controls;

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x182030, 0.85);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const sunLight = new THREE.DirectionalLight(0xe88a5a, 1.8);
    sunLight.position.set(-7, 3, -1);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 20;
    sunLight.shadow.camera.left = -4;
    sunLight.shadow.camera.right = 4;
    sunLight.shadow.camera.top = 4;
    sunLight.shadow.camera.bottom = -4;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Focused desk lamp spotlight
    const deskLamp = new THREE.SpotLight(0xffdfb3, 2.8, 6, Math.PI / 4, 0.35, 1.2);
    deskLamp.position.set(-0.25, 1.55, -1.05);
    deskLamp.target.position.set(-0.65, 0.75, -1.0);
    deskLamp.castShadow = true;
    scene.add(deskLamp);
    scene.add(deskLamp.target);
    deskLampLightRef.current = deskLamp;

    // 6. Room Architecture Construction (6.4m x 6.4m x 3.2m)
    const roomGroup = new THREE.Group();
    const interactables = [];

    // Wood Parquet Floor
    const woodTexture = createWoodTexture();
    const floorGeo = new THREE.PlaneGeometry(6.4, 6.4);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x5a3e2a,
      map: woodTexture || undefined,
      roughness: 0.38,
      metalness: 0.08
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    roomGroup.add(floorMesh);

    // Ceiling
    const ceilingGeo = new THREE.PlaneGeometry(6.4, 6.4);
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x141822,
      roughness: 0.9
    });
    const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceilingMesh.position.y = 3.2;
    ceilingMesh.rotation.x = Math.PI / 2;
    roomGroup.add(ceilingMesh);

    // Wall Material
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x1b202c,
      roughness: 0.85
    });

    // Back Wall (Z = -3.2)
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 3.2), wallMat);
    backWall.position.set(0, 1.6, -3.2);
    backWall.receiveShadow = true;
    roomGroup.add(backWall);

    // Left Wall (X = -3.2) with Window Aperture
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 3.2), wallMat);
    leftWall.position.set(-3.2, 1.6, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    roomGroup.add(leftWall);

    // Right Wall (X = +3.2)
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 3.2), wallMat);
    rightWall.position.set(3.2, 1.6, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    roomGroup.add(rightWall);

    // Window Architecture (Left Wall X = -3.18)
    const windowFrameGeo = new THREE.BoxGeometry(0.12, 1.8, 2.6);
    const windowFrameMat = new THREE.MeshStandardMaterial({
      color: 0x222735,
      roughness: 0.3
    });
    const windowFrame = new THREE.Mesh(windowFrameGeo, windowFrameMat);
    windowFrame.position.set(-3.18, 1.8, -0.8);
    roomGroup.add(windowFrame);

    // Glass Panes
    const windowGlassGeo = new THREE.PlaneGeometry(2.4, 1.6);
    const windowGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xaaccff,
      transmission: 0.95,
      roughness: 0.05,
      transparent: true,
      opacity: 0.55
    });
    const windowGlass = new THREE.Mesh(windowGlassGeo, windowGlassMat);
    windowGlass.position.set(-3.17, 1.8, -0.8);
    windowGlass.rotation.y = Math.PI / 2;
    windowGlass.userData = { key: "window" };
    interactables.push(windowGlass);
    roomGroup.add(windowGlass);

    // Window Sky Vista Backdrop
    const skyVistaGeo = new THREE.PlaneGeometry(4.0, 2.6);
    const skyVistaMat = new THREE.MeshBasicMaterial({ color: 0xc67248 });
    const skyVista = new THREE.Mesh(skyVistaGeo, skyVistaMat);
    skyVista.position.set(-3.4, 1.8, -0.8);
    skyVista.rotation.y = Math.PI / 2;
    windowGlowRef.current = skyVista;
    roomGroup.add(skyVista);

    // Baseboards around floor
    const baseboardMat = new THREE.MeshStandardMaterial({ color: 0x0f131a, roughness: 0.4 });
    const bbBack = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.14, 0.04), baseboardMat);
    bbBack.position.set(0, 0.07, -3.18);
    roomGroup.add(bbBack);
    const bbLeft = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 6.4), baseboardMat);
    bbLeft.position.set(-3.18, 0.07, 0);
    roomGroup.add(bbLeft);
    const bbRight = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 6.4), baseboardMat);
    bbRight.position.set(3.18, 0.07, 0);
    roomGroup.add(bbRight);

    // Area Rug
    const rugGeo = new THREE.BoxGeometry(3.2, 0.015, 2.4);
    const rugMat = new THREE.MeshStandardMaterial({ color: 0x181f2c, roughness: 0.9 });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.position.set(-0.5, 0.008, 0.2);
    rug.receiveShadow = true;
    roomGroup.add(rug);

    // 7. Furniture: Modern Walnut Study Desk (X = -0.65, Z = -1.0)
    const deskGroup = new THREE.Group();
    deskGroup.position.set(-0.65, 0, -1.0);

    const deskTopGeo = new THREE.BoxGeometry(1.6, 0.05, 0.85);
    const deskTopMat = new THREE.MeshStandardMaterial({
      color: 0x422a1d,
      roughness: 0.35,
      metalness: 0.05
    });
    const deskTop = new THREE.Mesh(deskTopGeo, deskTopMat);
    deskTop.position.y = 0.75;
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskTop.userData = { key: "desk" };
    interactables.push(deskTop);
    deskGroup.add(deskTop);

    // Steel Desk Legs
    const legGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.73, 16);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x11141a, roughness: 0.25, metalness: 0.85 });
    const legPositions = [
      [-0.72, 0.365, -0.36],
      [0.72, 0.365, -0.36],
      [-0.72, 0.365, 0.36],
      [0.72, 0.365, 0.36]
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      deskGroup.add(leg);
    });

    roomGroup.add(deskGroup);

    // 8. Interactive Laptop
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(-0.65, 0.775, -1.05);

    // Base chassis
    const laptopBaseGeo = new THREE.BoxGeometry(0.34, 0.012, 0.24);
    const laptopAluMat = new THREE.MeshStandardMaterial({ color: 0x9aa0a6, roughness: 0.25, metalness: 0.85 });
    const laptopBase = new THREE.Mesh(laptopBaseGeo, laptopAluMat);
    laptopBase.castShadow = true;
    laptopGroup.add(laptopBase);

    // Keyboard tray
    const keyboardGeo = new THREE.PlaneGeometry(0.28, 0.12);
    const keyboardMat = new THREE.MeshStandardMaterial({ color: 0x181c24, roughness: 0.6 });
    const keyboard = new THREE.Mesh(keyboardGeo, keyboardMat);
    keyboard.rotation.x = -Math.PI / 2;
    keyboard.position.set(0, 0.007, 0.02);
    laptopGroup.add(keyboard);

    // Screen Lid (Opened at 105 degrees)
    const screenGroup = new THREE.Group();
    screenGroup.position.set(0, 0.006, -0.12);
    screenGroup.rotation.x = 0.28;

    const screenLid = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.22, 0.008), laptopAluMat);
    screenLid.position.set(0, 0.11, 0);
    screenLid.castShadow = true;
    screenGroup.add(screenLid);

    // Dynamic Display Screen with QuantMix Lab UI
    const screenTexture = createLaptopScreenTexture();
    const screenDisplayGeo = new THREE.PlaneGeometry(0.32, 0.2);
    const screenDisplayMat = new THREE.MeshBasicMaterial({ map: screenTexture || undefined });
    const screenDisplay = new THREE.Mesh(screenDisplayGeo, screenDisplayMat);
    screenDisplay.position.set(0, 0.11, 0.005);
    screenDisplay.userData = { key: "laptop" };
    interactables.push(screenDisplay);
    screenGroup.add(screenDisplay);

    laptopGroup.add(screenGroup);
    laptopGroup.userData = { key: "laptop" };
    interactables.push(laptopBase);
    roomGroup.add(laptopGroup);

    // 9. Interactive Glass of Water
    const glassGroup = new THREE.Group();
    glassGroup.position.set(-0.2, 0.775, -1.0);

    const glassOuterGeo = new THREE.CylinderGeometry(0.045, 0.038, 0.13, 24, 1, true);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.96,
      roughness: 0.04,
      transparent: true,
      opacity: 0.85,
      ior: 1.52,
      thickness: 0.06
    });
    const glassOuter = new THREE.Mesh(glassOuterGeo, glassMat);
    glassOuter.position.y = 0.065;
    glassOuter.castShadow = true;
    glassGroup.add(glassOuter);

    // Water Column
    const waterGeo = new THREE.CylinderGeometry(0.042, 0.036, 0.09, 24);
    const waterMat = new THREE.MeshPhysicalMaterial({
      color: 0x35d6d0,
      transmission: 0.88,
      roughness: 0.08,
      transparent: true,
      opacity: 0.7,
      ior: 1.33
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.y = 0.048;
    glassGroup.add(waterMesh);

    glassGroup.userData = { key: "water" };
    interactables.push(glassOuter);
    roomGroup.add(glassGroup);

    // 10. Stack of Physics Textbooks
    const bookGroup = new THREE.Group();
    bookGroup.position.set(-1.15, 0.775, -1.05);

    const bookColors = [0x1c3a3e, 0x8c4626, 0x1f2742];
    bookColors.forEach((col, idx) => {
      const bookGeo = new THREE.BoxGeometry(0.24, 0.032, 0.18);
      const bookMat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.6 });
      const book = new THREE.Mesh(bookGeo, bookMat);
      book.position.y = 0.016 + idx * 0.034;
      book.rotation.y = (idx - 1) * 0.08;
      book.castShadow = true;
      book.userData = { key: "books" };
      interactables.push(book);
      bookGroup.add(book);
    });
    roomGroup.add(bookGroup);

    // 11. Ergonomic Desk Chair (X = -0.65, Z = -0.3)
    const chairGroup = new THREE.Group();
    chairGroup.position.set(-0.65, 0, -0.35);

    const chairSeatGeo = new THREE.BoxGeometry(0.48, 0.06, 0.46);
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x242832, roughness: 0.7 });
    const chairSeat = new THREE.Mesh(chairSeatGeo, chairMat);
    chairSeat.position.y = 0.48;
    chairSeat.castShadow = true;
    chairSeat.userData = { key: "chair" };
    interactables.push(chairSeat);
    chairGroup.add(chairSeat);

    const chairBackGeo = new THREE.BoxGeometry(0.46, 0.55, 0.05);
    const chairBack = new THREE.Mesh(chairBackGeo, chairMat);
    chairBack.position.set(0, 0.78, 0.22);
    chairBack.rotation.x = -0.08;
    chairBack.castShadow = true;
    chairGroup.add(chairBack);

    // Chair Stem & 5-Star Caster Base
    const stemGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.42, 16);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x111317, metalness: 0.85, roughness: 0.2 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = 0.22;
    chairGroup.add(stem);

    for (let c = 0; c < 5; c++) {
      const angle = (c / 5) * Math.PI * 2;
      const armGeo = new THREE.BoxGeometry(0.24, 0.025, 0.04);
      const arm = new THREE.Mesh(armGeo, stemMat);
      arm.position.set(Math.cos(angle) * 0.12, 0.035, Math.sin(angle) * 0.12);
      arm.rotation.y = angle;
      chairGroup.add(arm);
    }
    roomGroup.add(chairGroup);

    // 12. Modern Platform Bed (X = 1.8, Z = -0.6)
    const bedGroup = new THREE.Group();
    bedGroup.position.set(1.8, 0, -0.6);

    // Wooden Frame
    const bedFrame = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.28, 2.3),
      new THREE.MeshStandardMaterial({ color: 0x3a2517, roughness: 0.4 })
    );
    bedFrame.position.y = 0.14;
    bedFrame.castShadow = true;
    bedFrame.receiveShadow = true;
    bedGroup.add(bedFrame);

    // Headboard
    const headboard = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.95, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x3a2517, roughness: 0.4 })
    );
    headboard.position.set(0, 0.62, -1.09);
    headboard.castShadow = true;
    bedGroup.add(headboard);

    // Mattress
    const mattress = new THREE.Mesh(
      new THREE.BoxGeometry(1.95, 0.28, 2.1),
      new THREE.MeshStandardMaterial({ color: 0xe2e5ea, roughness: 0.85 })
    );
    mattress.position.set(0, 0.42, 0.02);
    mattress.castShadow = true;
    mattress.userData = { key: "bed" };
    interactables.push(mattress);
    bedGroup.add(mattress);

    // Duvet / Blanket
    const duvet = new THREE.Mesh(
      new THREE.BoxGeometry(1.97, 0.12, 1.45),
      new THREE.MeshStandardMaterial({ color: 0x1f2636, roughness: 0.9 })
    );
    duvet.position.set(0, 0.52, 0.35);
    duvet.castShadow = true;
    bedGroup.add(duvet);

    // Dual Pillows
    const pillowGeo = new THREE.BoxGeometry(0.75, 0.14, 0.44);
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xf0f2f5, roughness: 0.8 });
    const pillow1 = new THREE.Mesh(pillowGeo, pillowMat);
    pillow1.position.set(-0.52, 0.6, -0.7);
    pillow1.rotation.x = 0.12;
    bedGroup.add(pillow1);
    const pillow2 = new THREE.Mesh(pillowGeo, pillowMat);
    pillow2.position.set(0.52, 0.6, -0.7);
    pillow2.rotation.x = 0.12;
    bedGroup.add(pillow2);

    roomGroup.add(bedGroup);

    // 13. Minimalist Wall Art Frame
    const artFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.9, 0.03),
      new THREE.MeshStandardMaterial({ color: 0x12151d, roughness: 0.3 })
    );
    artFrame.position.set(1.8, 1.9, -3.18);
    roomGroup.add(artFrame);

    const artCanvas = new THREE.Mesh(
      new THREE.PlaneGeometry(1.3, 0.8),
      new THREE.MeshBasicMaterial({ color: 0x20c4b4 })
    );
    artCanvas.position.set(1.8, 1.9, -3.16);
    roomGroup.add(artCanvas);

    scene.add(roomGroup);
    interactiveMeshesRef.current = interactables;

    // Raycaster for Hover & Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshesRef.current, true);

      if (intersects.length > 0) {
        let hitObj = intersects[0].object;
        while (hitObj && !hitObj.userData?.key && hitObj.parent) {
          hitObj = hitObj.parent;
        }
        if (hitObj?.userData?.key) {
          setHoveredObjectName(hitObj.userData.key);
          canvas.style.cursor = "pointer";
          return;
        }
      }
      setHoveredObjectName(null);
      canvas.style.cursor = "default";
    };

    const handlePointerDown = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshesRef.current, true);

      if (intersects.length > 0) {
        let hitObj = intersects[0].object;
        while (hitObj && !hitObj.userData?.key && hitObj.parent) {
          hitObj = hitObj.parent;
        }
        if (hitObj?.userData?.key) {
          focusOnObject(hitObj.userData.key);
        }
      }
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerdown", handlePointerDown);

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

    // Main 3D Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Keyboard first-person navigation
      const keys = keysPressedRef.current;
      const moveSpeed = 2.4 * delta;

      if (keys["w"] || keys["arrowup"]) {
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        dir.y = 0;
        dir.normalize();
        camera.position.addScaledVector(dir, moveSpeed);
        controls.target.addScaledVector(dir, moveSpeed);
      }
      if (keys["s"] || keys["arrowdown"]) {
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        dir.y = 0;
        dir.normalize();
        camera.position.addScaledVector(dir, -moveSpeed);
        controls.target.addScaledVector(dir, -moveSpeed);
      }
      if (keys["a"] || keys["arrowleft"]) {
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        dir.y = 0;
        dir.cross(camera.up).normalize();
        camera.position.addScaledVector(dir, -moveSpeed);
        controls.target.addScaledVector(dir, -moveSpeed);
      }
      if (keys["d"] || keys["arrowright"]) {
        const dir = new THREE.Vector3();
        camera.getWorldDirection(dir);
        dir.y = 0;
        dir.cross(camera.up).normalize();
        camera.position.addScaledVector(dir, moveSpeed);
        controls.target.addScaledVector(dir, moveSpeed);
      }

      // Constrain camera inside room boundaries
      camera.position.x = Math.max(-2.8, Math.min(2.8, camera.position.x));
      camera.position.z = Math.max(-2.8, Math.min(2.8, camera.position.z));
      camera.position.y = Math.max(0.6, Math.min(2.8, camera.position.y));

      controls.update();
      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      controls.dispose();
      renderer.dispose();
    };
  }, [isWebGLSupported, focusOnObject]);

  const activeFact = selectedObject ? OBJECT_QUANTUM_FACTS[selectedObject] : null;

  return (
    <div className="bedroom-modal-backdrop" role="dialog" aria-modal="true" aria-label="Walkable 3D Bedroom">
      <div className="bedroom-viewport-container" ref={containerRef}>
        {!isWebGLSupported ? (
          <div className="bedroom-fallback">
            <Atom size={36} color="#C67248" />
            <h3 className="font-serif">WebGL Not Available</h3>
            <p>Your browser could not initialize the 3D graphics context.</p>
            <button onClick={onClose} className="fallback-close-btn">
              Return to QuantMix
            </button>
          </div>
        ) : (
          <>
            <canvas ref={canvasRef} className="bedroom-canvas" />

            {/* Top Navigation HUD Bar */}
            <div className="bedroom-top-hud">
              <div className="hud-title-badge">
                <span className="hud-dot" />
                <span className="hud-brand font-serif">QuantMix</span>
                <span className="hud-separator">/</span>
                <span className="hud-env-name">Walkable 3D Bedroom</span>
              </div>

              {/* Time of Day Lighting Controls */}
              <div className="time-of-day-picker">
                <button
                  onClick={() => applyTimeOfDay("day")}
                  className={`tod-btn ${timeOfDay === "day" ? "active" : ""}`}
                  title="Daylight illumination"
                  aria-label="Daylight mode"
                >
                  <Sun size={14} />
                  <span>Day</span>
                </button>
                <button
                  onClick={() => applyTimeOfDay("twilight")}
                  className={`tod-btn ${timeOfDay === "twilight" ? "active" : ""}`}
                  title="Twilight study atmosphere"
                  aria-label="Twilight mode"
                >
                  <Sunset size={14} />
                  <span>Twilight</span>
                </button>
                <button
                  onClick={() => applyTimeOfDay("night")}
                  className={`tod-btn ${timeOfDay === "night" ? "active" : ""}`}
                  title="Midnight study atmosphere"
                  aria-label="Night mode"
                >
                  <Moon size={14} />
                  <span>Night</span>
                </button>
              </div>

              {/* Camera Reset & Close Buttons */}
              <div className="hud-actions">
                <button
                  onClick={handleResetCamera}
                  className="hud-action-btn"
                  title="Reset Camera Position"
                  aria-label="Reset camera"
                >
                  <RotateCcw size={15} />
                  <span>Reset Camera</span>
                </button>

                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className={`hud-action-btn ${showHelp ? "active" : ""}`}
                  title="Controls Guide"
                  aria-label="Toggle help"
                >
                  <HelpCircle size={15} />
                </button>

                <button
                  onClick={onClose}
                  className="hud-action-btn close-btn"
                  title="Exit 3D Room"
                  aria-label="Close 3D Room"
                >
                  <X size={17} />
                  <span>Exit Room</span>
                </button>
              </div>
            </div>

            {/* Hover Target Crosshair Indicator */}
            {hoveredObjectName && (
              <div className="hover-indicator-pill">
                <Sparkles size={13} color="var(--color-copper)" />
                <span>Click to Inspect {OBJECT_QUANTUM_FACTS[hoveredObjectName]?.title || hoveredObjectName}</span>
              </div>
            )}

            {/* Interactive Object Quantum Briefing Drawer */}
            {activeFact && (
              <div className="object-quantum-drawer">
                <div className="drawer-header">
                  <div className="drawer-title-row">
                    <Atom size={18} color="var(--color-teal)" />
                    <h4 className="drawer-title font-serif">{activeFact.title}</h4>
                  </div>
                  <button
                    onClick={() => setSelectedObject(null)}
                    className="drawer-close-btn"
                    aria-label="Close briefing"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="drawer-phenomenon-badge">
                  <span>Quantum Mechanism:</span>
                  <strong>{activeFact.phenomenon}</strong>
                </div>

                <p className="drawer-summary">{activeFact.summary}</p>

                {selectedObject === "laptop" && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenLab?.();
                    }}
                    className="drawer-action-btn"
                  >
                    <span>Launch Quantum Lab Simulation</span>
                    <ExternalLink size={14} />
                  </button>
                )}
              </div>
            )}

            {/* Compact Floating Help / Controls Overlay */}
            {showHelp && (
              <div className="bedroom-help-panel">
                <div className="help-header">
                  <Compass size={14} color="var(--color-teal)" />
                  <span>3D Navigation &amp; Interaction</span>
                </div>
                <ul className="help-list">
                  <li><strong>WASD / Arrows:</strong> Walk through the bedroom</li>
                  <li><strong>Mouse Drag:</strong> Look around &amp; rotate camera</li>
                  <li><strong>Scroll Wheel:</strong> Zoom in &amp; inspect details</li>
                  <li><strong>Click Object:</strong> Inspect quantum physical laws</li>
                </ul>
                <div className="interactive-tags">
                  <span className="tag-label">Clickable:</span>
                  <button onClick={() => focusOnObject("laptop")} className="quick-obj-tag">Laptop</button>
                  <button onClick={() => focusOnObject("water")} className="quick-obj-tag">Glass of Water</button>
                  <button onClick={() => focusOnObject("chair")} className="quick-obj-tag">Chair</button>
                  <button onClick={() => focusOnObject("desk")} className="quick-obj-tag">Desk</button>
                  <button onClick={() => focusOnObject("bed")} className="quick-obj-tag">Bed</button>
                  <button onClick={() => focusOnObject("window")} className="quick-obj-tag">Window</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .bedroom-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: #0B0D11;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bedroom-viewport-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
        }

        .bedroom-canvas {
          display: block;
          width: 100%;
          height: 100%;
          outline: none;
        }

        /* Top HUD */
        .bedroom-top-hud {
          position: absolute;
          top: 18px;
          left: 20px;
          right: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 20;
          pointer-events: none;
          flex-wrap: wrap;
          gap: 12px;
        }

        .hud-title-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(18, 21, 29, 0.88);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-stone);
          padding: 7px 16px;
          border-radius: var(--radius-full);
          pointer-events: auto;
          box-shadow: var(--shadow-sm);
        }

        .hud-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-teal);
          box-shadow: 0 0 8px var(--color-teal);
        }

        .hud-brand {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-text-main);
        }

        .hud-separator {
          color: var(--color-text-muted);
        }

        .hud-env-name {
          font-family: var(--font-mono);
          font-size: 0.8rem;
          color: var(--color-copper);
          font-weight: 600;
        }

        .time-of-day-picker {
          display: inline-flex;
          background: rgba(18, 21, 29, 0.88);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-stone);
          border-radius: var(--radius-full);
          padding: 4px;
          gap: 4px;
          pointer-events: auto;
        }

        .tod-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-family: var(--font-mono);
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tod-btn:hover {
          color: var(--color-text-main);
        }

        .tod-btn.active {
          background: rgba(255, 255, 255, 0.12);
          color: var(--color-text-main);
          font-weight: 600;
        }

        .hud-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          pointer-events: auto;
        }

        .hud-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(18, 21, 29, 0.88);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-stone);
          color: var(--color-text-main);
          padding: 7px 14px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-family: var(--font-sans);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .hud-action-btn:hover {
          background: rgba(30, 36, 48, 0.95);
          border-color: var(--color-teal);
        }

        .hud-action-btn.active {
          border-color: var(--color-teal);
          color: var(--color-teal);
        }

        .hud-action-btn.close-btn {
          background: rgba(198, 114, 72, 0.18);
          border-color: rgba(198, 114, 72, 0.5);
          color: #FFFFFF;
        }

        .hud-action-btn.close-btn:hover {
          background: rgba(198, 114, 72, 0.35);
        }

        /* Hover indicator */
        .hover-indicator-pill {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(18, 21, 29, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid var(--color-copper-border);
          padding: 7px 18px;
          border-radius: var(--radius-full);
          font-family: var(--font-mono);
          font-size: 0.82rem;
          color: #FFFFFF;
          pointer-events: none;
          z-index: 15;
          animation: fadeIn 0.15s ease;
        }

        /* Quantum Briefing Drawer */
        .object-quantum-drawer {
          position: absolute;
          top: 80px;
          right: 20px;
          width: 360px;
          background: rgba(18, 21, 29, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border-stone);
          border-left: 3px solid var(--color-teal);
          border-radius: var(--radius-md);
          padding: 22px;
          box-shadow: var(--shadow-float);
          z-index: 25;
          animation: slideInRight 0.25s ease-out;
        }

        .drawer-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .drawer-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .drawer-title {
          font-size: 1.15rem;
          color: var(--color-text-main);
          font-weight: 600;
        }

        .drawer-close-btn {
          color: var(--color-text-muted);
          cursor: pointer;
          padding: 4px;
        }

        .drawer-close-btn:hover {
          color: var(--color-text-main);
        }

        .drawer-phenomenon-badge {
          display: flex;
          flex-direction: column;
          font-size: 0.74rem;
          font-family: var(--font-mono);
          color: var(--color-copper);
          margin-bottom: 10px;
          background: var(--color-copper-dim);
          border: 1px solid var(--color-copper-border);
          padding: 4px 8px;
          border-radius: 4px;
        }

        .drawer-summary {
          font-size: 0.88rem;
          color: var(--color-text-secondary);
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .drawer-action-btn {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border-radius: var(--radius-sm);
          background: var(--color-teal);
          color: #0B0D11;
          font-weight: 700;
          font-size: 0.84rem;
          font-family: var(--font-mono);
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .drawer-action-btn:hover {
          opacity: 0.9;
        }

        /* Help Panel */
        .bedroom-help-panel {
          position: absolute;
          bottom: 24px;
          left: 20px;
          width: 320px;
          background: rgba(18, 21, 29, 0.92);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-stone);
          border-radius: var(--radius-md);
          padding: 16px 18px;
          z-index: 15;
        }

        .help-header {
          display: flex;
          align-items: center;
          gap: 7px;
          font-family: var(--font-mono);
          font-size: 0.78rem;
          font-weight: 600;
          text-transform: uppercase;
          color: var(--color-text-main);
          margin-bottom: 8px;
        }

        .help-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.76rem;
          color: var(--color-text-secondary);
          margin-bottom: 12px;
        }

        .help-list strong {
          color: var(--color-text-main);
        }

        .interactive-tags {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .tag-label {
          font-size: 0.7rem;
          font-family: var(--font-mono);
          color: var(--color-text-muted);
        }

        .quick-obj-tag {
          font-size: 0.72rem;
          font-family: var(--font-mono);
          padding: 2px 7px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--border-subtle);
          color: var(--color-teal);
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .quick-obj-tag:hover {
          background: rgba(32, 196, 180, 0.2);
        }

        .bedroom-fallback {
          padding: 80px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .fallback-close-btn {
          padding: 8px 18px;
          background: var(--color-copper);
          color: #FFFFFF;
          border-radius: var(--radius-full);
          font-weight: 600;
          cursor: pointer;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, 6px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @media (max-width: 768px) {
          .object-quantum-drawer {
            left: 20px;
            right: 20px;
            width: auto;
            top: auto;
            bottom: 20px;
          }
          .bedroom-help-panel {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
