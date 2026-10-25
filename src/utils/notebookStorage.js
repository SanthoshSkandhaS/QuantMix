/**
 * QuantMix Persistent Experiment Notebook Storage Abstraction
 *
 * Privacy-First, Local-Only Architecture:
 * - Backed by browser IndexedDB (quantmix_notebook_db, v1)
 * - Automatic, robust LocalStorage fallback (for incognito or blocked IndexedDB)
 * - No user accounts, passwords, or cloud uploads
 * - Schema validation, stable unique IDs, and timestamps
 * - JSON and CSV export/import with validation
 */

const DB_NAME = "quantmix_notebook_db";
const DB_VERSION = 1;
const STORE_NAME = "experiments";
const LOCAL_STORAGE_KEY = "quantmix_notebook_experiments_v1";

export const NOTEBOOK_SCHEMA_VERSION = 1;

/**
 * Checks if IndexedDB is available and functional
 */
function isIndexedDBAvailable() {
  try {
    return typeof window !== "undefined" && "indexedDB" in window && window.indexedDB !== null;
  } catch {
    return false;
  }
}

/**
 * Opens or upgrades the IndexedDB database
 */
function openDB() {
  return new Promise((resolve, reject) => {
    if (!isIndexedDBAvailable()) {
      return reject(new Error("IndexedDB is not supported or accessible in this environment."));
    }

    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("timestamp", "timestamp", { unique: false });
          store.createIndex("experimentType", "experimentType", { unique: false });
          store.createIndex("title", "title", { unique: false });
        }
      };

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject(event.target.error || new Error("Failed to open IndexedDB"));
      };

      request.onblocked = () => {
        console.warn("IndexedDB open request blocked by another tab.");
      };
    } catch (err) {
      reject(err);
    }
  });
}

// ---------------------------------------------------------------------------
// LocalStorage Fallback Methods
// ---------------------------------------------------------------------------
function getFromLocalStorage() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to read from localStorage fallback:", err);
    return [];
  }
}

