import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#FF9237",
          dark: "#CC7420",
        },
        bg: "#F5F5F5",
        surface: "#FFFFFF",
        "text-primary": "#0D0D0D",
        "text-muted": "#666666",
        border: "#E0E0E0",
        "tag-bg": "#FFF4EC",
        "tag-text": "#FF9237",
      },
      fontFamily: {
        sora: ["Sora", "sans-serif"],
        serif: ["Source Serif 4", "serif"],
        sans: ["DM Sans", "sans-serif"],
      },
      maxWidth: {
        site: "1280px",
      },
    },
  },
  plugins: [],
};

export default config;
