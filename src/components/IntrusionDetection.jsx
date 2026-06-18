
import { useState, useEffect, useRef } from "react";

const C = {
  void: "#07090F",
  deep: "#0D1117",
  surface: "#111827",
  panel: "#151C2C",
  border: "#1E2D45",
  accent: "#00D4FF",
  danger: "#FF3B3B",
  warn: "#FFB800",
  safe: "#00E676",
  text: "#E8EDF5",
  muted: "#5A6A80",
  iris: "#7B6FFF",
};

const COUNTRIES = ["Russia", "China", "North Korea", "Romania", "Brazil", "Nigeria", "Ukraine", "Iran", "Unknown"];
const CITIES = ["Moscow", "Beijing", "Pyongyang", "Bucharest", "São Paulo", "Lagos", "Kyiv", "Tehran", "—"];
const TARGETS = [
  "admin@municipality.gov.za",
  "cfo@treasury.gov.za",
  "director@eskom.co.za",
  "payroll@hr.gov.za",
  "sysadmin@transnet.net",
  "auditor@agsa.gov.za",
];
const ATTACK_TYPES = [
  "Brute Force",
  "Credential Stuffing",
  "Password Spray",
  "Tor Exit Node",
  "Botnet Attack",
  "Dictionary Attack",
  "Phishing Redirect",
];
const STATUSES = ["BLOCKED", "BLOCKED", "BLOCKED", "INVESTIGATING"];

