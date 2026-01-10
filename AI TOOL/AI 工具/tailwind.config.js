/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Oxanium", "ui-sans-serif", "sans-serif"],
        body: ["Atkinson Hyperlegible", "ui-sans-serif", "sans-serif"],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: true, // Enable all themes
  },
};

