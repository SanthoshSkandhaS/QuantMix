# QuantMix — Virtual Quantum Mechanics Explorer

> **“What if our world behaved according to the laws of Quantum Mechanics”**  
> *Step into the familiar. Discover the extraordinary hidden within it.*

---

## 🌌 Overview

**QuantMix** is an interactive educational platform designed to make quantum physics intuitive and tangible by anchoring it in everyday experiences. Rather than treating quantum mechanics as an abstract mathematical curiosity confined to laboratories, QuantMix reveals how our macroscopic everyday world—from the solidity of a bedroom floor to solar cells and photosynthesis—is governed by quantum laws.

---

## 🎯 Milestone 1 Deliverables (Active)

This repository contains **Milestone 1**: an exceptionally polished, responsive, and functional homepage establishing the design tokens, visual atmosphere, interactive mechanics, and architectural component boundaries for future milestones.

### Key Implemented Features:
1. **Four-Second Atomic Intro**
   - High-fidelity Canvas 2D simulation depicting quantum wave packets approaching, interfering, and scattering with luminous trails.
   - Coalesces into the QuantMix atomic emblem and subtitle.
   - Includes an immediate **Skip Intro** button and `Esc` keyboard shortcut.
   - Session storage memory prevents repeated plays on page reloads; can be replayed anytime via the **Replay Intro** control.
   - Full support for `prefers-reduced-motion`.

2. **Hero & Signature Flowing-Wave Start Button**
   - Exact brand tagline and subtitle.
   - Prominent **Start Exploring** button surrounded by undulating quantum field wave ripples in Teal (`#35D6D0`) and Violet (`#9B8CFF`).
   - Dynamic expanding disturbance wave upon activation with smooth scroll transition.
   - Physical telemetry badges displaying fundamental quantum constants ($\hbar, c$, superposition states).

3. **Random Quantum Fact Discovery System**
   - Section heading: **“Small things. Strange rules.”**
   - Curated, scientifically validated collection of **22 quantum principles** (wave-particle duality, tunneling, entanglement, Pauli exclusion, semiconductors, Casimir effect, etc.).
   - Strict non-repetition algorithm using `localStorage` rotation memory: resets only after all 22 facts are discovered.
   - Interactive dual-mode live wave monitor (Double-Slit wave interference vs. 3D orbital probability density).
   - "Explore deeper" mechanical explanation drawer and verified authoritative citations (NIST, Nobel Prize, HyperPhysics, MIT OCW, CERN).

4. **Environment Exploration Showcase**
   - Section heading: **“Your everyday world, seen differently.”**
   - Six visual destinations:
     1. **Your Room** *(Primary Milestone 1 Focus & Next In-Engine Environment)*
     2. **The Sky**
     3. **The Street**
     4. **A Football Field**
     5. **Inside a Bus**
     6. **Inside the Human Body**
   - Architectural preview drawers detailing mapped physical objects, quantum phenomena, and planned 3D mechanics.

5. **The Quantum Lab Preview**
   - Introduces upcoming parameter adjustment experiments.
   - Features first experiment: **Quantum Tunnelling Through a Potential Barrier**.
   - Addresses beginner question: *“What happens if a particle encounters a narrower barrier?”*
   - Illustrative before-and-after comparison ($w = 2.4\text{ nm}$ vs. $w = 0.8\text{ nm}$) showing transmission probability jump from $0.04\%$ to $42.1\%$.
   - Dynamic SVG wavefunction diagram illustrating incident, decayed, and transmitted waves.

6. **QuAntI — Future AI Companion Preview**
   - Assistant name: **QuAntI**.
   - Subtitle: *“Ask anything. Understand the strange. Discover what to change next.”*
   - Stylized quantum orbital avatar with pulsing core.
   - Interactive question chips demonstrating planned concise 1–3 sentence demeanor and experimental parameter recommendations.
   - Clean architectural component boundary (`src/components/QuAntIPreview.jsx`) ready for future server-side AI integration.

7. **Ambient Quantum Field Canvas**
   - Responsive multi-frequency wave interference contours.
   - Coherent particles linked by quantum state threads with gentle pointer repulsion.
   - Automatically pauses on tab blur to preserve system resources.

---

## 🎨 Color Palette & Design Tokens

- **Midnight Cosmos** — `#0B1020`: Primary atmospheric background
- **Deep Slate** — `#111B2E`: Panels and elevated surfaces
- **Quantum Teal** — `#35D6D0`: Primary interactive accent
- **Wave Violet** — `#9B8CFF`: Quantum effects and secondary accent
- **Main Text** — `#F4F7FF`: Headings and prominent text
- **Secondary Text** — `#A9B6CF`: Subtitles and body descriptions
- **Coral** — `#FF8B78`: Physical barriers and warnings

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended; developed on Node v24)
- npm (v9.0.0 or higher)

### Installation
```bash
# Clone the repository
git clone https://github.com/SanthoshSkandhaS/QuantMix.git

# Navigate into the project folder
cd QuantMix

# Install dependencies
npm install
```

### Running Locally
```bash
# Start the local development server with Hot Module Replacement (HMR)
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Production Build
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🗺️ Project Roadmap

| Milestone | Scope | Status |
| :--- | :--- | :--- |
| **Milestone 1** | **QuantMix Homepage V1, Design Tokens, Discovery & Previews** | **Completed** |
| **Milestone 2** | Walkable 3D Bedroom Simulation (Three.js / WebGL) & Quantum Lab Model | Upcoming |
| **Milestone 3** | Live QuAntI AI Integration (Context-Aware Scientific LLM) | Upcoming |
| **Milestone 4** | Macro Environments (The Sky & The Street) | Upcoming |
| **Milestone 5** | Commuter & Biological Systems (Inside a Bus & Inside the Human Body) | Upcoming |

---

## 📜 License
This project is licensed under the [MIT License](LICENSE).
