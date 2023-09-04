import { type Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: "#FF9797",
        secondary: "#1B3F57",
      },
      screens: {
        "xs": "400px"
      },
      fontFamily: {
        brittany: "Brittany Signature, sans-serif",
        inter: "Inter, sans-serif",
        solway: "Solway, sans-serif",
        "noto-hebrew": "'Noto Sans Hebrew', sans-serif"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
