/**
 * QuantMix Quantum Physics Calculations Module
 * Provides pure, verified scientific calculation routines
 * separated from visual rendering components.
 */

// Electron mass in kg
export const ELECTRON_MASS_KG = 9.1093837015e-31;

// Reduced Planck constant in J·s
export const HBAR_JS = 1.054571817e-34;

// Full Planck constant in J·s
export const H_PLANCK_JS = 6.62607015e-34;

// Elementary charge in Coulombs (J/eV conversion)
export const ELEMENTARY_CHARGE = 1.602176634e-19;

// Speed of light in m/s
export const SPEED_OF_LIGHT = 299792458;

/**
 * Calculates complete quantum scattering and transmission through a 1D rectangular potential barrier.
 *
 * @param {number} energyEv - Particle energy E in electron-volts (eV)
 * @param {number} barrierHeightEv - Potential barrier height V₀ in electron-volts (eV)
 * @param {number} barrierWidthNm - Barrier width L in nanometers (nm)
 * @returns {object} Complete calculated physical quantities, complex amplitudes, and parameters
 */
export function calculateRectangularBarrierTunneling(energyEv, barrierHeightEv, barrierWidthNm) {
  const E = Math.max(0.01, Number(energyEv));
  const V0 = Math.max(0.01, Number(barrierHeightEv));
  const L_nm = Math.max(0.05, Number(barrierWidthNm));

  // Width in meters
  const L = L_nm * 1e-9;

  // Energies in Joules
  const EJ = E * ELEMENTARY_CHARGE;
  const V0J = V0 * ELEMENTARY_CHARGE;

  // Incident wavenumber in Region I and III: k1 = sqrt(2*m*E) / hbar
  const k1 = Math.sqrt(2 * ELECTRON_MASS_KG * EJ) / HBAR_JS; // in m^-1
  const k1_nm = k1 * 1e-9; // in nm^-1

  // De Broglie wavelength lambda = 2*pi / k1
  const deBroglieWavelengthNm = (2 * Math.PI) / k1_nm;

  // Particle group velocity v = hbar * k1 / m
  const velocityMs = (HBAR_JS * k1) / ELECTRON_MASS_KG;
  const velocityCPercent = (velocityMs / SPEED_OF_LIGHT) * 100;

  let T = 0;
  let R = 0;
  let kappa = 0; // decay constant (m^-1)
  let k2 = 0; // propagation wavenumber in Region II if E > V0 (m^-1)

  // Complex reflection and transmission amplitudes (r = rRe + i*rIm, t = tRe + i*tIm)
  let rRe = 0;
  let rIm = 0;
  let tRe = 0;
  let tIm = 0;

  // Barrier internal wave amplitudes A and B
  let aRe = 0;
  let aIm = 0;
  let bRe = 0;
  let bIm = 0;

  const regime = E < V0 ? "tunneling" : E > V0 ? "over-barrier" : "threshold";

  if (E < V0) {
    // -------------------------------------------------------------
    // REGIME 1: Quantum Tunneling (E < V0)
    // -------------------------------------------------------------
    const deltaV = V0J - EJ;
    kappa = Math.sqrt(2 * ELECTRON_MASS_KG * deltaV) / HBAR_JS;
    const kappaL = kappa * L;

    if (kappaL > 35) {
      // Exponential approximation for thick barrier to prevent numeric overflow
      const prefactor = 16 * (E / V0) * (1 - E / V0);
      T = Math.max(0, prefactor * Math.exp(-2 * kappaL));
      R = 1 - T;
      rRe = -Math.sqrt(R);
      rIm = 0;
      tRe = Math.sqrt(T) * Math.cos(-k1 * L);
      tIm = Math.sqrt(T) * Math.sin(-k1 * L);
      aRe = Math.sqrt(T) * Math.exp(kappaL);
      aIm = 0;
      bRe = 0;
      bIm = 0;
    } else {
      const coshKL = Math.cosh(kappaL);
      const sinhKL = Math.sinh(kappaL);

      // Exact denominator: D = cosh(kappa*L) + i * ((kappa^2 - k1^2) / (2*k1*kappa)) * sinh(kappa*L)
      const denomRe = coshKL;
      const denomIm = ((kappa * kappa - k1 * k1) / (2 * k1 * kappa)) * sinhKL;
      const denomMag2 = denomRe * denomRe + denomIm * denomIm;

      // Exact Transmission and Reflection probabilities
      T = 1 / denomMag2;
      R = 1 - T;

      // Transmission amplitude: t = exp(-i*k1*L) / D
      const cosK1L = Math.cos(k1 * L);
      const sinK1L = Math.sin(k1 * L);
      tRe = (cosK1L * denomRe - sinK1L * denomIm) / denomMag2;
      tIm = (-sinK1L * denomRe - cosK1L * denomIm) / denomMag2;

      // Reflection amplitude: r = i * ((k1^2 + kappa^2)/(2*k1*kappa)) * sinh(kappa*L) / D
      const rNumIm = ((k1 * k1 + kappa * kappa) / (2 * k1 * kappa)) * sinhKL;
      rRe = (rNumIm * denomIm) / denomMag2;
      rIm = (rNumIm * denomRe) / denomMag2;

      // Internal coefficients A and B from matching at x = L:
      // A = ((kappa - i*k1)/(2*kappa)) * exp(kappa*L) * exp(i*k1*L) * t
      // B = ((kappa + i*k1)/(2*kappa)) * exp(-kappa*L) * exp(i*k1*L) * t
      const expK1L_Re = cosK1L;
      const expK1L_Im = sinK1L;
      // exp(i*k1*L) * t:
      const tExpRe = tRe * expK1L_Re - tIm * expK1L_Im;
      const tExpIm = tRe * expK1L_Im + tIm * expK1L_Re;

      const aFactorRe = 0.5 * Math.exp(kappaL);
      const aFactorIm = (-k1 / (2 * kappa)) * Math.exp(kappaL);
      aRe = aFactorRe * tExpRe - aFactorIm * tExpIm;
      aIm = aFactorRe * tExpIm + aFactorIm * tExpRe;

      const bFactorRe = 0.5 * Math.exp(-kappaL);
      const bFactorIm = (k1 / (2 * kappa)) * Math.exp(-kappaL);
      bRe = bFactorRe * tExpRe - bFactorIm * tExpIm;
      bIm = bFactorRe * tExpIm + bFactorIm * tExpRe;
    }
  } else if (E > V0) {
    // -------------------------------------------------------------
    // REGIME 2: Over-Barrier Scattering & Quantum Reflection (E > V0)
    // -------------------------------------------------------------
    const excess = EJ - V0J;
    k2 = Math.sqrt(2 * ELECTRON_MASS_KG * excess) / HBAR_JS;
    const k2L = k2 * L;

    const cosK2L = Math.cos(k2L);
    const sinK2L = Math.sin(k2L);

    // Exact denominator: D = cos(k2*L) - i * ((k1^2 + k2^2) / (2*k1*k2)) * sin(k2*L)
    const denomRe = cosK2L;
    const denomIm = -((k1 * k1 + k2 * k2) / (2 * k1 * k2)) * sinK2L;
    const denomMag2 = denomRe * denomRe + denomIm * denomIm;

    T = 1 / denomMag2;
    R = 1 - T;

    const cosK1L = Math.cos(k1 * L);
    const sinK1L = Math.sin(k1 * L);
    tRe = (cosK1L * denomRe - sinK1L * denomIm) / denomMag2;
    tIm = (-sinK1L * denomRe - cosK1L * denomIm) / denomMag2;

    // Reflection amplitude: r = i * ((k2^2 - k1^2)/(2*k1*k2)) * sin(k2*L) / D
    const rNumIm = ((k2 * k2 - k1 * k1) / (2 * k1 * k2)) * sinK2L;
    rRe = (rNumIm * denomIm) / denomMag2;
    rIm = (rNumIm * denomRe) / denomMag2;

    const tExpRe = tRe * cosK1L - tIm * sinK1L;
    const tExpIm = tRe * sinK1L + tIm * cosK1L;

    // A = ((k2 + k1)/(2*k2)) * exp(-i*k2*L) * exp(i*k1*L) * t
    const aCoeff = (k2 + k1) / (2 * k2);
    const expNegK2L_Re = Math.cos(-k2L);
    const expNegK2L_Im = Math.sin(-k2L);
    const tPhaseRe = tExpRe * expNegK2L_Re - tExpIm * expNegK2L_Im;
    const tPhaseIm = tExpRe * expNegK2L_Im + tExpIm * expNegK2L_Re;
    aRe = aCoeff * tPhaseRe;
    aIm = aCoeff * tPhaseIm;

    // B = ((k2 - k1)/(2*k2)) * exp(i*k2*L) * exp(i*k1*L) * t
    const bCoeff = (k2 - k1) / (2 * k2);
    const expPosK2L_Re = Math.cos(k2L);
    const expPosK2L_Im = Math.sin(k2L);
    const tPhaseBRe = tExpRe * expPosK2L_Re - tExpIm * expPosK2L_Im;
    const tPhaseBIm = tExpRe * expPosK2L_Im + tExpIm * expPosK2L_Re;
    bRe = bCoeff * tPhaseBRe;
    bIm = bCoeff * tPhaseBIm;
  } else {
    // -------------------------------------------------------------
    // REGIME 3: Threshold Critical Limit (E == V0)
    // -------------------------------------------------------------
    const denom = 1 + (ELECTRON_MASS_KG * V0J * Math.pow(L, 2)) / (2 * Math.pow(HBAR_JS, 2));
    T = 1 / denom;
    R = 1 - T;
    tRe = Math.sqrt(T);
    tIm = 0;
    rRe = -Math.sqrt(R);
    rIm = 0;
    aRe = 1 + rRe;
    aIm = 0;
    bRe = (tRe - aRe) / L;
    bIm = 0;
  }

  // Strictly clamp numerical roundoff and enforce probability conservation
  T = Math.max(0, Math.min(1, T));
  R = Math.max(0, Math.min(1, 1 - T));
  const conservationSum = T + R;
  const conservationDeviation = Math.abs(1.0 - conservationSum);

  const kappaNm = kappa * 1e-9;
  const k2_nm = k2 * 1e-9;

  return {
    transmissionCoefficient: T,
    reflectionCoefficient: R,
    transmissionPercent: T * 100,
    reflectionPercent: R * 100,
    conservationSum,
    conservationDeviation,
    formattedTransmission: formatPercentage(T * 100),
    formattedReflection: formatPercentage(R * 100),
    k1_nm,
    kappaNm: kappaNm > 0 ? kappaNm.toFixed(3) : "0.000",
    k2_nm: k2_nm > 0 ? k2_nm.toFixed(3) : "0.000",
    deBroglieWavelengthNm,
    velocityMs,
    velocityCPercent,
    regime,
    amplitudes: {
      rRe,
      rIm,
      tRe,
      tIm,
      aRe,
      aIm,
      bRe,
      bIm
    },
    barrierWidthNm: L_nm,
    barrierHeightEv: V0,
    particleEnergyEv: E
  };
}

