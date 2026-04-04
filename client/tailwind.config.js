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
          DEFAULT: '#1E2A38',
          light: '#2A3B4D',
        },
        accent: {
          DEFAULT: '#4F9CF9',
          success: '#22C55E',
        },
        page: '#F4F6F8',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
