import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Billsy — Free Invoice Generator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          background: "#0a0a0f",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Background accents ── */}
        {/* Large indigo glow — top left */}
        <div style={{
          position: "absolute", top: -180, left: -80,
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.28) 0%, rgba(99,102,241,0) 65%)",
        }} />
        {/* Purple glow — bottom right */}
        <div style={{
          position: "absolute", bottom: -150, right: 80,
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(139,92,246,0.22) 0%, rgba(139,92,246,0) 65%)",
        }} />
        {/* Subtle top accent line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: "linear-gradient(90deg, #6366f1, #a78bfa, #6366f1)",
        }} />

        {/* ── LEFT — branding & copy ── */}
        <div style={{
          display: "flex", flexDirection: "column",
          justifyContent: "center",
          padding: "56px 52px 56px 60px",
          width: 596,
          position: "relative",
        }}>

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 36 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: "linear-gradient(140deg, #6366f1 0%, #4338ca 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginRight: 12,
              boxShadow: "0 0 0 1px rgba(99,102,241,0.4), 0 8px 20px rgba(99,102,241,0.35)",
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="2" width="12" height="18" rx="2" fill="white" />
                <path d="M16 2l4 4h-4V2z" fill="rgba(255,255,255,0.5)" />
                <rect x="7" y="7"  width="5"  height="1.5" rx="0.75" fill="#6366f1" />
                <rect x="7" y="10" width="7"  height="1.5" rx="0.75" fill="#a5b4fc" />
                <rect x="7" y="13" width="5.5" height="1.5" rx="0.75" fill="#a5b4fc" />
                <rect x="7" y="16" width="7"  height="1.5" rx="0.75" fill="#6366f1" />
              </svg>
            </div>
            <span style={{ fontSize: 30, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
              Billsy
            </span>
            {/* Free badge */}
            <div style={{
              marginLeft: 12,
              padding: "3px 10px",
              borderRadius: 99,
              background: "rgba(99,102,241,0.2)",
              border: "1px solid rgba(99,102,241,0.5)",
              display: "flex", alignItems: "center",
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#a5b4fc", letterSpacing: "0.05em" }}>
                FREE
              </span>
            </div>
          </div>

          {/* Headline */}
          <div style={{
            display: "flex", flexDirection: "column",
            marginBottom: 20,
          }}>
            <span style={{
              fontSize: 62, fontWeight: 900, color: "#ffffff",
              lineHeight: 1.0, letterSpacing: "-2.5px",
            }}>
              Invoice in
            </span>
            <span style={{
              fontSize: 62, fontWeight: 900,
              color: "#818cf8",
              lineHeight: 1.0, letterSpacing: "-2.5px",
            }}>
              30 seconds.
            </span>
          </div>

          {/* Sub-copy */}
          <div style={{
            display: "flex", flexDirection: "column", gap: 4,
            marginBottom: 40,
          }}>
            <span style={{ fontSize: 19, color: "#94a3b8", lineHeight: 1.5 }}>
              Professional invoices with PDF export,
            </span>
            <span style={{ fontSize: 19, color: "#94a3b8", lineHeight: 1.5 }}>
              payment details &amp; 3 templates.
            </span>
            <span style={{ fontSize: 19, color: "#64748b", lineHeight: 1.5, marginTop: 2 }}>
              No sign-up. Works in your browser.
            </span>
          </div>

          {/* Feature pills row */}
          <div style={{ display: "flex", gap: 8, marginBottom: 44 }}>
            {["PDF Export", "Templates", "Payments", "Auto-Save"].map((label) => (
              <div key={label} style={{
                padding: "6px 13px", borderRadius: 99,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
                display: "flex", alignItems: "center",
              }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Domain */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "#22c55e", marginRight: 7,
            }} />
            <span style={{ fontSize: 14, color: "#475569", fontWeight: 500 }}>
              billsy-invoice.vercel.app
            </span>
          </div>
        </div>

        {/* ── RIGHT — invoice mockup ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          flex: 1, paddingRight: 52, position: "relative",
        }}>
          {/* Outer glow around card */}
          <div style={{
            position: "absolute",
            width: 380, height: 500,
            borderRadius: 24,
            background: "rgba(99,102,241,0.08)",
            boxShadow: "0 0 80px 20px rgba(99,102,241,0.15)",
          }} />

          {/* Invoice card */}
          <div style={{
            width: 345, borderRadius: 18,
            overflow: "hidden",
            boxShadow: "0 30px 70px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
            background: "#ffffff",
            display: "flex", flexDirection: "column",
            position: "relative",
          }}>
            {/* Card top accent */}
            <div style={{
              height: 3,
              background: "linear-gradient(90deg, #6366f1, #a78bfa)",
            }} />

            {/* Invoice header */}
            <div style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
              padding: "18px 22px",
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: "-0.3px" }}>
                  Acme Studio
                </span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", marginTop: 3 }}>
                  hello@acme.io
                </span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginTop: 1 }}>
                  Lagos, Nigeria
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <span style={{
                  fontSize: 22, fontWeight: 900, color: "#fff",
                  letterSpacing: "-0.5px",
                }}>INVOICE</span>
                <span style={{
                  fontSize: 11, color: "rgba(255,255,255,0.85)",
                  fontWeight: 600, marginTop: 2,
                }}>INV-042</span>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.55)", marginTop: 5 }}>
                  Issued Apr 1, 2026
                </span>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.55)", marginTop: 1 }}>
                  Due May 1, 2026
                </span>
              </div>
            </div>

            {/* Bill to */}
            <div style={{
              padding: "13px 22px 10px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex", flexDirection: "column",
              background: "#fafbff",
            }}>
              <span style={{
                fontSize: 8, fontWeight: 700, color: "#6366f1",
                marginBottom: 4, letterSpacing: "0.08em",
              }}>BILL TO</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>Jane Cooper</span>
              <span style={{ fontSize: 10, color: "#64748b", marginTop: 1 }}>
                jane@designco.io · +1 555 0100
              </span>
            </div>

            {/* Line items */}
            <div style={{
              padding: "12px 22px 8px",
              display: "flex", flexDirection: "column", gap: 8,
            }}>
              {[
                { desc: "Brand Identity Design", qty: "1×", amt: "$1,200.00" },
                { desc: "Website Development",   qty: "1×", amt: "$3,500.00" },
                { desc: "SEO Consultation",       qty: "2×", amt: "$800.00"  },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "6px 8px", borderRadius: 6,
                  background: i % 2 === 0 ? "#f8fafc" : "transparent",
                }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span style={{
                      fontSize: 9, color: "#6366f1", fontWeight: 700,
                      marginRight: 6,
                    }}>{item.qty}</span>
                    <span style={{ fontSize: 10, color: "#334155" }}>{item.desc}</span>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#0f172a" }}>
                    {item.amt}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{
              margin: "6px 22px 12px",
              padding: "11px 14px",
              background: "linear-gradient(135deg, #eef2ff, #f5f3ff)",
              borderRadius: 10,
              border: "1px solid #c7d2fe",
              borderLeft: "3px solid #6366f1",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>Total Due</span>
              <span style={{ fontSize: 18, fontWeight: 900, color: "#4f46e5" }}>$5,500.00</span>
            </div>

            {/* Payment details */}
            <div style={{
              margin: "0 22px 18px",
              padding: "9px 12px",
              background: "#f8fafc",
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              display: "flex", flexDirection: "column",
            }}>
              <span style={{
                fontSize: 8, fontWeight: 700, color: "#6366f1",
                marginBottom: 3, letterSpacing: "0.08em",
              }}>BANK TRANSFER</span>
              <span style={{ fontSize: 9, color: "#475569" }}>
                First Bank · Acc: 3012345678 · Jane Cooper
              </span>
            </div>

            {/* Paid stamp overlay */}
            <div style={{
              position: "absolute",
              bottom: 72, right: 18,
              width: 64, height: 64,
              borderRadius: "50%",
              border: "3px solid #22c55e",
              display: "flex", alignItems: "center", justifyContent: "center",
              transform: "rotate(-15deg)",
            }}>
              <span style={{
                fontSize: 10, fontWeight: 900, color: "#22c55e",
                letterSpacing: "0.05em",
              }}>PAID</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
