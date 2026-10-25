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
  ExternalLink,
  Sliders,
  Scale
} from "lucide-react";
import { BEDROOM_QUANTUM_FACTS } from "../data/bedroomData";

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
 * Generates an authentic procedural oak parquet floor texture.
 */
function createOakParquetTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#2e1c12";
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

  // Wave curve
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

/**
 * Creates double-slit interference wall artwork texture
 */
function createWallArtTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#0d131f";
  ctx.fillRect(0, 0, 512, 512);

  // Subtle grid
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  for (let i = 0; i < 512; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(512, i);
    ctx.stroke();
  }

  // Wave interference pattern bands
  for (let x = 0; x < 512; x++) {
    const intensity = Math.pow(Math.cos((x - 256) * 0.045) * Math.sin((x - 256) * 0.015 + 0.001) / ((x - 256) * 0.015 + 0.001), 2);
    ctx.fillStyle = `rgba(53, 214, 208, ${Math.min(1, intensity * 0.85)})`;
    ctx.fillRect(x, 140, 1, 230);
  }

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px 'JetBrains Mono', monospace";
  ctx.fillText("YOUNG'S DOUBLE-SLIT INTERFERENCE", 40, 80);

  ctx.fillStyle = "#c67248";
  ctx.font = "14px 'JetBrains Mono', monospace";
  ctx.fillText("I(θ) = I₀ cos²(β) [sin(α)/α]²", 40, 110);

  return new THREE.CanvasTexture(canvas);
}

/**
 * Bedroom3D
 * Milestone 2 Navigable 3D Bedroom Environment.
 * Features:
 * - High-priority hit cylinder for glass of water (no table stealing focus).
 * - Selection Lock so selection remains stable until explicit deselect.
 * - Screen-space projected 2D contextual floating toolbar pinned directly to the object.
 * - Macroscopic Physical View vs. Microscopic Quantum View toggle in drawer.
 * - Keyboard shortcuts: E (inspect), F (focus), T (tweak), Q (lab), R (reset), H (help), Esc (close).
 * - Time-of-Day lighting presets (Day / Twilight / Night).
 * - Seamless environment switcher to 3D Street.
 */
