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
import { STREET_QUANTUM_FACTS } from "../data/streetData";

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
 * Street3D
 * Genuine 3D interactive Street Environment.
 * Features:
 * - 4-lane roadway with asphalt grain texture, double yellow centerlines, white dashed lane markings, and zebra crosswalk.
 * - Pavements, sidewalks, curbs, and architectural storefront buildings.
 * - Working traffic light system cycling colors with glowing emissive materials.
 * - Streetlights casting soft warm spotlight cones.
 * - Parked vehicle and animated cruising autonomous vehicle.
 * - Bus shelter, trees, benches, and street furniture.
 * - First-person walking (WASD/Arrows) with street collision clamping.
 * - Priority raycasting with screen-space projected contextual floating toolbar.
 * - Day / Twilight / Night lighting presets.
 * - Seamless environment switching to Bedroom.
 */
export default function Street3D({
  onClose,
  onOpenLab,
  onSwitchToBedroom,
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

  // 2D Screen-space coordinates of the currently active object
  const [screenCoords, setScreenCoords] = useState(null);

  // Three.js internal references
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const interactiveMeshesRef = useRef([]);
  const animFrameIdRef = useRef(null);
  const objectWorldPositionsRef = useRef({});

  // Dynamic moving car reference
  const movingCarRef = useRef(null);
  const trafficLightGroupRef = useRef(null);
  const trafficCycleTimerRef = useRef(0);

  // Lighting references
  const sunLightRef = useRef(null);
  const ambientLightRef = useRef(null);
  const streetLampLightsRef = useRef([]);

  // First-person keyboard movement
  const keysPressedRef = useRef({});

  // Reset Camera View
  const handleResetCamera = useCallback(() => {
    setSelectedObject(null);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    camera.position.set(0, 3.2, 12.0);
    controls.target.set(0, 1.5, 0);
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
      trafficLight: { pos: [3.8, 4.2, 4.5], target: [3.8, 3.8, 1.0] },
      streetlight: { pos: [-4.5, 3.5, 3.2], target: [-4.5, 4.8, 0.0] },
      car: { pos: [-1.8, 1.8, 3.8], target: [-1.8, 0.7, 1.5] },
      asphalt: { pos: [0, 1.8, 3.0], target: [0, 0, 1.0] },
      busStop: { pos: [5.8, 2.2, -1.5], target: [5.8, 1.6, -4.5] }
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
      // Don't intercept shortcuts when typing in inputs
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
    const streetLamps = streetLampLightsRef.current;

    if (!scene || !sun || !ambient) return;

    if (tod === "day") {
      scene.background = new THREE.Color("#7ba2d9");
      scene.fog = new THREE.FogExp2(0x7ba2d9, 0.012);
      sun.color.setHex(0xfff5ea);
      sun.intensity = 2.4;
      sun.position.set(20, 30, 15);
      ambient.color.setHex(0x556677);
      ambient.intensity = 1.2;
      streetLamps.forEach((lamp) => {
        lamp.intensity = 0.0;
      });
    } else if (tod === "twilight") {
      scene.background = new THREE.Color("#161a29");
      scene.fog = new THREE.FogExp2(0x161a29, 0.015);
      sun.color.setHex(0xe87a46);
      sun.intensity = 1.4;
      sun.position.set(-25, 12, 10);
      ambient.color.setHex(0x222a3d);
      ambient.intensity = 0.8;
      streetLamps.forEach((lamp) => {
        lamp.intensity = 2.2;
      });
    } else {
      // Night
      scene.background = new THREE.Color("#05070e");
      scene.fog = new THREE.FogExp2(0x05070e, 0.018);
      sun.color.setHex(0x223355);
      sun.intensity = 0.3;
      sun.position.set(-15, 25, -10);
      ambient.color.setHex(0x0b101c);
      ambient.intensity = 0.4;
      streetLamps.forEach((lamp) => {
        lamp.intensity = 3.6;
      });
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
    scene.background = new THREE.Color("#161a29");
    scene.fog = new THREE.FogExp2(0x161a29, 0.015);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 150);
    camera.position.set(0, 3.2, 12.0);
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
    renderer.toneMappingExposure = 1.05;
    rendererRef.current = renderer;

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.target.set(0, 1.5, 0);
    controls.maxPolarAngle = Math.PI / 2 - 0.03; // Prevent dipping below asphalt
    controls.minDistance = 1.2;
    controls.maxDistance = 35.0;
    controlsRef.current = controls;

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x222a3d, 0.8);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const sunLight = new THREE.DirectionalLight(0xe87a46, 1.4);
    sunLight.position.set(-25, 15, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 70;
    sunLight.shadow.camera.left = -20;
    sunLight.shadow.camera.right = 20;
    sunLight.shadow.camera.top = 20;
    sunLight.shadow.camera.bottom = -20;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // Interactables array
    const interactables = [];
    const worldPosMap = {};

    // 6. Road Surface (Asphalt)
    const roadGroup = new THREE.Group();
    const roadLength = 70;
    const roadWidth = 9.0;

    const asphaltGeo = new THREE.PlaneGeometry(roadWidth, roadLength);
    const asphaltMat = new THREE.MeshStandardMaterial({
      color: 0x181a1f,
      roughness: 0.88,
      metalness: 0.1
    });
    const asphaltMesh = new THREE.Mesh(asphaltGeo, asphaltMat);
    asphaltMesh.rotation.x = -Math.PI / 2;
    asphaltMesh.position.set(0, 0, 0);
    asphaltMesh.receiveShadow = true;
    asphaltMesh.userData = { key: "asphalt", priority: 10 };
    interactables.push(asphaltMesh);
    roadGroup.add(asphaltMesh);
    worldPosMap.asphalt = new THREE.Vector3(0, 0.1, 2.0);

    // Double Solid Yellow Centerlines
    const yellowLineGeo = new THREE.PlaneGeometry(0.12, roadLength);
    const yellowLineMat = new THREE.MeshBasicMaterial({ color: 0xffb703 });
    const yLine1 = new THREE.Mesh(yellowLineGeo, yellowLineMat);
    yLine1.rotation.x = -Math.PI / 2;
    yLine1.position.set(-0.15, 0.005, 0);
    roadGroup.add(yLine1);

    const yLine2 = new THREE.Mesh(yellowLineGeo, yellowLineMat);
    yLine2.rotation.x = -Math.PI / 2;
    yLine2.position.set(0.15, 0.005, 0);
    roadGroup.add(yLine2);

    // Dashed White Lane Dividers
    const dashLength = 2.4;
    const gapLength = 3.0;
    const dashCount = Math.floor(roadLength / (dashLength + gapLength));
    const whiteDashGeo = new THREE.PlaneGeometry(0.15, dashLength);
    const whiteDashMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < dashCount; i++) {
      const zPos = -roadLength / 2 + i * (dashLength + gapLength) + dashLength / 2;
      const dashLeft = new THREE.Mesh(whiteDashGeo, whiteDashMat);
      dashLeft.rotation.x = -Math.PI / 2;
      dashLeft.position.set(-2.25, 0.005, zPos);
      roadGroup.add(dashLeft);

      const dashRight = new THREE.Mesh(whiteDashGeo, whiteDashMat);
      dashRight.rotation.x = -Math.PI / 2;
      dashRight.position.set(2.25, 0.005, zPos);
      roadGroup.add(dashRight);
    }

    // Pedestrian Zebra Crosswalk at z = 6.0
    const zebraStripes = 8;
    const stripeWidth = 0.55;
    const stripeLength = 3.6;
    const stripeGeo = new THREE.PlaneGeometry(stripeWidth, stripeLength);
    const zebraMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.6 });

    for (let i = 0; i < zebraStripes; i++) {
      const stripe = new THREE.Mesh(stripeGeo, zebraMat);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(-3.5 + i * 1.0, 0.006, 6.0);
      roadGroup.add(stripe);
    }

    scene.add(roadGroup);

    // 7. Sidewalks & Curbs
    const sidewalkWidth = 4.2;
    const curbHeight = 0.18;
    const sidewalkGeo = new THREE.BoxGeometry(sidewalkWidth, curbHeight, roadLength);
    const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0x3d434d, roughness: 0.75 });

    // West Sidewalk (Left)
    const westSidewalk = new THREE.Mesh(sidewalkGeo, sidewalkMat);
    westSidewalk.position.set(-(roadWidth / 2 + sidewalkWidth / 2), curbHeight / 2, 0);
    westSidewalk.receiveShadow = true;
    scene.add(westSidewalk);

    // East Sidewalk (Right)
    const eastSidewalk = new THREE.Mesh(sidewalkGeo, sidewalkMat);
    eastSidewalk.position.set(roadWidth / 2 + sidewalkWidth / 2, curbHeight / 2, 0);
    eastSidewalk.receiveShadow = true;
    scene.add(eastSidewalk);

    // 8. Buildings Facades on Both Sides
    const buildingColors = [0x1c212d, 0x242b3b, 0x181c26, 0x2b3345];
    const buildingCount = 6;
    const buildingLength = roadLength / buildingCount;

    for (let i = 0; i < buildingCount; i++) {
      const zCenter = -roadLength / 2 + (i + 0.5) * buildingLength;
      const height = 12 + (i % 3) * 3;

      // West Buildings
      const bWestGeo = new THREE.BoxGeometry(10, height, buildingLength - 0.5);
      const bWestMat = new THREE.MeshStandardMaterial({
        color: buildingColors[i % buildingColors.length],
        roughness: 0.8
      });
      const bWest = new THREE.Mesh(bWestGeo, bWestMat);
      bWest.position.set(-(roadWidth / 2 + sidewalkWidth + 5), height / 2, zCenter);
      bWest.castShadow = true;
      bWest.receiveShadow = true;
      scene.add(bWest);

      // East Buildings
      const bEastGeo = new THREE.BoxGeometry(10, height, buildingLength - 0.5);
      const bEastMat = new THREE.MeshStandardMaterial({
        color: buildingColors[(i + 1) % buildingColors.length],
        roughness: 0.8
      });
      const bEast = new THREE.Mesh(bEastGeo, bEastMat);
      bEast.position.set(roadWidth / 2 + sidewalkWidth + 5, height / 2, zCenter);
      bEast.castShadow = true;
      bEast.receiveShadow = true;
      scene.add(bEast);
    }

    // 9. Streetlights (Cast-Iron Poles with Downward Spotlight Cones)
    const streetLamps = [];
    const lampPositions = [
      [-4.6, 0, 8.0],
      [-4.6, 0, -8.0],
      [4.6, 0, 8.0],
      [4.6, 0, -8.0]
    ];

    const poleMat = new THREE.MeshStandardMaterial({ color: 0x111622, roughness: 0.35, metalness: 0.85 });

    lampPositions.forEach(([lx, , lz], idx) => {
      const poleGroup = new THREE.Group();
      poleGroup.position.set(lx, curbHeight, lz);

      // Vertical pole
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 5.2, 16), poleMat);
      pole.position.y = 2.6;
      pole.castShadow = true;
      poleGroup.add(pole);

      // Curving arm
      const armDir = lx < 0 ? 1 : -1;
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.4, 12), poleMat);
      arm.rotation.z = armDir * 0.45;
      arm.position.set(armDir * 0.5, 5.0, 0);
      poleGroup.add(arm);

      // Luminaire Lamp Housing
      const lampHousing = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.25, 16), poleMat);
      lampHousing.rotation.x = Math.PI;
      lampHousing.position.set(armDir * 1.1, 5.2, 0);
      poleGroup.add(lampHousing);

      // Glowing Lamp Bulb
      const bulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffd180 })
      );
      bulb.position.set(armDir * 1.1, 5.05, 0);
      poleGroup.add(bulb);

      // Downward Spotlight
      const spotLight = new THREE.SpotLight(0xffdd99, 2.2, 18, Math.PI / 4, 0.35, 1.2);
      spotLight.position.set(armDir * 1.1, 5.0, 0);
      spotLight.target.position.set(armDir * 1.1, 0, 0);
      spotLight.castShadow = true;
      spotLight.shadow.bias = -0.0005;
      spotLight.shadow.mapSize.width = 1024;
      spotLight.shadow.mapSize.height = 1024;
      poleGroup.add(spotLight);
      poleGroup.add(spotLight.target);
      streetLamps.push(spotLight);

      // Invisible hit cylinder for easy inspection
      if (idx === 0) {
        const hitBox = new THREE.Mesh(
          new THREE.CylinderGeometry(0.5, 0.5, 5.5, 8),
          new THREE.MeshBasicMaterial({ visible: false })
        );
        hitBox.position.y = 2.75;
        hitBox.userData = { key: "streetlight", priority: 80 };
        interactables.push(hitBox);
        poleGroup.add(hitBox);
        worldPosMap.streetlight = new THREE.Vector3(lx, 3.5, lz);
      }

      scene.add(poleGroup);
    });
    streetLampLightsRef.current = streetLamps;

    // 10. Interactive Traffic Light Gantry at Crosswalk (z = 4.0)
    const trafficLightGroup = new THREE.Group();
    trafficLightGroup.position.set(3.8, curbHeight, 4.0);

    const tlPost = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 4.2, 16), poleMat);
    tlPost.position.y = 2.1;
    tlPost.castShadow = true;
    trafficLightGroup.add(tlPost);

    // Signal Housing Box
    const tlBoxGeo = new THREE.BoxGeometry(0.4, 1.0, 0.35);
    const tlBoxMat = new THREE.MeshStandardMaterial({ color: 0x15181e, roughness: 0.5 });
    const tlBox = new THREE.Mesh(tlBoxGeo, tlBoxMat);
    tlBox.position.set(0, 3.8, 0);
    tlBox.castShadow = true;
    trafficLightGroup.add(tlBox);

    // 3 Signal Lenses (Red, Yellow, Green)
    const lensGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const redLens = new THREE.Mesh(lensGeo, new THREE.MeshBasicMaterial({ color: 0xff3b30 }));
    redLens.position.set(0, 4.12, 0.18);
    trafficLightGroup.add(redLens);

    const yellowLens = new THREE.Mesh(lensGeo, new THREE.MeshBasicMaterial({ color: 0x332a00 }));
    yellowLens.position.set(0, 3.8, 0.18);
    trafficLightGroup.add(yellowLens);

    const greenLens = new THREE.Mesh(lensGeo, new THREE.MeshBasicMaterial({ color: 0x003311 }));
    greenLens.position.set(0, 3.48, 0.18);
    trafficLightGroup.add(greenLens);

    // Hit cylinder for traffic light
    const tlHit = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.55, 4.5, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    tlHit.position.y = 2.25;
    tlHit.userData = { key: "trafficLight", priority: 90 };
    interactables.push(tlHit);
    trafficLightGroup.add(tlHit);
    worldPosMap.trafficLight = new THREE.Vector3(3.8, 3.6, 4.0);

    scene.add(trafficLightGroup);
    trafficLightGroupRef.current = { redLens, yellowLens, greenLens };

    // 11. Interactive Parked Vehicle (Left Curbside at z = 1.5)
    const carGroup = new THREE.Group();
    carGroup.position.set(-2.8, 0.05, 1.5);

    // Chassis Base
    const carBodyMat = new THREE.MeshStandardMaterial({
      color: 0x1f3c6e,
      roughness: 0.2,
      metalness: 0.85
    });
    const carLower = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.6, 4.2), carBodyMat);
    carLower.position.y = 0.45;
    carLower.castShadow = true;
    carLower.receiveShadow = true;
    carGroup.add(carLower);

    // Cabin Glass / Roof
    const carCabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.55, 2.3), carBodyMat);
    carCabin.position.set(0, 0.95, -0.2);
    carCabin.castShadow = true;
    carGroup.add(carCabin);

    // Car Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.24, 20);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.85 });
    wheelGeo.rotateZ(Math.PI / 2);

    const wheelOffsets = [
      [-0.92, 0.32, 1.2],
      [0.92, 0.32, 1.2],
      [-0.92, 0.32, -1.2],
      [0.92, 0.32, -1.2]
    ];
    wheelOffsets.forEach(([wx, wy, wz]) => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.position.set(wx, wy, wz);
      wheel.castShadow = true;
      carGroup.add(wheel);
    });

    // Invisible Hit Box for Car
    const carHit = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 1.8, 4.8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    carHit.position.y = 0.9;
    carHit.userData = { key: "car", priority: 85 };
    interactables.push(carHit);
    carGroup.add(carHit);
    worldPosMap.car = new THREE.Vector3(-2.8, 1.2, 1.5);

    scene.add(carGroup);

    // 12. Dynamic Moving Vehicle (Right Lane: Traveling +Z to -Z)
    const movingCar = new THREE.Group();
    movingCar.position.set(2.2, 0.05, -28);

    const movingCarMat = new THREE.MeshStandardMaterial({
      color: 0x8a2424,
      roughness: 0.25,
      metalness: 0.8
    });
    const mLower = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.55, 3.8), movingCarMat);
    mLower.position.y = 0.42;
    mLower.castShadow = true;
    movingCar.add(mLower);

    const mCabin = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 2.0), movingCarMat);
    mCabin.position.set(0, 0.88, -0.2);
    mCabin.castShadow = true;
    movingCar.add(mCabin);

    // Headlights
    const hlGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const hlMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const hl1 = new THREE.Mesh(hlGeo, hlMat);
    hl1.position.set(-0.6, 0.45, 1.9);
    movingCar.add(hl1);
    const hl2 = new THREE.Mesh(hlGeo, hlMat);
    hl2.position.set(0.6, 0.45, 1.9);
    movingCar.add(hl2);

    scene.add(movingCar);
    movingCarRef.current = movingCar;

    // 13. Interactive Bus Stop Shelter (East Sidewalk at z = -4.5)
    const busStopGroup = new THREE.Group();
    busStopGroup.position.set(5.8, curbHeight, -4.5);

    const shelterFrameMat = new THREE.MeshStandardMaterial({ color: 0x1b202c, roughness: 0.3, metalness: 0.8 });
    const shelterGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.94,
      roughness: 0.05,
      transparent: true,
      opacity: 0.85,
      ior: 1.52,
      thickness: 0.04
    });

    // Rear glass panel
    const rearGlass = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.3, 0.06), shelterGlassMat);
    rearGlass.position.set(0, 1.15, -0.9);
    busStopGroup.add(rearGlass);

    // Side glass panels
    const sideGlass = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.3, 1.6), shelterGlassMat);
    sideGlass.position.set(-1.8, 1.15, -0.1);
    busStopGroup.add(sideGlass);

    // Roof
    const roof = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.08, 2.2), shelterFrameMat);
    roof.position.set(0, 2.35, -0.1);
    roof.castShadow = true;
    busStopGroup.add(roof);

    // Wooden Bench
    const benchMat = new THREE.MeshStandardMaterial({ color: 0x5a3d28, roughness: 0.6 });
    const bench = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.06, 0.4), benchMat);
    bench.position.set(0, 0.45, -0.6);
    bench.castShadow = true;
    busStopGroup.add(bench);

    // Hit box for bus stop
    const busStopHit = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 2.5, 2.4),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    busStopHit.position.y = 1.25;
    busStopHit.userData = { key: "busStop", priority: 85 };
    interactables.push(busStopHit);
    busStopGroup.add(busStopHit);
    worldPosMap.busStop = new THREE.Vector3(5.8, 1.6, -4.5);

    scene.add(busStopGroup);

    // Save interactables and positions
    interactiveMeshesRef.current = interactables;
    objectWorldPositionsRef.current = worldPosMap;

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
        // Sort by priority first (highest priority wins)
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

      // Keyboard navigation
      const keys = keysPressedRef.current;
      const moveSpeed = 4.5 * delta;

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

      // Constrain within street bounds
      camera.position.x = Math.max(-10, Math.min(10, camera.position.x));
      camera.position.z = Math.max(-30, Math.min(30, camera.position.z));
      camera.position.y = Math.max(0.8, Math.min(15, camera.position.y));

      // Move autonomous car down lane
      if (movingCarRef.current) {
        movingCarRef.current.position.z += 8.5 * delta;
        if (movingCarRef.current.position.z > 30) {
          movingCarRef.current.position.z = -30;
        }
      }

      // Traffic Light State Machine
      trafficCycleTimerRef.current += delta;
      const cycleTime = trafficCycleTimerRef.current % 12.0;
      if (trafficLightGroupRef.current) {
        const { redLens, yellowLens, greenLens } = trafficLightGroupRef.current;
        if (cycleTime < 5.0) {
          // Green Phase
          redLens.material.color.setHex(0x330000);
          yellowLens.material.color.setHex(0x332a00);
          greenLens.material.color.setHex(0x00ff66);
        } else if (cycleTime < 7.0) {
          // Yellow Phase
          redLens.material.color.setHex(0x330000);
          yellowLens.material.color.setHex(0xffcc00);
          greenLens.material.color.setHex(0x003311);
        } else {
          // Red Phase
          redLens.material.color.setHex(0xff3b30);
          yellowLens.material.color.setHex(0x332a00);
          greenLens.material.color.setHex(0x003311);
        }
      }

      // Compute Screen-space 2D position for currently selected object
      const activeKey = selectedObject || hoveredObjectName;
      if (activeKey && objectWorldPositionsRef.current[activeKey]) {
        const worldPos = objectWorldPositionsRef.current[activeKey].clone();
        worldPos.y += 0.45; // Offset slightly above object center
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

  const activeFact = selectedObject ? STREET_QUANTUM_FACTS[selectedObject] : null;

  return (
    <div className="street-modal-backdrop" role="dialog" aria-modal="true" aria-label="3D Street Environment">
      <div className="street-viewport-container" ref={containerRef}>
        {!isWebGLSupported ? (
          <div className="street-fallback">
            <Atom size={36} color="#35D6D0" />
            <h3 className="font-serif">WebGL Not Available</h3>
            <p>Your browser could not initialize the 3D graphics context for the street.</p>
            <button onClick={onClose} className="fallback-close-btn">
              Return to QuantMix
            </button>
          </div>
        ) : (
          <>
            <canvas ref={canvasRef} className="street-canvas" />

            {/* Top Navigation HUD Bar */}
            <div className="street-top-hud">
              <div className="hud-title-badge">
                <span className="hud-dot" />
                <span className="hud-brand font-serif">QuantMix</span>
                <span className="hud-separator">/</span>
                <span className="hud-env-name">Interactive 3D Street</span>
              </div>

              {/* Environment Switcher between Bedroom and Street */}
              <div className="environment-selector-hud">
                <button onClick={onSwitchToBedroom} className="env-switch-btn" title="Switch to Bedroom Simulation">
                  <span>Bedroom</span>
                </button>
                <button className="env-switch-btn active" title="Currently in Street Simulation">
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

                <button onClick={onClose} className="hud-action-btn close-btn" title="Exit Street [Esc]">
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
                    <strong>{STREET_QUANTUM_FACTS[screenCoords.key]?.title || screenCoords.key}</strong>
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
              <div className="street-object-drawer">
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

                {activeFact.materialComposition && (
                  <div className="street-material-card">
                    <span className="street-material-label font-mono">MATERIAL COMPOSITION</span>
                    <span className="street-material-val">{activeFact.materialComposition}</span>
                  </div>
                )}

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

                {activeFact.honestScopeNotice && (
                  <div className="honest-scope-callout">
                    <div className="scope-icon-row">
                      <Sparkles size={12} color="var(--color-copper, #c67248)" />
                      <span>Scientific Scope Notice</span>
                    </div>
                    <p>{activeFact.honestScopeNotice}</p>
                  </div>
                )}

                <div className="drawer-actions-row">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenLab?.(activeFact.exploreAction?.experimentKey || "tunneling");
                    }}
                    className="drawer-action-btn explore-btn"
                  >
                    <span>{activeFact.exploreAction?.label || "Launch Quantum Lab Solver"}</span>
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Floating Help / Controls Overlay */}
            {showHelp && (
              <div className="street-help-panel">
                <div className="help-header">
                  <Compass size={14} color="var(--color-teal, #35d6d0)" />
                  <span>Street Navigation &amp; Hotkeys</span>
                </div>
                <ul className="help-list">
                  <li><strong>WASD / Arrows:</strong> Walk along the street and crosswalk</li>
                  <li><strong>Mouse Drag:</strong> Orbit camera &amp; look around</li>
                  <li><strong>Scroll:</strong> Zoom into road surfaces &amp; shopfronts</li>
                  <li><strong>E:</strong> Inspect hovered street object</li>
                  <li><strong>F:</strong> Focus camera on selected object</li>
                  <li><strong>T:</strong> Open / close Simulation Tweak panel</li>
                  <li><strong>Q:</strong> Launch analytical Quantum Lab</li>
                  <li><strong>Esc:</strong> Deselect / close drawer</li>
                </ul>
                <div className="interactive-tags">
                  <span className="tag-label">Inspectable Objects:</span>
                  <button onClick={() => focusOnObject("trafficLight")} className="quick-obj-tag">Traffic LED</button>
                  <button onClick={() => focusOnObject("streetlight")} className="quick-obj-tag">Streetlight</button>
                  <button onClick={() => focusOnObject("car")} className="quick-obj-tag">Car Body</button>
                  <button onClick={() => focusOnObject("asphalt")} className="quick-obj-tag">Asphalt</button>
                  <button onClick={() => focusOnObject("busStop")} className="quick-obj-tag">Bus Shelter</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .street-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 950;
          background: #05070e;
          display: flex;
          flex-direction: column;
          animation: fadeIn 0.2s ease-out;
        }

        .street-viewport-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
        }

        .street-canvas {
          width: 100%;
          height: 100%;
          display: block;
        }

        .street-top-hud {
          position: absolute;
          top: 14px;
          left: 18px;
          right: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(11, 16, 32, 0.88);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(53, 214, 208, 0.2);
          border-radius: 8px;
          padding: 8px 16px;
          z-index: 20;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
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
          color: #35d6d0;
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
          background: #35d6d0;
          color: #0b1020;
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
          background: rgba(53, 214, 208, 0.2);
          color: #35d6d0;
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
          color: #f4f7ff;
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
          color: #ffffff;
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
          background: rgba(11, 16, 32, 0.94);
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

        /* Street Object Drawer */
        .street-object-drawer {
          position: absolute;
          top: 75px;
          right: 20px;
          width: 380px;
          max-width: calc(100vw - 30px);
          background: rgba(11, 16, 32, 0.95);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(53, 214, 208, 0.3);
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

        .street-material-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 8px 10px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .street-material-label {
          font-size: 0.64rem;
          color: #8c9bb3;
          letter-spacing: 0.05em;
        }

        .street-material-val {
          font-size: 0.74rem;
          color: #ffffff;
          line-height: 1.35;
        }

        .honest-scope-callout {
          background: rgba(198, 114, 72, 0.1);
          border-left: 3px solid #c67248;
          border-radius: 0 6px 6px 0;
          padding: 8px 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .scope-icon-row {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #c67248;
          font-size: 0.68rem;
          font-family: monospace;
          text-transform: uppercase;
        }

        .honest-scope-callout p {
          font-size: 0.7rem;
          color: #e2e8f5;
          line-height: 1.4;
          margin: 0;
        }

        .drawer-action-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #35d6d0;
          color: #0b1020;
          border: none;
          padding: 9px 14px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .drawer-action-btn:hover {
          background: #4ae0da;
        }

        /* Help panel */
        .street-help-panel {
          position: absolute;
          bottom: 20px;
          left: 20px;
          width: 320px;
          background: rgba(11, 16, 32, 0.92);
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

        .street-fallback {
          padding: 60px 20px;
          text-align: center;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}
