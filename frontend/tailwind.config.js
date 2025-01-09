/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#1155cc',
        'txt-blue': '#263753',
        'txt-gray': '#808B9F',
        'txt-hover': '#1155CC',
      },
      fontFamily: {
        sans: ['Roboto', 'Arial', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        mono: ['Courier New', 'Courier', 'monospace'],
      },
    },
  },
  plugins: [],
}
