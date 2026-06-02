import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: { center: true, padding: "1.5rem", screens: { "2xl": "1240px" } },
    extend: {
      colors: {
        navy: { DEFAULT: "#0D1B4B", deep: "#070f2e" },
        royal: "#1F3A93",
        gold: { DEFAULT: "#C9A84C", soft: "#E3CB86" },
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        ink: { DEFAULT: "#111827", 2: "#374151", 3: "#6B7280" },
        line: "#E5E7EB",
        surface: { DEFAULT: "#F8FAFC", 2: "#F1F5F9" },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        arabic: ["var(--font-amiri)", "serif"],
      },
      borderRadius: { xl: "0.875rem", "2xl": "1.125rem" },
      boxShadow: {
        card: "0 16px 40px -12px rgba(13,27,75,0.16)",
        soft: "0 8px 24px -8px rgba(13,27,75,0.10)",
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(22px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: { rise: "rise 0.7s cubic-bezier(0.16,1,0.3,1) both" },
    },
  },
  plugins: [],
};

export default config;
