import { ImageResponse } from "next/og";

export const alt = "Vidriería Demo — Aluminio, PVC y Vidrios";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#151515",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              width: 56,
              height: 56,
              borderRadius: 12,
              backgroundColor: "#C8102E",
              marginRight: 20,
            }}
          />
          <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: 2 }}>
            VIDRIERÍA DEMO
          </div>
        </div>
        <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1 }}>
          Ventanas, vidrios y cierres a tu medida
        </div>
        <div style={{ display: "flex", fontSize: 34, color: "#C8102E", marginTop: 28, fontWeight: 700 }}>
          Aluminio · PVC · Vidrios — Talca
        </div>
      </div>
    ),
    { ...size },
  );
}
