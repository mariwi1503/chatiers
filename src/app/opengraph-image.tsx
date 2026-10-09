import { ImageResponse } from "next/og";
export const alt = "Chatiers — Tempat Ide Bertemu Peluang";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#faf8ff",
        padding: "80px",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 30,
          color: "#0054cc",
          fontWeight: 700,
          marginBottom: 35,
        }}
      >
        Chatiers
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 78,
          fontWeight: 700,
          color: "#151b2b",
          letterSpacing: -3,
        }}
      >
        Tempat ide
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 78,
          fontWeight: 700,
          color: "#712ae2",
          letterSpacing: -3,
        }}
      >
        bertemu peluang.
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 26,
          color: "#424655",
          marginTop: 32,
        }}
      >
        Berbagi produk. Membangun koneksi. Tumbuh bersama.
      </div>
    </div>,
    size,
  );
}
