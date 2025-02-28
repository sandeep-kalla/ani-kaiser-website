/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#8B5CF6', // Purple-500
        'primary-dark': '#7C3AED', // Purple-600
        'secondary': '#1F2937', // Gray-800
        'secondary-dark': '#111827', // Gray-900
      },
    },
  },
  plugins: [],
} 