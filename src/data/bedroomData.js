/**
 * Bedroom Environment Scientific Inspection Data
 *
 * Grounded in authentic physical principles:
 * - Every object specifies its real material composition, macroscopic physical properties,
 *   and an honest explanation of its relationship to quantum mechanics.
 * - For glass: optical properties, refraction (Snell's Law, phase velocity v = c/n),
 *   and the microscopic origin of transparency (large electronic bandgap Eg ≈ 9.0 eV).
 * - Honest Scope Notice for every object: explicitly states that everyday solids (~10²⁴ atoms)
 *   are not described by a single macroscopic wavefunction; macroscopic properties emerge
 *   from collective band structures and Fermi-Dirac statistics.
 * - Relevant "Explore Quantum Physics" actions linked to grounded interactive simulations.
 */

export const BEDROOM_QUANTUM_FACTS = {
  water: {
    key: "water",
    title: "Borosilicate Glass of Water",
    material: "Amorphous Borosilicate Silicate Glass (~81% SiO₂, 13% B₂O₃, 4% Na₂O) with liquid H₂O",
    phenomenon: "Wide Bandgap Transparency, Refraction & Pauli Degeneracy",
    scale: "Molecular & Nanoscopic (~0.1 nm bond scale)",
    physicalProperties: [
      { label: "Refractive Index (n)", value: "1.473 (glass) / 1.333 (water at 20°C)" },
      { label: "Optical Transmission", value: "> 92% across visible spectrum (380–750 nm)" },
      { label: "Density", value: "2.23 g/cm³ (glass) / 0.998 g/cm³ (water)" },
      { label: "Thermal Expansion", value: "3.3 × 10⁻⁶ K⁻¹ (high thermal shock resistance)" },
      { label: "Dimensions & Mass", value: "250 mL volume, mass ≈ 0.38 kg (glass + liquid)" }
    ],
    opticalPhysics: {
      refractionMechanism:
        "When an electromagnetic wave enters the glass, its oscillating electric field polarizes the bound electron clouds of silicon and oxygen atoms. The induced dipoles re-radiate waves with a phase lag, slowing the net phase velocity through the medium to v = c / n ≈ 203,600 km/s. At non-normal angles of incidence, this deceleration bends the wavefront according to Snell's Law (n₁ sin θ₁ = n₂ sin θ₂).",
      transparencyOrigin:
        "Why is glass transparent? Amorphous SiO₂ has a very large electronic bandgap Eg ≈ 9.0 eV. Visible light photons carry energies between 1.65 eV (red, 750 nm) and 3.1 eV (violet, 400 nm). Because individual visible photons lack sufficient energy to excite electrons across the 9.0 eV gap into the conduction band, the photons pass through the glass network without being absorbed."
    },
    quantumRelationship:
      "Glass transparency and solidity demonstrate two distinct quantum principles. Transparent propagation occurs because visible photons (1.65–3.1 eV) cannot bridge the 9.0 eV electronic bandgap. At the same time, the glass rests rigidly on the desk without interpenetrating because the Pauli Exclusion Principle forbids electrons in the glass and the wood from occupying identical quantum states, producing immense fermion degeneracy pressure that provides solid matter rigidity.",
    honestScopeNotice:
      "Physical Scope Notice: This glass is a macroscopic system containing ~10²⁴ atoms. We do not evaluate a single macroscopic wavefunction for the entire glass. Its transparency and solidity are collective statistical manifestations of quantum bandgaps and Pauli fermion degeneracy pressure.",
    exploreAction: {
      label: "Explore Double-Slit Optical Wave-Particle Duality",
      experimentKey: "double_slit",
      reason: "Inspect how individual photons interact with optical boundaries and accumulate into interference patterns."
    },
    equation: "E_{\\text{photon}} = \\frac{hc}{\\lambda} < E_g \\approx 9.0\\text{ eV}",
    citation: "OpenStax University Physics Vol 3, Ch 9: Condensed Matter Physics & Optical Bandgaps"
  },

  lamp: {
    key: "lamp",
    title: "Architectural Desk Lamp",
    material: "Spun aluminum shade, steel counterbalance arm, GaN solid-state LED emitter with phosphor layer",
    phenomenon: "Electroluminescence & Quantized Photon Emission",
    scale: "Atomic Recombination (~2.7 eV semiconductor transition)",
    physicalProperties: [
      { label: "Luminous Flux", value: "850 lumens (warm task illumination)" },
      { label: "Color Temperature (CCT)", value: "3000 K (warm white spectrum)" },
      { label: "Electrical Power", value: "9.5 W electrical input (photonic efficacy ~90 lm/W)" },
      { label: "Radiant Flux", value: "~2.8 × 10¹⁹ visible photons emitted per second" }
    ],
    opticalPhysics: {
      emissionMechanism:
        "Inside the LED chip, forward-bias electrical current injects electrons into the conduction band and holes into the valence band of a gallium nitride (GaN) quantum well. When an electron recombines with a hole, it drops across the bandgap, releasing its energy as a single localized quantum of light (photon) with energy E = hν = hc/λ.",
      spectrumOrigin:
        "The primary blue emission (~450 nm, E ≈ 2.75 eV) excites a cerium-doped YAG phosphor coating, down-converting part of the radiation across a continuous spectrum to produce eye-comfortable warm white illumination."
    },
    quantumRelationship:
      "Light emission from this lamp is fundamentally discrete. Classical electrodynamics predicted continuous energy radiation, but quantum electrodynamics establishes that light propagates in indivisible energy packets (photons). In modern solid-state LEDs, direct interband quantum transitions convert electron kinetic energy into photons with quantum efficiency exceeding 80%.",
    honestScopeNotice:
      "Physical Scope Notice: The lamp emits a macroscopic beam of ~10¹⁹ photons per second. While the lamp beam behaves as a classical light field in bulk, each individual photon obeys quantum mechanical probability amplitudes when tested in an interferometer.",
    exploreAction: {
      label: "Launch Double-Slit Photon Interference",
      experimentKey: "double_slit",
      reason: "Observe how discrete photons emitted by a light source form wave interference fringes on a detector screen."
    },
    equation: "E = h\\nu = \\frac{hc}{\\lambda} \\quad (\\Delta E_{\\text{bandgap}} \\to \\gamma)",
    citation: "OpenStax University Physics Vol 3, Ch 6: Photons and Matter Waves"
  },

  desk: {
    key: "desk",
    title: "Solid Walnut Desk",
    material: "American Black Walnut hardwood (Juglans nigra) cellulose/lignin polymer matrix on powder-coated tubular steel",
    phenomenon: "Covalent sp³ Hybridization & Fermion Degeneracy Pressure",
    scale: "Molecular Bond Length (~0.154 nm)",
    physicalProperties: [
      { label: "Dimensions", value: "1.60 m (W) × 0.85 m (D) × 0.75 m (H)" },
      { label: "Wood Density", value: "0.64 g/cm³ (air-dried walnut heartwood)" },
      { label: "Static Friction (μ_s)", value: "0.42 (desk surface against borosilicate glass)" },
      { label: "Young's Modulus (E)", value: "11.5 GPa (longitudinal elastic stiffness)" }
    ],
    quantumRelationship:
      "Wood rigidity is maintained by directional covalent bonds between carbon, oxygen, and hydrogen atoms in cellulose chains. Quantum mechanically, the 2s and 2p electron orbitals of carbon hybridize into four tetrahedral sp³ molecular orbitals, producing lower energy bonding eigenstates that lock the atoms in place. When the glass and laptop rest on the desk, atoms are 99.9999% empty space; the contact force supporting them is pure quantum fermion degeneracy pressure enforcing the Pauli Exclusion Principle.",
    honestScopeNotice:
      "Physical Scope Notice: The desk contains >10²⁶ atoms. There is no single macroscopic wavefunction for the desk. Its mechanical stiffness and contact resistance emerge from localized covalent orbital overlap and Fermi-Dirac statistics.",
    exploreAction: {
      label: "Simulate Quantum Barrier Tunneling",
      experimentKey: "tunneling",
      reason: "Explore how quantum wavefunctions penetrate and reflect from repulsive potential barriers."
    },
    equation: "\\psi_{\\text{bonding}} = \\frac{1}{\\sqrt{2}}(\\phi_{A,\\text{sp}^3} + \\phi_{B,\\text{sp}^3})",
    citation: "OpenStax University Physics Vol 3, Ch 8: Molecular Structure & Covalent Bonds"
  },

  laptop: {
    key: "laptop",
    title: "Quantum Computer Terminal (Laptop)",
    material: "CNC-milled 6000-series aluminum unibody, monocrystalline silicon microprocessor wafer, glass/indium tin oxide display",
    phenomenon: "Semiconductor Bandgaps & Fowler-Nordheim Wave Tunneling",
    scale: "Nanoscale (3 nm Gate MOSFETs & Floating Gate Flash)",
    physicalProperties: [
      { label: "CPU Architecture", value: "3 nm FinFET / GAAFET silicon semiconductor logic" },
      { label: "Transistor Count", value: "> 16 billion integrated gate structures" },
      { label: "Gate Oxide Thickness", value: "~1.2 nm SiO₂ / HfO₂ dielectric barrier" },
      { label: "Flash Memory Mechanism", value: "Fowler-Nordheim quantum tunneling write/erase cycles" }
    ],
    quantumRelationship:
      "Every computation running on this machine directly exploits quantum physics. Transistors regulate current through quantum energy bands (valence and conduction bands separated by a 1.12 eV silicon bandgap). In solid-state NAND flash memory, electrons tunnel directly through a classically impenetrable 1.2 nm potential barrier to store non-volatile charge in floating gates, identical to the 1D Schrödinger barrier transmission calculated in the Quantum Lab.",
    honestScopeNotice:
      "Physical Scope Notice: While the computer operates as a classical digital device, its nanoscale gate oxide leakage and memory storage obey the exact 1D rectangular barrier transmission equation implemented in our analytical solver.",
    exploreAction: {
      label: "Simulate 1D Potential Barrier Tunneling",
      experimentKey: "tunneling",
      reason: "Solve the exact Schrödinger equation governing electron penetration through nanoscale gate oxides."
    },
    equation: "T \\approx \\exp\\left(-2L\\frac{\\sqrt{2m(V_0 - E)}}{\\hbar}\\right)",
    citation: "Rev. Mod. Phys. 75, 715: Quantum Tunneling in Nanoscale Electronics"
  },

  chair: {
    key: "chair",
    title: "Ergonomic Desk Chair",
    material: "Powder-coated steel skeleton, glass-fiber reinforced nylon armature, elastomeric breathable mesh",
    phenomenon: "Fermion Degeneracy & Electrostatic Normal Force",
    scale: "Atomic Shell Overlap (~0.1 nm)",
    physicalProperties: [
      { label: "Load Capacity", value: "135 kg (mechanical load rating)" },
      { label: "Pneumatic Pressure", value: "Class 4 nitrogen gas-lift cylinder (~4.5 MPa)" },
      { label: "Mesh Elasticity", value: "High-tensile polyester-elastomer tension grid" }
    ],
    quantumRelationship:
      "When you sit on this chair, the sensation of mechanical contact is governed by the Pauli Exclusion Principle. As the electron clouds in your clothing molecules approach within ~0.1 nm of the chair mesh molecules, the overlapping electron wavefunctions must remain antisymmetric. This forces electrons into higher-energy unoccupied states, generating a powerful repulsive contact force that counters gravity and supports your body.",
    honestScopeNotice:
      "Physical Scope Notice: Macroscopic contact mechanics is an emergent phenomenon of many-body Fermi-Dirac statistics, not a single coherent wavefunction.",
    exploreAction: {
      label: "Simulate Quantum Potential Scattering",
      experimentKey: "tunneling",
      reason: "Examine how repulsive potential barriers reflect incoming electron probability waves."
    },
    equation: "\\Delta E_{\\text{contact}} = \\langle \\Psi | \\hat{H}_{\\text{exchange}} | \\Psi \\rangle",
    citation: "MIT 8.04 Quantum Physics I: Many-Particle Systems & Degeneracy"
  },

  books: {
    key: "books",
    title: "Physics Textbooks (Griffiths, Feynman, Dirac)",
    material: "Wood-fiber cellulose paper, soy-based offset printing ink, cloth-wrapped board covers",
    phenomenon: "Wavefunction Formalism & Operator Hilbert Space",
    scale: "Theoretical Foundations",
    physicalProperties: [
      { label: "Edition Set", value: "Griffiths Quantum Mechanics, Feynman Lectures Vol III, Dirac Principles" },
      { label: "Page Count", value: "1,450 pages of mathematical derivations and experiments" },
      { label: "Binding", value: "Acid-free archival paper with sewn signatures" }
    ],
    quantumRelationship:
      "These classic references formulate the non-relativistic Schrödinger wave equation iℏ ∂Ψ/∂t = ĤΨ, establishing that physical quantum states reside in complex Hilbert spaces, observables correspond to Hermitian operators, and measurement probabilities equal the absolute square of state amplitudes |⟨x|Ψ⟩|².",
    honestScopeNotice:
      "Physical Scope Notice: Theoretical physics texts formulating the mathematical principles of wave mechanics and state vector transformations.",
    exploreAction: {
      label: "Explore Double-Slit Wave-Particle Duality",
      experimentKey: "double_slit",
      reason: "Observe the foundational experiment described in Feynman Lectures Vol III, Chapter 1."
    },
    equation: "i\\hbar \\frac{\\partial}{\\partial t}|\\Psi\\rangle = \\hat{H}|\\Psi\\rangle",
    citation: "P.A.M. Dirac, The Principles of Quantum Mechanics (Oxford University Press, 1930)"
  },

  window: {
    key: "window",
    title: "Architectural Exterior Window",
    material: "Dual-pane soda-lime float glass with 12 mm argon gas thermal cavity, thermal-break aluminum frame",
    phenomenon: "Optical Bandgap Filtering & Ultraviolet Photonic Absorption",
    scale: "Amorphous Network (Silicate Glass)",
    physicalProperties: [
      { label: "Glass Construction", value: "Dual 4 mm tempered panes with 12 mm argon gas space" },
      { label: "Visible Light Transmission", value: "76% transmission across 380–750 nm spectrum" },
      { label: "Solar Heat Gain (SHGC)", value: "0.38 (spectrally selective low-emissivity coating)" },
      { label: "UV Cutoff Wavelength", value: "λ < 310 nm (photons > 4.0 eV strongly absorbed)" }
    ],
    opticalPhysics: {
      refractionMechanism:
        "Float glass has an index of refraction n ≈ 1.52. Photons traveling at c = 300,000 km/s slow to v ≈ 197,000 km/s upon entering the pane, refracting light from outdoor skylight and sunset vistas into the interior.",
      transparencyOrigin:
        "Silica soda-lime glass has an optical bandgap Eg ≈ 9 eV. Visible photons (1.8–3.1 eV) do not have enough energy to promote valence electrons across the gap, allowing daylight to fill the room. In contrast, higher-energy UV photons promote electrons, causing absorption."
    },
    quantumRelationship:
      "The window demonstrates quantum spectral selectivity. It transmits visible sunlight while blocking harmful solar ultraviolet photons whose energy exceeds the localized absorption threshold of the glass matrix.",
    honestScopeNotice:
      "Physical Scope Notice: The window transmits ~10²⁰ visible photons each second; each individual photon obeys quantum wave-particle duality as verified in optical interferometers.",
    exploreAction: {
      label: "Explore Double-Slit Optical Interference",
      experimentKey: "double_slit",
      reason: "Test how monochromatic light beams refract and interfere through narrow apertures."
    },
    equation: "E_{\\text{visible}} = 1.65\\text{–}3.1\\text{ eV} < E_g \\approx 9\\text{ eV}",
    citation: "OpenStax University Physics Vol 3, Ch 9: Optical Absorption in Insulators"
  },

  bed: {
    key: "bed",
    title: "Modern Platform Bed",
    material: "Solid Scandinavian birch frame, pocketed steel springs, viscoelastic memory foam, woven cotton duvet",
    phenomenon: "Thermal Phonon Vibrations & Planck Blackbody Emission",
    scale: "Crystal Lattice Vibrations (~10¹² Hz)",
    physicalProperties: [
      { label: "Dimensions", value: "2.10 m (L) × 1.60 m (W) × 0.55 m (H)" },
      { label: "Equilibrium Temperature", value: "20°C (293.15 K ambient room equilibrium)" },
      { label: "Peak Thermal Wavelength", value: "λ_max ≈ 9.88 μm (infrared blackbody radiation)" }
    ],
    quantumRelationship:
      "The warmth and thermal energy of the bedding consists of quantized acoustic vibrations of the molecular lattice known as phonons. Furthermore, the bed continuously radiates thermal infrared photons according to Max Planck's quantum radiation law. Planck's discovery in 1900 that radiant energy is emitted only in discrete quanta E = nhν resolved the classical ultraviolet catastrophe and gave birth to quantum mechanics.",
    honestScopeNotice:
      "Physical Scope Notice: A macroscopic thermal body at room temperature. Its infrared radiation spectrum directly reflects Planck's quantum hypothesis.",
    exploreAction: {
      label: "Launch Quantum Lab Simulation",
      experimentKey: "tunneling",
      reason: "Simulate particle energy and wave mechanics in the Quantum Lab."
    },
    equation: "u(\\nu, T) = \\frac{8\\pi h\\nu^3}{c^3}\\frac{1}{e^{h\\nu / k_B T} - 1}",
    citation: "OpenStax University Physics Vol 3, Ch 6: Planck's Quantum Hypothesis"
  }
};
