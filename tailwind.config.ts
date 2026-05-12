import type { Config } from "tailwindcss"

const config: Config = {
  corePlugins: {
    preflight: false,
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist)", "Geist", "Space Grotesk", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        display: ["Instrument Serif", "Times New Roman", "serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        bg: "#0a0a0b",
        "bg-1": "#101012",
        "bg-2": "#15151a",
        surface: "#16161b",
        "surface-hi": "#1c1c22",
        border: "#232329",
        "border-hi": "#2f2f37",
        accent: "#c8ff3d",
        "accent-2": "#88f7c2",
        "accent-warm": "#ff6a35",
        "accent-amber": "#ffc857",
        "text-mid": "#b9b9c2",
        "text-dim": "#7a7a84",
        "text-faint": "#4d4d56",
      },
      maxWidth: {
        site: "1280px",
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        "pulse-dot": "pulse-dot 2s ease-in-out infinite",
        strike: "strike 1.2s .8s cubic-bezier(.2,.7,.2,1) forwards",
        "fade-up": "fade-up .4s forwards",
        spin: "spin 0.7s linear infinite",
        blink: "blink 1s step-end infinite",
      },
      keyframes: {
        marquee: { to: { transform: "translateX(-50%)" } },
        "pulse-dot": {
          "0%,100%": { opacity: "1", boxShadow: "0 0 0 0 rgba(200,255,61,.5)" },
          "50%": { opacity: ".6", boxShadow: "0 0 0 6px rgba(200,255,61,0)" },
        },
        strike: { to: { transform: "rotate(-3deg) scaleX(1)" } },
        "fade-up": { to: { opacity: "1", transform: "none" } },
        blink: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0" } },
      },
    },
  },
  plugins: [],
}
export default config
