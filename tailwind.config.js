/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // or 'media' or 'class'
  content: ["./public/dist/index.ejs","./dist/*.{html,js}", "./dist/*/*.{html,js}", "./dist/dashboard/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}