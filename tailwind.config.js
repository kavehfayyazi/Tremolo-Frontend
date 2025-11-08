/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'body-language': '#10b981', // green
        'vocal': '#3b82f6', // blue
        'speech': '#ef4444', // red
      },
    },
  },
  plugins: [],
}

