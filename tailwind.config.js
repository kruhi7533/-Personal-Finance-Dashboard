/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#a3e635',
          hover: '#bef264',
        },
        surface: {
          base: '#0a0f1e',
          sidebar: '#0d1117',
          card: '#141b2d',
          border: '#1e293b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Manrope', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
