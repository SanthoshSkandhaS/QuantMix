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
import ExperimentNotebookModal from "./components/ExperimentNotebookModal";
import { calculateRectangularBarrierTunneling } from "./utils/quantumPhysics";
import {
  listExperiments,
  subscribeToNotebook,
  createExperimentFromCurrentSimulation
} from "./utils/notebookService";

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
 * - Persistent Personal Experiment Notebook [N] (Browser-Local IndexedDB with QuAntI AI Control)
 * - QuAntI Scientific AI Intelligence Console with Live Simulation Telemetry & Notebook Operations
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

  // Persistent Experiment Notebook Modal & Badge Count
  const [showNotebookModal, setShowNotebookModal] = useState(false);
  const [notebookCount, setNotebookCount] = useState(0);
  const [activeLabTab, setActiveLabTab] = useState("tunneling"); // "tunneling" | "double_slit"

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

  // Keep notebookCount updated in sync with storage
  useEffect(() => {
    const updateCount = async () => {
      try {
        const list = await listExperiments();
        setNotebookCount(list.length);
      } catch (err) {
        console.error("Failed to fetch notebook count:", err);
      }
    };

    updateCount();
    const unsubscribe = subscribeToNotebook(() => {
      updateCount();
    });
    return () => unsubscribe();
  }, []);

  // Global Keyboard Shortcuts: 'T' toggles Tweak Panel, 'N' toggles Notebook
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea") return;

      if (e.key === "t" || e.key === "T") {
        setShowTweakPanel((prev) => !prev);
      } else if (e.key === "n" || e.key === "N") {
        setShowNotebookModal((prev) => !prev);
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

  // Restores saved parameters and recalculates live
  const handleRestoreExperiment = (snapshot) => {
    if (!snapshot) return;
    if (snapshot.experimentType === "double_slit") {
      setActiveLabTab("doubleslit");
    } else {
      setActiveLabTab("tunneling");
    }
    if (typeof snapshot.energyEv === "number") setEnergyEv(snapshot.energyEv);
    if (typeof snapshot.barrierHeightEv === "number") setBarrierHeightEv(snapshot.barrierHeightEv);
    if (typeof snapshot.barrierWidthNm === "number") setBarrierWidthNm(snapshot.barrierWidthNm);
    if (snapshot.particleKey) setParticleKey(snapshot.particleKey);
    scrollToLab();
  };

  const handleSaveToNotebookDirect = async () => {
    try {
      await createExperimentFromCurrentSimulation({
        energyEv,
        barrierHeightEv,
        barrierWidthNm,
        particleKey,
        physicsData
      });
      setShowNotebookModal(true);
    } catch (err) {
      console.error("Direct save failed:", err);
    }
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
      <Navbar
        onReplayIntro={handleReplayIntro}
        onOpenNotebook={() => setShowNotebookModal(true)}
        notebookCount={notebookCount}
      />

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
          activeLabTab={activeLabTab}
          onSelectLabTab={setActiveLabTab}
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
          onOpenNotebook={() => setShowNotebookModal(true)}
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
          onOpenNotebook={() => setShowNotebookModal(true)}
          onRestoreSimulation={handleRestoreExperiment}
        />
      </main>

      {/* Walkable 3D Bedroom Simulation Modal */}
      {showBedroom3D && (
        <Bedroom3D
          onClose={() => setShowBedroom3D(false)}
          onOpenLab={(experimentKey) => {
            setShowBedroom3D(false);
            if (experimentKey) setActiveLabTab(experimentKey);
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
          onOpenLab={(experimentKey) => {
            setShowStreet3D(false);
            if (experimentKey) setActiveLabTab(experimentKey);
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
          isOpen={showTweakPanel}
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
          onSaveToNotebook={handleSaveToNotebookDirect}
          onOpenNotebook={() => setShowNotebookModal(true)}
          onResetDefaults={() => {
            setEnergyEv(3.8);
            setBarrierHeightEv(4.5);
            setBarrierWidthNm(0.35);
            setParticleKey("electron");
          }}
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

      {/* Persistent Experiment Notebook Modal [N] */}
      <ExperimentNotebookModal
        isOpen={showNotebookModal}
        onClose={() => setShowNotebookModal(false)}
        currentSimState={{
          energyEv,
          barrierHeightEv,
          barrierWidthNm,
          particleKey,
          physicsData
        }}
        onRestoreExperiment={handleRestoreExperiment}
      />

      {/* Finished Professional Footer */}
      <Footer onReplayIntro={handleReplayIntro} />
    </div>
  );
}