/**
 * Computes exact stationary spatial wavefunction values psi(x) across a range.
 *
 * @param {object} physicsData - Result from calculateRectangularBarrierTunneling
 * @param {number} xMinNm - Starting x coordinate in nm
 * @param {number} xMaxNm - Ending x coordinate in nm
 * @param {number} numPoints - Sample density
 * @param {number} timePhase - Phase angle omega * t
 * @returns {Array<{x: number, re: number, im: number, probDensity: number, potential: number}>}
 */
export function evaluateStationaryWavefunction(physicsData, xMinNm = -2.5, xMaxNm = 2.5, numPoints = 300, timePhase = 0) {
  const { barrierWidthNm, barrierHeightEv, k1_nm, kappaNm, k2_nm, regime, amplitudes } = physicsData;
  const { rRe, rIm, tRe, tIm, aRe, aIm, bRe, bIm } = amplitudes;

  const points = [];
  const dx = (xMaxNm - xMinNm) / (numPoints - 1);

  const cosPhase = Math.cos(timePhase);
  const sinPhase = Math.sin(timePhase);

  for (let i = 0; i < numPoints; i++) {
    const x = xMinNm + i * dx;
    let psiRe = 0;
    let psiIm = 0;
    let V = 0;

    if (x < 0) {
      // Region I (x < 0): psi = exp(i*k1*x) + r * exp(-i*k1*x)
      V = 0;
      const incRe = Math.cos(k1_nm * x);
      const incIm = Math.sin(k1_nm * x);
      const refPhaseRe = Math.cos(-k1_nm * x);
      const refPhaseIm = Math.sin(-k1_nm * x);

      const refRe = rRe * refPhaseRe - rIm * refPhaseIm;
      const refIm = rRe * refPhaseIm + rIm * refPhaseRe;

      psiRe = incRe + refRe;
      psiIm = incIm + refIm;
    } else if (x <= barrierWidthNm) {
      // Region II (0 <= x <= L)
      V = barrierHeightEv;
      if (regime === "tunneling") {
        const kappaVal = parseFloat(kappaNm);
        const expDecay = Math.exp(-kappaVal * x);
        const expGrow = Math.exp(kappaVal * x);

        psiRe = aRe * expDecay + bRe * expGrow;
        psiIm = aIm * expDecay + bIm * expGrow;
      } else if (regime === "over-barrier") {
        const k2Val = parseFloat(k2_nm);
        const expPosRe = Math.cos(k2Val * x);
        const expPosIm = Math.sin(k2Val * x);
        const expNegRe = Math.cos(-k2Val * x);
        const expNegIm = Math.sin(-k2Val * x);

        const term1Re = aRe * expPosRe - aIm * expPosIm;
        const term1Im = aRe * expPosIm + aIm * expPosRe;
        const term2Re = bRe * expNegRe - bIm * expNegIm;
        const term2Im = bRe * expNegIm + bIm * expNegRe;

        psiRe = term1Re + term2Re;
        psiIm = term1Im + term2Im;
      } else {
        psiRe = aRe + bRe * x;
        psiIm = aIm + bIm * x;
      }
    } else {
      // Region III (x > L): psi = t * exp(i*k1*x)
      V = 0;
      const transPhaseRe = Math.cos(k1_nm * x);
      const transPhaseIm = Math.sin(k1_nm * x);

      psiRe = tRe * transPhaseRe - tIm * transPhaseIm;
      psiIm = tRe * transPhaseIm + tIm * transPhaseRe;
    }

    // Apply time phase rotation exp(-i*omega*t)
    // psi(x, t) = (psiRe + i*psiIm) * (cosPhase - i*sinPhase)
    const timeRe = psiRe * cosPhase + psiIm * sinPhase;
    const timeIm = psiIm * cosPhase - psiRe * sinPhase;

    const probDensity = timeRe * timeRe + timeIm * timeIm;

    points.push({
      x,
      re: timeRe,
      im: timeIm,
      probDensity,
      potential: V
    });
  }

  return points;
}

