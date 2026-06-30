import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error) {
    console.error("Admin runtime error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8fafc", padding: 16 }}>
          <div style={{ maxWidth: 760, width: "100%", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 20 }}>
            <h2 style={{ margin: 0, color: "#0f172a" }}>Erreur d'affichage du dashboard</h2>
            <p style={{ color: "#475569", marginTop: 8 }}>
              Le dashboard a rencontré une erreur JavaScript. Copiez ce message et envoyez-le-moi.
            </p>
            <pre style={{ whiteSpace: "pre-wrap", background: "#0b1020", color: "#f8fafc", padding: 12, borderRadius: 8, fontSize: 12 }}>
              {String(this.state.error?.stack || this.state.error?.message || this.state.error)}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{ marginTop: 12, background: "#1e40af", color: "#fff", border: 0, borderRadius: 8, padding: "10px 14px", cursor: "pointer" }}
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

