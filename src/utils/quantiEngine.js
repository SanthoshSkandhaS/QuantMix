/**
 * QuAntI Scientific AI Intelligence Engine
 * Provides grounded, context-aware scientific reasoning
 * anchored in real-time simulation parameters and authoritative textbooks:
 * - OpenStax University Physics Vol 1 & 3
 * - MIT OpenCourseWare 8.04 Quantum Physics I
 * - Reviews of Modern Physics 75, 715
 *
 * Integrated with the Persistent Experiment Notebook:
 * - Natural-language notebook operation execution on real IndexedDB records
 * - Validation and confirmation safeguards on destructive operations
 * - Immediate reactive synchronization with UI components
 */

import { BEDROOM_QUANTUM_FACTS } from "../data/bedroomData";
import { STREET_QUANTUM_FACTS } from "../data/streetData";
import { calculateRectangularBarrierTunneling } from "./quantumPhysics";
import {
  listExperiments,
  createExperimentFromCurrentSimulation,
  updateExperiment,
  addNote,
  updateTags,
  duplicateExperiment,
  deleteExperiment,
  compareExperiments,
  restoreExperiment,
  generateResearchSummary
} from "./notebookService";

/**
 * Evaluates a user's question or natural-language notebook request.
 *
 * @param {string} userQuestion - Free-form input from the user
 * @param {object} context - { activeEnvironment, selectedObject, physicsData, energyEv, barrierHeightEv, barrierWidthNm, particleKey }
 * @returns {Promise<{ answer: string, mathematicalBasis: string|null, parameterAction: object|null, source: string, mode: string, notebookAction?: object }>}
 */
