/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amap: {
          blue: '#1a73e8',
          light: '#f0f7ff',
        }
      }
    },
  },
  plugins: [],
}