export default function Bedroom3D({
  onClose,
  onOpenLab,
  onSwitchToStreet,
  onToggleTweak
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const [isWebGLSupported] = useState(checkWebGLSupport);
  const [timeOfDay, setTimeOfDay] = useState("twilight"); // "twilight" | "day" | "night"
  const [selectedObject, setSelectedObject] = useState(null);
  const [hoveredObjectName, setHoveredObjectName] = useState(null);
  const [showHelp, setShowHelp] = useState(true);
  const [viewMode, setViewMode] = useState("macro"); // "macro" | "quantum"

  // 2D Screen coordinates for contextual anchor
  const [screenCoords, setScreenCoords] = useState(null);

  // Three.js internal references
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const interactiveMeshesRef = useRef([]);
  const animFrameIdRef = useRef(null);
  const objectWorldPositionsRef = useRef({});

  // Lighting references
  const sunLightRef = useRef(null);
  const ambientLightRef = useRef(null);
  const deskLampLightRef = useRef(null);
  const windowGlowRef = useRef(null);

  // First-person keyboard movement state
  const keysPressedRef = useRef({});

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
    setViewMode("macro");
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    const targets = {
      laptop: { pos: [-0.65, 1.15, -0.6], target: [-0.65, 0.88, -1.05] },
      water: { pos: [-0.2, 1.05, -0.7], target: [-0.2, 0.88, -1.0] },
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

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept shortcuts when typing in inputs/textareas
      if (["input", "textarea", "select"].includes(e.target.tagName.toLowerCase())) {
        return;
      }

      const key = e.key.toLowerCase();
      keysPressedRef.current[key] = true;

      if (e.key === "Escape") {
        if (selectedObject) setSelectedObject(null);
        else onClose();
      } else if (key === "e") {
        if (hoveredObjectName && !selectedObject) {
          setSelectedObject(hoveredObjectName);
        }
      } else if (key === "f") {
        if (selectedObject) {
          focusOnObject(selectedObject);
        }
      } else if (key === "t") {
        onToggleTweak?.();
      } else if (key === "q") {
        onClose();
        onOpenLab?.();
      } else if (key === "h") {
        setShowHelp((prev) => !prev);
      } else if (key === "r") {
        handleResetCamera();
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
  }, [selectedObject, hoveredObjectName, onClose, onOpenLab, onToggleTweak, focusOnObject, handleResetCamera]);

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
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    rendererRef.current = renderer;

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1.1, 0);
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minDistance = 0.6;
    controls.maxDistance = 6.2;
    controlsRef.current = controls;

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x182030, 0.8);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const sunLight = new THREE.DirectionalLight(0xe88a5a, 1.6);
    sunLight.position.set(-7, 3, -1);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 18;
    sunLight.shadow.camera.left = -4;
    sunLight.shadow.camera.right = 4;
    sunLight.shadow.camera.top = 4;
    sunLight.shadow.camera.bottom = -4;
    sunLight.shadow.bias = -0.0003;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Desk Task Lamp (Focused Spotlight)
    const deskLampSpot = new THREE.SpotLight(0xffecc4, 2.8, 5.0, Math.PI / 4, 0.45, 1.2);
    deskLampSpot.position.set(-1.15, 1.5, -0.9);
    deskLampSpot.target.position.set(-0.65, 0.76, -1.0);
    deskLampSpot.castShadow = true;
    deskLampSpot.shadow.bias = -0.0005;
    deskLampSpot.shadow.mapSize.width = 1024;
    deskLampSpot.shadow.mapSize.height = 1024;
    scene.add(deskLampSpot);
    scene.add(deskLampSpot.target);
    deskLampLightRef.current = deskLampSpot;

    // Room interactables and world positions
    const interactables = [];
    const worldPosMap = {};
    const roomGroup = new THREE.Group();

    // 6. Architecture: Walls, Floor, Ceiling, Window
    const roomWidth = 6.4;
    const roomDepth = 6.4;
    const roomHeight = 3.2;

    // Floor (Procedural Oak Parquet)
    const floorGeo = new THREE.PlaneGeometry(roomWidth, roomDepth);
    const floorMat = new THREE.MeshStandardMaterial({
      roughness: 0.45,
      metalness: 0.05,
      map: createOakParquetTexture() || undefined
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    // Wall Material
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x181e2b,
      roughness: 0.9,
      metalness: 0.02
    });

    // Back Wall (Z = -3.2)
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomHeight), wallMat);
    backWall.position.set(0, roomHeight / 2, -roomDepth / 2);
    backWall.receiveShadow = true;
    roomGroup.add(backWall);

    // Right Wall (X = 3.2)
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(roomDepth, roomHeight), wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(roomWidth / 2, roomHeight / 2, 0);
    rightWall.receiveShadow = true;
    roomGroup.add(rightWall);

    // Left Wall with Window Frame (X = -3.2)
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(roomDepth, roomHeight), wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-roomWidth / 2, roomHeight / 2, 0);
    leftWall.receiveShadow = true;
    roomGroup.add(leftWall);

    // Ceiling
    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(roomWidth, roomDepth),
      new THREE.MeshStandardMaterial({ color: 0x0f131a, roughness: 0.95 })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, roomHeight, 0);
    roomGroup.add(ceiling);

    // Architectural Window Frame
    const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0x090b10, roughness: 0.3 });
    const winFrame = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.8, 2.2), windowFrameMat);
    winFrame.position.set(-roomWidth / 2 + 0.06, 1.8, -0.8);
    roomGroup.add(winFrame);

    // Window Glass Pane
    const winGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95,
      roughness: 0.02,
      transparent: true,
      opacity: 0.4,
      ior: 1.52
    });
    const winGlass = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.7), winGlassMat);
    winGlass.rotation.y = Math.PI / 2;
    winGlass.position.set(-roomWidth / 2 + 0.07, 1.8, -0.8);
    winGlass.userData = { key: "window", priority: 30 };
    interactables.push(winGlass);
    roomGroup.add(winGlass);
    worldPosMap.window = new THREE.Vector3(-roomWidth / 2 + 0.1, 1.8, -0.8);

    // Window Outdoor Glow
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xc67248 });
    const windowGlow = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.9), glowMat);
    windowGlow.rotation.y = Math.PI / 2;
    windowGlow.position.set(-roomWidth / 2 - 0.08, 1.8, -0.8);
    roomGroup.add(windowGlow);
    windowGlowRef.current = windowGlow;

    // Wall Art: Double-Slit Quantum Interference
    const artTexture = createWallArtTexture();
    const artGeo = new THREE.PlaneGeometry(1.6, 1.6);
    const artMat = new THREE.MeshBasicMaterial({ map: artTexture || undefined });
    const artMesh = new THREE.Mesh(artGeo, artMat);
    artMesh.position.set(0.6, 1.9, -roomDepth / 2 + 0.02);
    roomGroup.add(artMesh);

    // 7. Solid Walnut Desk (Desk Surface has low priority = 5 so it never steals focus from the glass)
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
    deskTop.userData = { key: "desk", priority: 5 }; // Low priority
    interactables.push(deskTop);
    deskGroup.add(deskTop);
    worldPosMap.desk = new THREE.Vector3(-0.65, 0.77, -1.0);

    // Steel Desk Legs
    const legGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.73, 16);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x11141a, roughness: 0.25, metalness: 0.85 });
    [
      [-0.72, 0.365, -0.36],
      [0.72, 0.365, -0.36],
      [-0.72, 0.365, 0.36],
      [0.72, 0.365, 0.36]
    ].forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      deskGroup.add(leg);
    });
    roomGroup.add(deskGroup);

    // 8. Interactive Laptop
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(-0.65, 0.775, -1.05);

    const laptopAluMat = new THREE.MeshStandardMaterial({ color: 0x9aa0a6, roughness: 0.25, metalness: 0.85 });
    const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.012, 0.24), laptopAluMat);
    laptopBase.castShadow = true;
    laptopGroup.add(laptopBase);

    // Dynamic Display Screen with QuantMix Lab UI
    const screenGroup = new THREE.Group();
    screenGroup.position.set(0, 0.006, -0.12);
    screenGroup.rotation.x = 0.28;

    const screenLid = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.22, 0.008), laptopAluMat);
    screenLid.position.set(0, 0.11, 0);
    screenLid.castShadow = true;
    screenGroup.add(screenLid);

    const screenTexture = createLaptopScreenTexture();
    const screenDisplay = new THREE.Mesh(
      new THREE.PlaneGeometry(0.32, 0.2),
      new THREE.MeshBasicMaterial({ map: screenTexture || undefined })
    );
    screenDisplay.position.set(0, 0.11, 0.005);
    screenDisplay.userData = { key: "laptop", priority: 90 };
    interactables.push(screenDisplay);
    screenGroup.add(screenDisplay);

    laptopGroup.add(screenGroup);

    // Generous hit box for laptop
    const laptopHit = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.32, 0.35),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    laptopHit.position.set(0, 0.15, -0.05);
    laptopHit.userData = { key: "laptop", priority: 90 };
    interactables.push(laptopHit);
    laptopGroup.add(laptopHit);

    worldPosMap.laptop = new THREE.Vector3(-0.65, 0.95, -1.05);
    roomGroup.add(laptopGroup);

    // 9. Interactive Glass of Water (Dedicated High-Priority Collider so Table CANNOT Steal Focus)
    const glassGroup = new THREE.Group();
    glassGroup.position.set(-0.2, 0.775, -1.0);

    const glassOuterGeo = new THREE.CylinderGeometry(0.045, 0.038, 0.13, 24);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.96,
      roughness: 0.03,
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

    // High-Priority Generous Hit Cylinder (Radius 0.12, Height 0.28)
    // Priority = 100 ensures the glass is ALWAYS selected over the desk underneath!
    const glassHit = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.28, 16),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    glassHit.position.y = 0.08;
    glassHit.userData = { key: "water", priority: 100 };
    interactables.push(glassHit);
    glassGroup.add(glassHit);

    worldPosMap.water = new THREE.Vector3(-0.2, 0.88, -1.0);
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
      bookGroup.add(book);
    });

    const bookHit = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.18, 0.28),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    bookHit.position.y = 0.08;
    bookHit.userData = { key: "books", priority: 85 };
    interactables.push(bookHit);
    bookGroup.add(bookHit);
    worldPosMap.books = new THREE.Vector3(-1.15, 0.88, -1.05);
    roomGroup.add(bookGroup);

    // 11. Ergonomic Desk Chair
    const chairGroup = new THREE.Group();
    chairGroup.position.set(-0.65, 0, -0.2);

    const chairFabricMat = new THREE.MeshStandardMaterial({ color: 0x1b2333, roughness: 0.8 });
    const chairFrameMat = new THREE.MeshStandardMaterial({ color: 0x0a0c10, roughness: 0.25, metalness: 0.85 });

    // Seat cushion
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.48), chairFabricMat);
    seat.position.y = 0.48;
    seat.castShadow = true;
    chairGroup.add(seat);

    // Backrest
    const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.52, 0.06), chairFabricMat);
    backrest.position.set(0, 0.78, 0.22);
    backrest.castShadow = true;
    chairGroup.add(backrest);

    // Central stem & 5-star caster base
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.44, 16), chairFrameMat);
    stem.position.y = 0.22;
    stem.castShadow = true;
    chairGroup.add(stem);

    // Hit box for chair
    const chairHit = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.95, 0.65),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    chairHit.position.y = 0.55;
    chairHit.userData = { key: "chair", priority: 40 };
    interactables.push(chairHit);
    chairGroup.add(chairHit);
    worldPosMap.chair = new THREE.Vector3(-0.65, 0.6, -0.2);
    roomGroup.add(chairGroup);

    // 12. Modern Platform Bed
    const bedGroup = new THREE.Group();
    bedGroup.position.set(1.8, 0, -0.6);

    const bedWoodMat = new THREE.MeshStandardMaterial({ color: 0x2e1e16, roughness: 0.45 });
    const mattressMat = new THREE.MeshStandardMaterial({ color: 0xe6e9ef, roughness: 0.85 });
    const duvetMat = new THREE.MeshStandardMaterial({ color: 0x20354a, roughness: 0.9 });

    // Wooden base frame
    const bedBase = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.28, 2.3), bedWoodMat);
    bedBase.position.y = 0.14;
    bedBase.castShadow = true;
    bedBase.receiveShadow = true;
    bedGroup.add(bedBase);

    // Headboard
    const headboard = new THREE.Mesh(new THREE.BoxGeometry(2.1, 1.1, 0.12), bedWoodMat);
    headboard.position.set(0, 0.55, -1.09);
    headboard.castShadow = true;
    bedGroup.add(headboard);

    // Mattress
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.26, 2.1), mattressMat);
    mattress.position.y = 0.41;
    mattress.castShadow = true;
    bedGroup.add(mattress);

    // Folded Duvet
    const duvet = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.12, 1.4), duvetMat);
    duvet.position.set(0, 0.58, 0.35);
    duvet.castShadow = true;
    bedGroup.add(duvet);

    // Dual Pillows
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xf5f7fa, roughness: 0.9 });
    const pillow1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.12, 0.45), pillowMat);
    pillow1.position.set(-0.48, 0.58, -0.75);
    pillow1.castShadow = true;
    bedGroup.add(pillow1);

    const pillow2 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.12, 0.45), pillowMat);
    pillow2.position.set(0.48, 0.58, -0.75);
    pillow2.castShadow = true;
    bedGroup.add(pillow2);

    // Hit box for bed
    const bedHit = new THREE.Mesh(
      new THREE.BoxGeometry(2.3, 1.0, 2.5),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    bedHit.position.y = 0.5;
    bedHit.userData = { key: "bed", priority: 30 };
    interactables.push(bedHit);
    bedGroup.add(bedHit);
    worldPosMap.bed = new THREE.Vector3(1.8, 0.6, -0.6);
    roomGroup.add(bedGroup);

    scene.add(roomGroup);
    interactiveMeshesRef.current = interactables;
    objectWorldPositionsRef.current = worldPosMap;

    // Raycaster for Hover & Selection with Priority Sorting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveMeshesRef.current, true);

      if (intersects.length > 0) {
        // Sort intersects by priority descending (highest priority wins), then by distance
        intersects.sort((a, b) => {
          const prioA = a.object.userData?.priority || 0;
          const prioB = b.object.userData?.priority || 0;
          if (prioB !== prioA) return prioB - prioA;
          return a.distance - b.distance;
        });

        const hitObj = intersects[0].object;
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
        intersects.sort((a, b) => {
          const prioA = a.object.userData?.priority || 0;
          const prioB = b.object.userData?.priority || 0;
          if (prioB !== prioA) return prioB - prioA;
          return a.distance - b.distance;
        });

        const hitObj = intersects[0].object;
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

      // Calculate screen-space coordinates for the active object
      const activeKey = selectedObject || hoveredObjectName;
      if (activeKey && objectWorldPositionsRef.current[activeKey]) {
        const worldPos = objectWorldPositionsRef.current[activeKey].clone();
        worldPos.y += 0.25; // Offset slightly above object
        worldPos.project(camera);

        if (worldPos.z < 1.0) {
          const sx = (worldPos.x * 0.5 + 0.5) * container.clientWidth;
          const sy = (-(worldPos.y * 0.5) + 0.5) * container.clientHeight;
          setScreenCoords({ x: sx, y: sy, key: activeKey });
        } else {
          setScreenCoords(null);
        }
      } else {
        setScreenCoords(null);
      }

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
  }, [isWebGLSupported, focusOnObject, selectedObject, hoveredObjectName]);

  const activeFact = selectedObject ? BEDROOM_QUANTUM_FACTS[selectedObject] : null;

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

              {/* Environment Switcher */}
              <div className="environment-selector-hud">
                <button className="env-switch-btn active" title="Currently in Bedroom Simulation">
                  <span>Bedroom</span>
                </button>
                <button onClick={onSwitchToStreet} className="env-switch-btn" title="Switch to 3D Street Simulation">
                  <span>Street</span>
                </button>
              </div>

              {/* Time of Day Lighting Controls */}
              <div className="time-of-day-picker">
                <button
                  onClick={() => applyTimeOfDay("day")}
                  className={`tod-btn ${timeOfDay === "day" ? "active" : ""}`}
                  title="Daylight mode"
                  aria-label="Daylight mode"
                >
                  <Sun size={14} />
                  <span>Day</span>
                </button>
                <button
                  onClick={() => applyTimeOfDay("twilight")}
                  className={`tod-btn ${timeOfDay === "twilight" ? "active" : ""}`}
                  title="Twilight mode"
                  aria-label="Twilight mode"
                >
                  <Sunset size={14} />
                  <span>Dusk</span>
                </button>
                <button
                  onClick={() => applyTimeOfDay("night")}
                  className={`tod-btn ${timeOfDay === "night" ? "active" : ""}`}
                  title="Night mode"
                  aria-label="Night mode"
                >
                  <Moon size={14} />
                  <span>Night</span>
                </button>
              </div>

              {/* Quick Actions HUD */}
              <div className="hud-actions-group">
                <button
                  onClick={onToggleTweak}
                  className="hud-action-btn tweak-trigger"
                  title="Open Simulation Tweak Panel [T]"
                >
                  <Sliders size={14} />
                  <span>Tweak [T]</span>
                </button>

                <button
                  onClick={handleResetCamera}
                  className="hud-action-btn"
                  title="Reset Camera [R]"
                  aria-label="Reset Camera View"
                >
                  <RotateCcw size={14} />
                  <span>Reset [R]</span>
                </button>

                <button
                  onClick={() => setShowHelp((prev) => !prev)}
                  className={`hud-action-btn ${showHelp ? "active" : ""}`}
                  title="Toggle Controls Guide [H]"
                  aria-label="Toggle Controls Help"
                >
                  <HelpCircle size={14} />
                </button>

                <button onClick={onClose} className="hud-action-btn close-btn" title="Exit Room [Esc]">
                  <X size={17} />
                  <span>Exit</span>
                </button>
              </div>
            </div>

            {/* Screen-Space Projected Contextual Toolbar Anchor */}
            {screenCoords && (
              <div
                className="screen-space-anchor-pill"
                style={{
                  transform: `translate(${screenCoords.x}px, ${screenCoords.y}px)`
                }}
              >
                <div className="anchor-dot" />
                <div className="anchor-card">
                  <div className="anchor-title-row">
                    <Sparkles size={12} color="var(--color-teal, #35d6d0)" />
                    <strong>{BEDROOM_QUANTUM_FACTS[screenCoords.key]?.title || screenCoords.key}</strong>
                  </div>
                  <div className="anchor-actions">
                    <button onClick={() => focusOnObject(screenCoords.key)} className="anchor-btn inspect-btn">
                      Inspect [E]
                    </button>
                    {selectedObject === screenCoords.key && (
                      <button onClick={() => setSelectedObject(null)} className="anchor-btn close-sub-btn">
                        Deselect [Esc]
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Object Quantum Briefing Drawer */}
            {activeFact && (
              <div className="object-quantum-drawer">
                <div className="drawer-header">
                  <div className="drawer-title-row">
                    <Atom size={18} color="var(--color-teal, #35d6d0)" />
                    <h4 className="drawer-title font-serif">{activeFact.title}</h4>
                  </div>
                  <button
                    onClick={() => setSelectedObject(null)}
                    className="drawer-close-btn"
                    aria-label="Close briefing [Esc]"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="drawer-phenomenon-badge">
                  <span>Quantum Mechanism:</span>
                  <strong>{activeFact.phenomenon}</strong>
                </div>

                {/* Macro vs Quantum View Mode Switcher */}
                <div className="view-mode-tabs">
                  <button
                    onClick={() => setViewMode("macro")}
                    className={`mode-tab ${viewMode === "macro" ? "active" : ""}`}
                  >
                    <span>Macroscopic Physical View</span>
                  </button>
                  <button
                    onClick={() => setViewMode("quantum")}
                    className={`mode-tab ${viewMode === "quantum" ? "active" : ""}`}
                  >
                    <span>Microscopic Quantum View</span>
                  </button>
                </div>

                {viewMode === "macro" ? (
                  <div className="view-mode-content">
                    <p className="drawer-summary">{activeFact.macroscopicSummary}</p>
                    <div className="scale-indicator">
                      <Scale size={13} color="var(--color-copper, #c67248)" />
                      <span>{activeFact.scale}</span>
                    </div>
                  </div>
                ) : (
                  <div className="view-mode-content">
                    <p className="drawer-summary">{activeFact.quantumSummary}</p>
                    <div className="equation-box">
                      <code>{activeFact.equation}</code>
                    </div>
                    <div className="citation-note">
                      <span>Source: {activeFact.citation}</span>
                    </div>
                  </div>
                )}

                <div className="drawer-actions-row">
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
                  {selectedObject === "water" && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenLab?.();
                      }}
                      className="drawer-action-btn"
                    >
                      <span>Simulate Atomic Barrier Tunneling</span>
                      <ExternalLink size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Compact Floating Help / Controls Overlay */}
            {showHelp && (
              <div className="bedroom-help-panel">
                <div className="help-header">
                  <Compass size={14} color="var(--color-teal, #35d6d0)" />
                  <span>3D Navigation &amp; Hotkeys</span>
                </div>
                <ul className="help-list">
                  <li><strong>WASD / Arrows:</strong> Walk through the bedroom</li>
                  <li><strong>Mouse Drag:</strong> Orbit camera &amp; look around</li>
                  <li><strong>Scroll:</strong> Zoom into desk &amp; glass details</li>
                  <li><strong>E:</strong> Inspect hovered object</li>
                  <li><strong>F:</strong> Focus camera on selected object</li>
                  <li><strong>T:</strong> Open / close Simulation Tweak panel</li>
                  <li><strong>Q:</strong> Launch analytical Quantum Lab</li>
                  <li><strong>Esc:</strong> Deselect / close drawer</li>
                </ul>
                <div className="interactive-tags">
                  <span className="tag-label">Inspectable:</span>
                  <button onClick={() => focusOnObject("water")} className="quick-obj-tag">Glass of Water</button>
                  <button onClick={() => focusOnObject("laptop")} className="quick-obj-tag">Laptop</button>
                  <button onClick={() => focusOnObject("chair")} className="quick-obj-tag">Chair</button>
                  <button onClick={() => focusOnObject("desk")} className="quick-obj-tag">Desk</button>
                  <button onClick={() => focusOnObject("bed")} className="quick-obj-tag">Bed</button>
                  <button onClick={() => focusOnObject("books")} className="quick-obj-tag">Books</button>
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
          z-index: 950;
          background: #0d121c;
          display: flex;
          flex-direction: column;
          animation: fadeIn 0.2s ease-out;
        }

        .bedroom-viewport-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
        }

        .bedroom-canvas {
          width: 100%;
          height: 100%;
          display: block;
        }

        .bedroom-top-hud {
          position: absolute;
          top: 14px;
          left: 18px;
          right: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(18, 21, 29, 0.88);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 8px 16px;
          z-index: 20;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .hud-title-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: monospace;
          font-size: 0.82rem;
        }

        .hud-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #35d6d0;
          box-shadow: 0 0 8px #35d6d0;
        }

        .hud-brand {
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #ffffff;
        }

        .hud-separator {
          color: rgba(255, 255, 255, 0.25);
        }

        .hud-env-name {
          color: #c67248;
          font-weight: 600;
        }

        .environment-selector-hud {
          display: flex;
          gap: 4px;
          background: rgba(0, 0, 0, 0.4);
          padding: 3px;
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .env-switch-btn {
          background: transparent;
          border: none;
          color: #8c9bb3;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 0.76rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .env-switch-btn.active {
          background: #c67248;
          color: #ffffff;
        }

        .env-switch-btn:hover:not(.active) {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.06);
        }

        .time-of-day-picker {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(0, 0, 0, 0.35);
          padding: 3px;
          border-radius: 6px;
        }

        .tod-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: transparent;
          border: none;
          color: #8c9bb3;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.74rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .tod-btn.active {
          background: rgba(198, 114, 72, 0.25);
          color: #ffffff;
        }

        .hud-actions-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hud-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #ffffff;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.76rem;
          font-family: monospace;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .hud-action-btn.tweak-trigger {
          background: rgba(53, 214, 208, 0.16);
          border-color: #35d6d0;
          color: #35d6d0;
          font-weight: 600;
        }

        .hud-action-btn:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .hud-action-btn.close-btn {
          background: rgba(198, 114, 72, 0.2);
          border-color: rgba(198, 114, 72, 0.5);
        }

        /* Screen-space projected anchor card */
        .screen-space-anchor-pill {
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: auto;
          z-index: 15;
          transform-origin: center bottom;
        }

        .anchor-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #35d6d0;
          box-shadow: 0 0 10px #35d6d0;
          margin: 0 auto 4px auto;
        }

        .anchor-card {
          background: rgba(18, 21, 29, 0.94);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(53, 214, 208, 0.4);
          padding: 8px 12px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
        }

        .anchor-title-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          color: #ffffff;
        }

        .anchor-actions {
          display: flex;
          gap: 6px;
        }

        .anchor-btn {
          border: none;
          border-radius: 4px;
          padding: 3px 8px;
          font-size: 0.7rem;
          font-family: monospace;
          cursor: pointer;
        }

        .inspect-btn {
          background: #35d6d0;
          color: #0b1020;
          font-weight: 700;
        }

        .close-sub-btn {
          background: rgba(255, 255, 255, 0.1);
          color: #a9b6cf;
        }

        /* Object Drawer */
        .object-quantum-drawer {
          position: absolute;
          top: 75px;
          right: 20px;
          width: 380px;
          max-width: calc(100vw - 30px);
          background: rgba(18, 21, 29, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-left: 3px solid #35d6d0;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
          z-index: 25;
          animation: slideInRight 0.22s ease-out;
          color: #f4f7ff;
        }

        .drawer-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .drawer-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .drawer-title {
          font-size: 1.05rem;
          margin: 0;
          color: #ffffff;
        }

        .drawer-close-btn {
          background: transparent;
          border: none;
          color: #a9b6cf;
          cursor: pointer;
        }

        .drawer-phenomenon-badge {
          background: rgba(53, 214, 208, 0.12);
          border: 1px solid rgba(53, 214, 208, 0.25);
          border-radius: 6px;
          padding: 6px 10px;
          font-size: 0.72rem;
          margin-bottom: 14px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .drawer-phenomenon-badge span {
          color: #8c9bb3;
        }

        .drawer-phenomenon-badge strong {
          color: #35d6d0;
          font-family: monospace;
        }

        .view-mode-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          margin-bottom: 12px;
        }

        .mode-tab {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #8c9bb3;
          border-radius: 6px;
          padding: 6px;
          font-size: 0.72rem;
          cursor: pointer;
        }

        .mode-tab.active {
          background: rgba(53, 214, 208, 0.18);
          border-color: #35d6d0;
          color: #ffffff;
          font-weight: 600;
        }

        .view-mode-content {
          margin-bottom: 14px;
        }

        .drawer-summary {
          font-size: 0.8rem;
          line-height: 1.5;
          color: #d1d9ea;
          margin: 0 0 10px 0;
        }

        .scale-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          color: #c67248;
          font-family: monospace;
        }

        .equation-box {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 8px 12px;
          font-family: monospace;
          color: #35d6d0;
          font-size: 0.82rem;
          margin-bottom: 8px;
        }

        .citation-note {
          font-size: 0.68rem;
          color: #6b7c96;
          font-style: italic;
        }

        .drawer-action-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #c67248;
          color: #ffffff;
          border: none;
          padding: 9px 14px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .drawer-action-btn:hover {
          background: #d88358;
        }

        /* Help panel */
        .bedroom-help-panel {
          position: absolute;
          bottom: 20px;
          left: 20px;
          width: 320px;
          background: rgba(18, 21, 29, 0.92);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          padding: 14px 16px;
          z-index: 15;
          color: #f4f7ff;
          font-size: 0.76rem;
        }

        .help-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #ffffff;
        }

        .help-list {
          list-style: none;
          padding: 0;
          margin: 0 0 10px 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
          color: #a9b6cf;
        }

        .help-list strong {
          color: #e2e8f5;
          font-family: monospace;
        }

        .interactive-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          align-items: center;
        }

        .tag-label {
          font-size: 0.68rem;
          color: #6b7c96;
        }

        .quick-obj-tag {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #35d6d0;
          padding: 2px 7px;
          border-radius: 4px;
          font-size: 0.68rem;
          font-family: monospace;
          cursor: pointer;
        }

        .quick-obj-tag:hover {
          background: rgba(53, 214, 208, 0.15);
        }

        .bedroom-fallback {
          padding: 60px 20px;
          text-align: center;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}
