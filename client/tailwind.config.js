/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          beige: "#F5F0E8",
          gold: "#C9A84C",
          "gold-dark": "#A67C2E",
          "off-white": "#FAF8F4",
          ivory: "#FDF6EC",
        },
        charcoal: "#2C2C2A",
      },
      fontFamily: {
        playfair: ["'Playfair Display'", "serif"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
