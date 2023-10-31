/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // or 'media' or 'class'
  content: [
  "./public/js/*.{html,js}",
  "./public/js/*/*.{html,js}",
  "./static/*.{html,js}",
  "./static/index.html",
  "./static/*/*.{html,js}",
  "./static/*/*/*.{html,js}",
  "./static/*/*/*/*.{html,js}"
],
  theme: {
    extend: {
      screens: {
        'tab': '760px', // if 768 it will affect tablets, so with a minimum of 760 this should show your screens
      },
    },
  },
  plugins: [],
}