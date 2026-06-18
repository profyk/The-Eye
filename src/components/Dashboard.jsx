
import { useState, useEffect, useRef } from "react";

const COLORS = {
  void: "#07090F",
  deep: "#0D1117",
  surface: "#111827",
  panel: "#151C2C",
  border: "#1E2D45",
  accent: "#00D4FF",
  accentDim: "#0099BB",
  danger: "#FF3B3B",
  warn: "#FFB800",
  safe: "#00E676",
  text: "#E8EDF5",
  muted: "#5A6A80",
  iris: "#7B6FFF",
};

const INITIAL_EVENTS = [
  { id: "EVT-908771", user: "John Smith", dept: "Finance", action: "Modified Supplier Payment", old: "R50,000", new: "R150,000", time: "14:35:21", risk: "critical", location: "Johannesburg", ip: "196.25.1.44", device: "FINPC-004" },
  { id: "EVT-908772", user: "Nomsa Dlamini", dept: "HR", action: "Created Employee Record", old: "—", new: "Employee #4821", time: "14:31:07", risk: "medium", location: "Pretoria", ip: "197.80.12.9", device: "HRPC-011" },
  { id: "EVT-908773", user: "Sipho Nkosi", dept: "IT", action: "Exported 12,400 Records", old: "—", new: "bulk_export.csv", time: "14:28:55", risk: "critical", location: "Cape Town", ip: "105.22.4.17", device: "ITPC-002" },
  { id: "EVT-908774", user: "Thabo Mokoena", dept: "Procurement", action: "Approved Contract R2.4M", old: "Pending", new: "Approved", time: "14:21:03", risk: "high", location: "Durban", ip: "196.11.5.88", device: "PRPC-007" },
  { id: "EVT-908775", user: "Lerato Khumalo", dept: "Finance", action: "Changed Vendor Bank Account", old: "ABSA ****1122", new: "FNB ****9934", time: "14:18:44", risk: "critical", location: "Johannesburg", ip: "196.25.1.45", device: "FINPC-006" },
  { id: "EVT-908776", user: "David Van Wyk", dept: "Admin", action: "USB Device Connected", old: "—", new: "32GB Kingston", time: "14:15:22", risk: "high", location: "Bloemfontein", ip: "196.30.7.21", device: "ADMPC-003" },
  { id: "EVT-908777", user: "Zanele Moyo", dept: "Compliance", action: "Accessed Salary Records", old: "—", new: "All Staff Viewed", time: "14:10:11", risk: "medium", location: "Pretoria", ip: "197.80.12.11", device: "CMPC-001" },
  { id: "EVT-908778", user: "Peter Sithole", dept: "Finance", action: "Login After Hours", old: "—", new: "23:47 Access", time: "23:47:05", risk: "high", location: "Unknown", ip: "41.55.200.3", device: "UNKNOWN" },
];

const USERS = [
  { name: "John Smith", dept: "Finance", score: 94, events: 47, status: "critical", avatar: "JS" },
  { name: "Sipho Nkosi", dept: "IT", score: 87, events: 31, status: "critical", avatar: "SN" },
  { name: "Lerato Khumalo", dept: "Finance", score: 82, events: 28, status: "high", avatar: "LK" },
  { name: "Thabo Mokoena", dept: "Procurement", score: 71, events: 19, status: "high", avatar: "TM" },
  { name: "Peter Sithole", dept: "Finance", score: 65, events: 14, status: "high", avatar: "PS" },
  { name: "David Van Wyk", dept: "Admin", score: 54, events: 9, status: "medium", avatar: "DV" },
];

const ALERTS = [
  { id: 1, msg: "CRITICAL: Bulk data export detected — Sipho Nkosi (IT)", time: "2 min ago", level: "critical" },
  { id: 2, msg: "CRITICAL: Vendor bank account changed without dual approval", time: "5 min ago", level: "critical" },
  { id: 3, msg: "HIGH: After-hours login from unrecognised IP — Peter Sithole", time: "12 min ago", level: "high" },
  { id: 4, msg: "HIGH: USB device connected on restricted workstation", time: "18 min ago", level: "high" },
  { id: 5, msg: "HIGH: Contract approved R2.4M — single approver only", time: "31 min ago", level: "high" },
  { id: 6, msg: "MEDIUM: Salary records accessed outside normal role scope", time: "43 min ago", level: "medium" },
];

