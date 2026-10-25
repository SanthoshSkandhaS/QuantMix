/**
 * QuantMix Quantum Physics Calculations Module
 * Provides pure, verified scientific calculation routines
 * separated from visual rendering components.
 */

// Electron mass in kg
export const ELECTRON_MASS_KG = 9.1093837015e-31;

// Reduced Planck constant in J·s
export const HBAR_JS = 1.054571817e-34;

// Elementary charge in Coulombs (J/eV conversion)
export const ELEMENTARY_CHARGE = 1.602176634e-19;

/**
 * Calculates transmission probability T through a 1D rectangular potential barrier.
 *
 * @param {number} energyEv - Particle energy E in electron-volts (eV)
 * @param {number} barrierHeightEv - Potential barrier height V₀ in electron-volts (eV)
 * @param {number} barrierWidthNm - Barrier width w in nanometers (nm)
 * @returns {object} Calculated physical quantities
 */
export function calculateRectangularBarrierTunneling(energyEv, barrierHeightEv, barrierWidthNm) {
  const E = Math.max(0.01, Number(energyEv));
  const V0 = Math.max(0.01, Number(barrierHeightEv));
  const wNm = Math.max(0.05, Number(barrierWidthNm));

  // Width in meters
  const a = wNm * 1e-9;

  // Energy differences in Joules
  const EJ = E * ELEMENTARY_CHARGE;
  const V0J = V0 * ELEMENTARY_CHARGE;

  let T = 0;
  let kappa = 0; // decay constant (1/m)
  let k1 = 0; // propagation wavenumber inside barrier if E > V0

  if (E < V0) {
    // Quantum tunneling regime (E < V0)
    // kappa = sqrt(2 * m * (V0 - E)) / hbar
    const deltaV = V0J - EJ;
    kappa = Math.sqrt(2 * ELECTRON_MASS_KG * deltaV) / HBAR_JS; // in m^-1

    const kappaA = kappa * a;

    // Sinh can overflow for very large arguments (e.g. kappaA > 50)
    if (kappaA > 40) {
      // Exponential approximation: T ~= 16 * (E / V0) * (1 - E / V0) * exp(-2 * kappa * a)
      const prefactor = 16 * (E / V0) * (1 - E / V0);
      T = prefactor * Math.exp(-2 * kappaA);
    } else {
      const sinhVal = Math.sinh(kappaA);
      const denominator = 1 + (Math.pow(V0, 2) * Math.pow(sinhVal, 2)) / (4 * E * (V0 - E));
      T = 1 / denominator;
    }
  } else if (E > V0) {
    // Classical transmission with quantum reflection regime (E > V0)
    const excess = EJ - V0J;
    k1 = Math.sqrt(2 * ELECTRON_MASS_KG * excess) / HBAR_JS;
    const sinVal = Math.sin(k1 * a);
    const denominator = 1 + (Math.pow(V0, 2) * Math.pow(sinVal, 2)) / (4 * E * (E - V0));
    T = 1 / denominator;
  } else {
    // E == V0 critical boundary limit
    const denominator = 1 + (ELECTRON_MASS_KG * V0J * Math.pow(a, 2)) / (2 * Math.pow(HBAR_JS, 2));
    T = 1 / denominator;
  }

  // Ensure T is strictly clamped between 0 and 1
  T = Math.max(0, Math.min(1, T));
  const R = 1 - T;

  // Kappa in nm^-1 for educational display
  const kappaNm = (kappa * 1e-9);

  return {
    transmissionCoefficient: T,
    reflectionCoefficient: R,
    transmissionPercent: T * 100,
    reflectionPercent: R * 100,
    formattedTransmission: formatPercentage(T * 100),
    formattedReflection: formatPercentage(R * 100),
    kappaNm: kappaNm > 0 ? kappaNm.toFixed(3) : "0.000",
    attenuationFactor: kappaNm > 0 ? Math.exp(-kappaNm * wNm) : 1,
    regime: E < V0 ? "tunneling" : E > V0 ? "over-barrier" : "resonance"
  };
}

function formatPercentage(pct) {
  if (pct >= 99.99) return "> 99.9%";
  if (pct >= 10) return `${pct.toFixed(1)}%`;
  if (pct >= 1) return `${pct.toFixed(2)}%`;
  if (pct >= 0.01) return `${pct.toFixed(2)}%`;
  if (pct >= 0.0001) return `${pct.toFixed(4)}%`;
  if (pct > 0) return `${pct.toExponential(2)}%`;
  return "0.00%";
}
