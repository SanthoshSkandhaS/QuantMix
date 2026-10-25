/**
 * QuantMix Quantum Facts Library
 * 22 curated, scientifically accurate facts with beginner explanations,
 * deep dive details, formulas, and verified authoritative reference URLs.
 */
export const QUANTUM_FACTS = [
  {
    id: "wave-particle-duality",
    concept: "Wave–Particle Duality",
    title: "Light and Matter Are Both Waves and Particles",
    summary: "Everything in our universe—including photons of light and massive electrons—exhibits properties of both localized particles and spread-out waves.",
    deepDive: "In 1924, Louis de Broglie hypothesized that every moving particle has an associated matter wave with wavelength λ = h / p, where h is Planck's constant and p is momentum. When unmeasured, particles propagate like waves, producing interference fringes; upon detection, they deposit energy at single discrete points.",
    formula: "λ = \\frac{h}{p}",
    formulaLabel: "de Broglie Wavelength",
    reference: {
      name: "HyperPhysics — Georgia State University",
      title: "DeBroglie Wavelength and Wave-Particle Duality",
      url: "http://hyperphysics.phy-astr.gsu.edu/hbase/debrog.html"
    }
  },
  {
    id: "quantum-tunneling",
    concept: "Quantum Tunnelling",
    title: "Particles Can Pass Right Through Solid Barriers",
    summary: "Because particles behave like probability waves, there is a non-zero chance a particle will appear on the other side of an energy barrier it doesn't have the energy to climb over.",
    deepDive: "Inside a finite potential barrier of height V₀ > E, the particle's wave function does not drop to zero abruptly; instead, it decays exponentially: ψ(x) ∝ e^(-κx), where κ = √(2m(V₀ - E)) / ℏ. If the barrier is thin enough, the wave function has non-zero amplitude at the far boundary, allowing transmission. Without tunneling, the Sun could not fuse hydrogen and our USB flash drives could not store data.",
    formula: "T \\approx e^{-2\\kappa w}",
    formulaLabel: "Transmission Probability",
    reference: {
      name: "NIST (National Institute of Standards & Technology)",
      title: "Quantum Tunneling in Scanning Probe Microscopy",
      url: "https://www.nist.gov/pml/sensor-science-division/quantum-measurement-division"
    }
  },
  {
    id: "energy-quantization",
    concept: "Quantized Energy Levels",
    title: "Atoms Only Absorb and Emit Precise Packets of Energy",
    summary: "Electrons orbiting atomic nuclei cannot possess arbitrary energies; they can only occupy discrete, 'quantized' rungs on an energy ladder.",
    deepDive: "Max Planck and Niels Bohr resolved the blackbody radiation catastrophe and atomic spectral lines by showing that energy exchanges occur in discrete bundles called quanta (E = hν). An electron absorbing a photon jumps instantly between orbital eigenvalues without ever inhabiting the intervening energy values.",
    formula: "E = h\\nu = \\hbar\\omega",
    formulaLabel: "Planck-Einstein Relation",
    reference: {
      name: "Nobel Prize Official Archives",
      title: "Max Planck and the Genesis of Quantum Theory",
      url: "https://www.nobelprize.org/prizes/physics/1918/planck/lecture/"
    }
  },
  {
    id: "double-slit-interference",
    concept: "Double-Slit Interference",
    title: "A Single Particle Can Interfere With Itself",
    summary: "When single electrons are fired one-by-one through two parallel slits, they build up an interference pattern over time, as if each electron traveled through both slits simultaneously.",
    deepDive: "The quantum state evolves according to Schrödinger's wave equation as a superposition of trajectories: |ψ⟩ = |slit 1⟩ + |slit 2⟩. The probability density P(x) = |ψ(x)|² contains cross-terms 2Re(ψ₁*ψ₂) that produce alternating bright and dark fringes. Placing a detector at a slit collapses the superposition, immediately erasing the wave interference.",
    formula: "I(x) \\propto \\cos^2\\left(\\frac{\\pi d x}{\\lambda L}\\right)",
    formulaLabel: "Double-Slit Intensity",
    reference: {
      name: "MIT OpenCourseWare",
      title: "Quantum Physics: The Double Slit Experiment",
      url: "https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2016/"
    }
  },
  {
    id: "electron-probability-clouds",
    concept: "Probability Distributions",
    title: "Electrons Don't Orbit in Circles—They Live in Clouds",
    summary: "Unlike planets orbiting the Sun, electrons don't trace neat planetary tracks; they exist as fuzzy three-dimensional clouds representing where they are likely to be found.",
    deepDive: "Max Born interpreted the quantum wave function ψ(r) probabilistically: the probability of finding an electron in volume dV is dP = |ψ(r)|² dV. For hydrogen, the familiar spherical s-orbitals and dumbbell p-orbitals are mathematical visualizations of spatial spherical harmonics and radial solutions to the Schrödinger equation.",
    formula: "P(\\mathbf{r}) = |\\psi(\\mathbf{r})|^2",
    formulaLabel: "Born Probability Rule",
    reference: {
      name: "HyperPhysics — GSU",
      title: "Hydrogen Energy Levels and Orbitals",
      url: "http://hyperphysics.phy-astr.gsu.edu/hbase/quantum/hydref.html"
    }
  },
  {
    id: "quantum-entanglement",
    concept: "Quantum Entanglement",
    title: "Two Particles Can Share a Single Linked Destiny",
    summary: "When two particles become entangled, measuring a property of one instantaneously dictates the state of the other, no matter how vast the distance separating them.",
    deepDive: "Entangled composite states cannot be factored into product states of individual particles: |Ψ⟩ ≠ |ψ₁⟩ ⊗ |ψ₂⟩. For example, in the Bell singlet state (|01⟩ - |10⟩)/√2, neither particle has a definite spin until measured, yet their outcomes are 100% anti-correlated. John Stewart Bell proved that no local hidden variable theory can reproduce these quantum correlations.",
    formula: "|\\Psi^-\\rangle = \\frac{1}{\\sqrt{2}}(|01\\rangle - |10\\rangle)",
    formulaLabel: "Bell Singlet State",
    reference: {
      name: "Nobel Prize in Physics 2022",
      title: "Experiments with Entangled Photons and Bell Inequalities",
      url: "https://www.nobelprize.org/prizes/physics/2022/popular-information/"
    }
  },
  {
    id: "pauli-exclusion-principle",
    concept: "The Pauli Exclusion Principle",
    title: "Why You Don't Fall Through the Floor",
    summary: "No two identical fermions (such as electrons) can occupy the same quantum state simultaneously, creating a powerful resistance to compression that gives matter solid structure.",
    deepDive: "Fermions have half-integer spin (1/2, 3/2, ...) and antisymmetric wave functions under particle exchange: Ψ(x₁, x₂) = -Ψ(x₂, x₁). If x₁ = x₂, Ψ must be zero. This prevents electrons in an atom from piling into the lowest ground state, forcing higher energy shells, creating the entire periodic table of chemistry, and preventing gravitational collapse in white dwarf stars via electron degeneracy pressure.",
    formula: "\\Psi(\\dots, r_i, \\dots, r_j, \\dots) = -\\Psi(\\dots, r_j, \\dots, r_i, \\dots)",
    formulaLabel: "Antisymmetric Wavefunction",
    reference: {
      name: "CERN Document Server",
      title: "Pauli Exclusion Principle and Spin-Statistics",
      url: "https://cds.cern.ch/record/1014115"
    }
  },
  {
    id: "quantum-semiconductors",
    concept: "Quantum Band Theory",
    title: "Every Computer Chip Depends on Quantum Bandgaps",
    summary: "Silicon transistors in your phone work because billions of atoms in a crystal lattice split electron energy levels into continuous conduction bands and forbidden energy gaps.",
    deepDive: "When atoms form a periodic periodic lattice, Bloch's theorem describes electron wave functions moving through a periodic potential V(r + R) = V(r). Destructive wave interference opens forbidden energy bandgaps (E_g). In semiconductors like silicon (E_g ≈ 1.1 eV), tiny amounts of dopants (phosphorus or boron) let electric fields switch current on and off billions of times per second.",
    formula: "\\psi_k(\\mathbf{r}) = e^{i \\mathbf{k} \\cdot \\mathbf{r}} u_k(\\mathbf{r})",
    formulaLabel: "Bloch Wave Function",
    reference: {
      name: "NIST Semiconductor Technology",
      title: "Semiconductor Physics and Quantum Metrology",
      url: "https://www.nist.gov/programs-projects/semiconductor-nanotechnology"
    }
  },
  {
    id: "light-matter-photons",
    concept: "Photons and Light–Matter Interaction",
    title: "Light Is Streamed as Discrete Packets of Electromagnetic Action",
    summary: "Even though light propagates across space as Maxwellian waves, it interacts with atoms strictly by exchanging indivisible energy quanta called photons.",
    deepDive: "Albert Einstein explained the Photoelectric Effect in 1905 by showing that light ejects electrons from a metal only if individual photon energy hν exceeds the metal's work function Φ, regardless of light intensity. This settled that the electromagnetic field itself is quantized, earning Einstein his 1921 Nobel Prize.",
    formula: "K_{\\max} = h\\nu - \\Phi",
    formulaLabel: "Photoelectric Equation",
    reference: {
      name: "Nobel Prize Official Archives",
      title: "Albert Einstein and the Law of the Photoelectric Effect",
      url: "https://www.nobelprize.org/prizes/physics/1921/einstein/facts/"
    }
  },
  {
    id: "quantum-chemistry-bonds",
    concept: "Quantum Chemistry",
    title: "Chemical Bonds Are Quantum Electron Sharing Overlaps",
    summary: "Molecules like water and DNA exist because atomic electron wave functions overlap constructively, lowering the system's kinetic energy into stable covalent bonds.",
    deepDive: "In Molecular Orbital (MO) theory, bonding occurs when the spatial wave functions of two valence electrons interfere constructively between nuclei: Ψ_bond = (ψ_A + ψ_B)/√2. The increased electron density between positive nuclei screens their repulsion and expands the electron's de Broglie wavelength, directly lowering its kinetic energy.",
    formula: "\\hat{H}\\Psi = E\\Psi",
    formulaLabel: "Time-Independent Schrödinger Equation",
    reference: {
      name: "National Science Foundation (NSF)",
      title: "Molecular Quantum Mechanics and Chemical Bonding",
      url: "https://www.nsf.gov/news/classroom/chemistry.jsp"
    }
  },
  {
    id: "quantum-superposition",
    concept: "Quantum Superposition",
    title: "Particles Can Exist in Multiple States at Once",
    summary: "Prior to measurement, a quantum system can inhabit a linear combination of all its possible physical states at the same time.",
    deepDive: "The mathematical space of quantum states is a complex Hilbert space. If |0⟩ and |1⟩ are valid orthonormal eigenstates, any normalized linear combination |ψ⟩ = α|0⟩ + β|1⟩ (with |α|² + |β|² = 1) is also a completely valid physical state. The act of measurement forces the system into one distinct state with probabilities |α|² and |β|².",
    formula: "|\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle",
    formulaLabel: "Superposition of States",
    reference: {
      name: "Nature Physics",
      title: "Quantum Superposition and Coherence",
      url: "https://www.nature.com/subjects/quantum-physics"
    }
  },
  {
    id: "vacuum-fluctuations",
    concept: "Zero-Point Energy",
    title: "Empty Space Is Never Truly Empty",
    summary: "Even in a total vacuum at absolute zero temperature, quantum fields bubble with restless fluctuations and fleeting virtual particle-antiparticle pairs.",
    deepDive: "The Heisenberg uncertainty principle in energy and time, ΔE · Δt ≥ ℏ/2, allows energy conservation to be briefly bypassed on microscopic timescales. Each harmonic oscillator mode of the electromagnetic vacuum possesses a baseline ground-state zero-point energy E₀ = ½ℏω, meaning empty space retains fundamental quantum jitter.",
    formula: "E_0 = \\frac{1}{2}\\hbar\\omega",
    formulaLabel: "Ground State Zero-Point Energy",
    reference: {
      name: "CERN Science Gateway",
      title: "The Quantum Vacuum and Particle Creation",
      url: "https://home.cern/science/physics/vacuum"
    }
  },
  {
    id: "casimir-effect",
    concept: "The Casimir Effect",
    title: "Two Mirrors in a Vacuum Are Pushed Together by Virtual Waves",
    summary: "Place two uncharged conducting plates nanometers apart in complete emptiness, and an attractive force pushes them together due to vacuum radiation pressure.",
    deepDive: "Hendrik Casimir predicted in 1948 that conducting boundaries restrict the allowed wavelengths of electromagnetic vacuum modes between the plates to discrete standing harmonics n(λ/2) = d. Because fewer vacuum modes can fit between the plates than in the open space outside, an inward net pressure pushes the plates together.",
    formula: "\\frac{F}{A} = -\\frac{\\pi^2 \\hbar c}{240 d^4}",
    formulaLabel: "Casimir Force per Area",
    reference: {
      name: "Physical Review Letters",
      title: "Precision Measurement of the Casimir Force",
      url: "https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.78.5"
    }
  },
  {
    id: "quantum-decoherence",
    concept: "Quantum Decoherence",
    title: "Why We Don't See Macroscopic Objects in Superposition",
    summary: "Quantum behavior seems invisible in daily life because trillions of air molecules and photons constantly measure and scramble quantum phase relationships.",
    deepDive: "Decoherence describes the irreversible leakage of quantum phase coherence from an open system into its surrounding environment. As a quantum object collides with stray thermal photons, the off-diagonal density matrix elements decay exponentially: ρ₁₂(t) = ρ₁₂(0)e^(-t/τ_dec). For a dust grain in air, τ_dec is less than 10^(-20) seconds.",
    formula: "\\rho(t) \\rightarrow \\sum_i p_i |i\\rangle\\langle i|",
    formulaLabel: "Loss of Quantum Phase Coherence",
    reference: {
      name: "Stanford Encyclopedia of Philosophy",
      title: "Quantum Decoherence and Measurement",
      url: "https://plato.stanford.edu/entries/qm-decoherence/"
    }
  },
  {
    id: "superconductivity",
    concept: "Superconductivity & Cooper Pairs",
    title: "Electricity Can Flow Forever with Absolute Zero Resistance",
    summary: "In certain materials cooled below critical temperatures, electrons bind into pairs that move in unison through crystal lattices without losing any heat or energy.",
    deepDive: "In BCS theory (Bardeen, Cooper, and Schrieffer), electrons weakly attract each other by distorting the positive ion lattice (emitting and absorbing virtual phonons). These paired electrons form 'Cooper pairs', behaving as composite bosons. They condense into a single macroscopic ground-state wave function that flows frictionlessly around obstacles.",
    formula: "\\Delta(0) \\approx 1.764 \\, k_B T_c",
    formulaLabel: "BCS Superconducting Gap",
    reference: {
      name: "HyperPhysics — GSU",
      title: "BCS Theory of Superconductivity",
      url: "http://hyperphysics.phy-astr.gsu.edu/hbase/solids/bcs.html"
    }
  },
  {
    id: "quantum-spin-mri",
    concept: "Nuclear Spin & MRI",
    title: "Hospital MRI Scanners Read the Quantum Gyroscopes in Your Body",
    summary: "Magnetic Resonance Imaging creates vivid 3D anatomical images by aligning and tipping the intrinsic quantum spin of hydrogen protons inside water molecules.",
    deepDive: "Protons carry intrinsic spin angular momentum S = ½ℏ and a magnetic dipole moment μ = γS. Placed inside a strong magnetic field B₀, their energy levels split into Zeeman states separated by ΔE = ℏγB₀. A tuned radiofrequency pulse tips the spins into precession at the Larmor frequency ω₀ = γB₀; when turned off, protons emit signals revealing surrounding tissue chemistry.",
    formula: "\\omega_0 = \\gamma B_0",
    formulaLabel: "Larmor Precession Frequency",
    reference: {
      name: "National Institutes of Health (NIH)",
      title: "Magnetic Resonance Imaging (MRI) Science",
      url: "https://www.nibib.nih.gov/science-education/science-topics/magnetic-resonance-imaging-mri"
    }
  },
  {
    id: "blackbody-radiation",
    concept: "Blackbody Radiation",
    title: "Hot Objects Glow Because Energy Is Quantized",
    summary: "The reason hot metal glows dull red, bright yellow, and then white—rather than releasing lethal bursts of ultraviolet radiation—is the foundation of quantum physics.",
    deepDive: "Classical physics predicted the 'Ultraviolet Catastrophe': radiating cavity resonators should emit infinite energy at short wavelengths. Max Planck resolved this in 1900 by proposing that electromagnetic oscillators in cavity walls exchange energy only in integral units of E = nhν. This suppressed high-frequency emissions and gave the exact spectral distribution observed in stars and incandescent filaments.",
    formula: "u(\\nu, T) = \\frac{8\\pi h \\nu^3}{c^3} \\frac{1}{e^{\\frac{h\\nu}{k_B T}} - 1}",
    formulaLabel: "Planck's Radiation Formula",
    reference: {
      name: "NIST Physics Laboratory",
      title: "Planck Law of Radiation and Standards",
      url: "https://www.nist.gov/pml"
    }
  },
  {
    id: "quantum-dots",
    concept: "Quantum Confinement",
    title: "Shrinking a Crystal Changes the Color of Light It Emits",
    summary: "Modern QLED television screens produce pure, hyper-saturated colors using tiny semiconductor crystals whose light emission color is tuned simply by changing their size.",
    deepDive: "When semiconductor crystals are fabricated smaller than the material's exciton Bohr radius (typically 2 to 10 nm), spatial confinement compresses the electron and hole wave functions. Just like a particle in a 1D box (E_n ∝ 1/L²), smaller dots have wider bandgaps, emitting higher-energy blue light, while larger dots emit lower-energy red light. The 2023 Nobel Prize in Chemistry celebrated this discovery.",
    formula: "E_{\\text{gap}}(R) \\approx E_{\\text{bulk}} + \\frac{\\hbar^2 \\pi^2}{2 m^* R^2}",
    formulaLabel: "Brus Equation for Quantum Confinement",
    reference: {
      name: "Nobel Prize in Chemistry 2023",
      title: "The Discovery and Synthesis of Quantum Dots",
      url: "https://www.nobelprize.org/prizes/chemistry/2023/popular-information/"
    }
  },
  {
    id: "quantum-photosynthesis",
    concept: "Quantum Biology",
    title: "Plants Use Quantum Coherence to Harvest Sunlight",
    summary: "Green leaves transfer solar energy through chlorophyll molecules with nearly 100% efficiency by exploring multiple molecular energy pathways at the same time.",
    deepDive: "In the Fenna-Matthews-Olson (FMO) protein complexes of photosynthetic bacteria and plants, absorbed photon energy travels to the reaction center as a delocalized exciton. Femtosecond 2D spectroscopic experiments show quantum beating and wave-like coherence, allowing the excitation to sample multiple molecular routes simultaneously and find the lowest-loss path.",
    formula: "\\frac{d\\rho}{dt} = -\\frac{i}{\\hbar}[H, \\rho] + \\mathcal{L}(\\rho)",
    formulaLabel: "Lindblad Master Equation",
    reference: {
      name: "Nature Chemistry",
      title: "Quantum Coherence in Photosynthetic Energy Transfer",
      url: "https://www.nature.com/articles/nchem.422"
    }
  },
  {
    id: "quantum-zeno-effect",
    concept: "The Quantum Zeno Effect",
    title: "A Watched Quantum Particle Never Changes",
    summary: "If you measure an unstable quantum system frequently enough, you can freeze it in its initial state and prevent it from decaying.",
    deepDive: "At ultra-short time intervals t, the decay probability of an excited state grows quadratically: P_decay(t) ∝ t². If N successive projective measurements are made during duration T (each step Δt = T/N), the cumulative survival probability is (1 - c(T/N)²)^N ≈ 1 - cT²/N. In the limit of continuous observation (N → ∞), the transition probability drops to zero.",
    formula: "P_{\\text{survive}}(T) = \\lim_{N \\to \\infty} \\left[1 - \\text{const}\\cdot\\left(\\frac{T}{N}\\right)^2\\right]^N = 1",
    formulaLabel: "Zeno Limit",
    reference: {
      name: "Journal of Mathematical Physics",
      title: "The Zeno's Paradox in Quantum Theory (Sudarshan & Misra)",
      url: "https://aip.scitation.org/doi/10.1063/1.523304"
    }
  },
  {
    id: "heisenberg-uncertainty",
    concept: "Heisenberg Uncertainty Principle",
    title: "Nature Forbids Knowing Position and Momentum Simultaneously",
    summary: "You cannot simultaneously measure both where a particle is and how fast it is moving with arbitrary precision—not because our instruments are clumsy, but because nature itself is wave-based.",
    deepDive: "Position x and momentum p are conjugate Fourier variables representing non-commuting quantum operators: [x̂, p̂] = iℏ. Because a sharply localized wave packet requires summing over a wide range of spatial frequencies (momenta), the product of their standard deviations has a fundamental lower bound: σ_x · σ_p ≥ ℏ/2.",
    formula: "\\sigma_x \\sigma_p \\ge \\frac{\\hbar}{2}",
    formulaLabel: "Robertson-Schrödinger Inequality",
    reference: {
      name: "American Institute of Physics (AIP)",
      title: "Werner Heisenberg and the Uncertainty Principle",
      url: "https://history.aip.org/history/exhibits/heisenberg/p08.htm"
    }
  },
  {
    id: "quantum-superfluidity",
    concept: "Superfluidity",
    title: "Liquid Helium Can Climb Out of Its Container",
    summary: "Cooled near absolute zero, Liquid Helium-4 loses all viscosity, flowing without friction and creeping up and over beaker walls in a thin quantum film.",
    deepDive: "Helium-4 atoms are bosons (integer total spin). Below 2.17 Kelvin (the lambda point), a macroscopic fraction of the atoms condenses into the lowest quantum ground state. The macroscopic wave function Ψ = √ρ e^(iθ) forbids individual atomic scattering below Landau's critical velocity, allowing it to generate quantized vortices and climb vertical surfaces as a Rollin film.",
    formula: "\\mathbf{v}_s = \\frac{\\hbar}{m} \\nabla \\theta",
    formulaLabel: "Superfluid Velocity Condition",
    reference: {
      name: "HyperPhysics — GSU",
      title: "Superfluidity in Liquid Helium",
      url: "http://hyperphysics.phy-astr.gsu.edu/hbase/lhel.html"
    }
  }
];
