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

### 3. Double-Slit Wave-Particle Duality Laboratory
- **Fraunhofer Analytical Diffraction & Interference Engine**:
  $$I(x) = I_0 \left[\frac{\sin(\beta)}{\beta}\right]^2 \cos^2(\alpha), \quad \beta = \frac{\pi a}{\lambda}\sin\theta, \quad \alpha = \frac{\pi d}{\lambda}\sin\theta$$
  where theoretical fringe spacing is $\Delta y \approx \frac{\lambda D}{d}$.
- **Poisson Arrival Impact Accumulator**:
  Individual particles (photons or electrons) are emitted and detected as discrete, localized arrival points on a phosphorescent screen canvas via Poisson rejection sampling. Users observe how a continuous wave interference pattern emerges solely from the accumulation of thousands of discrete quantum particle detections ($N$ particles registered).
- **Independent Slit Controls**:
  - *Two Slits Open (1 & 2)*: Full wave interference fringes modulated by single-slit diffraction envelope.
  - *Left Slit Only (1)*: Mechanical shutter closes right aperture; interference fringes collapse into pure single-slit Fraunhofer diffraction without fringe splitting.
  - *Right Slit Only (2)*: Mechanical shutter closes left aperture; single-slit diffraction pattern shifted by $+d/2$.
- **Multi-Species Beam Selector**:
  - 532 nm Green Laser (photons, $E = 2.33\text{ eV}$)
  - 650 nm Red Laser (photons, $E = 1.91\text{ eV}$)
  - 50 eV Electron Beam (de Broglie matter wave $\lambda = 0.173\text{ nm}$)
  - 100 eV Electron Beam (de Broglie matter wave $\lambda = 0.123\text{ nm}$)
- **Real-Time Analytical Histogram Overlay**: Real-time binning accumulator ($N$ bins) plotted dynamically against the theoretical continuous intensity curve.
- **Controls & Actions**: Adjust slit separation $d$ (20–250 µm), slit width $a$ (5–60 µm), screen distance $D$ (0.2–2.0 m), particle burst (+500), clear screen ($N=0$), and record trial to Notebook.

### 4. Analytical 1D Quantum Tunneling Laboratory
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

### 5. Scientifically Grounded Object Inspection (No Generic Waves)
- **Eliminated Fake Wavefunctions**: Everyday objects (containing $\sim 10^{24}$ atoms) no longer show decorative generic waves or claim to evaluate a single macroscopic wavefunction.
- **Structured Materials & Properties Layout**:
  - **Borosilicate Glass of Water**: Amorphous $\text{SiO}_2$ glass matrix ($n=1.473$), liquid $\text{H}_2\text{O}$ ($n=1.333$). Explains Snell's Law refraction via dipole polarization phase lag ($v = c/n \approx 203,600\text{ km/s}$) and the microscopic origin of transparency: amorphous $\text{SiO}_2$ has a wide electronic bandgap $E_g \approx 9.0\text{ eV}$, preventing visible photons ($1.65\text{--}3.10\text{ eV}$) from being absorbed by interband transitions.
  - **Architectural Desk Lamp**: Spun aluminum shade, steel counterbalance arm, and GaN solid-state LED emitter. Explains direct bandgap electroluminescence and quantized photon emission ($\sim 2.8 \times 10^{19}$ visible photons/s).
  - **Solid Walnut Desk**: American black walnut heartwood ($0.64\text{ g/cm}^3$) on tubular steel. Explains covalent $sp^3$ orbital hybridization and Pauli exclusion fermion degeneracy pressure resisting gravitational collapse.
  - **Dedicated "Explore Quantum Physics" Buttons**: Each inspection panel provides a direct action opening the relevant grounded experiment (Double-Slit photon interference or Tunneling).
  - **Honest Physical Scope Notices**: Every object explicitly clarifies that macroscopic solidity and optical transparency are collective statistical consequences of quantum band structures and fermion degeneracy, rather than isolated quantum states.

### 6. Classical vs. Quantum Comparison Engine
- **Synchronized Side-by-Side Predictions**:
  - *Classical Mechanics*: For $E < V_0$, kinetic energy $K = E - V_0 < 0$ requires an imaginary velocity. Classical physics predicts $100\%$ reflection ($T_{\text{class}} = 0, R_{\text{class}} = 100\%$).
  - *Quantum Mechanics*: Wave boundary matching at $x = 0$ and $x = L$ produces an evanescent decaying tail that yields non-zero transmission ($T_{\text{quant}} > 0$).
  - For $E > V_0$, demonstrates quantum reflection ($R > 0$) caused by the step potential impedance mismatch, contrasting with classical $100\%$ transmission.

### 7. Floating Tweak Panel [T] & Config A/B Comparator
- **Live Parameter Controls**: Slider and numeric controls for Particle Energy $E$ (eV), Barrier Height $V_0$ (eV), Barrier Width $L$ (nm), and species mass.
- **Physical Presets**: STM Vacuum Gap, Transmission Resonance (Ramsauer-Townsend effect), Macroscopic Wall, Critical Threshold, and Nuclear Alpha Decay (Gamow theory).
- **Experiment Comparison Workflow**: Allows saving Snapshot A and Snapshot B to compare dual calculated curves, transmission deltas, and attenuation ratios side-by-side in real time.
- **Direct Notebook Save**: Instant button to commit the tuned configuration directly to your personal notebook.

