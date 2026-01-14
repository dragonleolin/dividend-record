/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DotGothic16"', 'sans-serif'],
        retro: ['"DotGothic16"', 'sans-serif'],
      },
      colors: {
        retro: {
          dark: '#2d1b2e',
          light: '#bca7b1',
          accent: '#ff0044',
          green: '#63c74d',
          blue: '#1e88e5',
          orange: '#e4a672'
        }
      }
    },
  },
  plugins: [],
}
