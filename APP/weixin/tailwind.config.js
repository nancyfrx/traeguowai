/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wechat: {
          green: '#07c160',
          bg: '#ededed',
          tab: '#f7f7f7',
          text: '#000000',
          sub: '#888888',
          link: '#576b95',
          border: '#e5e5e5',
          red: '#fa5151',
        }
      }
    },
  },
  plugins: [],
}
