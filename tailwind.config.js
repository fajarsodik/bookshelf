/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'base-color': '#ED9455',
        'secondary-color': '#FFBB70',
        'danger-color': '#C51605'
      }
    },
  },
  plugins: [],
}