function randomIP() {
  return `${[185,91,193,45,77,194][Math.floor(Math.random()*6)]}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
}

function randomAttempts() { return Math.floor(Math.random() * 200) + 10; }

function generateAttempt(id) {
  const ci = Math.floor(Math.random() * COUNTRIES.length);
  return {
    id: `ATK-${String(id).padStart(6,"0")}`,
    ip: randomIP(),
    country: COUNTRIES[ci],
    city: CITIES[ci],
    target: TARGETS[Math.floor(Math.random() * TARGETS.length)],
    type: ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)],
    attempts: randomAttempts(),
    time: new Date().toTimeString().slice(0,8),
    status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
    isTor: Math.random() > 0.6,
    isVPN: Math.random() > 0.5,
  };
}

const INITIAL = Array.from({ length: 8 }, (_, i) => generateAttempt(1000 + i));

function Pulse({ color, size = 8 }) {
  return <span style={{ display:"inline-block", width:size, height:size, borderRadius:"50%", background:color, boxShadow:`0 0 ${size}px ${color}`, flexShrink:0 }} />;
}

function EyeLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
      <ellipse cx="18" cy="18" rx="16" ry="10" stroke={C.accent} strokeWidth="1.5"/>
      <circle cx="18" cy="18" r="5" fill={C.accent} opacity="0.15" stroke={C.accent} strokeWidth="1.5"/>
      <circle cx="18" cy="18" r="2" fill={C.accent}/>
    </svg>
  );
}

function GeoMap({ attempts }) {
  // Simple ASCII-style world threat map using SVG dots
  const dots = [
    { x: 540, y: 120, country: "Russia", active: true },
    { x: 680, y: 140, country: "China", active: true },
    { x: 700, y: 160, country: "North Korea", active: true },
    { x: 490, y: 130, country: "Ukraine", active: false },
    { x: 510, y: 160, country: "Romania", active: true },
    { x: 300, y: 290, country: "Brazil", active: false },
    { x: 430, y: 230, country: "Nigeria", active: true },
    { x: 590, y: 165, country: "Iran", active: true },
    { x: 180, y: 80, country: "Canada", active: false },
    // South Africa target
    { x: 490, y: 310, country: "South Africa (TARGET)", active: false, isTarget: true },
  ];

  return (
    <div style={{ background: C.surface, borderRadius: 12, padding: 20, border: `1px solid ${C.border}`, position: "relative", overflow: "hidden" }}>
      <div style={{ fontSize: 11, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Live Threat Origin Map</div>
      <svg viewBox="0 0 800 400" style={{ width: "100%", height: "auto" }}>
        {/* Simple world outline blocks */}
        <rect x="120" y="60" width="160" height="180" rx="4" fill="#0D1117" stroke="#1E2D45" strokeWidth="0.5" opacity="0.8"/>
        <rect x="290" y="230" width="120" height="120" rx="4" fill="#0D1117" stroke="#1E2D45" strokeWidth="0.5" opacity="0.8"/>
        <rect x="420" y="80" width="180" height="180" rx="4" fill="#0D1117" stroke="#1E2D45" strokeWidth="0.5" opacity="0.8"/>
        <rect x="440" y="270" width="80" height="100" rx="4" fill="#0D1117" stroke="#1E2D45" strokeWidth="0.5" opacity="0.8"/>
        <rect x="600" y="100" width="140" height="180" rx="4" fill="#0D1117" stroke="#1E2D45" strokeWidth="0.5" opacity="0.8"/>
        {/* Attack lines to SA */}
        {dots.filter(d => d.active && !d.isTarget).map((d, i) => (
          <line key={i} x1={d.x} y1={d.y} x2={490} y2={310}
            stroke={C.danger} strokeWidth="0.8" opacity="0.3" strokeDasharray="4 4">
            <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1.5s" repeatCount="indefinite"/>
          </line>
        ))}
        {/* Dots */}
        {dots.map((d, i) => (
          <g key={i}>
            <circle cx={d.x} cy={d.y} r={d.isTarget ? 10 : 5}
              fill={d.isTarget ? C.accent : d.active ? C.danger : C.muted}
              opacity={d.active || d.isTarget ? 1 : 0.3}>
              {(d.active || d.isTarget) && (
                <animate attributeName="r" values={d.isTarget ? "8;12;8" : "4;7;4"} dur="2s" repeatCount="indefinite"/>
              )}
            </circle>
            <circle cx={d.x} cy={d.y} r={d.isTarget ? 16 : 10}
              fill="none" stroke={d.isTarget ? C.accent : d.active ? C.danger : "transparent"}
              opacity="0.3" strokeWidth="1">
              {d.active && <animate attributeName="r" values={d.isTarget?"12;20;12":"6;14;6"} dur="2s" repeatCount="indefinite"/>}
            </circle>
            <text x={d.x + (d.isTarget ? -60 : 8)} y={d.y + 4} fill={d.isTarget ? C.accent : C.muted} fontSize="9" fontFamily="monospace">
              {d.country}
            </text>
          </g>
        ))}
      </svg>
      <div style={{ display:"flex", gap:16, marginTop:8 }}>
        <span style={{ fontSize:10, color:C.danger, display:"flex", alignItems:"center", gap:6 }}><Pulse color={C.danger} size={6}/> Active attack origin</span>
        <span style={{ fontSize:10, color:C.accent, display:"flex", alignItems:"center", gap:6 }}><Pulse color={C.accent} size={6}/> Your system (target)</span>
      </div>
    </div>
  );
}

function LoginSimulator({ onAttack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failCount, setFailCount] = useState(0);
  const [locked, setLocked] = useState(false);
  const [mfaStep, setMfaStep] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [msg, setMsg] = useState(null);
  const [shake, setShake] = useState(false);

  const triggerShake = () => { setShake(true); setTimeout(() => setShake(false), 500); };

  const tryLogin = () => {
    if (locked) return;
    if (!email || !password) { setMsg({ text: "Enter credentials.", color: C.warn }); return; }

    const isCorrect = email === "admin@eye.gov.za" && password === "correct123";

    if (isCorrect && failCount === 0) {
      setMfaStep(true);
      setMsg({ text: "Credentials accepted. MFA required.", color: C.safe });
      return;
    }

    const newFail = failCount + 1;
    setFailCount(newFail);
    triggerShake();
    onAttack({ type: newFail >= 3 ? "Brute Force — Account Locked" : "Failed Login Attempt", attempts: newFail, ip: randomIP(), target: email || "unknown" });

    if (newFail >= 3) {
      setLocked(true);
      setMsg({ text: "Account LOCKED. Security officer notified. IP banned.", color: C.danger });
    } else {
      setMsg({ text: `Invalid credentials. Warning ${newFail}/3 — account will lock.`, color: C.warn });
    }
  };

  const tryMFA = () => {
    if (mfaCode === "123456") {
      setMsg({ text: "✅ Access granted. Welcome, Administrator.", color: C.safe });
      setMfaStep(false);
    } else {
      triggerShake();
      setMsg({ text: "Invalid MFA code. Access denied.", color: C.danger });
      onAttack({ type: "MFA Bypass Attempt", attempts: 1, ip: randomIP(), target: email });
    }
  };

  return (
    <div style={{ background: C.panel, border: `1px solid ${locked ? C.danger : C.border}`, borderRadius: 16, padding: 28, maxWidth: 400, width: "100%" }}>
      <div style={{ textAlign:"center", marginBottom: 24 }}>
        <EyeLogo />
        <div style={{ fontFamily:"monospace", fontWeight:800, fontSize:15, letterSpacing:3, color:C.accent, marginTop:8 }}>THE EYE</div>
        <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Secure Access Portal</div>
      </div>

      {locked ? (
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:40, marginBottom:12 }}>🔒</div>
          <div style={{ color:C.danger, fontWeight:800, fontSize:14, marginBottom:8 }}>ACCOUNT LOCKED</div>
          <div style={{ color:C.muted, fontSize:12, lineHeight:1.6 }}>3 failed attempts detected.<br/>Security officer has been notified.<br/>Your IP has been banned for 24 hours.<br/>Contact your administrator.</div>
          <button onClick={() => { setLocked(false); setFailCount(0); setMsg(null); }} style={{ marginTop:16, background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 20px", color:C.muted, fontSize:12, cursor:"pointer" }}>Reset Demo</button>
        </div>
      ) : mfaStep ? (
        <div>
          <div style={{ fontSize:12, color:C.text, marginBottom:16, lineHeight:1.6 }}>📱 A 6-digit code has been sent to your registered phone. Enter it below.</div>
          <div style={{ fontSize:10, color:C.muted, marginBottom:8 }}>HINT: type 123456 to succeed, anything else to trigger alert</div>
          <input value={mfaCode} onChange={e=>setMfaCode(e.target.value)} placeholder="000000" maxLength={6}
            style={{ width:"100%", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"12px 16px", color:C.text, fontSize:18, textAlign:"center", letterSpacing:8, outline:"none", marginBottom:12, fontFamily:"monospace" }}/>
          <button onClick={tryMFA} style={{ width:"100%", background:C.accent, border:"none", borderRadius:8, padding:"12px", color:C.void, fontWeight:800, fontSize:13, cursor:"pointer" }}>Verify Code</button>
        </div>
      ) : (
        <div style={{ animation: shake ? "shake 0.4s ease" : "none" }}>
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:11, color:C.muted, marginBottom:6 }}>EMAIL</div>
            <input value={email} onChange={e=>setEmail(e.target.value)}
              placeholder="your@organisation.gov.za"
              style={{ width:"100%", background:C.surface, border:`1px solid ${failCount>0?C.danger+"44":C.border}`, borderRadius:8, padding:"11px 14px", color:C.text, fontSize:13, outline:"none" }}/>
          </div>
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11, color:C.muted, marginBottom:6 }}>PASSWORD</div>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
              placeholder="••••••••••••"
              style={{ width:"100%", background:C.surface, border:`1px solid ${failCount>0?C.danger+"44":C.border}`, borderRadius:8, padding:"11px 14px", color:C.text, fontSize:13, outline:"none" }}/>
          </div>
          {failCount > 0 && (
            <div style={{ display:"flex", gap:6, marginBottom:12 }}>
              {[1,2,3].map(n => (
                <div key={n} style={{ flex:1, height:4, borderRadius:2, background: failCount>=n ? C.danger : C.surface }} />
              ))}
            </div>
          )}
          <button onClick={tryLogin} style={{ width:"100%", background:`linear-gradient(135deg, ${C.accent}, ${C.iris})`, border:"none", borderRadius:8, padding:"12px", color:C.void, fontWeight:800, fontSize:13, cursor:"pointer", marginBottom:12 }}>
            Sign In
          </button>
          <div style={{ fontSize:10, color:C.muted, textAlign:"center" }}>HINT: use wrong password 3x to trigger lockout. Correct: admin@eye.gov.za / correct123</div>
        </div>
      )}

      {msg && (
        <div style={{ marginTop:14, padding:"10px 14px", background:msg.color+"18", border:`1px solid ${msg.color}44`, borderRadius:8, fontSize:12, color:msg.color, textAlign:"center" }}>
          {msg.text}
        </div>
      )}
    </div>
  );
}

function AttackRow({ atk, isNew }) {
  return (
    <div style={{ display:"grid", gridTemplateColumns:"110px 140px 120px 1fr 70px 90px", gap:10, padding:"11px 16px", borderBottom:`1px solid ${C.border}`, alignItems:"center", animation: isNew ? "fadeIn 0.4s ease" : "none", background: isNew ? C.danger+"08" : "transparent" }}>
      <span style={{ fontFamily:"monospace", fontSize:10, color:C.danger }}>{atk.id}</span>
      <span style={{ fontFamily:"monospace", fontSize:11, color:C.warn }}>{atk.ip}</span>
      <span style={{ fontSize:11, color:C.text }}>{atk.country}</span>
      <div>
        <span style={{ fontSize:11, color:C.text }}>{atk.type}</span>
        <div style={{ display:"flex", gap:6, marginTop:3 }}>
          {atk.isTor && <span style={{ fontSize:9, background:C.iris+"22", border:`1px solid ${C.iris}44`, borderRadius:3, padding:"1px 5px", color:C.iris }}>TOR</span>}
          {atk.isVPN && <span style={{ fontSize:9, background:C.warn+"22", border:`1px solid ${C.warn}44`, borderRadius:3, padding:"1px 5px", color:C.warn }}>VPN</span>}
        </div>
      </div>
      <span style={{ fontSize:11, color:C.muted, textAlign:"center" }}>{atk.attempts}x</span>
      <span style={{ fontSize:10, fontWeight:700, color:atk.status==="BLOCKED"?C.safe:C.warn, background:atk.status==="BLOCKED"?C.safe+"15":C.warn+"15", border:`1px solid ${atk.status==="BLOCKED"?C.safe:C.warn}44`, borderRadius:4, padding:"3px 7px", textAlign:"center" }}>
        {atk.status}
      </span>
    </div>
  );
}

export default function IntrusionDetection() {
  const [attacks, setAttacks] = useState(INITIAL);
  const [counter, setCounter] = useState(1008);
  const [newIdx, setNewIdx] = useState(null);
  const [stats, setStats] = useState({ blocked: 1247, attempts: 3891, countries: 9, todayPeak: "03:42" });
  const [activeTab, setActiveTab] = useState("attacks");

  // Auto-simulate attacks
  useEffect(() => {
    const iv = setInterval(() => {
      if (Math.random() > 0.4) {
        setCounter(c => {
          const newC = c + 1;
          const atk = generateAttempt(newC);
          setAttacks(a => [atk, ...a.slice(0, 19)]);
          setNewIdx(0);
          setTimeout(() => setNewIdx(null), 1200);
          setStats(s => ({ ...s, blocked: s.blocked + 1, attempts: s.attempts + atk.attempts }));
          return newC;
        });
      }
    }, 2800);
    return () => clearInterval(iv);
  }, []);

  const handleManualAttack = ({ type, attempts, ip, target }) => {
    setCounter(c => {
      const newC = c + 1;
      const atk = {
        id: `ATK-${String(newC).padStart(6,"0")}`,
        ip, country: "Unknown", city: "—",
        target, type, attempts,
        time: new Date().toTimeString().slice(0,8),
        status: attempts >= 3 ? "BLOCKED" : "INVESTIGATING",
        isTor: false, isVPN: false,
      };
      setAttacks(a => [atk, ...a.slice(0,19)]);
      setNewIdx(0);
      setTimeout(() => setNewIdx(null), 1200);
      setStats(s => ({ ...s, blocked: s.blocked+1, attempts: s.attempts+attempts }));
      return newC;
    });
  };

  return (
    <div style={{ background:C.void, minHeight:"100vh", fontFamily:"'Inter','Segoe UI',sans-serif", color:C.text }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1E2D45;border-radius:4px}
        @keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
      `}</style>

      {/* Header */}
      <div style={{ background:C.deep, borderBottom:`1px solid ${C.border}`, padding:"0 28px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <EyeLogo />
          <div>
            <div style={{ fontFamily:"monospace", fontWeight:800, fontSize:16, letterSpacing:3, color:C.accent }}>THE EYE</div>
            <div style={{ fontSize:9, color:C.muted, letterSpacing:2 }}>INTRUSION DETECTION & ACCESS CONTROL</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:C.danger, animation:"pulse 0.8s infinite" }}/>
            <span style={{ fontSize:11, color:C.danger, fontFamily:"monospace" }}>UNDER ATTACK · {stats.blocked} BLOCKED TODAY</span>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background:C.deep, borderBottom:`1px solid ${C.border}`, padding:"14px 28px", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
        {[
          { label:"Attacks Blocked", value:stats.blocked.toLocaleString(), color:C.safe },
          { label:"Total Attempts", value:stats.attempts.toLocaleString(), color:C.danger },
          { label:"Countries of Origin", value:stats.countries, color:C.warn },
          { label:"Today's Peak Hour", value:stats.todayPeak, color:C.iris },
        ].map(s => (
          <div key={s.label}>
            <div style={{ fontSize:10, color:C.muted, letterSpacing:1, textTransform:"uppercase" }}>{s.label}</div>
            <div style={{ fontSize:24, fontWeight:900, color:s.color, fontFamily:"monospace", marginTop:2 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ background:C.deep, borderBottom:`1px solid ${C.border}`, padding:"0 28px", display:"flex", gap:4 }}>
        {["attacks","simulate login","threat map"].map(t => (
          <button key={t} onClick={()=>setActiveTab(t)} style={{ background:"none", border:"none", borderBottom:activeTab===t?`2px solid ${C.accent}`:"2px solid transparent", padding:"13px 16px", color:activeTab===t?C.accent:C.muted, fontWeight:activeTab===t?700:400, fontSize:12, cursor:"pointer", textTransform:"uppercase", letterSpacing:1 }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ padding:28 }}>

        {/* ATTACKS TAB */}
        {activeTab === "attacks" && (
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
              <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:C.danger, animation:"pulse 0.8s infinite" }}/>
                  <span style={{ fontWeight:700, fontSize:13, letterSpacing:1 }}>LIVE INTRUSION ATTEMPTS</span>
                </div>
                <span style={{ fontSize:11, color:C.muted, fontFamily:"monospace" }}>{attacks.length} recorded</span>
              </div>
              <div>
                <div style={{ display:"grid", gridTemplateColumns:"110px 140px 120px 1fr 70px 90px", gap:10, padding:"10px 16px", borderBottom:`1px solid ${C.border}` }}>
                  {["Attack ID","IP Address","Origin","Attack Type","Tries","Status"].map(h => (
                    <span key={h} style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:1 }}>{h}</span>
                  ))}
                </div>
                {attacks.map((atk, i) => <AttackRow key={atk.id} atk={atk} isNew={i === newIdx}/>)}
              </div>
            </div>

            {/* Defence layers */}
            <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:12, padding:24 }}>
              <div style={{ fontWeight:700, fontSize:13, letterSpacing:1, marginBottom:16 }}>ACTIVE DEFENCE LAYERS</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
                {[
                  { icon:"🔒", label:"Account Lockout", desc:"Locks after 3 failed attempts", status:"ACTIVE" },
                  { icon:"📱", label:"MFA Enforcement", desc:"Required for all accounts", status:"ACTIVE" },
                  { icon:"🌍", label:"Geo-Blocking", desc:"High-risk countries blocked", status:"ACTIVE" },
                  { icon:"🕵️", label:"Tor/VPN Detection", desc:"Anonymous traffic flagged", status:"ACTIVE" },
                  { icon:"⚡", label:"Rate Limiting", desc:"Max 5 requests / minute", status:"ACTIVE" },
                  { icon:"🍯", label:"Honeypot Traps", desc:"Bot detection fields active", status:"ACTIVE" },
                  { icon:"🧬", label:"Device Fingerprint", desc:"Unknown devices blocked", status:"ACTIVE" },
                  { icon:"🤖", label:"AI Threat Scoring", desc:"Behaviour-based analysis", status:"ACTIVE" },
                ].map(d => (
                  <div key={d.label} style={{ background:C.surface, borderRadius:10, padding:"14px 16px", border:`1px solid ${C.safe}22` }}>
                    <div style={{ fontSize:20, marginBottom:6 }}>{d.icon}</div>
                    <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:3 }}>{d.label}</div>
                    <div style={{ fontSize:10, color:C.muted, marginBottom:8 }}>{d.desc}</div>
                    <span style={{ fontSize:9, fontWeight:800, color:C.safe, background:C.safe+"15", border:`1px solid ${C.safe}33`, borderRadius:3, padding:"2px 7px", letterSpacing:1 }}>{d.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SIMULATE LOGIN TAB */}
        {activeTab === "simulate login" && (
          <div style={{ display:"flex", gap:28, flexWrap:"wrap" }}>
            <div style={{ flex:"0 0 auto" }}>
              <div style={{ fontSize:12, color:C.muted, marginBottom:16, lineHeight:1.7, maxWidth:380 }}>
                This simulates The Eye's login portal. Try entering wrong passwords to trigger lockout, or use the correct credentials to see MFA in action. Every attempt is recorded in the live feed.
              </div>
              <LoginSimulator onAttack={handleManualAttack} />
            </div>
            <div style={{ flex:1, minWidth:300 }}>
              <div style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
                <div style={{ padding:"14px 18px", borderBottom:`1px solid ${C.border}` }}>
                  <span style={{ fontWeight:700, fontSize:12, letterSpacing:1 }}>YOUR ATTEMPTS — LIVE LOG</span>
                </div>
                {attacks.slice(0,12).map((atk, i) => (
                  <div key={atk.id} style={{ padding:"12px 16px", borderBottom:`1px solid ${C.border}`, display:"flex", gap:10, alignItems:"flex-start", animation:i===0?"fadeIn 0.4s ease":"none" }}>
                    <div style={{ width:32, height:32, borderRadius:"50%", background:atk.status==="BLOCKED"?C.danger+"22":C.warn+"22", border:`1px solid ${atk.status==="BLOCKED"?C.danger:C.warn}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, flexShrink:0 }}>
                      {atk.status==="BLOCKED"?"🚫":"⚠️"}
                    </div>
                    <div>
                      <div style={{ fontSize:11, color:C.text, fontWeight:600 }}>{atk.type}</div>
                      <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>IP: {atk.ip} · {atk.attempts} attempt{atk.attempts>1?"s":""} · {atk.time}</div>
                      <div style={{ fontSize:10, color:atk.status==="BLOCKED"?C.danger:C.warn, marginTop:2, fontWeight:700 }}>{atk.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* THREAT MAP TAB */}
        {activeTab === "threat map" && (
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <GeoMap attempts={attacks} />
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
              {[
                { country:"Russia", attacks:Math.floor(Math.random()*400)+200, flag:"🇷🇺" },
                { country:"China", attacks:Math.floor(Math.random()*300)+150, flag:"🇨🇳" },
                { country:"Nigeria", attacks:Math.floor(Math.random()*200)+80, flag:"🇳🇬" },
                { country:"Romania", attacks:Math.floor(Math.random()*150)+60, flag:"🇷🇴" },
                { country:"Iran", attacks:Math.floor(Math.random()*120)+50, flag:"🇮🇷" },
                { country:"Unknown/Tor", attacks:Math.floor(Math.random()*180)+90, flag:"🌐" },
              ].map(c => (
                <div key={c.country} style={{ background:C.panel, border:`1px solid ${C.border}`, borderRadius:10, padding:"16px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <span style={{ fontSize:22 }}>{c.flag}</span>
                    <span style={{ fontSize:13, fontWeight:600 }}>{c.country}</span>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:20, fontWeight:800, color:C.danger, fontFamily:"monospace" }}>{c.attacks}</div>
                    <div style={{ fontSize:10, color:C.muted }}>attempts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
