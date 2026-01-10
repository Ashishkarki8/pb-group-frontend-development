
/** @type {import('tailwindcss').Config} */
export default {
  // darkMode: ["class"], for manual integration
  darkMode: false,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'ui-serif', 'Georgia', 'serif'],
      },
    }
  },
  // Remove or comment out the plugins line
  // plugins: [require("tailwindcss-animate")],
}