const STATS = [
  { label: "Events Today", value: "14,882", delta: "+12%", color: COLORS.accent },
  { label: "Critical Flags", value: "7", delta: "↑3 new", color: COLORS.danger },
  { label: "High Risk Users", value: "5", delta: "↑2 new", color: COLORS.warn },
  { label: "Devices Monitored", value: "342", delta: "Online", color: COLORS.safe },
];

const riskColor = (r) => ({ critical: COLORS.danger, high: COLORS.warn, medium: COLORS.iris, low: COLORS.safe }[r] || COLORS.muted);
const riskBg = (r) => ({ critical: "#1A0A0A", high: "#1A1200", medium: "#0F0D1F", low: "#081A10" }[r] || "#111");

function Pulse({ color }) {
  return (
    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}`, marginRight: 6, flexShrink: 0 }} />
  );
}

function EyeLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <ellipse cx="18" cy="18" rx="16" ry="10" stroke={COLORS.accent} strokeWidth="1.5" />
      <circle cx="18" cy="18" r="5" fill={COLORS.accent} opacity="0.15" stroke={COLORS.accent} strokeWidth="1.5" />
      <circle cx="18" cy="18" r="2" fill={COLORS.accent} />
      <line x1="18" y1="2" x2="18" y2="8" stroke={COLORS.accent} strokeWidth="1" opacity="0.4" />
      <line x1="18" y1="28" x2="18" y2="34" stroke={COLORS.accent} strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

function AIInvestigator({ onClose }) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "I am The Eye Intelligence Engine. Ask me anything about activity in your organisation — I will investigate and report with evidence." }
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const ask = async () => {
    if (!query.trim() || loading) return;
    const q = query.trim();
    setQuery("");
    setMessages(m => [...m, { role: "user", text: q }]);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: `You are The Eye — an elite anti-corruption intelligence engine deployed in South African organisations. You have access to all activity logs, financial records, user behaviour patterns, and forensic data.

Current monitored events include:
- John Smith (Finance) modified a supplier payment from R50,000 to R150,000 at 14:35 — flagged CRITICAL
- Sipho Nkosi (IT) exported 12,400 records to bulk_export.csv at 14:28 — flagged CRITICAL  
- Lerato Khumalo (Finance) changed a vendor bank account without dual approval — flagged CRITICAL
- Thabo Mokoena (Procurement) approved a R2.4M contract as sole approver at 14:21 — flagged HIGH
- Peter Sithole (Finance) logged in at 23:47 from unrecognised IP 41.55.200.3 — flagged HIGH
- David Van Wyk (Admin) connected a 32GB USB to a restricted workstation — flagged HIGH

Risk scores: John Smith 94/100, Sipho Nkosi 87/100, Lerato Khumalo 82/100.

When answering:
- Be direct, authoritative, and forensic
- Reference specific event IDs, timestamps, and evidence
- Suggest concrete next steps for investigators
- Flag patterns that suggest coordinated fraud
- Keep responses concise but detailed
- Use South African context (POPIA, NPA, Hawks, SIU)`,
          messages: [{ role: "user", content: q }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "No response.";
      setMessages(m => [...m, { role: "assistant", text }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", text: "Connection error. Retrying secure channel..." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(7,9,15,0.92)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.accent}33`, borderRadius: 16, width: "100%", maxWidth: 720, height: "80vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.accent, boxShadow: `0 0 10px ${COLORS.accent}` }} />
            <span style={{ color: COLORS.text, fontFamily: "monospace", fontSize: 15, fontWeight: 700, letterSpacing: 2 }}>AI INTELLIGENCE ENGINE</span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 12, flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: m.role === "user" ? COLORS.iris : COLORS.accentDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                {m.role === "user" ? "YOU" : "AI"}
              </div>
              <div style={{ background: m.role === "user" ? "#1A1830" : COLORS.surface, border: `1px solid ${m.role === "user" ? COLORS.iris + "44" : COLORS.border}`, borderRadius: 12, padding: "12px 16px", maxWidth: "80%", color: COLORS.text, fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: COLORS.accentDim, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>AI</div>
              <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "12px 16px", color: COLORS.accent, fontSize: 13, fontFamily: "monospace" }}>
                Analysing logs<span style={{ animation: "blink 1s infinite" }}>...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${COLORS.border}`, display: "flex", gap: 12 }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && ask()}
            placeholder="Ask anything — 'Show me everything John Smith did today' or 'Who changed the vendor accounts?'"
            style={{ flex: 1, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "12px 16px", color: COLORS.text, fontSize: 13, outline: "none", fontFamily: "inherit" }}
          />
          <button onClick={ask} disabled={loading} style={{ background: COLORS.accent, border: "none", borderRadius: 8, padding: "12px 20px", color: COLORS.void, fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>
            Investigate →
          </button>
        </div>
      </div>
    </div>
  );
}

function EventRow({ ev, onClick }) {
  return (
    <div onClick={() => onClick(ev)} style={{ display: "grid", gridTemplateColumns: "110px 140px 120px 1fr 90px 80px", gap: 12, padding: "12px 16px", borderBottom: `1px solid ${COLORS.border}`, cursor: "pointer", transition: "background 0.15s", alignItems: "center" }}
      onMouseEnter={e => e.currentTarget.style.background = COLORS.surface}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
      <span style={{ fontFamily: "monospace", fontSize: 11, color: COLORS.accent }}>{ev.id}</span>
      <span style={{ fontSize: 12, color: COLORS.text, fontWeight: 600 }}>{ev.user}</span>
      <span style={{ fontSize: 11, color: COLORS.muted }}>{ev.dept}</span>
      <span style={{ fontSize: 12, color: COLORS.text }}>{ev.action}</span>
      <span style={{ fontSize: 11, color: COLORS.muted, fontFamily: "monospace" }}>{ev.time}</span>
      <span style={{ display: "flex", alignItems: "center" }}>
        <Pulse color={riskColor(ev.risk)} />
        <span style={{ fontSize: 11, color: riskColor(ev.risk), textTransform: "uppercase", fontWeight: 700 }}>{ev.risk}</span>
      </span>
    </div>
  );
}

function EventDetail({ ev, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(7,9,15,0.85)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: COLORS.panel, border: `1px solid ${riskColor(ev.risk)}44`, borderRadius: 16, width: "100%", maxWidth: 560, overflow: "hidden" }}>
        <div style={{ padding: "16px 24px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: riskBg(ev.risk) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Pulse color={riskColor(ev.risk)} />
            <span style={{ color: riskColor(ev.risk), fontFamily: "monospace", fontSize: 13, fontWeight: 700 }}>{ev.id} — {ev.risk.toUpperCase()}</span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: 18 }}>✕</button>
        </div>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            ["User", ev.user], ["Department", ev.dept], ["Action", ev.action],
            ["Previous Value", ev.old], ["New Value", ev.new], ["Time", ev.time],
            ["Location", ev.location], ["IP Address", ev.ip], ["Device", ev.device]
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 8 }}>
              <span style={{ color: COLORS.muted, fontSize: 12 }}>{k}</span>
              <span style={{ color: COLORS.text, fontSize: 12, fontFamily: k === "IP Address" || k === "Device" ? "monospace" : "inherit", fontWeight: 600 }}>{v}</span>
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button style={{ flex: 1, background: COLORS.danger + "22", border: `1px solid ${COLORS.danger}`, borderRadius: 8, padding: "10px", color: COLORS.danger, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>🚨 Escalate to Hawks</button>
            <button style={{ flex: 1, background: COLORS.accent + "22", border: `1px solid ${COLORS.accent}`, borderRadius: 8, padding: "10px", color: COLORS.accent, fontWeight: 700, fontSize: 12, cursor: "pointer" }}>📦 Export Evidence</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TheEye() {
  const [tab, setTab] = useState("overview");
  const [showAI, setShowAI] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [alertCount, setAlertCount] = useState(7);
  const [tick, setTick] = useState(0);
  const [newEventFlash, setNewEventFlash] = useState(false);

  // Simulate live events
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
      if (Math.random() > 0.6) {
        const newEv = {
          id: `EVT-${908779 + Math.floor(Math.random() * 100)}`,
          user: ["Sipho Nkosi", "John Smith", "Zanele Moyo", "Thabo Mokoena"][Math.floor(Math.random() * 4)],
          dept: ["Finance", "IT", "Procurement", "HR"][Math.floor(Math.random() * 4)],
          action: ["Accessed restricted file", "Modified salary record", "Login attempt failed x3", "Printed sensitive document", "Changed permissions"][Math.floor(Math.random() * 5)],
          old: "—",
          new: "Flagged",
          time: new Date().toTimeString().slice(0, 8),
          risk: ["critical", "high", "medium"][Math.floor(Math.random() * 3)],
          location: ["Johannesburg", "Pretoria", "Cape Town"][Math.floor(Math.random() * 3)],
          ip: `196.${Math.floor(Math.random() * 99)}.${Math.floor(Math.random() * 99)}.${Math.floor(Math.random() * 99)}`,
          device: `PC-00${Math.floor(Math.random() * 9)}`
        };
        setEvents(e => [newEv, ...e.slice(0, 19)]);
        setNewEventFlash(true);
        setTimeout(() => setNewEventFlash(false), 1000);
        if (newEv.risk === "critical") setAlertCount(a => a + 1);
      }
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const tabs = ["overview", "live feed", "users", "alerts", "forensics"];

  return (
    <div style={{ background: COLORS.void, minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', sans-serif", color: COLORS.text, display: "flex", flexDirection: "column" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #1E2D45; border-radius: 4px; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
      `}</style>

      {/* Header */}
      <div style={{ background: COLORS.deep, borderBottom: `1px solid ${COLORS.border}`, padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <EyeLogo />
          <div>
            <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 17, letterSpacing: 3, color: COLORS.accent }}>THE EYE</div>
            <div style={{ fontSize: 9, color: COLORS.muted, letterSpacing: 2 }}>INTELLIGENCE & ACCOUNTABILITY PLATFORM</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.safe, boxShadow: `0 0 8px ${COLORS.safe}`, animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: 11, color: COLORS.safe, fontFamily: "monospace" }}>LIVE · 342 AGENTS</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: COLORS.danger + "22", border: `1px solid ${COLORS.danger}44`, borderRadius: 20, padding: "4px 12px" }}>
            <span style={{ fontSize: 11, color: COLORS.danger, fontWeight: 700 }}>⚠ {alertCount} CRITICAL</span>
          </div>
          <button onClick={() => setShowAI(true)} style={{ background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.iris})`, border: "none", borderRadius: 8, padding: "8px 16px", color: COLORS.void, fontWeight: 700, fontSize: 12, cursor: "pointer", letterSpacing: 1 }}>
            🧠 AI INVESTIGATE
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: COLORS.deep, borderBottom: `1px solid ${COLORS.border}`, padding: "0 28px", display: "flex", gap: 4 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: "none", border: "none", borderBottom: tab === t ? `2px solid ${COLORS.accent}` : "2px solid transparent", padding: "14px 16px", color: tab === t ? COLORS.accent : COLORS.muted, fontWeight: tab === t ? 700 : 400, fontSize: 12, cursor: "pointer", textTransform: "uppercase", letterSpacing: 1, transition: "color 0.15s" }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, padding: 28, overflowY: "auto" }}>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {STATS.map(s => (
                <div key={s.label} style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "20px 24px" }}>
                  <div style={{ fontSize: 11, color: COLORS.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: s.color, fontFamily: "monospace" }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>{s.delta}</div>
                </div>
              ))}
            </div>

            {/* Live feed preview + alerts */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
              {/* Recent events */}
              <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: 1 }}>RECENT ACTIVITY</span>
                  <span style={{ fontSize: 11, color: COLORS.accent, cursor: "pointer" }} onClick={() => setTab("live feed")}>View all →</span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "110px 140px 120px 1fr 90px 80px", gap: 12, padding: "10px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
                    {["Event ID", "User", "Department", "Action", "Time", "Risk"].map(h => (
                      <span key={h} style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1 }}>{h}</span>
                    ))}
                  </div>
                  {events.slice(0, 6).map((ev, i) => <EventRow key={ev.id + i} ev={ev} onClick={setSelectedEvent} />)}
                </div>
              </div>

              {/* Alerts */}
              <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}` }}>
                  <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: 1 }}>LIVE ALERTS</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {ALERTS.map(a => (
                    <div key={a.id} style={{ padding: "12px 16px", borderBottom: `1px solid ${COLORS.border}`, background: riskBg(a.level) }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <Pulse color={riskColor(a.level)} />
                        <div>
                          <div style={{ fontSize: 11, color: COLORS.text, lineHeight: 1.5 }}>{a.msg}</div>
                          <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 3 }}>{a.time}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Risk users */}
            <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: 1 }}>HIGH RISK USERS — AI RISK SCORE</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: COLORS.border }}>
                {USERS.map(u => (
                  <div key={u.name} style={{ background: COLORS.panel, padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: riskColor(u.status) + "22", border: `1.5px solid ${riskColor(u.status)}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: riskColor(u.status) }}>{u.avatar}</div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13 }}>{u.name}</div>
                        <div style={{ fontSize: 11, color: COLORS.muted }}>{u.dept} · {u.events} events</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ flex: 1, height: 4, background: COLORS.surface, borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${u.score}%`, background: `linear-gradient(90deg, ${riskColor(u.status)}, ${riskColor(u.status)}88)`, borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 800, color: riskColor(u.status), fontFamily: "monospace" }}>{u.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LIVE FEED */}
        {tab === "live feed" && (
          <div style={{ background: COLORS.panel, border: `1px solid ${newEventFlash ? COLORS.accent : COLORS.border}`, borderRadius: 12, overflow: "hidden", transition: "border-color 0.3s" }}>
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.safe, animation: "pulse 1s infinite" }} />
                <span style={{ fontWeight: 700, fontSize: 13, letterSpacing: 1 }}>LIVE ACTIVITY FEED — ALL EVENTS</span>
              </div>
              <span style={{ fontSize: 11, color: COLORS.muted, fontFamily: "monospace" }}>{events.length} events captured</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <div style={{ display: "grid", gridTemplateColumns: "110px 140px 120px 1fr 90px 80px", gap: 12, padding: "10px 16px", borderBottom: `1px solid ${COLORS.border}` }}>
                {["Event ID", "User", "Department", "Action", "Time", "Risk"].map(h => (
                  <span key={h} style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1 }}>{h}</span>
                ))}
              </div>
              {events.map((ev, i) => (
                <div key={ev.id + i} style={{ animation: i === 0 && newEventFlash ? "fadeIn 0.4s ease" : "none" }}>
                  <EventRow ev={ev} onClick={setSelectedEvent} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* USERS */}
        {tab === "users" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: 1, color: COLORS.muted }}>USER RISK PROFILES — AI BEHAVIOURAL ANALYSIS</div>
            {USERS.map(u => (
              <div key={u.name} style={{ background: COLORS.panel, border: `1px solid ${riskColor(u.status)}33`, borderRadius: 12, padding: "20px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: riskColor(u.status) + "22", border: `2px solid ${riskColor(u.status)}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, color: riskColor(u.status) }}>{u.avatar}</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16 }}>{u.name}</div>
                      <div style={{ fontSize: 12, color: COLORS.muted }}>{u.dept} · {u.events} suspicious events recorded</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 36, fontWeight: 900, color: riskColor(u.status), fontFamily: "monospace" }}>{u.score}<span style={{ fontSize: 14, color: COLORS.muted }}>/100</span></div>
                    <div style={{ fontSize: 11, color: riskColor(u.status), textTransform: "uppercase", fontWeight: 700 }}>Risk Score</div>
                  </div>
                </div>
                <div style={{ marginTop: 16, height: 6, background: COLORS.surface, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${u.score}%`, background: `linear-gradient(90deg, ${riskColor(u.status)}, ${riskColor(u.status)}88)`, borderRadius: 3 }} />
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  <button style={{ background: COLORS.accent + "15", border: `1px solid ${COLORS.accent}44`, borderRadius: 8, padding: "8px 16px", color: COLORS.accent, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>View Full Timeline</button>
                  <button style={{ background: COLORS.danger + "15", border: `1px solid ${COLORS.danger}44`, borderRadius: 8, padding: "8px 16px", color: COLORS.danger, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Flag for Investigation</button>
                  <button style={{ background: COLORS.iris + "15", border: `1px solid ${COLORS.iris}44`, borderRadius: 8, padding: "8px 16px", color: COLORS.iris, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>🧠 AI Analyse</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ALERTS */}
        {tab === "alerts" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: 1, color: COLORS.muted }}>ALL ALERTS — REAL TIME</div>
            {ALERTS.map(a => (
              <div key={a.id} style={{ background: COLORS.panel, border: `1px solid ${riskColor(a.level)}33`, borderRadius: 12, padding: "18px 24px", display: "flex", alignItems: "flex-start", gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: riskColor(a.level) + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                  {a.level === "critical" ? "🚨" : a.level === "high" ? "⚠️" : "ℹ️"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: riskColor(a.level), textTransform: "uppercase", letterSpacing: 1 }}>{a.level}</span>
                    <span style={{ fontSize: 11, color: COLORS.muted }}>· {a.time}</span>
                  </div>
                  <div style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.5 }}>{a.msg}</div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 12px", color: COLORS.text, fontSize: 11, cursor: "pointer" }}>Acknowledge</button>
                  <button style={{ background: COLORS.danger + "22", border: `1px solid ${COLORS.danger}`, borderRadius: 6, padding: "6px 12px", color: COLORS.danger, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Escalate</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FORENSICS */}
        {tab === "forensics" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: 1, marginBottom: 16 }}>FORENSIC INVESTIGATION MODULE</div>
              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <input placeholder="Search by user, event ID, action, IP address, date..." style={{ flex: 1, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "12px 16px", color: COLORS.text, fontSize: 13, outline: "none" }} />
                <button style={{ background: COLORS.accent, border: "none", borderRadius: 8, padding: "12px 20px", color: COLORS.void, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Search</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                  { icon: "📋", label: "Generate Investigation Report", color: COLORS.accent },
                  { icon: "📦", label: "Export Evidence Package", color: COLORS.iris },
                  { icon: "⛓️", label: "Verify Chain of Custody", color: COLORS.safe },
                  { icon: "🗺️", label: "Build Activity Timeline", color: COLORS.warn },
                  { icon: "🔗", label: "Map Relationship Network", color: COLORS.accent },
                  { icon: "⚖️", label: "Prepare NPA Submission", color: COLORS.danger },
                ].map(item => (
                  <button key={item.label} style={{ background: item.color + "10", border: `1px solid ${item.color}33`, borderRadius: 10, padding: "16px", textAlign: "left", cursor: "pointer", color: item.color }}>
                    <div style={{ fontSize: 20, marginBottom: 8 }}>{item.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.4 }}>{item.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 13, letterSpacing: 1, marginBottom: 4 }}>MULTI-PERSON DELETION APPROVAL</div>
              <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 16 }}>No single person can delete records. All 4 officers must approve.</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {["Chief Auditor", "Compliance Officer", "Security Officer", "Executive Authority"].map((role, i) => (
                  <div key={role} style={{ background: COLORS.surface, border: `1px solid ${i < 2 ? COLORS.safe : COLORS.border}`, borderRadius: 10, padding: "14px", textAlign: "center" }}>
                    <div style={{ fontSize: 20, marginBottom: 8 }}>{i < 2 ? "✅" : "⏳"}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: i < 2 ? COLORS.safe : COLORS.muted }}>{role}</div>
                    <div style={{ fontSize: 10, color: COLORS.muted, marginTop: 4 }}>{i < 2 ? "Approved" : "Pending"}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showAI && <AIInvestigator onClose={() => setShowAI(false)} />}
      {selectedEvent && <EventDetail ev={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
}
