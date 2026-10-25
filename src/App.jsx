import React, { useState, useMemo, useEffect } from "react";
import ParticleBackground from "./components/ParticleBackground";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DiscoverySection from "./components/DiscoverySection";
import EnvironmentPreview from "./components/EnvironmentPreview";
import QuantumLabPreview from "./components/QuantumLabPreview";
import QuAntIPreview from "./components/QuAntIPreview";
import Footer from "./components/Footer";
import AtomicIntro from "./components/AtomicIntro";
import Bedroom3D from "./components/Bedroom3D";
import Street3D from "./components/Street3D";
import TweakPanel from "./components/TweakPanel";
import ConfigComparisonModal from "./components/ConfigComparisonModal";
import { calculateRectangularBarrierTunneling } from "./utils/quantumPhysics";

/**
 * QuantMix Homepage
 * Virtual Quantum Mechanics Explorer.
 *
 * Core Systems:
 * - 4-Second Atomic Intro with Skip Button and Session Memory
 * - Signature Flowing-Wave Start Button with Ripple Physics
 * - Curated Random Discovery System
 * - 6 Exploratory Environments with Walkable 3D Bedroom & 3D Street Scenes
 * - Precision 1D Schrödinger Scattering Analytical Quantum Lab (R + T = 1.000000)
 * - Classical vs. Quantum Side-by-Side Comparison Engine
 * - Floating Tweak Panel [T] with Live Preset Benchmarks & Snapshot A/B Comparator
 * - QuAntI Scientific AI Intelligence Console with Live Simulation Telemetry
 * - Ambient Canvas Wave & Coherence Particle System
 */
