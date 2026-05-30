/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta fintech verde — tonos principales de la marca
        gopass: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
      },
      backgroundImage: {
        // Gradiente de fondo para las vistas con efecto glassmorphism
        'gopass-gradient':
          'radial-gradient(ellipse at top, rgba(16, 185, 129, 0.15), transparent 50%), radial-gradient(ellipse at bottom right, rgba(5, 150, 105, 0.1), transparent 40%)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(6, 78, 59, 0.12)',
        neon: '0 0 20px rgba(52, 211, 153, 0.4), 0 0 40px rgba(16, 185, 129, 0.2)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
