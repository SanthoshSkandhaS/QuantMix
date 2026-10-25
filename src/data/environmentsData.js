/**
 * QuantMix Six Exploratory Environments
 * Detailed metadata for the long-term vision of exploring everyday spaces
 * through quantum mechanics.
 */
export const ENVIRONMENTS = [
  {
    id: "your-room",
    title: "Your Room",
    subtitle: "Everyday Objects, Atomic Realities",
    description: "Explore the surprising quantum foundations holding up your bed, powering your smartphone flash memory, and lighting up your room.",
    status: "Primary Milestone 1 Focus",
    statusBadge: "Next In-Engine Environment",
    isFirstFocus: true,
    accent: "#35D6D0",
    gradient: "linear-gradient(135deg, rgba(53, 214, 208, 0.15) 0%, rgba(155, 140, 255, 0.05) 100%)",
    icon: "Home",
    interactiveObjects: [
      {
        name: "Solid Floor & Chair",
        phenomenon: "Pauli Exclusion Principle",
        detail: "Why you don't sink through the floor: electron degeneracy and antisymmetric wavefunctions resist overlapping."
      },
      {
        name: "Smartphone SSD / Flash Memory",
        phenomenon: "Fowler-Nordheim Tunneling",
        detail: "Electrons tunnel through insulating silicon dioxide barriers to trap bits of charge without mechanical wear."
      },
      {
        name: "Fluorescent Light / LED",
        phenomenon: "Quantized Energy Transitions",
        detail: "Photons emitted when excited electrons cascade between discrete atomic energy levels."
      },
      {
        name: "Warm Mug of Tea",
        phenomenon: "Blackbody Radiation & Infrared Photons",
        detail: "Continuous thermal electromagnetic emissions governed by Planck's distribution law."
      }
    ],
    plannedFeatures: [
      "Walkable 3D Bedroom scene with interactive physics raycasting",
      "Quantum Inspector magnifying glass to see probability clouds",
      "Parameter slider to weaken the Pauli principle and watch objects compress"
    ]
  },
  {
    id: "the-sky",
    title: "The Sky",
    subtitle: "Atmospheric Scattering & Cosmic Particles",
    description: "Look upward to see why the sky is blue, how solar photons cross 93 million miles, and how cosmic ray muons penetrate our atmosphere.",
    status: "In Development",
    statusBadge: "Milestone 3",
    isFirstFocus: false,
    accent: "#9B8CFF",
    gradient: "linear-gradient(135deg, rgba(155, 140, 255, 0.15) 0%, rgba(53, 214, 208, 0.05) 100%)",
    icon: "CloudSun",
    interactiveObjects: [
      {
        name: "Blue Daytime Sky",
        phenomenon: "Rayleigh Scattering & Quantum Polarizability",
        detail: "Higher frequency blue photons scatter via atomic dipole resonance far more strongly (∝ ν⁴) than red."
      },
      {
        name: "Atmospheric Muons",
        phenomenon: "Relativistic Quantum Dilatation",
        detail: "Cosmic ray particles reaching sea level because time slows down at 0.998c."
      },
      {
        name: "Sunlight Core Fusion",
        phenomenon: "Proton–Proton Quantum Tunneling",
        detail: "Solar core temperatures are too cool for classical fusion; protons overcome Coulomb repulsion via tunneling."
      }
    ],
    plannedFeatures: [
      "Solar photon timeline from core quantum fusion to retinal absorption",
      "Muon cloud chamber simulation"
    ]
  },
  {
    id: "the-street",
    title: "The Street",
    subtitle: "Modern Infrastructure & Quantum Photonics",
    description: "Step onto a city sidewalk where traffic sensors, fiber-optic communication cables, and photo-sensors orchestrate urban life.",
    status: "In Development",
    statusBadge: "Milestone 4",
    isFirstFocus: false,
    accent: "#35D6D0",
    gradient: "linear-gradient(135deg, rgba(53, 214, 208, 0.12) 0%, rgba(17, 27, 46, 0.8) 100%)",
    icon: "Navigation",
    interactiveObjects: [
      {
        name: "LED Traffic Signals",
        phenomenon: "Direct Bandgap Electron-Hole Recombination",
        detail: "Electrons recombining with positive holes across GaN semiconductors to release direct monochromatic photons."
      },
      {
        name: "Underground Fiber Cables",
        phenomenon: "Total Internal Reflection & Quantum Solitons",
        detail: "Sub-nanosecond optical wavepackets transmitting terabits of global Internet data."
      },
      {
        name: "Solar Powered Crosswalk Sign",
        phenomenon: "The Photoelectric Effect",
        detail: "Solar photons exciting valence electrons into conduction states across p-n junctions."
      }
    ],
    plannedFeatures: [
      "Subsurface fiber optic packet visualization",
      "Dynamic urban spectrum explorer"
    ]
  },
  {
    id: "a-football-field",
    title: "A Football Field",
    subtitle: "Quantum Coherence in Open Turf",
    description: "Beneath the stadium lights, trillions of blades of grass employ quantum excitonic coherence to capture sunlight with near-perfect efficiency.",
    status: "In Development",
    statusBadge: "Milestone 4",
    isFirstFocus: false,
    accent: "#35D6D0",
    gradient: "linear-gradient(135deg, rgba(53, 214, 208, 0.15) 0%, rgba(255, 139, 120, 0.05) 100%)",
    icon: "Trophy",
    interactiveObjects: [
      {
        name: "Grass Blade Chlorophyll",
        phenomenon: "Photosynthetic Quantum Exciton Coherence",
        detail: "Delocalized energy packets sample multiple pathways simultaneously across molecular complexes."
      },
      {
        name: "Metal Halide Floodlights",
        phenomenon: "Plasma Arc Spectral Emission Lines",
        detail: "Metal iodide atoms vaporized to emit rich, high-efficiency visible quantum spectra."
      },
      {
        name: "Leather Ball Impact",
        phenomenon: "Elastic Molecular Van der Waals Forces",
        detail: "Quantum electromagnetic dipole-dipole interactions rebounding the ball off athletic turf."
      }
    ],
    plannedFeatures: [
      "Sub-nanometer chlorophyll reaction center zoom",
      "Macroscopic stadium acoustics vs. atomic vibration modes"
    ]
  },
  {
    id: "inside-a-bus",
    title: "Inside a Bus",
    subtitle: "Commuter Physics & Atomic Navigation",
    description: "Travel through a moving passenger coach connected to atomic clocks in orbit and powered by electrochemical energy storage.",
    status: "In Development",
    statusBadge: "Milestone 5",
    isFirstFocus: false,
    accent: "#FF8B78",
    gradient: "linear-gradient(135deg, rgba(255, 139, 120, 0.15) 0%, rgba(155, 140, 255, 0.08) 100%)",
    icon: "Bus",
    interactiveObjects: [
      {
        name: "GPS Navigation Unit",
        phenomenon: "Cesium Atomic Clock Hyperfine Transitions",
        detail: "Position triangulated using atomic clocks stabilized to 9,192,631,770 Hz microwave transitions."
      },
      {
        name: "Electric Bus Battery",
        phenomenon: "Lithium Ion Quantum Intercalation",
        detail: "Lithium ions slipping into graphite graphene layers via quantum potential wells."
      },
      {
        name: "Tempered Glass Windows",
        phenomenon: "Amorphous Silica Optical Transmission",
        detail: "Why glass is transparent: photon energies are too small to jump the wide 9 eV bandgap."
      }
    ],
    plannedFeatures: [
      "Orbital GPS satellite clock sync comparison",
      "Battery electrode ion migration micro-view"
    ]
  },
  {
    id: "inside-the-human-body",
    title: "Inside the Human Body",
    subtitle: "Biophysics at the Frontier of Consciousness",
    description: "Peer inside the human cellular architecture where quantum tunneling catalyzes enzyme biochemistry and enables visual perception.",
    status: "In Development",
    statusBadge: "Milestone 6",
    isFirstFocus: false,
    accent: "#9B8CFF",
    gradient: "linear-gradient(135deg, rgba(155, 140, 255, 0.2) 0%, rgba(53, 214, 208, 0.1) 100%)",
    icon: "HeartPulse",
    interactiveObjects: [
      {
        name: "Retinal Cells in the Eye",
        phenomenon: "Rhodopsin Photoisomerization",
        detail: "A single photon triggers 11-cis to all-trans retinal isomerization in under 200 femtoseconds."
      },
      {
        name: "Metabolic Enzymes",
        phenomenon: "Enzymatic Hydrogen & Electron Tunneling",
        detail: "Enzymes compress barriers allowing protons to tunnel, accelerating biochemical reactions 10¹⁴ times."
      },
      {
        name: "DNA Base Pairing",
        phenomenon: "Quantum Proton Tunnelling & Tautomerism",
        detail: "Spontaneous proton tunneling across hydrogen bonds can induce rare spontaneous genetic mutations."
      }
    ],
    plannedFeatures: [
      "Interactive 200-femtosecond visual pigment isomerization slider",
      "Proton transfer potential energy curve visualization"
    ]
  }
];
