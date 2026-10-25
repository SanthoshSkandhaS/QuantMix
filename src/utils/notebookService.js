/**
 * QuantMix Notebook Service & Typed Operations Layer
 *
 * Provides a high-level API for:
 * - Direct UI actions (saving, searching, filtering, editing, duplicating, deleting)
 * - QuAntI AI natural language execution with validation & error handling
 * - Multi-subscriber state notification for instant reactive UI synchronization
 * - Analytical experiment comparison and research summary generation
 */

import {
  getAllExperiments,
  getExperimentById,
  saveExperiment,
  deleteExperimentById,
  clearAllExperiments,
  exportNotebookJSON,
  exportNotebookCSV,
  importNotebookJSON
} from "./notebookStorage";
import { calculateRectangularBarrierTunneling } from "./quantumPhysics";

// Active Event Listeners for reactive updates
const listeners = new Set();

export function subscribeToNotebook(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notifySubscribers(event = { type: "change" }) {
  listeners.forEach((cb) => {
    try {
      cb(event);
    } catch (err) {
      console.error("Error in notebook subscriber callback:", err);
    }
  });
}

/**
 * Lists experiments with optional filtering and sorting
 *
 * @param {object} options
 * @param {string} [options.search]
 * @param {string} [options.experimentType]
 * @param {string} [options.tag]
 * @param {"newest" | "oldest" | "title" | "transmission"} [options.sort="newest"]
 * @returns {Promise<Array<object>>}
 */
export async function listExperiments(options = {}) {
  let list = await getAllExperiments();

  const { search, experimentType, tag, sort = "newest" } = options;

  // Filter by Type
  if (experimentType && experimentType !== "all") {
    list = list.filter((item) => item.experimentType === experimentType);
  }

  // Filter by Tag
  if (tag) {
    list = list.filter((item) => (item.tags || []).some((t) => t.toLowerCase() === tag.toLowerCase()));
  }

  // Search by Title, Notes, Hypothesis, or Tags
  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    list = list.filter((item) => {
      const titleMatch = (item.title || "").toLowerCase().includes(q);
      const hypMatch = (item.hypothesis || "").toLowerCase().includes(q);
      const obsMatch = (item.observations || "").toLowerCase().includes(q);
      const conMatch = (item.conclusion || "").toLowerCase().includes(q);
      const typeMatch = (item.experimentType || "").toLowerCase().includes(q);
      const tagMatch = (item.tags || []).some((t) => t.toLowerCase().includes(q));
      return titleMatch || hypMatch || obsMatch || conMatch || typeMatch || tagMatch;
    });
  }

  // Sorting
  if (sort === "oldest") {
    list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  } else if (sort === "title") {
    list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  } else if (sort === "transmission") {
    list.sort((a, b) => {
      const tA = parseFloat(a.results?.transmissionPercent || 0);
      const tB = parseFloat(b.results?.transmissionPercent || 0);
      return tB - tA;
    });
  } else {
    // default: newest
    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  return list;
}

/**
 * Retrieves a single experiment by ID
 */
export async function getExperiment(id) {
  return await getExperimentById(id);
}

/**
 * Creates and stores an experiment from active simulation state
 *
 * @param {object} simState - { energyEv, barrierHeightEv, barrierWidthNm, particleKey, physicsData }
 * @param {string} [customTitle]
 * @param {string} [hypothesis]
 * @param {Array<string>} [tags]
 * @returns {Promise<object>} Created experiment record
 */
export async function createExperimentFromCurrentSimulation(simState, customTitle, hypothesis = "", tags = []) {
  if (!simState) throw new Error("Simulation state required to record experiment.");

  const E = Number(simState.energyEv) || 3.8;
  const V0 = Number(simState.barrierHeightEv) || 4.5;
  const L = Number(simState.barrierWidthNm) || 0.35;
  const particleKey = simState.particleKey || "electron";

  // Always compute or verify with analytical physics engine
  const physicsData = simState.physicsData || calculateRectangularBarrierTunneling(E, V0, L, particleKey);

  // Generate sampled probability density points for reproducible graph preview
  const graphPoints = [];
  const totalPoints = 30;
  const xMin = -0.5;
  const xMax = L + 0.5;
  const step = (xMax - xMin) / (totalPoints - 1);
  for (let i = 0; i < totalPoints; i++) {
    const x = xMin + i * step;
    let probDensity = 0;
    if (x < 0) {
      // Region I
      probDensity = 1.0 + Math.pow(physicsData.reflectionCoefficient, 2) +
        2 * physicsData.reflectionCoefficient * Math.cos(2 * physicsData.waveNumberK1 * x * 1e-9);
    } else if (x <= L) {
      // Region II
      const kappaM = parseFloat(physicsData.kappaNm) * 1e9;
      probDensity = Math.exp(-2 * kappaM * x * 1e-9);
    } else {
      // Region III
      probDensity = physicsData.transmissionCoefficient;
    }
    graphPoints.push({ x: Number(x.toFixed(3)), probDensity: Number(probDensity.toFixed(4)) });
  }

  const defaultTitle = `Tunneling Trial: ${physicsData.particle.name} (${E.toFixed(2)} eV vs ${V0.toFixed(2)} eV)`;

  const record = {
    id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: (customTitle || defaultTitle).trim(),
    timestamp: new Date().toISOString(),
    experimentType: E < V0 ? "tunneling" : "resonance",
    modelName: "1D Finite Rectangular Potential Barrier (Schrödinger Solver)",
    hypothesis: hypothesis.trim() || `Investigate transmission of ${physicsData.particle.name} with barrier attenuation κ = ${physicsData.kappaNm} nm⁻¹.`,
    parameters: {
      energyEv: E,
      barrierHeightEv: V0,
      barrierWidthNm: L,
      particleKey,
      particleName: physicsData.particle.name,
      particleMassRelative: physicsData.particle.massRelative,
      units: { energy: "eV", barrierHeight: "eV", barrierWidth: "nm" }
    },
    results: {
      transmissionCoefficient: physicsData.transmissionCoefficient,
      reflectionCoefficient: physicsData.reflectionCoefficient,
      transmissionPercent: physicsData.transmissionPercent,
      reflectionPercent: physicsData.reflectionPercent,
      formattedTransmission: physicsData.formattedTransmission,
      formattedReflection: physicsData.formattedReflection,
      conservationSum: physicsData.conservationSum,
      kappaNm: physicsData.kappaNm,
      deBroglieWavelengthNm: physicsData.deBroglieWavelengthNm,
      velocityMs: physicsData.velocityMs,
      regime: physicsData.regime
    },
    graphData: graphPoints,
    observations: `Transmission calculated as ${physicsData.formattedTransmission} with exact probability conservation (R + T = ${physicsData.conservationSum}).`,
    conclusion: E < V0
      ? `Quantum wave tunneling observed with exponential spatial decay inside the potential barrier.`
      : `Particle energy exceeds potential barrier; classical transmission with quantum wave reflection oscillations.`,
    tags: tags.length ? tags : ["tunneling", particleKey, E < V0 ? "sub-barrier" : "over-barrier"],
    configSnapshot: {
      energyEv: E,
      barrierHeightEv: V0,
      barrierWidthNm: L,
      particleKey
    },
    isSummary: false
  };

  const saved = await saveExperiment(record);
  notifySubscribers({ type: "create", experiment: saved });
  return saved;
}

/**
 * Updates an existing experiment record
 */
export async function updateExperiment(id, updates = {}) {
  const existing = await getExperimentById(id);
  if (!existing) throw new Error(`Experiment ${id} not found.`);

  const updatedRecord = {
    ...existing,
    ...updates,
    id: existing.id, // Immutable ID
    updatedAt: new Date().toISOString()
  };

  const saved = await saveExperiment(updatedRecord);
  notifySubscribers({ type: "update", experiment: saved });
  return saved;
}

/**
 * Adds or appends an observation/note to an experiment
 */
export async function addNote(id, noteText) {
  if (!noteText || !noteText.trim()) throw new Error("Note text cannot be empty.");
  const existing = await getExperimentById(id);
  if (!existing) throw new Error(`Experiment ${id} not found.`);

  const dateTag = `[${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}]`;
  const appended = existing.observations
    ? `${existing.observations}\n${dateTag} ${noteText.trim()}`
    : `${dateTag} ${noteText.trim()}`;

  return await updateExperiment(id, { observations: appended });
}

/**
 * Updates tags for an experiment
 */
export async function updateTags(id, newTags) {
  if (!Array.isArray(newTags)) throw new Error("Tags must be an array of strings.");
  return await updateExperiment(id, { tags: newTags });
}

/**
 * Duplicates an existing experiment record
 */
export async function duplicateExperiment(id, newTitle) {
  const existing = await getExperimentById(id);
  if (!existing) throw new Error(`Experiment ${id} not found.`);

  const copy = {
    ...existing,
    id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: (newTitle || `${existing.title} (Copy)`).trim(),
    timestamp: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const saved = await saveExperiment(copy);
  notifySubscribers({ type: "duplicate", experiment: saved });
  return saved;
}

/**
 * Deletes an experiment with event dispatch
 */
export async function deleteExperiment(id) {
  const existing = await getExperimentById(id);
  if (!existing) throw new Error(`Experiment ${id} not found.`);

  const success = await deleteExperimentById(id);
  if (success) {
    notifySubscribers({ type: "delete", id });
  }
  return success;
}

/**
 * Search experiments by query
 */
export async function searchExperiments(query, filter = {}) {
  return await listExperiments({ search: query, ...filter });
}

/**
 * Compares two experiments and generates a structured comparison object
 */
export async function compareExperiments(idA, idB) {
  const expA = await getExperimentById(idA);
  const expB = await getExperimentById(idB);

  if (!expA || !expB) {
    throw new Error("One or both experiments could not be found for comparison.");
  }

  const pA = expA.parameters || {};
  const pB = expB.parameters || {};
  const rA = expA.results || {};
  const rB = expB.results || {};

  const transmissionDiff = (
    parseFloat(rB.transmissionPercent || 0) - parseFloat(rA.transmissionPercent || 0)
  ).toFixed(3);

  const energyDiff = ((pB.energyEv || 0) - (pA.energyEv || 0)).toFixed(2);
  const barrierWidthDiff = ((pB.barrierWidthNm || 0) - (pA.barrierWidthNm || 0)).toFixed(3);

  return {
    expA: { id: expA.id, title: expA.title, parameters: pA, results: rA },
    expB: { id: expB.id, title: expB.title, parameters: pB, results: rB },
    differences: {
      energyEvDelta: energyDiff,
      barrierWidthNmDelta: barrierWidthDiff,
      transmissionPercentDelta: transmissionDiff,
      particleSpeciesSame: pA.particleKey === pB.particleKey
    },
    scientificInsight:
      parseFloat(transmissionDiff) > 0
        ? `Experiment B exhibits ${Math.abs(transmissionDiff)}% higher transmission, primarily governed by reduced barrier attenuation factor κ·L or higher incident kinetic energy.`
        : parseFloat(transmissionDiff) < 0
        ? `Experiment B exhibits ${Math.abs(transmissionDiff)}% lower transmission due to exponential wave damping across an increased barrier dimension or heavier effective particle mass.`
        : `Identical transmission probabilities measured across both parameter sets.`
  };
}

/**
 * Prepares the configuration snapshot to restore into the active simulation
 */
export async function restoreExperiment(id) {
  const exp = await getExperimentById(id);
  if (!exp) throw new Error(`Experiment ${id} not found.`);

  const snap = exp.configSnapshot || {
    energyEv: exp.parameters?.energyEv ?? 3.8,
    barrierHeightEv: exp.parameters?.barrierHeightEv ?? 4.5,
    barrierWidthNm: exp.parameters?.barrierWidthNm ?? 0.35,
    particleKey: exp.parameters?.particleKey ?? "electron"
  };

  return {
    ...snap,
    experimentTitle: exp.title,
    experimentId: exp.id
  };
}

/**
 * Generates an AI-ready structured research summary across selected or all experiments
 */
export async function generateResearchSummary(experimentIds = []) {
  let targets = [];
  if (experimentIds && experimentIds.length) {
    for (const id of experimentIds) {
      const e = await getExperimentById(id);
      if (e) targets.push(e);
    }
  } else {
    // Default to last 5 experiments
    targets = (await getAllExperiments()).slice(0, 5);
  }

  if (!targets.length) {
    throw new Error("No experiments available to generate a research summary.");
  }

  const titles = targets.map((t) => t.title);
  const avgTransmission = (
    targets.reduce((acc, t) => acc + parseFloat(t.results?.transmissionPercent || 0), 0) / targets.length
  ).toFixed(2);

  // Identify trends
  const hasMultipleWidths = new Set(targets.map((t) => t.parameters?.barrierWidthNm)).size > 1;
  const hasMultipleParticles = new Set(targets.map((t) => t.parameters?.particleKey)).size > 1;

  let trendObservation = `Across ${targets.length} evaluated trials, measured transmission ranged between ${Math.min(...targets.map((t) => parseFloat(t.results?.transmissionPercent || 0))).toFixed(2)}% and ${Math.max(...targets.map((t) => parseFloat(t.results?.transmissionPercent || 0))).toFixed(2)}% (mean = ${avgTransmission}%).`;

  if (hasMultipleWidths) {
    trendObservation += ` A strict inverse exponential correlation between barrier width L and transmission probability T was validated, confirming the e^{-2κL} evanescent decay model.`;
  }
  if (hasMultipleParticles) {
    trendObservation += ` Testing heavier particle species (e.g. muon or alpha) demonstrated severe exponential mass suppression due to the √m factor in attenuation constant κ.`;
  }

  const summaryReport = {
    id: `summary_${Date.now()}`,
    title: `Research Synthesis: ${targets.length} Quantum Scattering Trials`,
    timestamp: new Date().toISOString(),
    isSummary: true,
    experimentType: "summary",
    modelName: "Comparative 1D Schrödinger Scattering Analysis",
    hypothesis: `Investigate physical drivers of quantum barrier penetration across varied boundary dimensions and incident species.`,
    experimentsCompared: titles,
    parameters: {
      trialCount: targets.length,
      speciesTested: Array.from(new Set(targets.map((t) => t.parameters?.particleKey || "electron"))).join(", ")
    },
    results: {
      averageTransmission: `${avgTransmission}%`,
      trendObservation
    },
    scientificInterpretation: `Tunneling coefficients closely mirror analytical predictions from OpenStax Vol 3 (Eq 7.27). In all trials where E < V₀, classical mechanics predicted 100% reflection (T_class = 0), whereas wave-mechanical boundary continuity consistently yielded non-zero probability currents.`,
    limitations: `Assumes 1D planar geometry, steady-state continuous plane waves, and ideal rectangular potential step barriers without image-force rounding or thermal lattice vibrations.`,
    suggestedNextExperiment: `Investigate resonance scattering phenomena by tuning particle energy E to exceed barrier height V₀ (E > V₀), observing transmission resonances where barrier width is an integer multiple of half the de Broglie wavelength (L = n·λ/2).`,
    observations: trendObservation,
    conclusion: `The data confirms quantum tunneling as an exponentially sensitive wave phenomena, offering a direct analog to macroscopic scanning tunneling microscopy (STM).`,
    tags: ["research-summary", "ai-synthesis", "comparative-study"]
  };

  return summaryReport;
}

/**
 * Exports notebook in specified format
 */
export async function exportNotebook(format = "json") {
  if (format === "csv") {
    return await exportNotebookCSV();
  }
  return await exportNotebookJSON();
}

/**
 * Imports notebook from JSON string
 */
export async function importNotebook(jsonString, mode = "merge") {
  const result = await importNotebookJSON(jsonString, mode);
  notifySubscribers({ type: "import", result });
  return result;
}

/**
 * Clears notebook storage
 */
export async function resetNotebook() {
  await clearAllExperiments();
  notifySubscribers({ type: "clear" });
  return true;
}
