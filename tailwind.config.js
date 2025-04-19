/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html"
  ],
  theme: {
    screens: {
      sm: {'max': '767px'},
      'tablet': {'min': '768px', 'max': '1023px'},
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      boxShadow: {
        'link-shadow': '0 1px 0 #000000',
        'box-shadow': '0 0 10px 4px #9a7d0abb',
      },
    },
  },
  plugins: [],
}
