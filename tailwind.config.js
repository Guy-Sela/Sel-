/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./main.js",
    "./meditativeclocks/**/*.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'josefin': ['"Josefin Sans"', 'system-ui', 'sans-serif'],
        'jetbrains': ['"JetBrains Mono"', 'monospace'],
        'roboto-mono': ['"Roboto Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}

