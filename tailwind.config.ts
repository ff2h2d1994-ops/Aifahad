import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#F7F2E7",
          layer: "#EFE6D3",
          layer2: "#FFFFFF",
        },
        electric: {
          DEFAULT: "rgb(var(--color-electric) / <alpha-value>)",
          soft: "rgb(var(--color-electric-soft) / <alpha-value>)",
        },
        violet: {
          DEFAULT: "rgb(var(--color-violet) / <alpha-value>)",
        },
        cyan: {
          DEFAULT: "rgb(var(--color-cyan) / <alpha-value>)",
        },
        ember: {
          DEFAULT: "rgb(var(--color-ember) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "#1C1710",
          muted: "#6B6255",
        },
      },
      fontFamily: {
        arabic: ["var(--font-arabic)", "sans-serif"],
        display: ["var(--font-arabic)", "sans-serif"],
        body: ["var(--font-arabic)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px -12px rgb(var(--color-electric) / 0.5)",
        "glow-violet": "0 0 50px -14px rgb(var(--color-violet) / 0.45)",
        "glow-cyan": "0 0 50px -14px rgb(var(--color-cyan) / 0.4)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgb(var(--color-electric) / 0.12), transparent)",
      },
    },
  },
  plugins: [],
};
export default config;
