// Resume Templates — ATS-Friendly, Professional
// Azurill | Chikorita | Ditgar | Ditto | Gengar | Glalie | Kakuna
// Each template accepts the same `resume` prop schema

import { useState } from "react";

// ─── Shared data schema ───────────────────────────────────────────────────────
export const sampleResume = {
  name: "Sarah Martinez",
  title: "Human Resources Business Partner | Talent Development Specialist",
  photo: "https://i.pravatar.cc/150?img=47",
  contact: {
    email: "sarah.martinez@email.com",
    phone: "+1 (555) 739-4750",
    location: "Austin, TX",
    linkedin: "linkedin.com/in/sarahm",
    website: "sarahmartinez.com",
  },
  summary:
    "Passionate game developer with 5+ years of professional experience creating engaging gameplay systems and polished player experiences across multiple platforms. Specialized in Unity and Unreal Engine with strong expertise in C#, C++, and game design principles.",
  skills: [
    { name: "Unity Engine", level: 5 },
    { name: "Unreal Engine", level: 4 },
    { name: "C# / C++", level: 5 },
    { name: "Game AI", level: 4 },
    { name: "3D Modeling", level: 3 },
  ],
  languages: [
    { name: "C#", level: 5 },
    { name: "C++", level: 4 },
    { name: "Python", level: 3 },
  ],
  education: [
    {
      degree: "Bachelor of Science — CS, GPA 3.8",
      school: "University of Washington",
      date: "2014 — 2018",
    },
  ],
  certifications: [
    "Unity Certified Expert Programmer — 2021",
    "Unreal Engine 5 Developer — 2022",
    "AWS Certified Developer — 2023",
  ],
  awards: [
    { title: "Employee Excellence Award", org: "Cascade Studios", date: "April 2023" },
    { title: "Best Gameplay Engineer", org: "GDC Awards", date: "2022" },
  ],
  experience: [
    {
      role: "Lead Game Developer",
      company: "Cascade Studios",
      location: "Seattle, WA",
      period: "March 2021 — Present",
      bullets: [
        "Architected core combat system resulting in 40% improvement in player engagement metrics.",
        "Developed custom editor tools in C++ reducing designer iteration time by 60%.",
        "Implemented procedural generation systems for level layouts and loot drops using Unity.",
        "Led cross-functional team of 8 engineers delivering 3 major game updates on schedule.",
      ],
    },
    {
      role: "Mid-Level Game Developer",
      company: "PostFrag Interactive",
      location: "Bellevue, WA",
      period: "June 2020 — February 2022",
      bullets: [
        "Core developer on Shattered Odyssey achieving 50,000+ sales in first month.",
        "Implemented procedural generation system for level layouts and enemy encounters.",
        "Created robust save/load system supporting cloud saves and cross-platform play.",
      ],
    },
    {
      role: "Junior Game Developer",
      company: "IndieSpark Games",
      location: "Seattle, WA",
      period: "Jan 2019 — May 2020",
      bullets: [
        "Built core gameplay loop for a mobile puzzle game reaching 200k+ downloads.",
        "Optimized application performance improving load times by 35% on low-end devices.",
      ],
    },
  ],
  spokenLanguages: [
    { name: "English", level: "Native" },
    { name: "Spanish", level: "Conversational" },
  ],
};

// ─── Shared helpers ───────────────────────────────────────────────────────────
function Dots({ level, max = 5, fill = "#6366f1", empty = "#e5e7eb" }) {
  return (
    <span style={{ display: "inline-flex", gap: 3, alignItems: "center" }}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: "50%",
          background: i < level ? fill : empty,
          display: "inline-block",
        }} />
      ))}
    </span>
  );
}

function Bullet({ children, color = "#6366f1" }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 5, alignItems: "flex-start" }}>
      <span style={{
        width: 5, height: 5, borderRadius: "50%", background: color,
        flexShrink: 0, marginTop: 6,
      }} />
      <span style={{ fontSize: 11, color: "#374151", lineHeight: 1.6 }}>{children}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. AZURILL — Clean left sidebar, blue accent, minimal dot skills
