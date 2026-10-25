# QuantMix — Virtual Quantum Mechanics Explorer

> **“What if our world behaved according to the laws of Quantum Mechanics?”**  
> *Step into the familiar. Discover the extraordinary hidden within it.*

**Live Demo:** [https://quant-mix.vercel.app/](https://quant-mix.vercel.app/)  
**GitHub Repository:** [https://github.com/SanthoshSkandhaS/QuantMix](https://github.com/SanthoshSkandhaS/QuantMix)

---

## 🌌 Overview

**QuantMix** is an interactive, scientifically grounded 3D exploration platform designed to make quantum mechanics intuitive and tangible by anchoring it in everyday experiences. Rather than treating quantum physics as an abstract mathematical curiosity confined to distant laboratories, QuantMix demonstrates how our macroscopic everyday world—from the solidity of a bedroom floor to streetlights, semiconductors, and nuclear fusion—is governed by fundamental quantum laws.

QuantMix now includes an **automatic, login-free personal Experiment Notebook** backed by browser IndexedDB and operated natively by **QuAntI AI** through natural language.

---

## 🔬 Core Implemented Systems

### 1. Walkable 3D Bedroom Simulation
- **Three.js WebGL Architecture**: Realistic indoor lighting, soft task-lamp spotlights, ambient shadows, PBR material properties, and procedural wood and linen textures.
- **Priority Raycasting & Selection Lock**: The glass of water uses a dedicated priority hit collider (`priority: 100` vs desk `priority: 5`), completely resolving cursor-drift where the desk stole selection focus. Selection lock ensures cursor movement or camera repositioning never switches target accidentally.
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
  - `N` — Open / close personal Experiment Notebook
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
- **Direct Notebook Save**: Instant button to commit the tuned configuration directly to your personal notebook.

### 6. Persistent Personal Experiment Notebook [N]
- **Automatic & Login-Free**: Zero accounts, passwords, registration, or authentication screens. Every browser receives an initialized local notebook automatically on first visit.
- **IndexedDB Storage Abstraction**: High-reliability persistence through browser IndexedDB (`quantmix_notebook_db`, schema v1) with transparent LocalStorage fallback. Changes survive normal refreshes and browser restarts.
- **Save Status Indicators**: Unobtrusive live status indicator: `Saved`, `Saving…`, or `Save failed`.
- **Local-First Privacy**: Notebook records remain strictly local to the user's browser. No data is transmitted to remote servers by default. Clear notice explains that data is browser-specific.
- **Research Journal Interface**:
  - Search across title, notes, hypothesis, model, or tags.
  - Filter by experiment type (Tunneling, Resonance, Alpha Decay, AI Summary).
  - Sort by newest, oldest, title (A-Z), and highest transmission probability ($T\%$).
  - Inline editing of title, hypothesis, laboratory notes, physical conclusions, and tags.
  - Duplicate experiment and permanent deletion with safety confirmation modal.
  - Export as formatted JSON backup or CSV spreadsheet table.
  - Import JSON backups with schema validation and choice between **Merge** or **Replace**.
  - **Reopen in Lab**: Restores saved physical parameters into the live Quantum Lab and recalculates with the current verified analytical solver.

### 7. QuAntI AI Notebook Control & Scientific Research Synthesis
- **Typed Operations Layer**: QuAntI AI executes verified operations on actual stored IndexedDB records:
  - `listExperiments`
  - `getExperiment`
  - `createExperiment`
  - `updateExperiment`
  - `addNote`
  - `updateTags`
  - `duplicateExperiment`
  - `deleteExperiment` (with confirmation safeguard)
  - `compareExperiments`
  - `restoreExperiment`
  - `generateResearchSummary`
  - `exportNotebook`
- **Natural Language Capabilities**:
  - *"Save this experiment to my notebook as Electron Tunnelling — Trial 1"*
  - *"Show me my last five experiments"*
  - *"Rename my latest experiment to High Barrier Test"*
  - *"Add a note to my double-slit experiment that the interference pattern became less distinct"*
  - *"Compare my last two tunnelling experiments"*
  - *"Find every experiment where the barrier width was greater than 2 nm"*
  - *"Organize my experiments using the tags 'tunnelling', 'beginner', and 'high energy'"*
  - *"Duplicate my particle-in-a-box experiment and give the copy a new title"*
  - *"Delete the draft experiment called Untitled Test"* (requires confirmation!)
  - *"Create a research summary of my saved experiments"*
  - *"Restore the parameters from my best transmission-probability experiment"*
- **AI Research Summaries**: Synthesizes multi-trial trends, parameter deltas, physical interpretations grounded in OpenStax Vol 3, model limitations, and suggested next experiments. Saves the generated synthesis report directly back to the notebook.

---

## 🗺️ Project Roadmap & Status

| Milestone | Scope | Status |
| :--- | :--- | :--- |
| **Milestone 1** | **QuantMix Homepage, Discovery System & Design Tokens** | **Completed** |
| **Milestone 2** | **Walkable 3D Bedroom, Priority Raycasting & Object Inspection** | **Completed** |
| **Milestone 3** | **Analytical 1D Quantum Lab, 3D Wavefunction Helix & Conservation** | **Completed** |
| **Milestone 4** | **Lively 3D Street Environment, Traffic & Urban Photonics** | **Completed** |
| **Milestone 5** | **Live Tweak Panel [T], Config A/B Comparator & QuAntI AI Engine** | **Completed** |
| **Milestone 6** | **Persistent Experiment Notebook [N] with AI Control & Research Summaries** | **Completed** |
| **Milestone 7** | Macro Environments (The Sky, Football Field, Human Body) | Upcoming |

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

### Keyboard Shortcuts
- `N` — Toggle personal Experiment Notebook
- `T` — Toggle parameter Tweak Panel
- `E` — Inspect active 3D object
- `F` — Focus camera on inspected object
- `R` — Reset object position / lab defaults
- `Q` — Scroll to Quantum Lab
- `M` — Switch between Bedroom and Street 3D environments
- `Esc` — Close active modal or inspection panel

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
