/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        rail: {
          navy: '#0E2347',
          navyMid: '#153162',
          navyLight: '#1E4380',
          gold: '#D4A13B',
          goldLight: '#F3D27A',
          goldCream: '#FDF6E4',
          surface: '#F2F5FA',
        },
      },
      boxShadow: {
        card: '0 2px 12px -2px rgba(14, 35, 71, 0.06), 0 1px 3px rgba(14, 35, 71, 0.04)',
        cardHover: '0 10px 24px -6px rgba(14, 35, 71, 0.12), 0 2px 6px rgba(14, 35, 71, 0.05)',
        phone: '0 28px 70px -15px rgba(11, 27, 56, 0.38), 0 0 0 1px rgba(255,255,255,0.12) inset',
      },
    },
  },
  plugins: [],
};