/**
 * Generates dynamic time-dependent wavepacket profiles for the colliding wavepacket visualization mode.
 *
 * @param {object} physicsData - Result from calculateRectangularBarrierTunneling
 * @param {number} t - Normalized simulation time (0.0 to 1.0)
 * @param {number} xMinNm - Starting coordinate
 * @param {number} xMaxNm - Ending coordinate
 * @param {number} numPoints - Sample density
 * @returns {Array<{x: number, re: number, im: number, probDensity: number, potential: number}>}
 */
export function evaluateWavepacketDynamics(physicsData, t, xMinNm = -2.5, xMaxNm = 2.5, numPoints = 300) {
  const { barrierWidthNm, barrierHeightEv, k1_nm, kappaNm, transmissionCoefficient, reflectionCoefficient } = physicsData;

  const points = [];
  const dx = (xMaxNm - xMinNm) / (numPoints - 1);

  // Packet speed and positions
  const speed = 2.6; // nm per normalized unit time
  const packetWidth = 0.42; // nm width parameter sigma
  const L = barrierWidthNm;

  // Initial packet center starts at x = -1.8 nm
  const x0 = -1.8;
  const currentCenter = x0 + t * speed;

  const T_amp = Math.sqrt(transmissionCoefficient);
  const R_amp = Math.sqrt(reflectionCoefficient);

  // Time at which packet reaches the barrier front (x = 0)
  const t_hit = Math.abs(x0) / speed;
  const phase = t * 24.0;

  for (let i = 0; i < numPoints; i++) {
    const x = xMinNm + i * dx;
    let psiRe = 0;
    let psiIm = 0;
    let V = (x >= 0 && x <= L) ? barrierHeightEv : 0;

    if (t < t_hit) {
      // Phase 1: Approaching incident wavepacket
      const dist = x - currentCenter;
      const envelope = Math.exp(-(dist * dist) / (2 * packetWidth * packetWidth));
      psiRe = envelope * Math.cos(k1_nm * x - phase);
      psiIm = envelope * Math.sin(k1_nm * x - phase);
    } else {
      // Phase 2: Post-collision splitting into reflected and transmitted packets
      const dt = t - t_hit;

      // Reflected packet travels backward from x = 0 towards xMin
      const reflectedCenter = -dt * speed * 0.95;
      const distRef = x - reflectedCenter;
      const envRef = (x <= 0.05) ? R_amp * Math.exp(-(distRef * distRef) / (2 * packetWidth * packetWidth)) : 0;

      // Transmitted packet travels forward from x = L towards xMax
      const transmittedCenter = L + dt * speed;
      const distTrans = x - transmittedCenter;
      const envTrans = (x >= L - 0.05) ? T_amp * Math.exp(-(distTrans * distTrans) / (2 * packetWidth * packetWidth)) : 0;

      // Evanescent decay inside barrier during collision
      let envBarrier = 0;
      if (x >= 0 && x <= L && dt < 0.6) {
        const decayRate = parseFloat(kappaNm);
        const contactFactor = Math.max(0, 1 - dt / 0.6);
        envBarrier = contactFactor * Math.exp(-decayRate * x);
      }

      const refWaveRe = envRef * Math.cos(-k1_nm * x - phase);
      const refWaveIm = envRef * Math.sin(-k1_nm * x - phase);

      const transWaveRe = envTrans * Math.cos(k1_nm * x - phase);
      const transWaveIm = envTrans * Math.sin(k1_nm * x - phase);

      const barrierRe = envBarrier * Math.cos(phase * 0.5);
      const barrierIm = envBarrier * Math.sin(phase * 0.5);

      psiRe = refWaveRe + transWaveRe + barrierRe;
      psiIm = refWaveIm + transWaveIm + barrierIm;
    }

    const probDensity = psiRe * psiRe + psiIm * psiIm;

    points.push({
      x,
      re: psiRe,
      im: psiIm,
      probDensity,
      potential: V
    });
  }

  return points;
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