function saveToLocalStorage(experiments) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(experiments));
    return true;
  } catch (err) {
    console.error("Failed to write to localStorage fallback:", err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Core Notebook Storage API
// ---------------------------------------------------------------------------

/**
 * Retrieves all stored experiments, sorted by timestamp descending
 */
export async function getAllExperiments() {
  if (isIndexedDBAvailable()) {
    try {
      const db = await openDB();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();

        req.onsuccess = () => {
          const results = req.result || [];
          results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          resolve(results);
        };
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn("IndexedDB getAll failed; falling back to localStorage:", err);
    }
  }

  // Fallback
  const list = getFromLocalStorage();
  list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return list;
}

/**
 * Retrieves a single experiment by unique ID
 */
export async function getExperimentById(id) {
  if (!id) return null;

  if (isIndexedDBAvailable()) {
    try {
      const db = await openDB();
      return await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);

        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn("IndexedDB get failed; falling back to localStorage:", err);
    }
  }

  const list = getFromLocalStorage();
  return list.find((item) => item.id === id) || null;
}

/**
 * Saves or updates an experiment record
 */
export async function saveExperiment(experiment) {
  if (!experiment || typeof experiment !== "object") {
    throw new Error("Invalid experiment payload");
  }

  // Ensure mandatory fields
  const record = {
    ...experiment,
    id: experiment.id || `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title: (experiment.title || "Untitled Experiment").trim(),
    timestamp: experiment.timestamp || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    schemaVersion: NOTEBOOK_SCHEMA_VERSION,
    tags: Array.isArray(experiment.tags) ? experiment.tags : []
  };

  if (isIndexedDBAvailable()) {
    try {
      const db = await openDB();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(record);

        req.onsuccess = () => resolve(record);
        req.onerror = () => reject(req.error);
      });

      // Keep localStorage in sync as backup
      try {
        const localList = getFromLocalStorage();
        const idx = localList.findIndex((item) => item.id === record.id);
        if (idx >= 0) {
          localList[idx] = record;
        } else {
          localList.unshift(record);
        }
        saveToLocalStorage(localList);
      } catch {
        // Non-fatal
      }

      return record;
    } catch (err) {
      console.warn("IndexedDB put failed; falling back to localStorage:", err);
    }
  }

  // Fallback to LocalStorage
  const list = getFromLocalStorage();
  const idx = list.findIndex((item) => item.id === record.id);
  if (idx >= 0) {
    list[idx] = record;
  } else {
    list.unshift(record);
  }
  const ok = saveToLocalStorage(list);
  if (!ok) {
    throw new Error("Storage quota exceeded or storage unavailable.");
  }
  return record;
}

/**
 * Deletes an experiment by ID
 */
export async function deleteExperimentById(id) {
  if (!id) return false;

  let success = false;

  if (isIndexedDBAvailable()) {
    try {
      const db = await openDB();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);

        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
      success = true;
    } catch (err) {
      console.warn("IndexedDB delete failed; falling back to localStorage:", err);
    }
  }

  // Also remove from localStorage backup
  const list = getFromLocalStorage();
  const filtered = list.filter((item) => item.id !== id);
  if (filtered.length !== list.length) {
    saveToLocalStorage(filtered);
    success = true;
  }

  return success;
}

/**
 * Clears all experiments in the notebook
 */
export async function clearAllExperiments() {
  if (isIndexedDBAvailable()) {
    try {
      const db = await openDB();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const req = store.clear();

        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn("IndexedDB clear failed:", err);
    }
  }

  saveToLocalStorage([]);
  return true;
}

/**
 * Exports entire notebook as a formatted JSON backup string
 */
export async function exportNotebookJSON() {
  const experiments = await getAllExperiments();
  const exportPayload = {
    app: "QuantMix",
    formatVersion: NOTEBOOK_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    totalExperiments: experiments.length,
    experiments
  };
  return JSON.stringify(exportPayload, null, 2);
}

/**
 * Exports experiment summary table as a CSV string
 */
export async function exportNotebookCSV() {
  const experiments = await getAllExperiments();
  const headers = [
    "ID",
    "Title",
    "Timestamp",
    "Experiment Type",
    "Model",
    "Particle",
    "Energy (eV)",
    "Barrier Height V0 (eV)",
    "Barrier Width L (nm)",
    "Transmission (%)",
    "Reflection (%)",
    "Decay Kappa (nm^-1)",
    "Tags",
    "Hypothesis",
    "Observations"
  ];

  const rows = experiments.map((exp) => {
    const params = exp.parameters || {};
    const results = exp.results || {};
    return [
      `"${exp.id || ""}"`,
      `"${(exp.title || "").replace(/"/g, '""')}"`,
      `"${exp.timestamp || ""}"`,
      `"${exp.experimentType || ""}"`,
      `"${(exp.modelName || "").replace(/"/g, '""')}"`,
      `"${params.particleKey || "electron"}"`,
      params.energyEv ?? "",
      params.barrierHeightEv ?? "",
      params.barrierWidthNm ?? "",
      `"${results.formattedTransmission || ""}"`,
      `"${results.formattedReflection || ""}"`,
      `"${results.kappaNm || ""}"`,
      `"${(exp.tags || []).join("; ").replace(/"/g, '""')}"`,
      `"${(exp.hypothesis || "").replace(/"/g, '""')}"`,
      `"${(exp.observations || "").replace(/"/g, '""')}"`
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

/**
 * Validates and imports a JSON backup string into notebook storage
 * @param {string} jsonString
 * @param {"merge" | "replace"} mode
 * @returns {Promise<{ importedCount: number, errorCount: number }>}
 */
export async function importNotebookJSON(jsonString, mode = "merge") {
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    throw new Error("Invalid JSON format. Please upload a valid QuantMix backup file.");
  }

  let incomingList = [];
  if (Array.isArray(parsed)) {
    incomingList = parsed;
  } else if (parsed && Array.isArray(parsed.experiments)) {
    incomingList = parsed.experiments;
  } else {
    throw new Error("Unrecognized notebook structure: missing 'experiments' array.");
  }

  if (mode === "replace") {
    await clearAllExperiments();
  }

  let importedCount = 0;
  let errorCount = 0;

  for (const item of incomingList) {
    if (!item || typeof item !== "object") {
      errorCount++;
      continue;
    }

    try {
      // Validate or generate ID
      const validRecord = {
        id: item.id || `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: item.title || "Imported Experiment",
        timestamp: item.timestamp || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
        experimentType: item.experimentType || "tunneling",
        modelName: item.modelName || "1D Finite Rectangular Potential Barrier",
        hypothesis: item.hypothesis || "",
        parameters: item.parameters || {},
        results: item.results || {},
        graphData: Array.isArray(item.graphData) ? item.graphData : [],
        observations: item.observations || "",
        conclusion: item.conclusion || "",
        tags: Array.isArray(item.tags) ? item.tags : [],
        configSnapshot: item.configSnapshot || null,
        isSummary: Boolean(item.isSummary),
        schemaVersion: NOTEBOOK_SCHEMA_VERSION
      };

      await saveExperiment(validRecord);
      importedCount++;
    } catch {
      errorCount++;
    }
  }

  return { importedCount, errorCount };
}
