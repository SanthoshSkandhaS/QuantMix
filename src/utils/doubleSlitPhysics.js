/**
 * Analytical Double-Slit & Single-Slit Quantum Physics Engine
 *
 * Implements rigorous wave optics and de Broglie matter wave mechanics:
 * - Two-slit Fraunhofer diffraction & interference:
 *     I(x) = I₀ * [sin(β)/β]² * cos²(α)
 *     where β = (π * a * x) / (λ * D)   [single-slit diffraction envelope]
 *           α = (π * d * x) / (λ * D)   [two-slit interference fringes]
 * - Single-slit diffraction (when only 1 slit is open):
 *     I(x) = I₀ * [sin(β)/β]²
 *     Notice: NO interference fringes form! Demonstrates wave-particle duality and path interference.
 * - Matter wave de Broglie relation:
 *     λ = h / p = h / sqrt(2 * m * E)
 * - Stochastic particle impact generator (rejection sampling based on probability density P(x) ∝ I(x))
 *
 * Reference: OpenStax University Physics Vol 3, Chapter 3 & 4 (Interference & Diffraction)
 */

export const PARTICLE_CONFIGS = {
  photon_green: {
    name: "Photon (532 nm Green Laser)",
    species: "photon",
    wavelengthNm: 532,
    massKg: 0,
    energyEv: 2.33,
    description: "Coherent 532 nm light emitted by a frequency-doubled Nd:YAG laser diode."
  },
  photon_red: {
    name: "Photon (650 nm Red Laser)",
    species: "photon",
    wavelengthNm: 650,
    massKg: 0,
    energyEv: 1.91,
    description: "Monochromatic 650 nm visible red photon beam."
  },
  electron_50ev: {
    name: "Electron (50 eV de Broglie Wave)",
    species: "matter",
    wavelengthNm: 0.173, // λ = h / sqrt(2 * m_e * 50 eV) = 0.173 nm
    massKg: 9.1093837e-31,
    energyEv: 50.0,
    description: "Thermal cathode electron accelerated through a 50 V electric potential."
  },
  electron_100ev: {
    name: "Electron (100 eV de Broglie Wave)",
    species: "matter",
    wavelengthNm: 0.123,
    massKg: 9.1093837e-31,
    energyEv: 100.0,
    description: "Accelerated electron exhibiting matter wave interference as first observed by Davisson-Germer (1927)."
  }
};

/**
 * Calculates physical double-slit parameters and intensity profile
 *
 * @param {Object} params
 * @param {string} params.slitMode - "both" | "left" | "right"
 * @param {number} params.wavelengthNm - wavelength in nanometers (e.g. 532)
 * @param {number} params.slitSeparationUm - slit separation d in micrometers (e.g. 200)
 * @param {number} params.slitWidthUm - slit width a in micrometers (e.g. 40)
 * @param {number} params.screenDistanceM - distance to detector screen D in meters (default 1.2 m)
 * @param {number} params.screenSpanMm - total visible width on detector screen in mm (e.g. 30 mm)
 * @param {number} params.resolution - number of evaluation sample points along screen
 */
