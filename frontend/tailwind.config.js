/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spark: {
          black: '#09090b',
          surface: '#141414',
          border: '#1f1f1f',
          amber: '#f97316',
          gold: '#fbbf24',
          cream: '#fafaf9',
          muted: '#a8a29e',
          dim: '#57534e',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        heading: ['"DM Serif Display"', 'Georgia', 'serif'],
        body: ['"Space Mono"', 'Consolas', 'monospace'],
        label: ['"Instrument Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
