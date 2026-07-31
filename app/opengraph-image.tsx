import { ImageResponse } from "next/og";

export const alt = "Satorus — Tu negocio, menos enredado";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function RouteMark() {
  return (
    <svg width="54" height="54" viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M36.5 10.8C30.2 5.8 18.1 5.7 11.8 12.4C5.7 18.9 11.8 23.9 24 23.9C36.5 23.9 42.3 29 36.2 35.8C30.4 42.2 18 42.4 10.7 36.7"
        fill="none"
        stroke="#e56748"
        strokeLinecap="round"
        strokeWidth="6.5"
      />
      <circle cx="10.7" cy="36.7" r="4.2" fill="#dfe97a" stroke="#171b18" strokeWidth="2.2" />
    </svg>
  );
}

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        color: "#171b18",
        background: "#f2f1ea",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -150,
          bottom: -110,
          width: 750,
          height: 650,
          display: "flex",
          background: "#2948c7",
          clipPath: "polygon(28% 0, 100% 0, 100% 100%, 0 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 270,
          right: 118,
          width: 205,
          height: 276,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          padding: "30px 24px",
          background: "#f2f1ea",
          border: "4px solid #171b18",
          transform: "rotate(6deg)",
          boxShadow: "12px 15px 0 rgba(16,20,17,.22)",
        }}
      >
        <div style={{ width: 112, height: 9, display: "flex", background: "#171b18" }} />
        <div style={{ width: 154, height: 4, display: "flex", background: "#171b18", opacity: 0.35 }} />
        <div style={{ width: 132, height: 4, display: "flex", background: "#171b18", opacity: 0.35 }} />
        <div style={{ width: 147, height: 4, display: "flex", background: "#171b18", opacity: 0.35 }} />
        <div style={{ marginTop: 40, width: 92, height: 34, display: "flex", background: "#dfe97a" }} />
      </div>

      <svg
        width="1200"
        height="630"
        viewBox="0 0 1200 630"
        style={{ position: "absolute", inset: 0 }}
        aria-hidden="true"
      >
        <path
          d="M-70 472 C150 395 282 535 455 461 S780 390 945 468 S1120 525 1255 430"
          fill="none"
          stroke="#e56748"
          strokeLinecap="round"
          strokeWidth="20"
        />
      </svg>

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: 760,
          padding: "44px 0 42px 62px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <RouteMark />
          <div style={{ display: "flex", fontSize: 38, fontWeight: 900, letterSpacing: -2 }}>
            satorus.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 68,
            fontSize: 91,
            fontWeight: 900,
            letterSpacing: -6,
            lineHeight: 0.86,
          }}
        >
          <div style={{ display: "flex" }}>Tu negocio,</div>
          <div style={{ display: "flex" }}>menos enredado.</div>
        </div>

        <div
          style={{
            display: "flex",
            maxWidth: 505,
            marginTop: 42,
            fontSize: 25,
            fontWeight: 700,
            lineHeight: 1.25,
          }}
        >
          Webs, herramientas y automatizaciones para pymes, explicadas sin tecnicismos.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 52,
          bottom: 50,
          display: "flex",
          padding: "15px 25px",
          color: "#171b18",
          background: "#dfe97a",
          border: "3px solid #171b18",
          borderRadius: 8,
          fontSize: 24,
          fontWeight: 800,
        }}
      >
        satorus.es →
      </div>
    </div>,
    size,
  );
}
