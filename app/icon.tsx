import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Document body */}
        <div
          style={{
            width: 18,
            height: 22,
            background: "#ffffff",
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            padding: "4px 3px",
            gap: 2,
            position: "relative",
          }}
        >
          {/* Folded corner */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 5,
              height: 5,
              background: "#6366f1",
              borderBottomLeftRadius: 2,
            }}
          />
          {/* Lines representing invoice rows */}
          <div style={{ width: 10, height: 2, background: "#6366f1", borderRadius: 1, marginTop: 2 }} />
          <div style={{ width: 12, height: 2, background: "#c7d2fe", borderRadius: 1 }} />
          <div style={{ width: 8,  height: 2, background: "#c7d2fe", borderRadius: 1 }} />
          <div style={{ width: 12, height: 2, background: "#c7d2fe", borderRadius: 1 }} />
          {/* Total line */}
          <div style={{ width: 12, height: 2, background: "#6366f1", borderRadius: 1, marginTop: 1 }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
