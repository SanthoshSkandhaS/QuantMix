/**
 * Bedroom Environment Data & Mapped Quantum Phenomena
 */
export const BEDROOM_QUANTUM_FACTS = {
  water: {
    title: "Borosilicate Glass of Water",
    phenomenon: "Pauli Exclusion & Wide Bandgap Transparency",
    scale: "Molecular & Nanoscopic",
    macroscopicSummary:
      "A 250 mL cylindrical glass of water at ambient room temperature (20°C). Under classical rigid-body mechanics, it rests on the table with static friction (μ_s ≈ 0.4), exhibits mass inertia (m ≈ 0.35 kg), and liquid surface tension (γ ≈ 0.0728 N/m).",
    quantumSummary:
      "Two profound quantum principles govern this glass. First: Why is the glass transparent? Amorphous SiO₂ has a huge optical bandgap E_g ≈ 9.0 eV; visible photons (1.8 to 3.1 eV) lack sufficient energy to excite valence electrons across the gap and pass through completely unabsorbed. Second: Why doesn't the glass fall through the desk? Atoms are 99.9999% empty space, but the Pauli Exclusion Principle forbids fermions (electrons) from occupying the same quantum states, producing tremendous degeneracy pressure that creates solid matter rigidity.",
    equation: "\\Psi(\\mathbf{r}_1, \\mathbf{r}_2) = -\\Psi(\\mathbf{r}_2, \\mathbf{r}_1)",
    citation: "OpenStax University Physics Vol 3, Ch 8: Exclusion Principle & Covalent Lattices"
  },
  laptop: {
    title: "Quantum Computer Terminal (Laptop)",
    phenomenon: "Bandgap Semiconductors & Fowler-Nordheim Tunneling",
    scale: "Nanoscale (3 nm Gate MOSFETs & Flash Memory)",
    macroscopicSummary:
      "An aluminum unibody computer terminal running live analytical quantum physics simulations and receiving telemetry at 60 FPS.",
    quantumSummary:
      "Billions of 3-nanometer FinFET transistors in the CPU modulate currents by tuning semiconductor quantum bandgaps. In solid-state NAND flash drive memory, quantum mechanical wave tunneling (Fowler-Nordheim tunneling) injects electrons through a 1.2 nm SiO₂ barrier to trap charge in floating gates, storing digital bits without requiring mechanical movement or continuous power.",
    equation: "J = A \\cdot E^2 \\exp\\left(-\\frac{4\\sqrt{2m^*}\\Phi^{3/2}}{3e\\hbar E}\\right)",
    citation: "Rev. Mod. Phys. 75, 715: Quantum Tunneling in Nanoscale Electronics"
  },
  chair: {
    title: "Ergonomic Desk Chair",
    phenomenon: "Fermion Degeneracy & Electrostatic Exchange",
    scale: "Atomic Shell Overlap",
    macroscopicSummary:
      "A swivel office chair with powder-coated steel legs, caster wheels, and a tension-sprung mesh backrest.",
    quantumSummary:
      "When you sit on this chair, the classical sensation of touch is entirely an electrostatic exchange phenomenon. As the electron clouds of your clothes approach within ~0.1 nm of the polymer seat molecules, the overlapping electron wavefunctions are forced into higher energy quantum states by the Pauli Exclusion Principle, generating the repulsive contact force you perceive as sitting on a solid object.",
    equation: "\\Delta E = \\langle \\Psi | \\hat{H}_{\\text{exchange}} | \\Psi \\rangle",
    citation: "MIT 8.04 Quantum Physics I: Many-Particle Systems"
  },
  desk: {
    title: "Solid Walnut Desk",
    phenomenon: "Covalent sp³ Hybridization & Molecular Orbitals",
    scale: "Molecular Bond Length (~0.154 nm)",
    macroscopicSummary:
      "A 1.6-meter beveled walnut study desk supporting the computer, books, desk lamp, and glassware.",
    quantumSummary:
      "Wood rigidity is created by cellulose and lignin polymers bound by covalent sp³ hybridized carbon-carbon molecular bonds. Quantum mechanical wavefunctions overlap to form bonding orbitals with lower energy eigenvalues, locking the carbon atoms into a macroscopic rigid lattice that resists compressive and shear mechanical deformation.",
    equation: "\\psi_{\\text{bonding}} = \\frac{1}{\\sqrt{2}}(\\phi_A + \\phi_B)",
    citation: "OpenStax University Physics Vol 3, Ch 8: Molecular Bonds"
  },
  window: {
    title: "Architectural Exterior Window",
    phenomenon: "Optical Bandgap & Solar Photon Transmission",
    scale: "Amorphous Network (Silicate Glass)",
    macroscopicSummary:
      "A double-glazed window looking out onto outdoor daylight, dusk, and twilight sky vistas.",
    quantumSummary:
      "Visible sunlight photons (wavelengths 380 nm to 750 nm) pass through window glass because their photon energies (1.65 eV to 3.26 eV) are smaller than the glass electronic bandgap (E_g ≈ 9 eV). However, higher-energy ultraviolet photons (UVB, λ < 310 nm, E > 4.0 eV) are strongly absorbed, protecting the room interior.",
    equation: "E = h\\nu = \\frac{hc}{\\lambda} < E_{\\text{bandgap}}",
    citation: "OpenStax University Physics Vol 3, Ch 9: Optical Absorption"
  },
  books: {
    title: "Physics Textbooks (Griffiths, Feynman, Dirac)",
    phenomenon: "Wavefunction Formalism & Operator Hilbert Space",
    scale: "Theoretical Foundations",
    macroscopicSummary:
      "A stack of standard quantum physics references: Griffiths' 'Introduction to Quantum Mechanics', Feynman Lectures Vol III, and Dirac's 'Principles of Quantum Mechanics'.",
    quantumSummary:
      "These texts formulate the non-relativistic Schrödinger equation iℏ ∂Ψ/∂t = ĤΨ, establishing that state vectors |Ψ⟩ reside in complex Hilbert space, and observable quantities correspond to Hermitian operators whose eigenvalues represent physical measurement outcomes.",
    equation: "i\\hbar \\frac{\\partial}{\\partial t}|\\Psi\\rangle = \\hat{H}|\\Psi\\rangle",
    citation: "P.A.M. Dirac, Principles of Quantum Mechanics (Oxford, 1930)"
  },
  bed: {
    title: "Modern Platform Bed",
    phenomenon: "Thermal Phonon Excitations & Planck Blackbody Radiation",
    scale: "Crystal Lattice Vibrations (~10¹² Hz)",
    macroscopicSummary:
      "A wooden platform bed with a comfortable mattress, folded duvet, and dual pillows.",
    quantumSummary:
      "The heat and thermal energy of the bedding consists of quantized acoustic and optical lattice vibrations termed phonons. The thermal radiation emitted by the bed obeys Max Planck's quantum law of blackbody radiation (1900), the seminal discovery that initiated modern quantum mechanics.",
    equation: "u(\\nu, T) = \\frac{8\\pi h\\nu^3}{c^3}\\frac{1}{e^{h\\nu / k_B T} - 1}",
    citation: "OpenStax University Physics Vol 3, Ch 6: Photons & Matter Waves"
  }
};
