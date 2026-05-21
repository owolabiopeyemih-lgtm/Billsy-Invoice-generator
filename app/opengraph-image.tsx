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
          fontFamily: "system-ui, Arial, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.08) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glow blob */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: 300,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
          }}
        />

        {/* Left panel — branding */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "64px 56px",
            flex: 1,
            zIndex: 1,
          }}
        >
          {/* Logo + name */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 32px rgba(99,102,241,0.4)",
              }}
            >
              {/* Document icon */}
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="2" width="12" height="18" rx="2" fill="white" opacity="0.95" />
                <path d="M16 2l4 4h-4V2z" fill="white" opacity="0.6" />
                <rect x="7" y="7" width="5" height="1.5" rx="0.75" fill="#6366f1" />
                <rect x="7" y="10" width="7" height="1.5" rx="0.75" fill="#a5b4fc" />
                <rect x="7" y="13" width="6" height="1.5" rx="0.75" fill="#a5b4fc" />
                <rect x="7" y="16" width="7" height="1.5" rx="0.75" fill="#6366f1" />
              </svg>
            </div>
            <span style={{ fontSize: 40, fontWeight: 800, color: "#ffffff", letterSpacing: "-1px" }}>
              Billsy
            </span>
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.1,
              letterSpacing: "-1.5px",
              marginBottom: 20,
            }}
          >
            Professional
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #818cf8, #a78bfa)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              invoices
            </span>
            , instantly.
          </div>

          {/* Subtext */}
          <div style={{ fontSize: 22, color: "#94a3b8", lineHeight: 1.5, marginBottom: 40 }}>
            Create, download &amp; share invoices in seconds.
            <br />
            No login. No account. Just bill.
          </div>

          {/* Feature pills */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {["PDF Export", "3 Templates", "Payment Methods", "Auto-Save"].map((f) => (
              <div
                key={f}
                style={{
                  padding: "8px 16px",
                  borderRadius: 99,
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.4)",
                  color: "#a5b4fc",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                {f}
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — mock invoice card */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 56px 48px 0",
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 340,
              background: "#ffffff",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
            }}
          >
            {/* Invoice header */}
            <div
              style={{
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                padding: "20px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#ffffff" }}>Acme Studio</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>hello@acme.io</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#ffffff", letterSpacing: "-0.5px" }}>
                  INVOICE
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.8)", fontFamily: "monospace" }}>
                  INV-042
                </div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>Due May 30, 2026</div>
              </div>
            </div>

            {/* Bill to */}
            <div style={{ padding: "14px 24px 10px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                Bill To
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#1e293b" }}>Jane Cooper</div>
              <div style={{ fontSize: 10, color: "#64748b" }}>jane@example.com</div>
            </div>

            {/* Line items */}
            <div style={{ padding: "12px 24px", display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { desc: "Brand Identity Design", amt: "$1,200.00" },
                { desc: "Website Development", amt: "$3,500.00" },
                { desc: "SEO Consultation", amt: "$800.00" },
              ].map((item) => (
                <div
                  key={item.desc}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <div style={{ fontSize: 10, color: "#475569" }}>{item.desc}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#1e293b", fontFamily: "monospace" }}>
                    {item.amt}
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div
              style={{
                margin: "0 24px 16px",
                padding: "10px 14px",
                background: "#f8fafc",
                borderRadius: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: "2px solid #6366f1",
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, color: "#1e293b" }}>Total Due</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#6366f1", fontFamily: "monospace" }}>
                $5,500.00
              </div>
            </div>

            {/* Payment badge */}
            <div
              style={{
                margin: "0 24px 20px",
                padding: "8px 12px",
                background: "rgba(99,102,241,0.06)",
                borderRadius: 6,
                border: "1px solid rgba(99,102,241,0.2)",
              }}
            >
              <div style={{ fontSize: 9, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>
                Bank Transfer
              </div>
              <div style={{ fontSize: 9, color: "#64748b" }}>Account: 1234567890 · Sort: 00-00-00</div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
