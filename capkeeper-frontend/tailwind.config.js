/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/**/*.{html,ts}',
    'src/index.html',
    'node_modules/flowbite/**/*.js'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'),
    require('@tailwindcss/forms'),
  ],
  important: true,

}