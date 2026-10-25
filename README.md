# QuantMix — Virtual Quantum Mechanics Explorer

> **“What if our world behaved according to the laws of Quantum Mechanics?”**  
> *Step into the familiar. Discover the extraordinary hidden within it.*

Existing Website: [https://quant-mix.vercel.app/](https://quant-mix.vercel.app/)  
GitHub Repository: [https://github.com/SanthoshSkandhaS/QuantMix](https://github.com/SanthoshSkandhaS/QuantMix)

---

## 🌌 Overview

**QuantMix** is an interactive, scientifically grounded 3D exploration platform designed to make quantum mechanics intuitive and tangible by anchoring it in everyday experiences. Rather than treating quantum physics as an abstract mathematical curiosity confined to distant laboratories, QuantMix demonstrates how our macroscopic everyday world—from the solidity of a bedroom floor to streetlights, semiconductors, and nuclear fusion—is governed by fundamental quantum laws.

---

## 🔬 Core Implemented Systems

### 1. Walkable 3D Bedroom Simulation
- **Three.js WebGL Architecture**: Realistic indoor lighting, soft task-lamp spotlights, ambient shadows, PBR material properties, and procedural wood and linen textures.
- **Priority Raycasting & Selection Lock**: The glass of water uses a dedicated priority hit collider (`priority: 100` vs desk `priority: 5`), completely resolving the cursor-drift issue where the desk stole selection focus. Selection lock ensures cursor movement or camera repositioning never switches target accidentally.
- **Screen-Space 2D Floating Anchor**: 3D world coordinates are projected to pixel space, rendering an intuitive, stable contextual pill directly adjacent to the inspected object.
- **Dual Inspection Modes**:
  - *Macroscopic Physical View*: Rigid-body mechanics, mass, volume, and classical gravity.
  - *Microscopic Quantum View*: Explains Pauli Exclusion Principle, antisymmetric electron wavefunctions ($\Psi(\mathbf{r}_1, \mathbf{r}_2) = -\Psi(\mathbf{r}_2, \mathbf{r}_1)$), and electron degeneracy pressure explaining why ordinary matter resists compression.
- **Conflict-Free Keyboard Shortcuts**:
  - `E` — Inspect or interact with selected object
  - `Esc` — Close inspection or deselect
  - `R` — Reset object position and orientation
  - `F` — Smooth camera focus on selected object
  - `T` — Open / close live Tweak Panel
  - `Q` — Open Quantum Laboratory
  - `H` — Toggle on-screen Controls HUD
  - `M` — Seamlessly switch to 3D Street environment
  - `WASD` / Mouse Drag — Move and orbit camera

### 2. Lively 3D Street Simulation
- **Full Urban 3D Environment**: 4-lane roadway with dashed lane markings, yellow double centerlines, zebra crosswalks, concrete sidewalks, 6 commercial buildings, 4 cast-iron streetlights with directional spotlights, parked sedan, dynamic cruising vehicle, and glass transit shelter.
- **Time of Day Modes**: Real-time switching between Daylight, Sunset, and Night illumination.
- **Interactive Street Objects**: Raycasting on traffic signals, streetlights, asphalt, vehicles, and bus shelters revealing their underlying quantum photonics, GaN direct bandgap emission, total internal reflection, and photovoltaic sensors.
- **Bidirectional Navigation**: Instant environment transition between Bedroom and Street via in-world HUD buttons or `M` shortcut.

### 3. Analytical 1D Quantum Mechanics Laboratory
- **Stationary 1D Schrödinger Barrier Solver**: Evaluates exact boundary conditions for a finite rectangular potential barrier without discretization artifacts:
  $$-\frac{\hbar^2}{2m}\frac{d^2\psi(x)}{dx^2} + V(x)\psi(x) = E\psi(x)$$
- **Strict Conservation**: Verifies continuous probability current conservation identity:
  $$R + T = 1.000000 \quad (\Delta < 10^{-12})$$
- **Dual Visualizations**:
  - *3D Rotating Complex Wavefunction Helix*: Depicts spatial profile where horizontal axis is $x$, vertical displacement is $\text{Re}[\Psi]$, and depth is $\text{Im}[\Psi]$.
  - *Dynamic Wavepacket Simulation*: Demonstrates wavepacket collision, evanescent tunneling, and partial reflection.
  - *2D Probability Density Canvas*: Cross-sectional plot of $|\Psi(x)|^2$ versus potential barrier $V(x)$.
- **Variable Particle Species**:
  - **Electron** ($m = 1.0 \, m_e$)
  - **Muon** ($m = 206.8 \, m_e$)
  - **Proton** ($m = 1836.2 \, m_e$)
  - **Alpha Particle** ($m = 7294.3 \, m_e$)  
  Directly demonstrates how increasing particle mass exponentially magnifies attenuation constant $\kappa = \sqrt{2m(V_0 - E)}/\hbar$, suppressing transmission and explaining why macroscopic objects never tunnel.

### 4. Classical vs. Quantum Comparison Engine
- **Synchronized Side-by-Side Predictions**:
  - *Classical Mechanics*: For $E < V_0$, kinetic energy $K = E - V_0 < 0$ requires an imaginary velocity. Classical physics predicts $100\%$ reflection ($T_{\text{class}} = 0, R_{\text{class}} = 100\%$).
  - *Quantum Mechanics*: Wave boundary matching at $x = 0$ and $x = L$ produces an evanescent decaying tail that yields non-zero transmission ($T_{\text{quant}} > 0$).
  - For $E > V_0$, demonstrates quantum reflection ($R > 0$) caused by the step potential impedance mismatch, contrasting with classical $100\%$ transmission.

### 5. Floating Tweak Panel [T] & Config A/B Comparator
- **Live Parameter Controls**: Slider and numeric controls for Particle Energy $E$ (eV), Barrier Height $V_0$ (eV), Barrier Width $L$ (nm), and species mass.
- **Physical Presets**: STM Vacuum Gap, Transmission Resonance (Ramsauer-Townsend effect), Macroscopic Wall, Critical Threshold, and Nuclear Alpha Decay (Gamow theory).
- **Experiment Comparison Workflow**: Allows saving Snapshot A and Snapshot B to compare dual calculated curves, transmission deltas, and attenuation ratios side-by-side in real time.

### 6. QuAntI — Context-Aware Scientific Intelligence Engine
- **Live Simulation Telemetry**: Automatically receives active environment, selected object, particle species, $E, V_0, L$, and computed $T, R, \kappa, \lambda$.
- **Authoritative Textbook Grounding**:
  - OpenStax University Physics Vol 1 (Classical Mechanics)
  - OpenStax University Physics Vol 3 (Ch 7: Quantum Mechanics & Tunneling, Ch 8: Exclusion Principle)
  - MIT OpenCourseWare 8.04 (Quantum Physics I: 1D Barrier Scattering)
  - Reviews of Modern Physics 75, 715 (Scattering Formalism in Nanostructures)
- **Active Dialogue Console**: Free-form question input with Enter submission, prompt question chips, KaTeX mathematical typesetting, parameter recommendations, and textbook citations.
- **Safe Provider Integration**: Supports optional live API key (`VITE_OPENAI_API_KEY` / `VITE_GEMINI_API_KEY`) with deterministic retrieval fallback.

---

## 🗺️ Project Roadmap & Status

| Milestone | Scope | Status |
| :--- | :--- | :--- |
| **Milestone 1** | **QuantMix Homepage, Discovery System & Design Tokens** | **Completed** |
| **Milestone 2** | **Walkable 3D Bedroom, Priority Raycasting & Object Inspection** | **Completed** |
| **Milestone 3** | **Analytical 1D Quantum Lab, 3D Wavefunction Helix & Conservation** | **Completed** |
| **Milestone 4** | **Lively 3D Street Environment, Traffic & Urban Photonics** | **Completed** |
| **Milestone 5** | **Live Tweak Panel [T], Config A/B Comparator & QuAntI AI Engine** | **Completed** |
| **Milestone 6** | Macro Environments (The Sky, Football Field, Human Body) | Upcoming |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
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
# Start the local development server with Vite HMR
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Production Build & Linting
```bash
# Run oxlint checks
npm run lint

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📜 Scientific References & Citations
1. OpenStax University Physics Volume 3, Chapter 7: *Quantum Tunneling of Particles through Potential Barriers*
2. MIT OpenCourseWare 8.04, Spring 2016: *Quantum Physics I (Prof. Barton Zwiebach)*
3. Reviews of Modern Physics 75, 715: *Quantum transport and scattering in potential barriers*
4. NIST Reference on Constants, Units, and Uncertainty: *Reduced Planck constant $\hbar$ and physical invariants*

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
