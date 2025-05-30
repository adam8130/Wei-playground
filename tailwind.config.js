/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        'main': 'rgb(139,210,181)',
        'active': 'rgb(30,203,130)',
        'secondary': '#60c6db'
      },
      fontSize: {
        'basic': ['16px', 'unset']
      }
    },
  },
  plugins: [],
}
