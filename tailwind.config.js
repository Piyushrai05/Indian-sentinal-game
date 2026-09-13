/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: '#0F0F0D',
        panel: '#181713',
        panelLight: '#211F1A',
        paper: '#D6C6A8',
        muted: '#A99778',
        brass: '#C09A5B',
        amber: '#D4A45C',
        danger: '#A94C42',
        secure: '#70836A',
        lightText: '#EEE7DA',
        mutedText: '#817B6F',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        condensed: ['"Barlow Condensed"', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'military': '0 4px 20px -2px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(192, 154, 91, 0.15)',
        'brass-glow': '0 0 15px rgba(192, 154, 91, 0.35)',
        'danger-glow': '0 0 15px rgba(169, 76, 66, 0.45)',
        'paper-edge': 'inset 0 0 30px rgba(0, 0, 0, 0.35), 0 2px 8px rgba(0,0,0,0.6)',
      }
    },
  },
  plugins: [],
}