export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    try {
      const seen = sessionStorage.getItem("quantmix_intro_seen");
      return !seen;
    } catch {
      return true;
    }
  });

  const [forceIntro, setForceIntro] = useState(false);

  // Environment View Modals
  const [showBedroom3D, setShowBedroom3D] = useState(false);
  const [showStreet3D, setShowStreet3D] = useState(false);

  // Tweak Panel & Config Comparison Modals
  const [showTweakPanel, setShowTweakPanel] = useState(false);
  const [showCompModal, setShowCompModal] = useState(false);

  // Shared Physical Simulation State
  const [energyEv, setEnergyEv] = useState(3.8); // eV
  const [barrierHeightEv, setBarrierHeightEv] = useState(4.5); // eV
  const [barrierWidthNm, setBarrierWidthNm] = useState(0.35); // nm
  const [particleKey, setParticleKey] = useState("electron");
  const [simMode, setSimMode] = useState("helix");
  const [showClassicalComparison, setShowClassicalComparison] = useState(true);

  // Experiment Comparison Configurations (Snapshots A and B)
  const [configA, setConfigA] = useState(() => ({
    name: "Preset A (STM Vacuum Gap)",
    particleKey: "electron",
    energyEv: 3.8,
    barrierHeightEv: 4.5,
    barrierWidthNm: 0.35,
    physicsData: calculateRectangularBarrierTunneling(3.8, 4.5, 0.35, "electron")
  }));

  const [configB, setConfigB] = useState(() => ({
    name: "Preset B (Wider Barrier)",
    particleKey: "electron",
    energyEv: 3.8,
    barrierHeightEv: 4.5,
    barrierWidthNm: 0.65,
    physicsData: calculateRectangularBarrierTunneling(3.8, 4.5, 0.65, "electron")
  }));

  // Analytical physics solver output
  const physicsData = useMemo(() => {
    return calculateRectangularBarrierTunneling(
      energyEv,
      barrierHeightEv,
      barrierWidthNm,
      particleKey
    );
  }, [energyEv, barrierHeightEv, barrierWidthNm, particleKey]);

  // Global Keyboard Shortcut: 'T' toggles Tweak Panel without stealing typing focus
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "t" || e.key === "T") {
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        if (activeTag === "input" || activeTag === "textarea") return;
        setShowTweakPanel((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    setForceIntro(false);
  };

  const handleReplayIntro = () => {
    setForceIntro(true);
    setShowIntro(true);
  };

  const scrollToLab = () => {
    const el = document.getElementById("lab") || document.getElementById("quantum-lab");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="quantmix-app-root">
      {/* 4-Second Atomic Intro Overlay */}
      {showIntro && (
        <AtomicIntro
          onComplete={handleIntroComplete}
          forceShow={forceIntro}
        />
      )}

      {/* Ambient Quantum Field Canvas Background */}
      <ParticleBackground />

      {/* Global Navigation Bar */}
      <Navbar onReplayIntro={handleReplayIntro} />

      {/* Main Content Sections */}
      <main id="main-content" tabIndex={-1}>
        <Hero
          onExplore={() => {
            const el = document.getElementById("environments");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          onOpenBedroom={() => setShowBedroom3D(true)}
          onOpenStreet={() => setShowStreet3D(true)}
        />

        <DiscoverySection />

        <EnvironmentPreview
          onOpenBedroom={() => setShowBedroom3D(true)}
          onOpenStreet={() => setShowStreet3D(true)}
        />

        <QuantumLabPreview
          energyEv={energyEv}
          setEnergyEv={setEnergyEv}
          barrierHeightEv={barrierHeightEv}
          setBarrierHeightEv={setBarrierHeightEv}
          barrierWidthNm={barrierWidthNm}
          setBarrierWidthNm={setBarrierWidthNm}
          particleKey={particleKey}
          setParticleKey={setParticleKey}
          simMode={simMode}
          setSimMode={setSimMode}
          showClassicalComparison={showClassicalComparison}
          setShowClassicalComparison={setShowClassicalComparison}
          onOpenTweak={() => setShowTweakPanel(true)}
          onOpenComparison={() => setShowCompModal(true)}
        />

        <QuAntIPreview
          simulationState={{
            energyEv,
            barrierHeightEv,
            barrierWidthNm,
            particleKey,
            physicsData,
            activeEnvironment: showStreet3D ? "street" : "bedroom",
            selectedObject: "water"
          }}
          onOpenTweak={() => setShowTweakPanel(true)}
        />
      </main>

      {/* Walkable 3D Bedroom Simulation Modal */}
      {showBedroom3D && (
        <Bedroom3D
          onClose={() => setShowBedroom3D(false)}
          onOpenLab={() => {
            setShowBedroom3D(false);
            scrollToLab();
          }}
          onSwitchToStreet={() => {
            setShowBedroom3D(false);
            setShowStreet3D(true);
          }}
        />
      )}

      {/* Walkable 3D Street Simulation Modal */}
      {showStreet3D && (
        <Street3D
          onClose={() => setShowStreet3D(false)}
          onOpenLab={() => {
            setShowStreet3D(false);
            scrollToLab();
          }}
          onSwitchToBedroom={() => {
            setShowStreet3D(false);
            setShowBedroom3D(true);
          }}
        />
      )}

      {/* Floating Tweak Panel [T] */}
      {showTweakPanel && (
        <TweakPanel
          energyEv={energyEv}
          setEnergyEv={setEnergyEv}
          barrierHeightEv={barrierHeightEv}
          setBarrierHeightEv={setBarrierHeightEv}
          barrierWidthNm={barrierWidthNm}
          setBarrierWidthNm={setBarrierWidthNm}
          particleKey={particleKey}
          setParticleKey={setParticleKey}
          simMode={simMode}
          setSimMode={setSimMode}
          showClassicalComparison={showClassicalComparison}
          setShowClassicalComparison={setShowClassicalComparison}
          onClose={() => setShowTweakPanel(false)}
          configA={configA}
          configB={configB}
          onSaveConfigA={setConfigA}
          onSaveConfigB={setConfigB}
          onOpenComparison={() => setShowCompModal(true)}
        />
      )}

      {/* Side-by-Side Experiment Comparison Modal */}
      {showCompModal && (
        <ConfigComparisonModal
          configA={configA}
          configB={configB}
          onClose={() => setShowCompModal(false)}
        />
      )}

      {/* Finished Professional Footer */}
      <Footer onReplayIntro={handleReplayIntro} />
    </div>
  );
}
