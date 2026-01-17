/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark mode navy blue theme
        navy: {
          900: '#0a1628',
          800: '#132039',
          700: '#1a2d4a',
          600: '#2d3f5f',
        }
      }
    },
  },
  plugins: [],
}
