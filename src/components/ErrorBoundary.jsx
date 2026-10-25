import React from "react";
import { AlertTriangle, RefreshCw, Trash2 } from "lucide-react";

/**
 * ErrorBoundary
 * Catches any JavaScript initialization or runtime exceptions in the component tree
 * and displays an informative recovery screen rather than leaving a blank page.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("QuantMix Uncaught Boundary Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // Ignore storage errors
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B1020",
          color: "#F4F7FF",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          padding: "24px"
        }}>
          <div style={{
            maxWidth: "680px",
            width: "100%",
            background: "rgba(18, 21, 29, 0.95)",
            border: "1px solid rgba(198, 114, 72, 0.4)",
            borderRadius: "12px",
            padding: "36px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{
                background: "rgba(198, 114, 72, 0.15)",
                border: "1px solid #C67248",
                borderRadius: "50%",
                padding: "8px",
                display: "flex"
              }}>
                <AlertTriangle size={24} color="#C67248" />
              </div>
              <div>
                <h1 style={{ fontSize: "1.35rem", margin: 0, fontWeight: 700, color: "#F4F7FF" }}>
                  QuantMix Simulation Recovery
                </h1>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#A3ACB9" }}>
                  An unexpected initialization error occurred during WebGL or state setup.
                </p>
              </div>
            </div>

            <div style={{
              background: "#080B14",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "24px",
              fontFamily: "monospace",
              fontSize: "0.84rem",
              color: "#FF8B78",
              overflowX: "auto",
              maxHeight: "220px",
              whiteSpace: "pre-wrap"
            }}>
              <strong>{this.state.error?.name}: </strong>
              {this.state.error?.message || "Unknown runtime exception"}
              {this.state.error?.stack && (
                <div style={{ marginTop: "12px", color: "#A3ACB9", fontSize: "0.76rem" }}>
                  {this.state.error.stack}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={this.handleResetAndReload}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#A3ACB9",
                  padding: "10px 18px",
                  borderRadius: "6px",
                  fontSize: "0.86rem",
                  cursor: "pointer"
                }}
              >
                <Trash2 size={15} />
                <span>Clear Cache & Reload</span>
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#C67248",
                  border: "none",
                  color: "#FFFFFF",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  fontSize: "0.86rem",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                <RefreshCw size={15} />
                <span>Reload Simulation</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