### 8. Persistent Personal Experiment Notebook [N]
- **Automatic & Login-Free**: Zero accounts, passwords, registration, or authentication screens. Every browser receives an initialized local notebook automatically on first visit.
- **IndexedDB Storage Abstraction**: High-reliability persistence through browser IndexedDB (`quantmix_notebook_db`, schema v1) with transparent LocalStorage fallback. Changes survive normal refreshes and browser restarts.
- **Multi-Experiment Support**: Automatically handles both Quantum Tunneling trials and Double-Slit wave-particle duality experiments.
- **Save Status Indicators**: Unobtrusive live status indicator: `Saved`, `Saving…`, or `Save failed`.
- **Local-First Privacy**: Notebook records remain strictly local to the user's browser. No data is transmitted to remote servers by default. Clear notice explains that data is browser-specific.
- **Research Journal Interface**:
  - Search across title, notes, hypothesis, model, or tags.
  - Filter by experiment type (Tunneling, Double-Slit, Resonance, Alpha Decay, AI Summary).
  - Sort by newest, oldest, title (A-Z), and highest transmission probability ($T\%$).
  - Inline editing of title, hypothesis, laboratory notes, physical conclusions, and tags.
  - Duplicate experiment and permanent deletion with safety confirmation modal.
  - Export as formatted JSON backup or CSV spreadsheet table.
  - Import JSON backups with schema validation and choice between **Merge** or **Replace**.
  - **Reopen in Lab**: Restores saved physical parameters into the live Quantum Lab (automatically selecting the corresponding experiment tab) and recalculates live with verified physics.

### 9. QuAntI Research-Grounded AI Intelligence Engine
- **Lightweight Scientific Retrieval System (`quantumKnowledgeBase.js`)**: Organizes peer-reviewed references by topic (superposition, wavefunctions, probability, measurement & decoherence, interference, tunnelling, quantisation, and quantum materials).
- **Authoritative Citations & Direct References**: Every response cites real peer-reviewed papers or authoritative university texts (APS Phys. Rev. Phys. Educ. Res., EPJ Quantum Technology 2025, Rev. Mod. Phys. 75, 715, MIT OCW 8.04, OpenStax Vol 3, QuVis, Quantum Flytrap).
- **Honest Physical Scope Disclosures**: Clearly distinguishes between established fundamental principles, 1D stationary analytical models, and conceptual laboratory visualizations.
- **Typed Operations Layer**: QuAntI AI executes verified natural-language operations on actual stored IndexedDB records (saving trials, listing, comparing experiments, generating research summaries).

---

## 🗺️ Project Roadmap & Status

| Milestone | Scope | Status |
| :--- | :--- | :--- |
| **Milestone 1** | **QuantMix Homepage, Discovery System & Design Tokens** | **Completed** |
| **Milestone 2** | **Walkable 3D Bedroom, Priority Raycasting & Object Inspection** | **Completed** |
| **Milestone 3** | **Analytical 1D Quantum Lab, 3D Wavefunction Helix & Conservation** | **Completed** |
| **Milestone 4** | **Double-Slit Wave-Particle Duality Poisson Accumulator & Slit Shutters** | **Completed** |
| **Milestone 5** | **Lively 3D Street Environment, Traffic & Urban Photonics** | **Completed** |
| **Milestone 6** | **Live Tweak Panel [T], Config A/B Comparator & QuAntI AI Engine** | **Completed** |
| **Milestone 7** | **Persistent Experiment Notebook [N] with Multi-Experiment Support** | **Completed** |
| **Milestone 8** | **Research-Grounded Retrieval System & Scope Disclosures** | **Completed** |

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
1. **APS Physical Review Physics Education Research 13, 010123**: *Student understanding of wave-particle duality and the double-slit experiment* (https://journals.aps.org/prper/abstract/10.1103/PhysRevPhysEducRes.13.010123)
2. **EPJ Quantum Technology (2025)**: *Quantum physics education review: state of the art and future directions* (https://link.springer.com/article/10.1140/epjqt/s40507-025-00460-0)
3. **OpenStax University Physics Volume 3**:
   - Chapter 7: *Quantum Mechanics & Tunneling through Potential Barriers*
   - Chapter 8: *Atomic Structure & The Pauli Exclusion Principle*
   - Chapter 9: *Condensed Matter Physics & Band Theory of Solids*
4. **MIT OpenCourseWare 8.04, Spring 2016**: *Quantum Physics I (Prof. Barton Zwiebach)* (https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2016/)
5. **Reviews of Modern Physics 75, 715**: *Decoherence, the measurement problem, and the appearance of a classical world in quantum theory* (https://doi.org/10.1103/RevModPhys.75.715)
6. **Quantum Flytrap Virtual Lab (arXiv:2203.13300)**: *Simulating quantum optics and educational interactive simulations* (https://lab.quantumflytrap.com/)
7. **QuVis Quantum Mechanics Visualisation Project**: *University of St Andrews Interactive Simulations* (https://www.st-andrews.ac.uk/physics/quvis/)
8. **NIST Reference on Constants, Units, and Uncertainty**: *CODATA Fundamental Physical Constants* (https://www.nist.gov/)

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).

