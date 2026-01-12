/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#050505",
        secondary: "#111111",
        accent: "#ffffff",
        // Cyber/Aurora Palette
        cyber: {
          neon: "#00f2ff",
          purple: "#bc13fe",
          pink: "#ff00bd",
          blue: "#2d5cf7",
          bg: "#030303",
          card: "rgba(15, 15, 15, 0.6)",
          border: "rgba(255, 255, 255, 0.08)",
        },
        glass: {
          dark: "rgba(0, 0, 0, 0.6)",
          border: "rgba(255, 255, 255, 0.1)",
        }
      },
      fontFamily: {
        sans: ['Inter', 'Space Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 242, 255, 0.2)',
        'purple-glow': '0 0 30px rgba(188, 19, 254, 0.3)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.8)',
      },
      backgroundImage: {
        'aurora': "radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%), radial-gradient(at 0% 100%, hsla(180,100%,20%,1) 0, transparent 50%), radial-gradient(at 100% 100%, hsla(280,100%,20%,1) 0, transparent 50%)",
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
