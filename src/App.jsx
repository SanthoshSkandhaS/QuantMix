import React, { useState } from "react";
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

/**
 * QuantMix Homepage V1
 * An immersive quantum mechanics exploration platform.
 *
 * Core Features:
 * - 4-Second Atomic Intro with Skip Button and Session Memory
 * - Signature Flowing-Wave Start Button with Ripple Physics
 * - Curated 22-Fact Random Discovery System with LocalStorage Non-Repetition
 * - 6 Exploratory Environments Showcase with Architectural Preview Drawers
 * - Quantum Lab Preview (Potential Barrier Tunnelling Experiment)
 * - QuAntI AI Companion Interface Preview with Sample Dialogues
 * - Ambient Canvas Wave & Coherence Particle System
 */
export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    // Only show on first visit in this browser session
    try {
      const seen = sessionStorage.getItem("quantmix_intro_seen");
      return !seen;
    } catch {
      return true;
    }
  });

  const [forceIntro, setForceIntro] = useState(false);
  const [showBedroom3D, setShowBedroom3D] = useState(false);

  const handleIntroComplete = () => {
    setShowIntro(false);
    setForceIntro(false);
  };

  const handleReplayIntro = () => {
    setForceIntro(true);
    setShowIntro(true);
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
        />

        <DiscoverySection />

        <EnvironmentPreview onOpenBedroom={() => setShowBedroom3D(true)} />

        <QuantumLabPreview />

        <QuAntIPreview />
      </main>

      {/* Walkable 3D Bedroom Simulation Modal */}
      {showBedroom3D && (
        <Bedroom3D
          onClose={() => setShowBedroom3D(false)}
          onOpenLab={() => {
            setShowBedroom3D(false);
            const el = document.getElementById("lab") || document.getElementById("quantum-lab");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />
      )}

      {/* Finished Professional Footer */}
      <Footer onReplayIntro={handleReplayIntro} />
    </div>
  );
}