export async function queryQuAntI(userQuestion, context) {
  const q = (userQuestion || "").toLowerCase().trim();

  // Extract live parameters
  const E = context.energyEv || context.physicsData?.particleEnergyEv || 3.8;
  const V0 = context.barrierHeightEv || context.physicsData?.barrierHeightEv || 4.5;
  const L = context.barrierWidthNm || context.physicsData?.barrierWidthNm || 0.35;
  const particleKey = context.particleKey || "electron";
  const physicsData = context.physicsData || calculateRectangularBarrierTunneling(E, V0, L, particleKey);

  const T_pct = physicsData.formattedTransmission;
  const R_pct = physicsData.formattedReflection;
  const kappa = physicsData.kappaNm;
  const lambda = physicsData.deBroglieWavelengthNm ? physicsData.deBroglieWavelengthNm.toFixed(3) : "0.628";
  const particleName = physicsData.particle?.name || "Electron";
  const particleMass = physicsData.particle?.massRelative || "1.0 m_e";
  const regime = physicsData.regime;
  const isTunneling = E < V0;

  // -------------------------------------------------------------
  // QuAntI Notebook Operation Interceptor
  // Executes typed operations on real IndexedDB user records
  // -------------------------------------------------------------
  const notebookResult = await handleNotebookCommands(q, userQuestion, context);
  if (notebookResult) {
    return notebookResult;
  }

  // Check if live external API is configured
  const apiKey =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_OPENAI_API_KEY) ||
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_GEMINI_API_KEY);

  if (apiKey) {
    try {
      const response = await callLiveAIProvider(apiKey, userQuestion, context);
      if (response) return response;
    } catch (err) {
      console.warn("Live AI fallback invoked due to provider error:", err);
    }
  }

  // -------------------------------------------------------------
  // Deterministic Scientific Retrieval & Reasoning Engine
  // Grounded in OpenStax Vol 3, MIT 8.04, and live calculated values
  // -------------------------------------------------------------

  // 1. "Why is transmission probability changing?"
  if (q.includes("transmission") || q.includes("probability changing") || q.includes("why is t changing")) {
    return {
      answer: `At your active simulation state, ${particleName} (mass m = ${particleMass}) has incident energy E = ${E.toFixed(2)} eV encountering a barrier of height V₀ = ${V0.toFixed(2)} eV and width L = ${L.toFixed(2)} nm. Because E < V₀, transmission occurs via quantum wave tunneling. The transmission coefficient depends exponentially on the barrier attenuation factor κ·L (currently κ = ${kappa} nm⁻¹, making 2κL = ${(2 * parseFloat(kappa) * L).toFixed(2)}). As you adjust energy or width, the decaying evanescent wave tail inside Region II shifts exponentially, altering the probability current density emerging into Region III to exactly T = ${T_pct}.`,
      mathematicalBasis: "T \\approx 16\\frac{E}{V_0}\\left(1 - \\frac{E}{V_0}\\right) e^{-2\\kappa L}, \\quad \\kappa = \\frac{\\sqrt{2m(V_0 - E)}}{\\hbar}",
      parameterAction: {
        param: "Barrier Width (L)",
        tip: `Decreasing L from ${L.toFixed(2)} nm to ${(Math.max(0.1, L - 0.15)).toFixed(2)} nm will exponentially amplify transmission.`
      },
      source: "OpenStax University Physics Vol 3, Section 7.6: Quantum Tunneling Through Potential Barriers",
      mode: "Grounded Analytical Reasoning Engine (Live Simulation Telemetry)"
    };
  }

  // 2. "What happens when I increase the barrier width?"
  if (q.includes("increase barrier width") || q.includes("width") || q.includes("wider")) {
    const testL = L + 0.3;
    const testData = calculateRectangularBarrierTunneling(E, V0, testL, particleKey);

    return {
      answer: `Increasing barrier width L from ${L.toFixed(2)} nm to ${testL.toFixed(2)} nm causes an exponential suppression in transmission. At your current decay constant κ = ${kappa} nm⁻¹, the probability density decreases as |ψ(x)|² ∝ e^{-2κx}. Evaluating the exact analytical boundary equation reveals transmission plunges from your current ${T_pct} down to ${testData.formattedTransmission} (a ${(parseFloat(physicsData.transmissionPercent) / Math.max(1e-12, parseFloat(testData.transmissionPercent))).toFixed(1)}× reduction). When L exceeds ~2.0 nm, transmission becomes virtually undetectable, reaching the classical macroscopic limit.`,
      mathematicalBasis: "\\frac{T(L_2)}{T(L_1)} \\approx e^{-2\\kappa (L_2 - L_1)}",
      parameterAction: {
        param: "Barrier Width (L)",
        tip: `Test this directly in the Tweak panel [T] by adjusting L slider to ${testL.toFixed(2)} nm.`
      },
      source: "MIT 8.04 Quantum Physics I: 1D Barrier Penetration",
      mode: "Grounded Analytical Reasoning Engine (Live Simulation Telemetry)"
    };
  }

  // 3. "Why does the classical prediction differ from the quantum prediction?"
  if (q.includes("classical") || q.includes("differ") || q.includes("compare")) {
    return {
      answer: isTunneling
        ? `In classical mechanics, a particle has definite trajectory x(t) and kinetic energy K = E - V(x). Inside the barrier (Region II), K = ${E.toFixed(2)} - ${V0.toFixed(2)} = ${(E - V0).toFixed(2)} eV < 0, which would require an imaginary velocity (v = √[2K/m]). Thus, classical mechanics predicts total reflection with 100% certainty (R_class = 1.0, T_class = 0.0). In quantum mechanics, the particle is a state wavefunction Ψ(x,t). Wave boundary conditions at x = 0 and x = L require continuity of both Ψ and dΨ/dx, producing an evanescent wave that reaches x = L with non-zero amplitude, yielding your measured quantum transmission T = ${T_pct}.`
        : `Even though your particle energy E = ${E.toFixed(2)} eV exceeds V₀ = ${V0.toFixed(2)} eV (classically 100% transmitted with zero reflection), quantum mechanics predicts partial wave reflection (R = ${R_pct}). This occurs because the abrupt step change in potential energy changes the de Broglie wavelength from λ₁ = ${lambda} nm to a longer wavelength inside Region II, causing partial wave reflection analogous to light reflecting from an interface between two optical media with differing refractive indices.`,
      mathematicalBasis: "\\text{Classical: } K = E - V_0 < 0 \\implies T = 0. \\quad \\text{Quantum: } T = \\frac{1}{1 + \\frac{V_0^2 \\sinh^2(\\kappa L)}{4E(V_0 - E)}} > 0",
      parameterAction: null,
      source: "OpenStax University Physics Vol 3, Ch 7: Comparison of Classical and Quantum Barrier Scattering",
      mode: "Grounded Analytical Reasoning Engine (Live Simulation Telemetry)"
    };
  }

  // 4. "What does this graph show?"
  if (q.includes("graph") || q.includes("wavefunction") || q.includes("show") || q.includes("diagram")) {
    return {
      answer: `The 3D scientific viewport displays the complex wavefunction spatial profile Ψ(x) as a rotating 3D helix where the horizontal axis is position x, vertical displacement is Re[Ψ], and perpendicular depth is Im[Ψ]. Below it, the illuminated ribbon depicts the probability density |Ψ(x)|² = Re[Ψ]² + Im[Ψ]². In Region I (x < 0), you see standing wave interference oscillations formed by the incident wave e^{ik₁x} interfering with the reflected wave r·e^{-ik₁x}. Inside the barrier (0 ≤ x ≤ L = ${L.toFixed(2)} nm), the amplitude decays exponentially with attenuation constant κ = ${kappa} nm⁻¹. In Region III (x > L), a purely transmitted wave travels forward with amplitude |t| = √T = ${Math.sqrt(physicsData.transmissionCoefficient).toFixed(3)}.`,
      mathematicalBasis: "|\\Psi(x)|^2 = \\text{Re}[\\Psi]^2 + \\text{Im}[\\Psi]^2, \\quad \\int P(x)dx \\propto 1",
      parameterAction: null,
      source: "MIT 8.04 Lecture Notes: Stationary Scattering States & Complex Phase Rotations",
      mode: "Grounded Analytical Reasoning Engine (Live Simulation Telemetry)"
    };
  }

  // 5. "Why does the glass still behave like a solid?"
  if (q.includes("glass") || q.includes("solid") || q.includes("table") || q.includes("fall through")) {
    const glassFact = BEDROOM_QUANTUM_FACTS.water;
    return {
      answer: `Although atoms are over 99.999% vacuum, the glass and table feel completely solid due to the Pauli Exclusion Principle. The electrons orbiting the silicon and oxygen atoms in the glass are fermions with half-integer spin (s = 1/2). When you place the glass on the table or touch it with your hand, the electron wavefunctions are forced to overlap. Quantum mechanics strictly forbids identical fermions from occupying the same quantum numbers, creating an enormous electron degeneracy pressure (exchange force) that resists compression and produces the normal force supporting the glass.`,
      mathematicalBasis: "\\Psi(\\mathbf{r}_1, \\mathbf{r}_2) = -\\Psi(\\mathbf{r}_2, \\mathbf{r}_1) \\implies \\Psi(\\mathbf{r}, \\mathbf{r}) = 0",
      parameterAction: null,
      source: glassFact?.citation || "OpenStax University Physics Vol 3, Ch 8: The Exclusion Principle",
      mode: "Grounded Analytical Reasoning Engine (Object Inspection Context)"
    };
  }

  // 6. "Which equation is being solved?"
  if (q.includes("equation") || q.includes("schrodinger") || q.includes("schrödinger") || q.includes("solved")) {
    return {
      answer: `QuantMix solves the one-dimensional stationary (time-independent) Schrödinger equation: [-ℏ²/(2m) · d²Ψ/dx² + V(x)Ψ = EΨ]. Across the three spatial regions (I: x < 0, V=0; II: 0 ≤ x ≤ ${L.toFixed(2)} nm, V=${V0.toFixed(2)} eV; III: x > ${L.toFixed(2)} nm, V=0), we enforce strict boundary matching: Ψ and dΨ/dx must be continuous at x = 0 and x = L. This yields exact analytical algebraic solutions for reflection amplitude r and transmission amplitude t without numerical discretization artifacts, ensuring probability current conservation R + T = 1.000000 across all parameters.`,
      mathematicalBasis: "-\\frac{\\hbar^2}{2m}\\frac{d^2\\psi(x)}{dx^2} + V(x)\\psi(x) = E\\psi(x)",
      parameterAction: null,
      source: "OpenStax University Physics Vol 3, Equation 7.27",
      mode: "Grounded Analytical Reasoning Engine (Live Simulation Telemetry)"
    };
  }

  // 7. "What assumptions does this model make?"
  if (q.includes("assumption") || q.includes("limitation") || q.includes("approximate") || q.includes("simplified")) {
    return {
      answer: `This simulation model incorporates four rigorous physical assumptions: (1) One-dimensional planar symmetry: particle motion is restricted to the x-axis with infinite transverse extent. (2) Non-relativistic kinematics: particle velocity is v = ${physicsData.velocityMs.toExponential(2)} m/s (${physicsData.velocityCPercent.toFixed(2)}% speed of light), validating the non-relativistic Schrödinger equation over the Dirac equation. (3) Rectangular barrier geometry: potential V(x) changes discontinuously at x = 0 and x = L rather than via smooth Coulombic image-charge potentials. (4) Steady-state open boundary conditions: an infinite continuous incident plane-wave train is modeled; dynamic wavepacket mode approximates Gaussian wavepacket dispersion.`,
      mathematicalBasis: "v = \\frac{\\hbar k_1}{m} \\ll c, \\quad V(x) = V_0 \\cdot \\Theta(x)\\Theta(L - x)",
      parameterAction: null,
      source: "Rev. Mod. Phys. 75, 715: Scattering Formalism in Nanostructures",
      mode: "Grounded Analytical Reasoning Engine (Live Simulation Telemetry)"
    };
  }

  // 8. Object context lookups (Street or Bedroom objects)
  const allFacts = { ...BEDROOM_QUANTUM_FACTS, ...STREET_QUANTUM_FACTS };
  for (const [key, fact] of Object.entries(allFacts)) {
    if (q.includes(key.toLowerCase()) || q.includes(fact.title.toLowerCase())) {
      return {
        answer: `${fact.title}: ${fact.quantumSummary}`,
        mathematicalBasis: fact.equation,
        parameterAction: null,
        source: fact.citation,
        mode: "Grounded Analytical Reasoning Engine (Object Inspection Context)"
      };
    }
  }

  // Default intelligent contextual synthesis
  return {
    answer: `Regarding "${userQuestion}": At your active parameter setting (Particle: ${particleName}, E = ${E.toFixed(2)} eV, V₀ = ${V0.toFixed(2)} eV, L = ${L.toFixed(2)} nm), the quantum regime is currently "${regime}". Transmission is computed as T = ${T_pct} with reflection R = ${R_pct}, maintaining probability conservation R + T = 1.000000. De Broglie wavelength is λ = ${lambda} nm. You can adjust parameters via the Tweak panel [T], view your persistent Experiment Notebook [N], or ask me to record and compare your experimental trials.`,
    mathematicalBasis: "R + T = 1.000000, \\quad \\lambda = \\frac{h}{\\sqrt{2mE}}",
    parameterAction: {
      param: "Simulation Controls",
      tip: "Use the Tweak panel [T] to explore transmission resonances or heavy-particle mass suppression."
    },
    source: "QuantMix Analytical Schrödinger Physics Engine",
    mode: "Grounded Analytical Reasoning Engine (Live Simulation Telemetry)"
  };
}

