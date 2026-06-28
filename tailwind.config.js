export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          50: "#fffbeb",
          100: "#fdf2cf",
          200: "#f5e4a8",
          300: "#e9cf76",
          400: "#D4AF37",
          500: "#C5A028",
          600: "#B49020",
          700: "#8f6f18",
        },
        dark: { 900: "#0a0a0a", 800: "#121212" },
      },
      boxShadow: {
        "gold-lg": "0 10px 30px -8px rgba(212,175,55,0.45)",
        "nav-up": "0 -8px 24px -8px rgba(0,0,0,0.08)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};
