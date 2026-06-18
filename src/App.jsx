import { useState } from "react";
import Dashboard from "./components/Dashboard";
import IntrusionDetection from "./components/IntrusionDetection";

export default function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div>
      <nav style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 999, display: "flex", gap: 8, background: "#0D1117", border: "1px solid #1E2D45", borderRadius: 50, padding: "6px 12px" }}>
        <button onClick={() => setPage("dashboard")} style={{ background: page === "dashboard" ? "#00D4FF" : "transparent", border: "none", borderRadius: 50, padding: "8px 18px", color: page === "dashboard" ? "#07090F" : "#5A6A80", fontWeight: 700, fontSize: 12, cursor: "pointer", letterSpacing: 1 }}>
          DASHBOARD
        </button>
        <button onClick={() => setPage("intrusion")} style={{ background: page === "intrusion" ? "#FF3B3B" : "transparent", border: "none", borderRadius: 50, padding: "8px 18px", color: page === "intrusion" ? "#07090F" : "#5A6A80", fontWeight: 700, fontSize: 12, cursor: "pointer", letterSpacing: 1 }}>
          INTRUSION
        </button>
      </nav>
      {page === "dashboard" ? <Dashboard /> : <IntrusionDetection />}
    </div>
  );
}
