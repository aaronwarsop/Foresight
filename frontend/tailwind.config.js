/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './app/**/*.{vue,js}',
  './components/**/*.{vue,js}',
  './layouts/**/*.vue',
  './pages/**/*.vue',
  './app.vue',
  './App.vue',
],

  theme: {
    extend: {
      colors: {
        backgroundSecondary: "#28344e",
        backgroundPrimary: "#252f48",
        textPrimary: '#c7d1dd',
        textSecondary: '#5e6d84',
      }
    },
  },
  plugins: [],
}