// ═══════════════════════════════════════════════════════════════════════════════
export function Azurill({ resume = sampleResume }) {
  const r = resume;
  const accent = "#2563eb";
  const sidebarBg = "#1e3a5f";

  return (
    <div style={{ width: 794, minHeight: 1123, background: "#fff", display: "flex", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* SIDEBAR */}
      <div style={{ width: 200, background: sidebarBg, padding: "28px 16px", flexShrink: 0 }}>
        {r.photo && (
          <img src={r.photo} alt={r.name} style={{
            width: 80, height: 80, borderRadius: "50%",
            border: "3px solid rgba(255,255,255,0.3)", objectFit: "cover",
            display: "block", margin: "0 auto 14px",
          }} />
        )}
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 3 }}>{r.name}</div>
        <div style={{ fontSize: 9.5, color: "#93c5fd", textAlign: "center", marginBottom: 16, lineHeight: 1.4 }}>{r.title}</div>

        {[["✉", r.contact.email], ["☎", r.contact.phone], ["📍", r.contact.location], ["in", r.contact.linkedin]].map(([ic, val], i) => val && (
          <div key={i} style={{ display: "flex", gap: 5, marginBottom: 5, alignItems: "flex-start" }}>
            <span style={{ fontSize: 9, color: "#60a5fa", flexShrink: 0, marginTop: 1 }}>{ic}</span>
            <span style={{ fontSize: 9, color: "#bfdbfe", lineHeight: 1.4, wordBreak: "break-all" }}>{val}</span>
          </div>
        ))}

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", margin: "14px 0 10px", paddingTop: 10 }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#60a5fa", marginBottom: 8 }}>Skills</div>
          {r.skills.map((s, i) => (
            <div key={i} style={{ marginBottom: 7 }}>
              <div style={{ fontSize: 9.5, color: "#e2e8f0", marginBottom: 3 }}>{s.name}</div>
              <Dots level={s.level} fill="#3b82f6" empty="#1e3a5f" />
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", margin: "10px 0", paddingTop: 10 }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#60a5fa", marginBottom: 8 }}>Education</div>
          {r.education.map((e, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 9.5, fontWeight: 600, color: "#f1f5f9" }}>{e.degree}</div>
              <div style={{ fontSize: 9, color: "#93c5fd", marginTop: 2 }}>{e.school}</div>
              <div style={{ fontSize: 9, color: "#64748b" }}>{e.date}</div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", margin: "10px 0", paddingTop: 10 }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#60a5fa", marginBottom: 8 }}>Certifications</div>
          {r.certifications.map((c, i) => (
            <div key={i} style={{ fontSize: 9, color: "#cbd5e1", marginBottom: 5, lineHeight: 1.45, paddingLeft: 7, borderLeft: "2px solid #3b82f6" }}>{c}</div>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, padding: "28px 26px" }}>
        <div style={{ borderBottom: `2px solid ${accent}`, paddingBottom: 6, marginBottom: 16 }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: accent }}>Professional Summary</div>
        </div>
        <p style={{ fontSize: 11, color: "#4b5563", lineHeight: 1.7, marginBottom: 20 }}>{r.summary}</p>

        <div style={{ borderBottom: `2px solid ${accent}`, paddingBottom: 5, marginBottom: 14 }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: accent }}>Professional Experience</div>
        </div>
        {r.experience.map((exp, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{exp.role}</div>
              <div style={{ fontSize: 9.5, color: "#6b7280", background: "#f3f4f6", padding: "2px 8px", borderRadius: 4 }}>{exp.period}</div>
            </div>
            <div style={{ fontSize: 10.5, color: accent, fontWeight: 600, marginBottom: 6 }}>{exp.company} <span style={{ color: "#9ca3af", fontWeight: 400 }}>· {exp.location}</span></div>
            {exp.bullets.map((b, j) => <Bullet key={j} color={accent}>{b}</Bullet>)}
          </div>
        ))}

        <div style={{ borderBottom: `2px solid ${accent}`, paddingBottom: 5, marginBottom: 12 }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: accent }}>Awards &amp; Recognition</div>
        </div>
        {r.awards.map((a, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#111827" }}>{a.title} <span style={{ fontWeight: 400, color: "#6b7280" }}>— {a.org}</span></div>
            <div style={{ fontSize: 10, color: "#9ca3af" }}>{a.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. CHIKORITA — Three-column, photo top-right, green accent
// ═══════════════════════════════════════════════════════════════════════════════
export function Chikorita({ resume = sampleResume }) {
  const r = resume;
  const accent = "#059669";

  return (
    <div style={{ width: 794, minHeight: 1123, background: "#fff", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", padding: "22px 28px 18px", borderBottom: `3px solid ${accent}`, gap: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#111827", letterSpacing: "-.02em" }}>{r.name}</div>
          <div style={{ fontSize: 11.5, color: accent, fontWeight: 600, margin: "3px 0 10px" }}>{r.title}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
            {[["✉", r.contact.email], ["☎", r.contact.phone], ["📍", r.contact.location], ["in", r.contact.linkedin]].map(([ic, v], i) => v && (
              <span key={i} style={{ fontSize: 9.5, color: "#6b7280", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: accent }}>{ic}</span>{v}
              </span>
            ))}
          </div>
        </div>
        {r.photo && (
          <img src={r.photo} alt={r.name} style={{
            width: 74, height: 74, borderRadius: "50%",
            border: `3px solid ${accent}`, objectFit: "cover", flexShrink: 0,
          }} />
        )}
      </div>

      {/* Body: left col + right col */}
      <div style={{ display: "flex" }}>
        {/* Left narrow */}
        <div style={{ width: 195, padding: "18px 16px", borderRight: "1px solid #e5e7eb", flexShrink: 0 }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, marginBottom: 8 }}>Skills</div>
          {r.skills.map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
              <span style={{ fontSize: 10, color: "#374151" }}>{s.name}</span>
              <Dots level={s.level} fill={accent} empty="#d1fae5" />
            </div>
          ))}

          <div style={{ borderTop: "1px solid #e5e7eb", margin: "14px 0 10px", paddingTop: 10 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, marginBottom: 8 }}>Education</div>
            {r.education.map((e, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#111827" }}>{e.degree}</div>
                <div style={{ fontSize: 9.5, color: accent }}>{e.school}</div>
                <div style={{ fontSize: 9.5, color: "#9ca3af" }}>{e.date}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #e5e7eb", margin: "10px 0", paddingTop: 10 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, marginBottom: 8 }}>Certifications</div>
            {r.certifications.map((c, i) => (
              <div key={i} style={{ fontSize: 9.5, color: "#4b5563", marginBottom: 5, lineHeight: 1.5 }}>• {c}</div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #e5e7eb", margin: "10px 0", paddingTop: 10 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, marginBottom: 8 }}>Languages</div>
            {r.spokenLanguages?.map((l, i) => (
              <div key={i} style={{ fontSize: 9.5, color: "#374151", marginBottom: 5 }}>{l.name} <span style={{ color: "#9ca3af" }}>— {l.level}</span></div>
            ))}
          </div>
        </div>

        {/* Right main */}
        <div style={{ flex: 1, padding: "18px 22px" }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, borderBottom: `1.5px solid #d1fae5`, paddingBottom: 4, marginBottom: 10 }}>Professional Summary</div>
          <p style={{ fontSize: 11, color: "#4b5563", lineHeight: 1.7, marginBottom: 16 }}>{r.summary}</p>

          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, borderBottom: `1.5px solid #d1fae5`, paddingBottom: 4, marginBottom: 12 }}>Professional Experience</div>
          {r.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{exp.role}</div>
                <div style={{ fontSize: 9.5, color: "#6b7280" }}>{exp.period}</div>
              </div>
              <div style={{ fontSize: 10.5, color: accent, fontWeight: 600, marginBottom: 5 }}>{exp.company} <span style={{ color: "#9ca3af", fontWeight: 400 }}>· {exp.location}</span></div>
              {exp.bullets.map((b, j) => <Bullet key={j} color={accent}>{b}</Bullet>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. DITGAR — Blue header band, right photo, two-column body
// ═══════════════════════════════════════════════════════════════════════════════
export function Ditgar({ resume = sampleResume }) {
  const r = resume;
  const accent = "#1d4ed8";
  const headerBg = "#1e3a8a";

  return (
    <div style={{ width: 794, minHeight: 1123, background: "#fff", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: headerBg, padding: "22px 28px 18px", display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: "#fff", letterSpacing: "-.02em" }}>{r.name}</div>
          <div style={{ fontSize: 11, color: "#93c5fd", fontWeight: 500, margin: "3px 0 10px" }}>{r.title}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 18px" }}>
            {[["✉", r.contact.email], ["☎", r.contact.phone], ["📍", r.contact.location], ["in", r.contact.linkedin]].map(([ic, v], i) => v && (
              <span key={i} style={{ fontSize: 9.5, color: "#bfdbfe", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ opacity: .7 }}>{ic}</span>{v}
              </span>
            ))}
          </div>
        </div>
        {r.photo && (
          <img src={r.photo} alt={r.name} style={{
            width: 80, height: 80, borderRadius: "50%",
            border: "3px solid rgba(255,255,255,.4)", objectFit: "cover", flexShrink: 0,
          }} />
        )}
      </div>

      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <div style={{ width: 205, background: "#eff6ff", padding: "18px 16px", borderRight: "1px solid #dbeafe", flexShrink: 0 }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, marginBottom: 8 }}>Technical Skills</div>
          {r.skills.map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
              <span style={{ fontSize: 10, color: "#1e3a8a" }}>{s.name}</span>
              <Dots level={s.level} fill={accent} empty="#bfdbfe" />
            </div>
          ))}

          <div style={{ borderTop: "1px solid #bfdbfe", margin: "12px 0 10px", paddingTop: 10 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, marginBottom: 8 }}>Education</div>
            {r.education.map((e, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#1e3a8a" }}>{e.degree}</div>
                <div style={{ fontSize: 9.5, color: "#3b82f6" }}>{e.school}</div>
                <div style={{ fontSize: 9.5, color: "#64748b" }}>{e.date}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #bfdbfe", margin: "10px 0", paddingTop: 10 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, marginBottom: 8 }}>Certifications</div>
            {r.certifications.map((c, i) => (
              <div key={i} style={{ fontSize: 9.5, color: "#1e40af", marginBottom: 6, lineHeight: 1.45, paddingLeft: 7, borderLeft: `2px solid ${accent}` }}>{c}</div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #bfdbfe", margin: "10px 0", paddingTop: 10 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, marginBottom: 8 }}>Awards</div>
            {r.awards.map((a, i) => (
              <div key={i} style={{ marginBottom: 7 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#1e3a8a" }}>{a.title}</div>
                <div style={{ fontSize: 9.5, color: "#64748b" }}>{a.org} · {a.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: "18px 22px" }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, borderBottom: `2px solid #dbeafe`, paddingBottom: 4, marginBottom: 10 }}>Professional Summary</div>
          <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.7, marginBottom: 16 }}>{r.summary}</p>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, borderBottom: `2px solid #dbeafe`, paddingBottom: 4, marginBottom: 12 }}>Experience</div>
          {r.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{exp.role}</div>
                <div style={{ fontSize: 9.5, color: "#6b7280", background: "#eff6ff", padding: "2px 7px", borderRadius: 4 }}>{exp.period}</div>
              </div>
              <div style={{ fontSize: 10.5, color: accent, fontWeight: 600, marginBottom: 5 }}>{exp.company} <span style={{ color: "#9ca3af", fontWeight: 400 }}>· {exp.location}</span></div>
              {exp.bullets.map((b, j) => <Bullet key={j} color={accent}>{b}</Bullet>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. DITTO — Hot pink accent, photo top-left, modern bold headers
// ═══════════════════════════════════════════════════════════════════════════════
export function Ditto({ resume = sampleResume }) {
  const r = resume;
  const accent = "#db2777";

  return (
    <div style={{ width: 794, minHeight: 1123, background: "#fff", fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex" }}>
      {/* Pink sidebar */}
      <div style={{ width: 200, background: "#1f172a", padding: "22px 15px", flexShrink: 0 }}>
        {r.photo && (
          <img src={r.photo} alt={r.name} style={{
            width: 82, height: 82, borderRadius: 8,
            border: `3px solid ${accent}`, objectFit: "cover",
            display: "block", margin: "0 auto 14px",
          }} />
        )}
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 3 }}>{r.name}</div>
        <div style={{ fontSize: 9.5, color: "#f9a8d4", textAlign: "center", marginBottom: 14, lineHeight: 1.4 }}>{r.title}</div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 12 }}>
          {[["✉", r.contact.email], ["☎", r.contact.phone], ["📍", r.contact.location], ["in", r.contact.linkedin]].map(([ic, v], i) => v && (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "flex-start" }}>
              <span style={{ fontSize: 9, color: accent, flexShrink: 0 }}>{ic}</span>
              <span style={{ fontSize: 9, color: "#e9d5ff", lineHeight: 1.4, wordBreak: "break-all" }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", margin: "12px 0 10px", paddingTop: 10 }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, marginBottom: 8 }}>Skills</div>
          {r.skills.map((s, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 9.5, color: "#e2e8f0" }}>{s.name}</span>
              </div>
              <div style={{ height: 3, background: "#3b2040", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${(s.level / 5) * 100}%`, background: accent, borderRadius: 2 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", margin: "10px 0", paddingTop: 10 }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, marginBottom: 8 }}>Education</div>
          {r.education.map((e, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 9.5, fontWeight: 600, color: "#f1f5f9" }}>{e.degree}</div>
              <div style={{ fontSize: 9, color: "#f9a8d4" }}>{e.school}</div>
              <div style={{ fontSize: 9, color: "#64748b" }}>{e.date}</div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", margin: "10px 0", paddingTop: 10 }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, marginBottom: 8 }}>Languages</div>
          {r.spokenLanguages?.map((l, i) => (
            <div key={i} style={{ fontSize: 9.5, color: "#e2e8f0", marginBottom: 5 }}>{l.name} <span style={{ color: "#94a3b8" }}>— {l.level}</span></div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "22px 24px" }}>
        <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, borderBottom: `2px solid #fce7f3`, paddingBottom: 4, marginBottom: 10 }}>Professional Summary</div>
        <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.7, marginBottom: 16 }}>{r.summary}</p>

        <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, borderBottom: `2px solid #fce7f3`, paddingBottom: 4, marginBottom: 12 }}>Professional Experience</div>
        {r.experience.map((exp, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{exp.role}</div>
              <div style={{ fontSize: 9.5, color: "#6b7280", background: "#fdf2f8", padding: "2px 7px", borderRadius: 4 }}>{exp.period}</div>
            </div>
            <div style={{ fontSize: 10.5, color: accent, fontWeight: 600, marginBottom: 5 }}>{exp.company} <span style={{ color: "#9ca3af", fontWeight: 400 }}>· {exp.location}</span></div>
            {exp.bullets.map((b, j) => <Bullet key={j} color={accent}>{b}</Bullet>)}
          </div>
        ))}

        <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, borderBottom: `2px solid #fce7f3`, paddingBottom: 4, marginBottom: 10 }}>Certifications</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {r.certifications.map((c, i) => (
            <span key={i} style={{ fontSize: 9.5, background: "#fdf2f8", border: `1px solid #fbcfe8`, color: "#9d174d", padding: "3px 10px", borderRadius: 4 }}>{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. GENGAR — Purple dark sidebar, photo circle, bold typeface
// ═══════════════════════════════════════════════════════════════════════════════
export function Gengar({ resume = sampleResume }) {
  const r = resume;
  const accent = "#7c3aed";

  return (
    <div style={{ width: 794, minHeight: 1123, background: "#fff", fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex" }}>
      {/* Purple sidebar */}
      <div style={{ width: 215, background: "#1e1b4b", padding: "24px 16px", flexShrink: 0 }}>
        {r.photo && (
          <img src={r.photo} alt={r.name} style={{
            width: 84, height: 84, borderRadius: "50%",
            border: "3px solid #7c3aed", objectFit: "cover",
            display: "block", margin: "0 auto 12px",
          }} />
        )}
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", textAlign: "center", marginBottom: 3 }}>{r.name}</div>
        <div style={{ fontSize: 9.5, color: "#c4b5fd", textAlign: "center", marginBottom: 16, lineHeight: 1.4 }}>{r.title}</div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,.12)", paddingTop: 12 }}>
          {[["✉", r.contact.email], ["☎", r.contact.phone], ["📍", r.contact.location], ["in", r.contact.linkedin]].map(([ic, v], i) => v && (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "flex-start" }}>
              <span style={{ fontSize: 9, color: "#a78bfa", flexShrink: 0 }}>{ic}</span>
              <span style={{ fontSize: 9, color: "#ddd6fe", lineHeight: 1.4, wordBreak: "break-all" }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,.12)", margin: "12px 0 10px", paddingTop: 10 }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#a78bfa", marginBottom: 8 }}>Technical Skills</div>
          {r.skills.map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
              <span style={{ fontSize: 9.5, color: "#e2e8f0" }}>{s.name}</span>
              <Dots level={s.level} fill="#8b5cf6" empty="#312e81" />
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,.12)", margin: "10px 0", paddingTop: 10 }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#a78bfa", marginBottom: 8 }}>Education</div>
          {r.education.map((e, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 9.5, fontWeight: 600, color: "#f1f5f9" }}>{e.degree}</div>
              <div style={{ fontSize: 9, color: "#c4b5fd" }}>{e.school}</div>
              <div style={{ fontSize: 9, color: "#64748b" }}>{e.date}</div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,.12)", margin: "10px 0", paddingTop: 10 }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "#a78bfa", marginBottom: 8 }}>Certifications</div>
          {r.certifications.map((c, i) => (
            <div key={i} style={{ fontSize: 9, color: "#c4b5fd", marginBottom: 5, lineHeight: 1.45, paddingLeft: 7, borderLeft: "2px solid #7c3aed" }}>{c}</div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "24px 24px" }}>
        <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, borderBottom: `2px solid #ede9fe`, paddingBottom: 4, marginBottom: 10 }}>Professional Summary</div>
        <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.7, marginBottom: 16 }}>{r.summary}</p>

        <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, borderBottom: `2px solid #ede9fe`, paddingBottom: 4, marginBottom: 12 }}>Professional Experience</div>
        {r.experience.map((exp, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{exp.role}</div>
              <div style={{ fontSize: 9.5, color: "#6b7280", background: "#f5f3ff", padding: "2px 7px", borderRadius: 4 }}>{exp.period}</div>
            </div>
            <div style={{ fontSize: 10.5, color: accent, fontWeight: 600, marginBottom: 5 }}>{exp.company} <span style={{ color: "#9ca3af", fontWeight: 400 }}>· {exp.location}</span></div>
            {exp.bullets.map((b, j) => <Bullet key={j} color={accent}>{b}</Bullet>)}
          </div>
        ))}

        <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, borderBottom: `2px solid #ede9fe`, paddingBottom: 4, marginBottom: 10 }}>Awards</div>
        {r.awards.map((a, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#111827" }}>{a.title} <span style={{ fontWeight: 400, color: "#6b7280" }}>— {a.org}</span></div>
            <div style={{ fontSize: 10, color: "#9ca3af" }}>{a.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. GLALIE — Minimal, clean, single column with ruled sections
// ═══════════════════════════════════════════════════════════════════════════════
export function Glalie({ resume = sampleResume }) {
  const r = resume;
  const accent = "#0891b2";

  return (
    <div style={{ width: 794, minHeight: 1123, background: "#fff", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Thin top band */}
      <div style={{ height: 5, background: accent }} />

      {/* Header */}
      <div style={{ padding: "26px 36px 20px", display: "flex", alignItems: "center", gap: 20, borderBottom: "1.5px solid #e5e7eb" }}>
        {r.photo && (
          <img src={r.photo} alt={r.name} style={{
            width: 76, height: 76, borderRadius: "50%",
            border: `2.5px solid ${accent}`, objectFit: "cover", flexShrink: 0,
          }} />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#111827", letterSpacing: "-.02em" }}>{r.name}</div>
          <div style={{ fontSize: 11.5, color: accent, fontWeight: 600, margin: "4px 0 10px" }}>{r.title}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 20px" }}>
            {[["✉", r.contact.email], ["☎", r.contact.phone], ["📍", r.contact.location], ["in", r.contact.linkedin]].map(([ic, v], i) => v && (
              <span key={i} style={{ fontSize: 10, color: "#6b7280", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: accent }}>{ic}</span>{v}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Two-column body */}
      <div style={{ display: "flex" }}>
        {/* Narrow left */}
        <div style={{ width: 210, padding: "18px 16px 18px 28px", borderRight: "1.5px solid #e5e7eb", flexShrink: 0 }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, marginBottom: 9 }}>Skills</div>
          {r.skills.map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
              <span style={{ fontSize: 10, color: "#374151" }}>{s.name}</span>
              <Dots level={s.level} fill={accent} empty="#cffafe" />
            </div>
          ))}

          <div style={{ margin: "14px 0 10px", borderTop: "1px solid #e5e7eb", paddingTop: 10 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, marginBottom: 8 }}>Education</div>
            {r.education.map((e, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#111827" }}>{e.degree}</div>
                <div style={{ fontSize: 9.5, color: accent }}>{e.school}</div>
                <div style={{ fontSize: 9.5, color: "#9ca3af" }}>{e.date}</div>
              </div>
            ))}
          </div>

          <div style={{ margin: "10px 0", borderTop: "1px solid #e5e7eb", paddingTop: 10 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, marginBottom: 8 }}>Certifications</div>
            {r.certifications.map((c, i) => (
              <div key={i} style={{ fontSize: 9.5, color: "#374151", marginBottom: 5, lineHeight: 1.5 }}>• {c}</div>
            ))}
          </div>

          <div style={{ margin: "10px 0", borderTop: "1px solid #e5e7eb", paddingTop: 10 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, marginBottom: 8 }}>Awards</div>
            {r.awards.map((a, i) => (
              <div key={i} style={{ marginBottom: 7 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#111827" }}>{a.title}</div>
                <div style={{ fontSize: 9.5, color: "#64748b" }}>{a.org} · {a.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main right */}
        <div style={{ flex: 1, padding: "18px 28px" }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, borderBottom: `2px solid #cffafe`, paddingBottom: 4, marginBottom: 10 }}>Professional Summary</div>
          <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.7, marginBottom: 16 }}>{r.summary}</p>

          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, borderBottom: `2px solid #cffafe`, paddingBottom: 4, marginBottom: 12 }}>Professional Experience</div>
          {r.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{exp.role}</div>
                <div style={{ fontSize: 9.5, color: "#6b7280" }}>{exp.period}</div>
              </div>
              <div style={{ fontSize: 10.5, color: accent, fontWeight: 600, marginBottom: 5 }}>{exp.company} <span style={{ color: "#9ca3af", fontWeight: 400 }}>· {exp.location}</span></div>
              {exp.bullets.map((b, j) => <Bullet key={j} color={accent}>{b}</Bullet>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. KAKUNA — Warm beige/cream, photo right header, elegant serif feel
// ═══════════════════════════════════════════════════════════════════════════════
export function Kakuna({ resume = sampleResume }) {
  const r = resume;
  const accent = "#92400e";
  const headerBg = "#fffbeb";

  return (
    <div style={{ width: 794, minHeight: 1123, background: "#fff", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Amber top bar */}
      <div style={{ height: 6, background: "linear-gradient(90deg, #d97706, #f59e0b, #d97706)" }} />

      {/* Header */}
      <div style={{ background: headerBg, padding: "22px 32px 18px", display: "flex", alignItems: "center", gap: 20, borderBottom: "1px solid #fde68a" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#78350f", letterSpacing: "-.02em" }}>{r.name}</div>
          <div style={{ fontSize: 11.5, color: "#b45309", fontWeight: 600, margin: "3px 0 10px" }}>{r.title}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
            {[["✉", r.contact.email], ["☎", r.contact.phone], ["📍", r.contact.location], ["in", r.contact.linkedin]].map(([ic, v], i) => v && (
              <span key={i} style={{ fontSize: 9.5, color: "#92400e", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ opacity: .7 }}>{ic}</span>{v}
              </span>
            ))}
          </div>
        </div>
        {r.photo && (
          <img src={r.photo} alt={r.name} style={{
            width: 76, height: 76, borderRadius: 8,
            border: "3px solid #fcd34d", objectFit: "cover", flexShrink: 0,
          }} />
        )}
      </div>

      {/* Body */}
      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <div style={{ width: 200, background: "#fffbeb", padding: "18px 16px", borderRight: "1px solid #fde68a", flexShrink: 0 }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, marginBottom: 8 }}>Core Skills</div>
          {r.skills.map((s, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 9.5, color: "#78350f" }}>{s.name}</span>
              </div>
              <div style={{ height: 3, background: "#fde68a", borderRadius: 2 }}>
                <div style={{ height: "100%", width: `${(s.level / 5) * 100}%`, background: "#d97706", borderRadius: 2 }} />
              </div>
            </div>
          ))}

          <div style={{ borderTop: "1px solid #fde68a", margin: "12px 0 10px", paddingTop: 10 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, marginBottom: 8 }}>Education</div>
            {r.education.map((e, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#78350f" }}>{e.degree}</div>
                <div style={{ fontSize: 9.5, color: "#b45309" }}>{e.school}</div>
                <div style={{ fontSize: 9.5, color: "#9ca3af" }}>{e.date}</div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #fde68a", margin: "10px 0", paddingTop: 10 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, marginBottom: 8 }}>Certifications</div>
            {r.certifications.map((c, i) => (
              <div key={i} style={{ fontSize: 9.5, color: "#78350f", marginBottom: 5, lineHeight: 1.5, paddingLeft: 7, borderLeft: `2px solid #d97706` }}>{c}</div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #fde68a", margin: "10px 0", paddingTop: 10 }}>
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, marginBottom: 8 }}>Languages</div>
            {r.spokenLanguages?.map((l, i) => (
              <div key={i} style={{ fontSize: 9.5, color: "#78350f", marginBottom: 5 }}>{l.name} <span style={{ color: "#9ca3af" }}>— {l.level}</span></div>
            ))}
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: "18px 26px" }}>
          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, borderBottom: `2px solid #fde68a`, paddingBottom: 4, marginBottom: 10 }}>Professional Summary</div>
          <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.7, marginBottom: 16 }}>{r.summary}</p>

          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, borderBottom: `2px solid #fde68a`, paddingBottom: 4, marginBottom: 12 }}>Professional Experience</div>
          {r.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{exp.role}</div>
                <div style={{ fontSize: 9.5, color: "#6b7280", background: "#fffbeb", border: "1px solid #fde68a", padding: "2px 7px", borderRadius: 4 }}>{exp.period}</div>
              </div>
              <div style={{ fontSize: 10.5, color: "#b45309", fontWeight: 600, marginBottom: 5 }}>{exp.company} <span style={{ color: "#9ca3af", fontWeight: 400 }}>· {exp.location}</span></div>
              {exp.bullets.map((b, j) => <Bullet key={j} color="#d97706">{b}</Bullet>)}
            </div>
          ))}

          <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: accent, borderBottom: `2px solid #fde68a`, paddingBottom: 4, marginBottom: 10 }}>Awards &amp; Recognition</div>
          {r.awards.map((a, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "#78350f" }}>{a.title} <span style={{ fontWeight: 400, color: "#6b7280" }}>— {a.org}</span></div>
              <div style={{ fontSize: 10, color: "#9ca3af" }}>{a.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Template Gallery Picker (for your website's template selection page)
// ═══════════════════════════════════════════════════════════════════════════════
const templates = [
  { id: "azurill",  label: "Azurill",  component: Azurill,  accent: "#2563eb" },
  { id: "chikorita",label: "Chikorita",component: Chikorita,accent: "#059669" },
  { id: "ditgar",   label: "Ditgar",   component: Ditgar,   accent: "#1d4ed8" },
  { id: "ditto",    label: "Ditto",    component: Ditto,    accent: "#db2777" },
  { id: "gengar",   label: "Gengar",   component: Gengar,   accent: "#7c3aed" },
  { id: "glalie",   label: "Glalie",   component: Glalie,   accent: "#0891b2" },
  { id: "kakuna",   label: "Kakuna",   component: Kakuna,   accent: "#d97706" },
];

export default function TemplateGallery() {
  const [active, setActive] = useState("azurill");
  const current = templates.find(t => t.id === active);
  const Component = current.component;

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      {/* Top nav */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "12px 24px", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginRight: 8, letterSpacing: ".05em", textTransform: "uppercase" }}>Template:</span>
        {templates.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)} style={{
            padding: "5px 14px", borderRadius: 20, border: "1.5px solid",
            borderColor: active === t.id ? t.accent : "#e5e7eb",
            background: active === t.id ? t.accent : "#fff",
            color: active === t.id ? "#fff" : "#374151",
            fontSize: 11.5, fontWeight: 600, cursor: "pointer",
            transition: "all .15s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* Preview */}
      <div style={{ display: "flex", justifyContent: "center", padding: "24px 16px", background: "#e2e8f0" }}>
        <div style={{ transform: "scale(0.72)", transformOrigin: "top center", marginBottom: `${(0.72 - 1) * 1123}px` }}>
          <Component resume={sampleResume} />
        </div>
      </div>
    </div>
  );
}