export function calculateDoubleSlitPattern({
  slitMode = "both",
  wavelengthNm = 532,
  slitSeparationUm = 200,
  slitWidthUm = 40,
  screenDistanceM = 1.2,
  screenSpanMm = 30,
  resolution = 600
}) {
  const lambda = wavelengthNm * 1e-9; // meters
  const d = slitSeparationUm * 1e-6; // meters
  const a = slitWidthUm * 1e-6; // meters
  const D = screenDistanceM; // meters
  const halfSpan = (screenSpanMm * 1e-3) / 2; // meters

  // Analytical fringe spacing: Δy = (λ * D) / d
  const fringeSpacingMm = d > 0 ? ((lambda * D) / d) * 1000 : 0;

  // Central maximum diffraction envelope width: W = (2 * λ * D) / a
  const centralMaxDiffractionWidthMm = a > 0 ? ((2 * lambda * D) / a) * 1000 : 0;

  // Discrete profile arrays
  const positionsMm = [];
  const intensities = [];
  const diffractionEnvelopes = [];

  let maxIntensity = 0;

  for (let i = 0; i < resolution; i++) {
    const xMeters = -halfSpan + (i / (resolution - 1)) * (2 * halfSpan);
    const xMm = xMeters * 1000;
    positionsMm.push(xMm);

    // Diffraction parameter beta = (pi * a * x) / (lambda * D)
    const beta = (Math.PI * a * xMeters) / (lambda * D);
    const sinc = Math.abs(beta) < 1e-7 ? 1.0 : Math.sin(beta) / beta;
    const diffEnvelope = sinc * sinc;
    diffractionEnvelopes.push(diffEnvelope);

    let intensity = 0;

    if (slitMode === "both") {
      // Interference parameter alpha = (pi * d * x) / (lambda * D)
      const alpha = (Math.PI * d * xMeters) / (lambda * D);
      const interference = Math.cos(alpha) * Math.cos(alpha);
      intensity = diffEnvelope * interference;
    } else if (slitMode === "left") {
      // Single slit centered at -d/2
      const xOffset = xMeters + d / 2;
      const betaLeft = (Math.PI * a * xOffset) / (lambda * D);
      const sincLeft = Math.abs(betaLeft) < 1e-7 ? 1.0 : Math.sin(betaLeft) / betaLeft;
      intensity = 0.5 * sincLeft * sincLeft;
    } else if (slitMode === "right") {
      // Single slit centered at +d/2
      const xOffset = xMeters - d / 2;
      const betaRight = (Math.PI * a * xOffset) / (lambda * D);
      const sincRight = Math.abs(betaRight) < 1e-7 ? 1.0 : Math.sin(betaRight) / betaRight;
      intensity = 0.5 * sincRight * sincRight;
    }

    intensities.push(intensity);
    if (intensity > maxIntensity) maxIntensity = intensity;
  }

  // Normalized intensity profile for sampling
  const normalizedIntensities = intensities.map((v) => (maxIntensity > 0 ? v / maxIntensity : 0));

  return {
    slitMode,
    wavelengthNm,
    slitSeparationUm,
    slitWidthUm,
    screenDistanceM,
    screenSpanMm,
    fringeSpacingMm,
    centralMaxDiffractionWidthMm,
    positionsMm,
    intensities,
    normalizedIntensities,
    diffractionEnvelopes,
    maxIntensity
  };
}

/**
 * Samples a single particle arrival position x on the screen using rejection sampling
 * directly according to the exact intensity probability distribution P(x) ∝ I(x).
 *
 * @param {Object} patternData - calculated pattern from calculateDoubleSlitPattern
 * @returns {{ xMm: number, yMm: number }}
 */
export function sampleParticleImpact(patternData) {
  const { positionsMm, normalizedIntensities, screenSpanMm } = patternData;
  const halfSpan = screenSpanMm / 2;
  const len = positionsMm.length;

  // Rejection sampling
  for (let attempt = 0; attempt < 1000; attempt++) {
    const candidateXMm = -halfSpan + Math.random() * screenSpanMm;
    // Find nearest index
    const frac = (candidateXMm + halfSpan) / screenSpanMm;
    const idx = Math.min(len - 1, Math.max(0, Math.floor(frac * len)));
    const targetProbability = normalizedIntensities[idx];

    if (Math.random() <= targetProbability) {
      // Realistic vertical spread on detector screen (Gaussian slit height distribution)
      const u1 = Math.random();
      const u2 = Math.random();
      const randStdNormal = Math.sqrt(-2.0 * Math.log(u1 || 0.0001)) * Math.cos(2.0 * Math.PI * u2);
      const yMm = randStdNormal * 4.5; // ~±10 mm screen vertical height

      return {
        xMm: candidateXMm,
        yMm
      };
    }
  }

  // Fallback if rejection limit reached
  return {
    xMm: (-0.5 + Math.random()) * 2,
    yMm: (-0.5 + Math.random()) * 5
  };
}
