import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  BookOpen,
  X,
  Search,
  Filter,
  ArrowUpDown,
  Upload,
  Plus,
  Trash2,
  Copy,
  Edit3,
  Check,
  RotateCcw,
  Sparkles,
  Tag,
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
  FileJson,
  Info
} from "lucide-react";
import {
  listExperiments,
  createExperimentFromCurrentSimulation,
  updateExperiment,
  addNote,
  duplicateExperiment,
  deleteExperiment,
  exportNotebook,
  importNotebook,
  generateResearchSummary,
  subscribeToNotebook
} from "../utils/notebookService";

/**
 * ExperimentNotebookModal
 * Polished, personal, login-free scientific research notebook for QuantMix.
 *
 * Supported features:
 * - Browser IndexedDB persistence with LocalStorage fallback
 * - Search, filter, and sort across title, tags, notes, and models
 * - Create, inspect, inline edit, duplicate, and delete with confirmation
 * - Reproduce / "Reopen in Lab" with parameter restoration & recalculation
 * - AI-powered research summary generation
 * - JSON backup export/import (with validation & merge/replace options) and CSV export
 * - Save status indicators ("Saved", "Saving...", "Save failed")
 * - Clear browser-local privacy disclosure
 */
export default function ExperimentNotebookModal({
  isOpen,
  onClose,
  currentSimState,
  onRestoreExperiment
}) {
  const [experiments, setExperiments] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortOption, setSortOption] = useState("newest");
  const [saveStatus, setSaveStatus] = useState("saved"); // "saved" | "saving" | "error"
  const [statusMessage, setStatusMessage] = useState("");

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editHypothesis, setEditHypothesis] = useState("");
  const [editObservations, setEditObservations] = useState("");
  const [editConclusion, setEditConclusion] = useState("");
  const [editTagsString, setEditTagsString] = useState("");

  // Quick Note Input
  const [quickNote, setQuickNote] = useState("");

  // Delete Confirmation Dialog
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  // Import Dialog
  const [showImportModal, setShowImportModal] = useState(false);
  const [importMode, setImportMode] = useState("merge"); // "merge" | "replace"
  const fileInputRef = useRef(null);

  // Load Experiments on open and subscribe to background changes (e.g. from QuAntI)
  const loadList = useCallback(async () => {
    try {
      setSaveStatus("saving");
      const list = await listExperiments({
        search: searchQuery,
        experimentType: typeFilter,
        sort: sortOption
      });
      setExperiments(list);
      setSaveStatus("saved");

      // Auto-select first item if none selected or if selected item was deleted
      if (list.length > 0) {
        if (!selectedId || !list.some((item) => item.id === selectedId)) {
          setSelectedId(list[0].id);
        }
      } else {
        setSelectedId(null);
      }
    } catch (err) {
      console.error("Failed to list experiments:", err);
      setSaveStatus("error");
      setStatusMessage("Failed to load notebook data from local storage.");
    }
  }, [searchQuery, typeFilter, sortOption, selectedId]);

  useEffect(() => {
    if (isOpen) {
      loadList();
    }
  }, [isOpen, loadList]);

  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = subscribeToNotebook(() => {
      loadList();
    });
    return () => unsubscribe();
  }, [isOpen, loadList]);

  // Sync edit fields when selection changes
  const selectedExperiment = useMemo(() => {
    return experiments.find((item) => item.id === selectedId) || null;
  }, [experiments, selectedId]);

  useEffect(() => {
    if (selectedExperiment) {
      setEditTitle(selectedExperiment.title || "");
      setEditHypothesis(selectedExperiment.hypothesis || "");
      setEditObservations(selectedExperiment.observations || "");
      setEditConclusion(selectedExperiment.conclusion || "");
      setEditTagsString((selectedExperiment.tags || []).join(", "));
      setIsEditing(false);
      setQuickNote("");
    }
  }, [selectedExperiment]);

  // Handle Save Edits
  const handleSaveEdits = async () => {
    if (!selectedId) return;
    try {
      setSaveStatus("saving");
      const parsedTags = editTagsString
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      await updateExperiment(selectedId, {
        title: editTitle.trim() || "Untitled Experiment",
        hypothesis: editHypothesis.trim(),
        observations: editObservations.trim(),
        conclusion: editConclusion.trim(),
        tags: parsedTags
      });

      setSaveStatus("saved");
      setIsEditing(false);
      setStatusMessage("Changes saved successfully.");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (err) {
      console.error("Failed to update experiment:", err);
      setSaveStatus("error");
      setStatusMessage(err.message || "Failed to save edits.");
    }
  };

  // Handle Quick Note Submission
  const handleAddQuickNote = async () => {
    if (!selectedId || !quickNote.trim()) return;
    try {
      setSaveStatus("saving");
      await addNote(selectedId, quickNote.trim());
      setQuickNote("");
      setSaveStatus("saved");
      setStatusMessage("Note appended.");
      setTimeout(() => setStatusMessage(""), 2500);
    } catch (err) {
      console.error("Failed to add note:", err);
      setSaveStatus("error");
      setStatusMessage("Failed to append note.");
    }
  };

  // Handle Record from current simulation
  const handleRecordCurrentSimulation = async () => {
    try {
      setSaveStatus("saving");
      const saved = await createExperimentFromCurrentSimulation(currentSimState);
      setSelectedId(saved.id);
      setSaveStatus("saved");
      setStatusMessage("Active simulation recorded to notebook.");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (err) {
      console.error("Failed to record experiment:", err);
      setSaveStatus("error");
      setStatusMessage(err.message || "Failed to save experiment.");
    }
  };

  // Handle Duplicate
  const handleDuplicate = async (id, e) => {
    e?.stopPropagation();
    try {
      setSaveStatus("saving");
      const dup = await duplicateExperiment(id);
      setSelectedId(dup.id);
      setSaveStatus("saved");
      setStatusMessage("Experiment duplicated.");
      setTimeout(() => setStatusMessage(""), 2500);
    } catch (err) {
      console.error("Failed to duplicate:", err);
      setSaveStatus("error");
      setStatusMessage("Failed to duplicate experiment.");
    }
  };

  // Handle Delete Confirmed
  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      setSaveStatus("saving");
      await deleteExperiment(deleteTargetId);
      setDeleteTargetId(null);
      setSaveStatus("saved");
      setStatusMessage("Experiment deleted.");
      setTimeout(() => setStatusMessage(""), 2500);
    } catch (err) {
      console.error("Failed to delete experiment:", err);
      setSaveStatus("error");
      setStatusMessage("Failed to delete experiment.");
    }
  };

  // Handle Reopen in Lab
  const handleReopenInLab = () => {
    if (!selectedExperiment) return;
    const snapshot = selectedExperiment.configSnapshot || {
      energyEv: selectedExperiment.parameters?.energyEv ?? 3.8,
      barrierHeightEv: selectedExperiment.parameters?.barrierHeightEv ?? 4.5,
      barrierWidthNm: selectedExperiment.parameters?.barrierWidthNm ?? 0.35,
      particleKey: selectedExperiment.parameters?.particleKey ?? "electron"
    };

    if (onRestoreExperiment) {
      onRestoreExperiment(snapshot);
    }
    onClose();
  };

  // Handle Generate Research Summary
  const handleGenerateSummary = async () => {
    try {
      setSaveStatus("saving");
      const summary = await generateResearchSummary();
      setSelectedId(summary.id);
      setSaveStatus("saved");
      setStatusMessage("AI Research Summary synthesized and saved.");
      setTimeout(() => setStatusMessage(""), 4000);
    } catch (err) {
      console.error("Failed to generate summary:", err);
      setSaveStatus("error");
      setStatusMessage(err.message || "Failed to generate research summary.");
    }
  };

  // Handle Export (JSON / CSV)
  const handleExportJSON = async () => {
    try {
      const dataStr = await exportNotebook("json");
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `QuantMix_Notebook_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setStatusMessage("Exported JSON backup.");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (err) {
      console.error("JSON export failed:", err);
      setStatusMessage("Export failed.");
    }
  };

  const handleExportCSV = async () => {
    try {
      const csvStr = await exportNotebook("csv");
      const blob = new Blob([csvStr], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `QuantMix_Experiments_${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      setStatusMessage("Exported CSV table.");
      setTimeout(() => setStatusMessage(""), 3000);
    } catch (err) {
      console.error("CSV export failed:", err);
      setStatusMessage("CSV export failed.");
    }
  };

  // Handle File Upload Import
  const handleFileImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setSaveStatus("saving");
        const jsonContent = event.target?.result;
        const result = await importNotebook(jsonContent, importMode);
        setShowImportModal(false);
        setSaveStatus("saved");
        setStatusMessage(`Imported ${result.importedCount} experiment(s) successfully.`);
        setTimeout(() => setStatusMessage(""), 4000);
      } catch (err) {
        console.error("Import failed:", err);
        setSaveStatus("error");
        setStatusMessage(err.message || "Failed to import JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  if (!isOpen) return null;

  return (
    <div className="notebook-modal-backdrop" role="dialog" aria-modal="true" aria-label="Experiment Notebook">
      <div className="notebook-modal-container">
        {/* Top Header Bar */}
        <div className="notebook-modal-header">
          <div className="notebook-header-left">
            <div className="notebook-icon-badge">
              <BookOpen size={20} color="var(--color-copper, #C67248)" />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h2 className="notebook-title font-serif">Experiment Notebook</h2>
                <span className="notebook-count-pill">{experiments.length} entries</span>
              </div>
              <p className="notebook-subtitle">
                Personal Research Journal &middot; Automatic Browser-Local IndexedDB
              </p>
            </div>
          </div>

          <div className="notebook-header-actions">
            {/* Save Status Indicator */}
            <div
              className={`notebook-save-indicator indicator-${saveStatus}`}
              title="Local storage persistence status"
            >
              {saveStatus === "saving" && (
                <>
                  <span className="spinner-dot" />
                  <span>Saving…</span>
                </>
              )}
              {saveStatus === "saved" && (
                <>
                  <Check size={14} color="#20C4B4" />
                  <span>Saved</span>
                </>
              )}
              {saveStatus === "error" && (
                <>
                  <AlertTriangle size={14} color="#EF4444" />
                  <span>Save failed</span>
                </>
              )}
            </div>

            {/* Record Current Simulation Button */}
            <button
              onClick={handleRecordCurrentSimulation}
              className="notebook-btn notebook-btn-primary"
              title="Save the current active Quantum Lab simulation as a new notebook entry"
            >
              <Plus size={15} />
              <span>Record Live Lab</span>
            </button>

            {/* AI Research Synthesis Button */}
            <button
              onClick={handleGenerateSummary}
              className="notebook-btn notebook-btn-ai"
              title="QuAntI AI: Analyze and synthesize saved trials into a structured research report"
            >
              <Sparkles size={14} />
              <span>AI Research Summary</span>
            </button>

            {/* Export Dropdown / Buttons */}
            <button
              onClick={handleExportJSON}
              className="notebook-btn notebook-btn-secondary"
              title="Export complete notebook backup as JSON"
            >
              <FileJson size={14} />
              <span>JSON Backup</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="notebook-btn notebook-btn-secondary"
              title="Export experiment summary table as CSV spreadsheet"
            >
              <FileSpreadsheet size={14} />
              <span>CSV</span>
            </button>

            {/* Import Button */}
            <button
              onClick={() => setShowImportModal(true)}
              className="notebook-btn notebook-btn-secondary"
              title="Import experiments from a QuantMix JSON backup file"
            >
              <Upload size={14} />
              <span>Import</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="notebook-close-btn"
              title="Close Notebook [Esc or N]"
              aria-label="Close Notebook"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Status Toast Banner if set */}
        {statusMessage && (
          <div className="notebook-status-toast">
            <Info size={15} color="var(--color-teal)" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Toolbar: Search, Filter, Sort */}
        <div className="notebook-toolbar">
          <div className="notebook-search-wrapper">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Search experiments by title, tags, notes, or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="notebook-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="search-clear-btn"
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="notebook-filter-group">
            <div className="filter-select-wrapper">
              <Filter size={13} />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="notebook-select"
                aria-label="Filter by experiment type"
              >
                <option value="all">All Types</option>
                <option value="tunneling">Quantum Tunnelling</option>
                <option value="resonance">Resonance / Overbarrier</option>
                <option value="summary">Research Summaries</option>
              </select>
            </div>

            <div className="filter-select-wrapper">
              <ArrowUpDown size={13} />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="notebook-select"
                aria-label="Sort experiments"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title (A-Z)</option>
                <option value="transmission">Highest Transmission (T%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Body: Master-Detail Layout */}
        <div className="notebook-modal-body">
          {/* Left Column: Experiment Card List */}
          <div className="notebook-list-column">
            {experiments.length === 0 ? (
              <div className="notebook-empty-state">
                <div className="empty-icon-circle">
                  <BookOpen size={32} color="var(--color-copper)" />
                </div>
                <h4 className="empty-title font-serif">No experiments saved yet</h4>
                <p className="empty-desc">
                  Your personal research notebook is initialized and ready. Click &ldquo;Record Live Lab&rdquo; above or use QuAntI AI (&ldquo;Save this experiment as...&rdquo;) to record your first quantum scattering trial.
                </p>
                <button
                  onClick={handleRecordCurrentSimulation}
                  className="notebook-btn notebook-btn-primary"
                  style={{ marginTop: "12px" }}
                >
                  <Plus size={15} />
                  <span>Record Active Simulation</span>
                </button>
              </div>
            ) : (
              <div className="notebook-cards-scroll">
                {experiments.map((exp) => {
                  const isSelected = exp.id === selectedId;
                  const isSummary = Boolean(exp.isSummary);
                  const p = exp.parameters || {};
                  const r = exp.results || {};

                  return (
                    <div
                      key={exp.id}
                      onClick={() => setSelectedId(exp.id)}
                      className={`notebook-experiment-card ${isSelected ? "card-selected" : ""} ${
                        isSummary ? "card-summary" : ""
                      }`}
                    >
                      <div className="card-top-row">
                        <span
                          className={`type-tag ${
                            isSummary
                              ? "tag-summary"
                              : exp.experimentType === "tunneling"
                              ? "tag-tunneling"
                              : "tag-resonance"
                          }`}
                        >
                          {isSummary ? "AI Synthesis" : exp.experimentType}
                        </span>
                        <span className="card-date">
                          {new Date(exp.timestamp).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>

                      <h4 className="card-title font-serif">{exp.title}</h4>

                      {!isSummary ? (
                        <div className="card-metrics-grid">
                          <div className="metric-chip">
                            <span className="metric-lbl">T%:</span>
                            <span className="metric-val font-mono">{r.formattedTransmission || "—"}</span>
                          </div>
                          <div className="metric-chip">
                            <span className="metric-lbl">E:</span>
                            <span className="metric-val font-mono">{p.energyEv ? `${p.energyEv.toFixed(1)} eV` : "—"}</span>
                          </div>
                          <div className="metric-chip">
                            <span className="metric-lbl">L:</span>
                            <span className="metric-val font-mono">{p.barrierWidthNm ? `${p.barrierWidthNm.toFixed(2)} nm` : "—"}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="card-summary-snippet">
                          {exp.results?.trendObservation || "Cross-experiment comparative synthesis."}
                        </p>
                      )}

                      {/* Card Tags */}
                      {exp.tags && exp.tags.length > 0 && (
                        <div className="card-tags-row">
                          {exp.tags.slice(0, 3).map((t) => (
                            <span key={t} className="mini-tag">
                              #{t}
                            </span>
                          ))}
                          {exp.tags.length > 3 && (
                            <span className="mini-tag-more">+{exp.tags.length - 3}</span>
                          )}
                        </div>
                      )}

                      {/* Quick Card Action Buttons */}
                      <div className="card-actions-hover">
                        <button
                          onClick={(e) => handleDuplicate(exp.id, e)}
                          className="card-quick-btn"
                          title="Duplicate experiment"
                          aria-label="Duplicate"
                        >
                          <Copy size={13} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTargetId(exp.id);
                          }}
                          className="card-quick-btn btn-danger"
                          title="Delete experiment"
                          aria-label="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Experiment Details Pane */}
          <div className="notebook-detail-column">
            {selectedExperiment ? (
              <div className="detail-pane-content">
                {/* Detail Header & Action Row */}
                <div className="detail-header-row">
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <span className="detail-id-badge">{selectedExperiment.id}</span>
                      <span className="detail-type-badge">{selectedExperiment.modelName}</span>
                      <span className="detail-timestamp">
                        Recorded {new Date(selectedExperiment.timestamp).toLocaleString()}
                      </span>
                    </div>

                    {isEditing ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="detail-title-input font-serif"
                        placeholder="Experiment Title"
                      />
                    ) : (
                      <h3 className="detail-title font-serif">{selectedExperiment.title}</h3>
                    )}
                  </div>

                  <div className="detail-header-actions">
                    {!selectedExperiment.isSummary && (
                      <button
                        onClick={handleReopenInLab}
                        className="notebook-btn notebook-btn-primary"
                        title="Load this experiment's exact parameters into the active Quantum Lab and recalculate"
                      >
                        <RotateCcw size={14} />
                        <span>Reopen in Lab</span>
                      </button>
                    )}

                    {isEditing ? (
                      <button
                        onClick={handleSaveEdits}
                        className="notebook-btn notebook-btn-teal"
                        title="Save edits"
                      >
                        <Check size={14} />
                        <span>Save Edits</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="notebook-btn notebook-btn-secondary"
                        title="Edit title, hypothesis, notes, conclusion, and tags"
                      >
                        <Edit3 size={14} />
                        <span>Edit</span>
                      </button>
                    )}

                    <button
                      onClick={() => setDeleteTargetId(selectedExperiment.id)}
                      className="notebook-btn notebook-btn-danger"
                      title="Permanently delete this record"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Detail Body Content */}
                <div className="detail-sections-scroll">
                  {/* Research Question / Hypothesis */}
                  <div className="detail-section-card">
                    <h5 className="section-card-title">Research Question / Hypothesis</h5>
                    {isEditing ? (
                      <textarea
                        value={editHypothesis}
                        onChange={(e) => setEditHypothesis(e.target.value)}
                        className="detail-textarea"
                        rows={2}
                        placeholder="What physical question or hypothesis was being tested?"
                      />
                    ) : (
                      <p className="section-card-text">
                        {selectedExperiment.hypothesis || "No specific hypothesis noted for this trial."}
                      </p>
                    )}
                  </div>

                  {/* Physical Parameters Table */}
                  {!selectedExperiment.isSummary && (
                    <div className="detail-section-card">
                      <div className="section-card-header">
                        <h5 className="section-card-title">Configuration Parameters</h5>
                        <div className="conservation-pill">
                          <ShieldCheck size={13} color="var(--color-teal)" />
                          <span>R + T = 1.000000</span>
                        </div>
                      </div>

                      <div className="params-table-grid">
                        <div className="param-cell">
                          <span className="param-label">Incident Particle</span>
                          <span className="param-value">
                            {selectedExperiment.parameters?.particleName || selectedExperiment.parameters?.particleKey || "Electron"}
                          </span>
                        </div>
                        <div className="param-cell">
                          <span className="param-label">Particle Energy (E)</span>
                          <span className="param-value font-mono">
                            {selectedExperiment.parameters?.energyEv?.toFixed(2)} eV
                          </span>
                        </div>
                        <div className="param-cell">
                          <span className="param-label">Barrier Height (V₀)</span>
                          <span className="param-value font-mono">
                            {selectedExperiment.parameters?.barrierHeightEv?.toFixed(2)} eV
                          </span>
                        </div>
                        <div className="param-cell">
                          <span className="param-label">Barrier Width (L)</span>
                          <span className="param-value font-mono">
                            {selectedExperiment.parameters?.barrierWidthNm?.toFixed(3)} nm
                          </span>
                        </div>
                        <div className="param-cell">
                          <span className="param-label">Decay Constant (κ)</span>
                          <span className="param-value font-mono">
                            {selectedExperiment.results?.kappaNm ? `${selectedExperiment.results.kappaNm} nm⁻¹` : "—"}
                          </span>
                        </div>
                        <div className="param-cell">
                          <span className="param-label">de Broglie Wavelength (λ)</span>
                          <span className="param-value font-mono">
                            {selectedExperiment.results?.deBroglieWavelengthNm
                              ? `${selectedExperiment.results.deBroglieWavelengthNm.toFixed(3)} nm`
                              : "—"}
                          </span>
                        </div>
                      </div>

                      {/* Calculated Quantities Banner */}
                      <div className="results-summary-row">
                        <div className="result-metric-box">
                          <span className="res-title">Quantum Transmission (T)</span>
                          <span className="res-val-big text-teal font-mono">
                            {selectedExperiment.results?.formattedTransmission || "0.0%"}
                          </span>
                          <span className="res-coeff font-mono">
                            T = {Number(selectedExperiment.results?.transmissionCoefficient || 0).toFixed(6)}
                          </span>
                        </div>
                        <div className="result-metric-box">
                          <span className="res-title">Quantum Reflection (R)</span>
                          <span className="res-val-big text-copper font-mono">
                            {selectedExperiment.results?.formattedReflection || "100.0%"}
                          </span>
                          <span className="res-coeff font-mono">
                            R = {Number(selectedExperiment.results?.reflectionCoefficient || 0).toFixed(6)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* If Summary: Render Synthesis Content */}
                  {selectedExperiment.isSummary && (
                    <div className="detail-section-card summary-report-card">
                      <h5 className="section-card-title text-copper">
                        Comparative Quantum Scattering Synthesis
                      </h5>
                      <div className="summary-field">
                        <strong className="summary-lbl">Observed Trends:</strong>
                        <p className="summary-txt">{selectedExperiment.results?.trendObservation}</p>
                      </div>
                      <div className="summary-field">
                        <strong className="summary-lbl">Scientific Interpretation:</strong>
                        <p className="summary-txt">{selectedExperiment.scientificInterpretation}</p>
                      </div>
                      <div className="summary-field">
                        <strong className="summary-lbl">Model Assumptions & Limitations:</strong>
                        <p className="summary-txt">{selectedExperiment.limitations}</p>
                      </div>
                      <div className="summary-field">
                        <strong className="summary-lbl">Suggested Next Experiment:</strong>
                        <p className="summary-txt">{selectedExperiment.suggestedNextExperiment}</p>
                      </div>
                    </div>
                  )}

                  {/* Observations & Laboratory Notes */}
                  <div className="detail-section-card">
                    <h5 className="section-card-title">Observations & Research Notes</h5>
                    {isEditing ? (
                      <textarea
                        value={editObservations}
                        onChange={(e) => setEditObservations(e.target.value)}
                        className="detail-textarea"
                        rows={4}
                        placeholder="Log observations, anomalies, or parameter trends..."
                      />
                    ) : (
                      <div className="notes-display-box">
                        {selectedExperiment.observations ? (
                          <pre className="notes-pre">{selectedExperiment.observations}</pre>
                        ) : (
                          <p className="empty-subtext">No observations logged yet.</p>
                        )}
                      </div>
                    )}

                    {/* Quick Note Add (if not editing) */}
                    {!isEditing && (
                      <div className="quick-note-row">
                        <input
                          type="text"
                          placeholder="Quick note: e.g. 'Transmission dropped 10x when width increased to 0.5 nm'"
                          value={quickNote}
                          onChange={(e) => setQuickNote(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddQuickNote()}
                          className="quick-note-input"
                        />
                        <button
                          onClick={handleAddQuickNote}
                          disabled={!quickNote.trim()}
                          className="notebook-btn notebook-btn-teal"
                        >
                          Append Note
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Conclusion */}
                  <div className="detail-section-card">
                    <h5 className="section-card-title">Conclusion & Physical Takeaway</h5>
                    {isEditing ? (
                      <textarea
                        value={editConclusion}
                        onChange={(e) => setEditConclusion(e.target.value)}
                        className="detail-textarea"
                        rows={2}
                        placeholder="Conclusion drawn from this experiment..."
                      />
                    ) : (
                      <p className="section-card-text">
                        {selectedExperiment.conclusion || "No formal conclusion logged."}
                      </p>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="detail-section-card">
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                      <Tag size={14} color="var(--color-copper)" />
                      <h5 className="section-card-title" style={{ margin: 0 }}>
                        Tags & Classifications
                      </h5>
                    </div>

                    {isEditing ? (
                      <input
                        type="text"
                        value={editTagsString}
                        onChange={(e) => setEditTagsString(e.target.value)}
                        className="detail-title-input"
                        placeholder="e.g. tunneling, electron, stm, high-barrier (comma separated)"
                      />
                    ) : (
                      <div className="tags-flex-wrap">
                        {(selectedExperiment.tags || []).map((tag) => (
                          <span
                            key={tag}
                            className="detail-tag-pill"
                            onClick={() => setSearchQuery(tag)}
                            title={`Filter notebook by #${tag}`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="detail-empty-selection">
                <p>Select an experiment on the left to inspect configuration details, or record a new one.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer: Privacy Notice & Shortcuts */}
        <div className="notebook-modal-footer">
          <div className="privacy-notice">
            <ShieldCheck size={15} color="var(--color-teal)" />
            <span>
              <strong>Local-First & Login-Free:</strong> Your experiments are stored securely in your browser&rsquo;s IndexedDB. Data is never uploaded to remote servers. Export backups periodically to prevent loss when clearing browser history.
            </span>
          </div>

          <div className="footer-keys">
            <span>Shortcut: <strong>N</strong> to toggle notebook &middot; <strong>T</strong> for tweak panel</span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal-box">
            <div className="confirm-icon-circle">
              <AlertTriangle size={24} color="#EF4444" />
            </div>
            <h4 className="confirm-title font-serif">Delete Experiment?</h4>
            <p className="confirm-text">
              Are you sure you want to delete this experiment record? This will permanently remove it from your browser storage.
            </p>
            <div className="confirm-actions-row">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="notebook-btn notebook-btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="notebook-btn notebook-btn-danger"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal-box">
            <div className="confirm-icon-circle" style={{ background: "rgba(32, 196, 180, 0.15)" }}>
              <Upload size={24} color="var(--color-teal)" />
            </div>
            <h4 className="confirm-title font-serif">Import Notebook Backup</h4>
            <p className="confirm-text">
              Select a QuantMix JSON backup file to import into your browser storage.
            </p>

            <div style={{ display: "flex", gap: "16px", margin: "16px 0", justifyContent: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.88rem" }}>
                <input
                  type="radio"
                  name="importMode"
                  value="merge"
                  checked={importMode === "merge"}
                  onChange={() => setImportMode("merge")}
                />
                Merge with existing records
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.88rem", color: "#EF4444" }}>
                <input
                  type="radio"
                  name="importMode"
                  value="replace"
                  checked={importMode === "replace"}
                  onChange={() => setImportMode("replace")}
                />
                Replace all existing records
              </label>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              style={{ display: "none" }}
              onChange={handleFileImport}
            />

            <div className="confirm-actions-row">
              <button
                onClick={() => setShowImportModal(false)}
                className="notebook-btn notebook-btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="notebook-btn notebook-btn-teal"
              >
                Choose File (.json)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
