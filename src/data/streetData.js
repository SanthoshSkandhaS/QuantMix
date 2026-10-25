/**
 * Street Environment Data & Mapped Quantum Phenomena
 */
export const STREET_QUANTUM_FACTS = {
  trafficLight: {
    title: "Traffic Signal LED",
    phenomenon: "Semiconductor Bandgap Recombination (E = hc/λ)",
    scale: "Microscopic (Solid-State Quantum Electronics)",
    materialComposition:
      "AlGaInP & InGaN III-V direct bandgap semiconductor micro-dies, wire-bonded to copper lead frames, encapsulated in high-refraction optical epoxy.",
    macroscopicSummary:
      "A classical 3-aspect optical signal cycling through Red (stop), Amber (caution), and Green (go) using automated timing relays.",
    quantumSummary:
      "Modern traffic signals use solid-state Light Emitting Diodes (LEDs). Under forward electrical bias, electrons cross from the n-doped conduction band and drop into p-doped valence holes, emitting single photons whose energy exactly equals the semiconductor bandgap: E = h·ν = h·c / λ. AlGaInP semiconductors yield red light (λ ≈ 630 nm, E_g ≈ 1.97 eV), while InGaN yields green light (λ ≈ 525 nm, E_g ≈ 2.36 eV).",
    equation: "E_{\\text{photon}} = h\\nu = \\frac{hc}{\\lambda} = E_g",
    citation: "OpenStax University Physics Vol 3, Ch 9: Semiconductor Devices",
    honestScopeNotice:
      "Physical Scope Notice: Traffic signal LEDs operate via semiconductor bandgap electron-hole radiative recombination rather than isolated atomic transitions. We model the quantized photons emitted by this process in the Double-Slit Optical Lab.",
    exploreAction: {
      label: "Explore Double-Slit Optical Wave-Particle Duality",
      experimentKey: "double_slit",
      reason: "Examine how individual photons emitted by semiconductor sources accumulate into interference fringes on a detector screen."
    }
  },
  streetlight: {
    title: "Street Luminaire",
    phenomenon: "Atomic Line Spectra & Electron Transitions",
    scale: "Atomic (Excited Electronic Energy Levels)",
    materialComposition:
      "High-pressure sodium (HPS) arc tube or GaN solid-state luminaire module with borosilicate glass optical refractors.",
    macroscopicSummary:
      "A 6-meter municipal streetlight casting a 120-degree cone of downward illumination onto road lanes and sidewalks.",
    quantumSummary:
      "High-efficiency streetlights utilize gas-discharge plasma or LED arrays. In sodium vapor lamps, electric current excites outer 3p valence electrons of sodium atoms; when they de-excite to the 3s ground state, they emit discrete quantum doublet spectral lines at 589.0 nm and 589.6 nm. In contrast to classical continuous blackbody thermal radiation, this light exists only at quantized energy differences: ΔE = E_2 - E_1.",
    equation: "\\Delta E = E_2 - E_1 = h\\nu",
    citation: "MIT 8.04 Quantum Physics I: Atomic Transitions & Selection Rules",
    honestScopeNotice:
      "Physical Scope Notice: A municipal streetlight emits billions of discrete photons per second (N ~ 10¹⁹ photons/s) whose wave-particle duality is directly demonstrable in diffraction experiments.",
    exploreAction: {
      label: "Explore Double-Slit Optical Wave-Particle Duality",
      experimentKey: "double_slit",
      reason: "Inspect discrete photon impact arrivals and wavelength-dependent fringe spacing."
    }
  },
  car: {
    title: "Automobile Bodywork",
    phenomenon: "Fermi-Dirac Degeneracy & Conduction Plasma",
    scale: "Mesoscopic (Metallic Electronic Plasma)",
    materialComposition:
      "Cold-rolled galvanized sheet steel, stamped 6061-T6 aluminum alloys, and multi-layer polyurethane clearcoat.",
    macroscopicSummary:
      "A 1400 kg steel-and-aluminum passenger vehicle governed by Newtonian mechanics (F = m·a) and tire-asphalt friction.",
    quantumSummary:
      "The car body is made of sheet steel and aluminum alloys. Its metallic sheen and electric conductivity stem from the Fermi-Dirac electron gas: valence electrons are delocalized into a collective quantum Fermi sea with Fermi energy E_F ≈ 7 eV. Incoming visible photons oscillate these free electrons collectively, creating an optical plasma frequency ω_p that reflects over 90% of visible light.",
    equation: "\\omega_p = \\sqrt{\\frac{n e^2}{\\varepsilon_0 m^*}}",
    citation: "Rev. Mod. Phys. 75, 715: Optical Properties of Metallic Solids",
    honestScopeNotice:
      "Physical Scope Notice: A 1,400 kg passenger vehicle's macroscopic mass (m >> m_e) produces an astronomical attenuation constant κ, suppressing quantum tunneling probability strictly to zero (T ~ 10^-10^35).",
    exploreAction: {
      label: "Explore Quantum Tunnelling & Mass Suppression",
      experimentKey: "tunneling",
      reason: "Simulate how scaling particle mass from electrons to heavy hadrons and macroscopic masses drives barrier transmission to zero."
    }
  },
  asphalt: {
    title: "Asphalt Road Surface",
    phenomenon: "Pauli Exclusion Principle & Molecular Repulsion",
    scale: "Nanoscopic Contact (Fermionic Electron Degeneracy)",
    materialComposition:
      "Dense-graded asphalt concrete (~95% crushed granite aggregate bound by 5% viscoelastic petroleum bitumen matrix).",
    macroscopicSummary:
      "Aggregated bitumen and crushed stone providing classical tire traction (friction coefficient μ ≈ 0.75 - 0.85).",
    quantumSummary:
      "What stops the car or pedestrian from sinking through the asphalt road? At the macroscopic scale we call it the 'normal force'. At the fundamental quantum level, it is the Pauli Exclusion Principle. The electrons in the rubber tires and the bitumen molecules are fermions; quantum mechanics forbids multiple identical fermions from occupying the exact same quantum state, producing intense exchange degeneracy pressure that maintains solid structure.",
    equation: "\\Psi(\\mathbf{r}_1, \\mathbf{r}_2) = -\\Psi(\\mathbf{r}_2, \\mathbf{r}_1)",
    citation: "OpenStax University Physics Vol 3, Ch 8: Pauli Exclusion & Solid State",
    honestScopeNotice:
      "Physical Scope Notice: Macroscopic solidity in asphalt results from Pauli exclusion degeneracy between trillions of fermionic electron clouds rather than a single isolated wave state.",
    exploreAction: {
      label: "Explore Quantum Barrier Penetration & Decay",
      experimentKey: "tunneling",
      reason: "Observe how finite potential barriers produce evanescent exponential tails and boundary condition matching."
    }
  },
  busStop: {
    title: "Bus Transit Shelter",
    phenomenon: "Wide Bandgap Optical Transparency",
    scale: "Molecular (Amorphous Silicon Dioxide)",
    materialComposition:
      "10 mm tempered soda-lime/borosilicate silicate glass panels (Eg ≈ 9.0 eV) in extruded anodized aluminum framing.",
    macroscopicSummary:
      "A weather-protective transit passenger shelter constructed of tempered glass panels and powder-coated steel posts.",
    quantumSummary:
      "The shelter's glass is amorphous silicon dioxide (SiO₂). With an enormous electronic bandgap of E_g ≈ 9.0 eV, visible light photons (1.8 to 3.1 eV) lack sufficient energy to promote electrons from the valence band into the conduction band. Because no quantum transition can be excited, the visible photons cannot be absorbed and pass straight through, making the glass transparent.",
    equation: "E_{\\text{photon}} < E_g \\implies \\text{Optical Transmission}",
    citation: "OpenStax University Physics Vol 3, Ch 9: Condensed Matter Physics",
    honestScopeNotice:
      "Physical Scope Notice: Glass transparency in the bus shelter is governed by wide electronic bandgaps preventing visible photon absorption (E_photon < E_g ≈ 9.0 eV).",
    exploreAction: {
      label: "Explore Double-Slit Optical Wave-Particle Duality",
      experimentKey: "double_slit",
      reason: "Observe how unabsorbed visible photons propagate through optical media and produce wave interference fringes."
    }
  }
};
