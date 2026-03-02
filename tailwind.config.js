import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: false, // or 'class' if you want manual dark mode
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
    },
  },
  plugins: [
    typography,
  ],
};


// // tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       typography: {
//         DEFAULT: {
//           css: {
//             color: '#333',
//             a: {
//               color: '#3b82f6', // Your brand color
//               '&:hover': {
//                 color: '#2563eb',
//               },
//             },
//             strong: {
//               color: '#111',
//               fontWeight: '600',
//             },
//           },
//         },
//       },
//     },
//   },
//   plugins: [require('@tailwindcss/typography')],
// }