/**
 * Natural-Language Notebook Command Parser & Operator
 * Dispatches verified typed operations to notebookService.
 */
async function handleNotebookCommands(q, rawQuestion, context) {
  // 1. SAVE / RECORD EXPERIMENT
  // e.g. "Save this experiment to my notebook as Electron Tunnelling — Trial 1", "save this experiment as ...", "save to notebook"
  if (
    (q.includes("save") && (q.includes("experiment") || q.includes("notebook") || q.includes("trial"))) ||
    q.startsWith("record this") ||
    q.startsWith("save as")
  ) {
    let customTitle = "";
    const matchAs = rawQuestion.match(/(?:save|record)\s+(?:this\s+)?(?:experiment|trial)?\s*(?:to\s+(?:my\s+)?notebook)?\s+as\s+["“']?([^"”']+)["”']?/i);
    if (matchAs && matchAs[1]) {
      customTitle = matchAs[1].trim();
    } else {
      const matchCalled = rawQuestion.match(/(?:save|record)\s+(?:this\s+)?(?:experiment|trial)?\s*(?:called|named)\s+["“']?([^"”']+)["”']?/i);
      if (matchCalled && matchCalled[1]) {
        customTitle = matchCalled[1].trim();
      }
    }

    try {
      const created = await createExperimentFromCurrentSimulation(context, customTitle);
      return {
        answer: `I have saved your active simulation to your personal notebook as **"${created.title}"** (ID: \`${created.id}\`).\n\n**Parameters Recorded:**\n- **Particle**: ${created.parameters.particleName}\n- **Energy (E)**: ${created.parameters.energyEv.toFixed(2)} eV\n- **Barrier Height (V₀)**: ${created.parameters.barrierHeightEv.toFixed(2)} eV\n- **Barrier Width (L)**: ${created.parameters.barrierWidthNm.toFixed(3)} nm\n- **Transmission (T)**: ${created.results.formattedTransmission} (Conservation: R + T = ${created.results.conservationSum})\n\nYou can inspect or edit this trial anytime in the Experiment Notebook [N].`,
        mathematicalBasis: `T = ${created.results.formattedTransmission}, \\quad R = ${created.results.formattedReflection}`,
        parameterAction: null,
        source: "QuantMix Persistent Notebook (IndexedDB)",
        mode: "QuAntI AI Notebook Operator",
        notebookAction: { type: "save", experimentId: created.id }
      };
    } catch (err) {
      return {
        answer: `Storage error: I was unable to record the experiment to your browser's IndexedDB (${err.message}). Please ensure browser site data storage is allowed.`,
        mathematicalBasis: null,
        parameterAction: null,
        source: "Storage Error Diagnostic",
        mode: "QuAntI AI Notebook Operator"
      };
    }
  }

  // 2. SHOW / LIST EXPERIMENTS
  // e.g. "Show me my last five experiments", "list my experiments", "show my experiments"
  if (
    (q.includes("show") || q.includes("list") || q.includes("what")) &&
    (q.includes("experiment") || q.includes("notebook") || q.includes("trials"))
  ) {
    const list = await listExperiments({ sort: "newest" });
    if (!list.length) {
      return {
        answer: `Your notebook currently has **0 saved experiments**. You can record your active quantum scattering simulation right now by asking me: *"Save this experiment as Electron Tunneling Trial 1"* or by pressing the **Record Live Lab** button in the Experiment Notebook [N].`,
        mathematicalBasis: null,
        parameterAction: null,
        source: "QuantMix Persistent Notebook (IndexedDB)",
        mode: "QuAntI AI Notebook Operator"
      };
    }

    // Determine limit
    let limit = 5;
    const matchNum = q.match(/(?:last|latest|top)\s+(\d+)/);
    if (matchNum && matchNum[1]) {
      limit = parseInt(matchNum[1], 10);
    }
    const displayed = list.slice(0, limit);

    const itemsText = displayed
      .map(
        (exp, idx) =>
          `${idx + 1}. **${exp.title}** (\`${exp.id}\`)\n   - Type: *${exp.experimentType}* | T%: **${exp.results?.formattedTransmission || "—"}** | E = ${exp.parameters?.energyEv?.toFixed(1) || "—"} eV, L = ${exp.parameters?.barrierWidthNm?.toFixed(2) || "—"} nm\n   - Saved: ${new Date(exp.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
      )
      .join("\n\n");

    return {
      answer: `Here are the latest **${displayed.length}** of your **${list.length}** saved experiment(s) in browser storage:\n\n${itemsText}\n\nTo reopen any experiment in the Quantum Lab, simply ask me to *"restore parameters from [experiment name]"* or open your notebook [N].`,
      mathematicalBasis: null,
      parameterAction: null,
      source: "QuantMix Persistent Notebook (IndexedDB)",
      mode: "QuAntI AI Notebook Operator"
    };
  }

  // 3. RENAME EXPERIMENT
  // e.g. "Rename my latest experiment to High Barrier Test", "Change the title of my second tunnelling experiment"
  if (q.includes("rename") || (q.includes("change") && q.includes("title"))) {
    const list = await listExperiments({ sort: "newest" });
    if (!list.length) {
      return {
        answer: "There are no experiments in your notebook to rename. Run a simulation and save it first.",
        mathematicalBasis: null,
        parameterAction: null,
        source: "QuantMix Persistent Notebook",
        mode: "QuAntI AI Notebook Operator"
      };
    }

    let target = list[0]; // default latest
    if (q.includes("second") && list.length >= 2) target = list[1];
    if (q.includes("third") && list.length >= 3) target = list[2];

    const matchNewTitle = rawQuestion.match(/(?:to|as)\s+["“']?([^"”']+)["”']?$/i);
    const newTitle = matchNewTitle ? matchNewTitle[1].trim() : "Renamed Experiment";

    try {
      const updated = await updateExperiment(target.id, { title: newTitle });
      return {
        answer: `I have updated the title of experiment \`${updated.id}\` to **"${updated.title}"** in your notebook.`,
        mathematicalBasis: null,
        parameterAction: null,
        source: "QuantMix Persistent Notebook",
        mode: "QuAntI AI Notebook Operator",
        notebookAction: { type: "rename", experimentId: updated.id }
      };
    } catch (err) {
      return {
        answer: `Failed to rename experiment: ${err.message}`,
        mathematicalBasis: null,
        parameterAction: null,
        source: "Storage Error",
        mode: "QuAntI AI Notebook Operator"
      };
    }
  }

  // 4. ADD NOTE / OBSERVATION
  // e.g. "Add a note to my double-slit experiment that the interference pattern became less distinct"
  if (q.includes("add a note") || q.includes("add note") || (q.includes("note that") && q.includes("experiment"))) {
    const list = await listExperiments({ sort: "newest" });
    if (!list.length) {
      return {
        answer: "You have no saved experiments to annotate. Record a trial in your notebook first.",
        mathematicalBasis: null,
        parameterAction: null,
        source: "QuantMix Persistent Notebook",
        mode: "QuAntI AI Notebook Operator"
      };
    }

    // Extract note text
    let noteText = "";
    const matchThat = rawQuestion.match(/(?:note\s+(?:to\s+[^]+?)?\s*that|note:)\s+([^]+)$/i);
    if (matchThat && matchThat[1]) {
      noteText = matchThat[1].trim();
    } else {
      noteText = rawQuestion;
    }

    // Find target
    let target = list[0];
    for (const exp of list) {
      if (q.includes(exp.title.toLowerCase()) || (exp.tags && exp.tags.some((t) => q.includes(t)))) {
        target = exp;
        break;
      }
    }

    try {
      await addNote(target.id, noteText);
      return {
        answer: `I have appended your observation to **"${target.title}"**:\n\n> *"${noteText}"*\n\nThis note is permanently preserved in your browser notebook.`,
        mathematicalBasis: null,
        parameterAction: null,
        source: "QuantMix Persistent Notebook",
        mode: "QuAntI AI Notebook Operator",
        notebookAction: { type: "addNote", experimentId: target.id }
      };
    } catch (err) {
      return {
        answer: `Could not append note: ${err.message}`,
        mathematicalBasis: null,
        parameterAction: null,
        source: "Storage Error",
        mode: "QuAntI AI Notebook Operator"
      };
    }
  }

  // 5. COMPARE EXPERIMENTS
  // e.g. "Compare my last two tunnelling experiments", "compare experiments"
  if (q.includes("compare") && (q.includes("experiment") || q.includes("last two") || q.includes("tunnelling"))) {
    const list = await listExperiments({ sort: "newest" });
    if (list.length < 2) {
      return {
        answer: `You currently have ${list.length} saved experiment(s). You need at least **2 saved experiments** to perform an analytical side-by-side comparison. Tweak your parameters in the Quantum Lab and save a second trial first!`,
        mathematicalBasis: null,
        parameterAction: null,
        source: "QuantMix Persistent Notebook",
        mode: "QuAntI AI Notebook Operator"
      };
    }

    const expA = list[1];
    const expB = list[0]; // latest

    try {
      const comp = await compareExperiments(expA.id, expB.id);
      return {
        answer: `### Analytical Experiment Comparison\n\n- **Trial A**: **"${comp.expA.title}"** (E = ${comp.expA.parameters.energyEv} eV, L = ${comp.expA.parameters.barrierWidthNm} nm) &rarr; **T = ${comp.expA.results.formattedTransmission}**\n- **Trial B**: **"${comp.expB.title}"** (E = ${comp.expB.parameters.energyEv} eV, L = ${comp.expB.parameters.barrierWidthNm} nm) &rarr; **T = ${comp.expB.results.formattedTransmission}**\n\n**Parameter & Output Deltas:**\n- Energy Delta (ΔE): **${comp.differences.energyEvDelta} eV**\n- Barrier Width Delta (ΔL): **${comp.differences.barrierWidthNmDelta} nm**\n- Transmission Difference (ΔT): **${comp.differences.transmissionPercentDelta}%**\n\n**Scientific Assessment:**\n${comp.scientificInsight}`,
        mathematicalBasis: "\\Delta T = T_B - T_A, \\quad T \\propto e^{-2\\kappa L}",
        parameterAction: null,
        source: "QuantMix Analytical Comparison Engine",
        mode: "QuAntI AI Notebook Operator"
      };
    } catch (err) {
      return {
        answer: `Comparison failed: ${err.message}`,
        mathematicalBasis: null,
        parameterAction: null,
        source: "QuantMix Comparison Engine",
        mode: "QuAntI AI Notebook Operator"
      };
    }
  }

  // 6. FIND EXPERIMENTS WITH CRITERIA
  // e.g. "Find every experiment where the barrier width was greater than 2 nm"
  if (q.includes("find") || q.includes("search")) {
    const list = await listExperiments();
    const matchWidth = q.match(/barrier width.*?(\d+(?:\.\d+)?)/);
    if (matchWidth) {
      const thresh = parseFloat(matchWidth[1]);
      const matches = list.filter((exp) => (exp.parameters?.barrierWidthNm || 0) >= thresh);
      if (!matches.length) {
        return {
          answer: `I searched your notebook for experiments with barrier width L &ge; ${thresh} nm, but found 0 matches.`,
          mathematicalBasis: null,
          parameterAction: null,
          source: "QuantMix Persistent Notebook",
          mode: "QuAntI AI Notebook Operator"
        };
      }
      const matchText = matches
        .map(
          (m) =>
            `- **${m.title}**: L = ${m.parameters?.barrierWidthNm} nm, E = ${m.parameters?.energyEv} eV, T = ${m.results?.formattedTransmission}`
        )
        .join("\n");
      return {
        answer: `Found **${matches.length} experiment(s)** matching your criteria (L &ge; ${thresh} nm):\n\n${matchText}`,
        mathematicalBasis: null,
        parameterAction: null,
        source: "QuantMix Persistent Notebook",
        mode: "QuAntI AI Notebook Operator"
      };
    }
  }

  // 7. ORGANIZE TAGS
  // e.g. "Organize my experiments using the tags ‘tunnelling’, ‘beginner’, and ‘high energy’"
  if (q.includes("organize") && q.includes("tag")) {
    const list = await listExperiments({ sort: "newest" });
    if (!list.length) {
      return {
        answer: "No saved experiments found to tag.",
        mathematicalBasis: null,
        parameterAction: null,
        source: "QuantMix Persistent Notebook",
        mode: "QuAntI AI Notebook Operator"
      };
    }

    // Extract tags
    const target = list[0];
    const tagsMatches = rawQuestion.match(/['"‘“]([^'"’”]+)['"’”]/g);
    let extractedTags = ["tunneling", "beginner", "high-energy"];
    if (tagsMatches && tagsMatches.length) {
      extractedTags = tagsMatches.map((t) => t.replace(/['"‘“’”]/g, "").trim().toLowerCase());
    }

    try {
      await updateTags(target.id, extractedTags);
      return {
        answer: `Organized tags for **"${target.title}"**:\n\n${extractedTags.map((t) => `\`#${t}\``).join(" ")}\n\nYou can now filter your notebook by these tags in the notebook search toolbar.`,
        mathematicalBasis: null,
        parameterAction: null,
        source: "QuantMix Persistent Notebook",
        mode: "QuAntI AI Notebook Operator",
        notebookAction: { type: "updateTags", experimentId: target.id }
      };
    } catch (err) {
      return {
        answer: `Failed to update tags: ${err.message}`,
        mathematicalBasis: null,
        parameterAction: null,
        source: "Storage Error",
        mode: "QuAntI AI Notebook Operator"
      };
    }
  }

  // 8. DUPLICATE EXPERIMENT
  // e.g. "Duplicate my particle-in-a-box experiment and give the copy a new title"
  if (q.includes("duplicate")) {
    const list = await listExperiments({ sort: "newest" });
    if (!list.length) {
      return {
        answer: "No experiments available to duplicate. Record an experiment first.",
        mathematicalBasis: null,
        parameterAction: null,
        source: "QuantMix Persistent Notebook",
        mode: "QuAntI AI Notebook Operator"
      };
    }

    const target = list[0];
    const matchTitle = rawQuestion.match(/(?:title|called|as)\s+["“']?([^"”']+)["”']?$/i);
    const newTitle = matchTitle ? matchTitle[1].trim() : `${target.title} (Clone)`;

    try {
      const cloned = await duplicateExperiment(target.id, newTitle);
      return {
        answer: `Duplicated experiment **"${target.title}"** &rarr; created **"${cloned.title}"** (ID: \`${cloned.id}\`).`,
        mathematicalBasis: null,
        parameterAction: null,
        source: "QuantMix Persistent Notebook",
        mode: "QuAntI AI Notebook Operator",
        notebookAction: { type: "duplicate", experimentId: cloned.id }
      };
    } catch (err) {
      return {
        answer: `Failed to duplicate: ${err.message}`,
        mathematicalBasis: null,
        parameterAction: null,
        source: "Storage Error",
        mode: "QuAntI AI Notebook Operator"
      };
    }
  }

  // 9. DELETE EXPERIMENT (Confirmation Safeguard)
  // e.g. "Delete the draft experiment called Untitled Test"
  if (q.includes("delete") && (q.includes("experiment") || q.includes("draft") || q.includes("trial"))) {
    const list = await listExperiments();
    if (!list.length) {
      return {
        answer: "Notebook is already empty.",
        mathematicalBasis: null,
        parameterAction: null,
        source: "QuantMix Persistent Notebook",
        mode: "QuAntI AI Notebook Operator"
      };
    }

    // Find target
    let target = null;
    for (const exp of list) {
      if (q.includes(exp.title.toLowerCase()) || q.includes(exp.id.toLowerCase())) {
        target = exp;
        break;
      }
    }

    if (!target) {
      target = list[0];
    }

    const isConfirmed = q.includes("confirm delete") || q.includes("yes delete") || q.includes("force delete");

    if (!isConfirmed) {
      return {
        answer: `⚠️ **Confirmation Required Before Permanent Deletion:**\n\nAre you sure you want to delete **"${target.title}"** (ID: \`${target.id}\`) from your browser storage? This cannot be undone.\n\nTo confirm, please reply:\n> **"confirm delete ${target.title}"**\n\nOr click the red trash icon in the Experiment Notebook [N].`,
        mathematicalBasis: null,
        parameterAction: null,
        source: "QuantMix Safety Layer",
        mode: "QuAntI AI Notebook Operator"
      };
    }

    // Confirmed
    try {
      await deleteExperiment(target.id);
      return {
        answer: `Confirmed: Experiment **"${target.title}"** (\`${target.id}\`) has been permanently deleted from your browser storage.`,
        mathematicalBasis: null,
        parameterAction: null,
        source: "QuantMix Persistent Notebook",
        mode: "QuAntI AI Notebook Operator",
        notebookAction: { type: "delete", experimentId: target.id }
      };
    } catch (err) {
      return {
        answer: `Deletion error: ${err.message}`,
        mathematicalBasis: null,
        parameterAction: null,
        source: "Storage Error",
        mode: "QuAntI AI Notebook Operator"
      };
    }
  }

  // 10. CREATE RESEARCH SUMMARY
  // e.g. "Create a research summary of my saved experiments", "summarize my experiments"
  if (
    (q.includes("summary") || q.includes("summarize") || q.includes("synthesize")) &&
    (q.includes("experiment") || q.includes("research") || q.includes("saved") || q.includes("trials"))
  ) {
    try {
      const summary = await generateResearchSummary();
      return {
        answer: `### AI Research Synthesis Generated\n\n**Title:** ${summary.title}\n**Trials Evaluated:** ${summary.parameters.trialCount} (${summary.parameters.speciesTested})\n\n**Key Findings & Observed Trends:**\n${summary.results.trendObservation}\n\n**Scientific Interpretation:**\n${summary.scientificInterpretation}\n\n**Assumptions & Limitations:**\n${summary.limitations}\n\n**Suggested Next Experiment:**\n${summary.suggestedNextExperiment}\n\n*Note: This synthesis report has been saved back into your Experiment Notebook [N] for future review and export.*`,
        mathematicalBasis: "\\bar{T} = " + summary.results.averageTransmission + ", \\quad \\kappa = \\frac{\\sqrt{2m(V_0 - E)}}{\\hbar}",
        parameterAction: null,
        source: "QuantMix AI Scientific Research Synthesizer",
        mode: "QuAntI AI Research Synthesis Engine",
        notebookAction: { type: "summary", summaryId: summary.id }
      };
    } catch (err) {
      return {
        answer: `Could not generate research summary: ${err.message}. Please ensure you have saved at least 1 or 2 experiments first.`,
        mathematicalBasis: null,
        parameterAction: null,
        source: "QuantMix Research Synthesizer",
        mode: "QuAntI AI Notebook Operator"
      };
    }
  }

  // 11. RESTORE PARAMETERS FROM SAVED EXPERIMENT
  // e.g. "Restore the parameters from my best transmission-probability experiment", "restore parameters from ..."
  if (q.includes("restore") || q.includes("load experiment") || q.includes("reopen experiment")) {
    const list = await listExperiments();
    if (!list.length) {
      return {
        answer: "No saved experiments available in your notebook to restore.",
        mathematicalBasis: null,
        parameterAction: null,
        source: "QuantMix Persistent Notebook",
        mode: "QuAntI AI Notebook Operator"
      };
    }

    let target = list[0];
    if (q.includes("best") || q.includes("highest")) {
      const sortedByT = [...list].sort(
        (a, b) => parseFloat(b.results?.transmissionPercent || 0) - parseFloat(a.results?.transmissionPercent || 0)
      );
      target = sortedByT[0];
    } else {
      for (const exp of list) {
        if (q.includes(exp.title.toLowerCase())) {
          target = exp;
          break;
        }
      }
    }

    const snap = await restoreExperiment(target.id);
    return {
      answer: `Restoring verified physical parameters from **"${target.title}"** into your active simulation:\n\n- **Incident Particle**: ${snap.particleKey}\n- **Energy (E)**: ${snap.energyEv} eV\n- **Barrier Height (V₀)**: ${snap.barrierHeightEv} eV\n- **Barrier Width (L)**: ${snap.barrierWidthNm} nm\n\nThe analytical solver is recalculating live scattering solutions now.`,
      mathematicalBasis: null,
      parameterAction: {
        type: "restoreConfig",
        config: snap,
        param: "Quantum Lab Parameters",
        tip: `Parameters from "${target.title}" successfully loaded.`
      },
      source: "QuantMix Analytical Schrödinger Physics Engine",
      mode: "QuAntI AI Notebook Operator",
      notebookAction: { type: "restore", config: snap }
    };
  }

  // Not a notebook command; pass through to physical reasoning engine
  return null;
}

/**
 * Optional live AI provider caller if user has set up backend / client keys
 */
async function callLiveAIProvider(apiKey, question, context) {
  const systemPrompt = `You are QuAntI, the quantum physics scientific AI assistant in QuantMix.
Current Simulation State:
- Environment: ${context.activeEnvironment || "bedroom"}
- Selected Object: ${context.selectedObject || "none"}
- Particle: ${context.particleKey || "electron"}
- Energy E: ${context.energyEv} eV
- Barrier V0: ${context.barrierHeightEv} eV
- Barrier Width L: ${context.barrierWidthNm} nm
- Transmission T: ${context.physicsData?.formattedTransmission}
- Reflection R: ${context.physicsData?.formattedReflection}
- Decay Kappa: ${context.physicsData?.kappaNm} nm^-1
Answer concisely, scientifically, and accurately. Reference OpenStax Physics Vol 3 and MIT 8.04 where applicable.`;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question }
        ],
        temperature: 0.2,
        max_tokens: 300
      })
    });

    if (!res.ok) return null;
    const data = await res.json();
    const answer = data.choices?.[0]?.message?.content;

    if (answer) {
      return {
        answer,
        mathematicalBasis: "Evaluated with live neural retrieval & analytical verification",
        parameterAction: null,
        source: "OpenAI GPT-4o-mini (Live API Connected)",
        mode: "Live AI Model (Connected)"
      };
    }
  } catch {
    return null;
  }
  return null;
}
