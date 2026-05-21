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
          background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow top-right */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.4) 0%, rgba(99,102,241,0) 70%)",
          }}
        />

        {/* Glow bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: 280,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, rgba(139,92,246,0) 70%)",
          }}
        />

        {/* ── LEFT PANEL ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "64px 48px",
            width: 620,
            position: "relative",
          }}
        >
          {/* Logo row */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 13,
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 14,
                boxShadow: "0 8px 24px rgba(99,102,241,0.45)",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="2" width="12" height="18" rx="2" fill="white" />
                <path d="M16 2l4 4h-4V2z" fill="rgba(255,255,255,0.55)" />
                <rect x="7" y="7"  width="5" height="1.5" rx="0.75" fill="#6366f1" />
                <rect x="7" y="10" width="7" height="1.5" rx="0.75" fill="#a5b4fc" />
                <rect x="7" y="13" width="6" height="1.5" rx="0.75" fill="#a5b4fc" />
                <rect x="7" y="16" width="7" height="1.5" rx="0.75" fill="#6366f1" />
              </svg>
            </div>
            <span style={{ fontSize: 38, fontWeight: 800, color: "#ffffff", letterSpacing: "-1px" }}>
              Billsy
            </span>
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.08,
              letterSpacing: "-2px",
              marginBottom: 22,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Professional</span>
            <span style={{ color: "#a5b4fc" }}>invoices,</span>
            <span>instantly.</span>
          </div>

          {/* Subtext */}
          <div
            style={{
              fontSize: 20,
              color: "#94a3b8",
              lineHeight: 1.55,
              marginBottom: 36,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Create, download &amp; share in seconds.</span>
            <span>No login. No account. Just bill.</span>
          </div>

          {/* Feature pills */}
          <div style={{ display: "flex", gap: 10 }}>
            {["PDF Export", "3 Templates", "Payments", "Auto-Save"].map((f) => (
              <div
                key={f}
                style={{
                  padding: "7px 15px",
                  borderRadius: 99,
                  background: "rgba(99,102,241,0.18)",
                  border: "1px solid rgba(99,102,241,0.45)",
                  color: "#a5b4fc",
                  fontSize: 14,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL — mock invoice ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            paddingRight: 56,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 348,
              background: "#ffffff",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 40px 80px rgba(0,0,0,0.55)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Invoice header */}
            <div
              style={{
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                padding: "20px 22px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#ffffff" }}>Acme Studio</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginTop: 3 }}>hello@acme.io</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.5px" }}>INVOICE</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>INV-042</span>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>Due May 30, 2026</span>
              </div>
            </div>

            {/* Bill to */}
            <div
              style={{
                padding: "14px 22px 10px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span style={{ fontSize: 9, fontWeight: 600, color: "#94a3b8", marginBottom: 4 }}>BILL TO</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>Jane Cooper</span>
              <span style={{ fontSize: 10, color: "#64748b" }}>jane@example.com</span>
            </div>

            {/* Line items */}
            <div style={{ padding: "12px 22px", display: "flex", flexDirection: "column", gap: 7 }}>
              {[
                { desc: "Brand Identity Design", amt: "$1,200.00" },
                { desc: "Website Development",   amt: "$3,500.00" },
                { desc: "SEO Consultation",       amt: "$800.00"  },
              ].map((item) => (
                <div
                  key={item.desc}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <span style={{ fontSize: 10, color: "#475569" }}>{item.desc}</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: "#1e293b" }}>{item.amt}</span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div
              style={{
                margin: "4px 22px 14px",
                padding: "10px 14px",
                background: "#f8fafc",
                borderRadius: 8,
                borderTop: "2px solid #6366f1",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>Total Due</span>
              <span style={{ fontSize: 17, fontWeight: 800, color: "#6366f1" }}>$5,500.00</span>
            </div>

            {/* Payment */}
            <div
              style={{
                margin: "0 22px 20px",
                padding: "9px 12px",
                background: "#f0f0ff",
                borderRadius: 7,
                border: "1px solid #c7d2fe",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span style={{ fontSize: 9, fontWeight: 700, color: "#6366f1", marginBottom: 3 }}>BANK TRANSFER</span>
              <span style={{ fontSize: 9, color: "#64748b" }}>Account: 1234567890 · Sort: 00-00-00</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
