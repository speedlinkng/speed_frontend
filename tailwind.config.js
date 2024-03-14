/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // or 'media' or 'class'
  content: [
  "./public/js/*.{html,js}",
  "./public/js/*/*.{html,js}",
  "./views/includes/*/*.{ejs,js,html}",
  "./views/includes/*.{html,js,ejs}",
  "./views/*.{html,ejs,js}",
  "./views/main.ejs",
  "./views/*/*.{html,ejs,js}",
  "./views/dashoard/*upload.{html,ejs,js}",
  "./views/*/*/*.{html,ejs,js}",
  "./views/*/*/*/*.{html,ejs,js}"
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