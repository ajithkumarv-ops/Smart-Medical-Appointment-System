/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#EBF3FF',
          100: '#D6E7FF',
          200: '#ADC9FF',
          300: '#84ABFF',
          400: '#5B8DFF',
          500: '#1B4FD8',
          600: '#1640B8',
          700: '#0A2463',
          800: '#071A47',
          900: '#04102B',
        },
        medical: {
          blue:   '#0A2463',
          sky:    '#3B82F6',
          light:  '#E8F4FD',
          teal:   '#0D9488',
          mint:   '#ECFDF5',
          red:    '#EF4444',
          amber:  '#F59E0B',
          green:  '#22C55E',
        },
        glass: {
          white: 'rgba(255,255,255,0.15)',
          dark:  'rgba(10,36,99,0.25)',
        },
      },
      backgroundImage: {
        'gradient-brand':    'linear-gradient(135deg, #0A2463 0%, #1B4FD8 50%, #3B82F6 100%)',
        'gradient-hero':     'linear-gradient(135deg, #04102B 0%, #0A2463 40%, #1B4FD8 100%)',
        'gradient-card':     'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
        'gradient-light':    'linear-gradient(135deg, #EBF3FF 0%, #ffffff 100%)',
        'gradient-radial':   'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'glass':   '0 8px 32px rgba(10, 36, 99, 0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
        'glass-lg':'0 24px 64px rgba(10, 36, 99, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
        'brand':   '0 4px 20px rgba(27, 79, 216, 0.4)',
        'brand-lg':'0 8px 40px rgba(27, 79, 216, 0.5)',
        'card':    '0 2px 16px rgba(10, 36, 99, 0.08)',
        'card-lg': '0 8px 32px rgba(10, 36, 99, 0.12)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in':      'fadeIn 0.5s ease-out',
        'fade-up':      'fadeUp 0.5s ease-out',
        'fade-down':    'fadeDown 0.5s ease-out',
        'slide-in-left':'slideInLeft 0.4s ease-out',
        'slide-in-right':'slideInRight 0.4s ease-out',
        'scale-in':     'scaleIn 0.3s ease-out',
        'pulse-slow':   'pulse 3s ease-in-out infinite',
        'shimmer':      'shimmer 2s linear infinite',
        'float':        'float 3s ease-in-out infinite',
        'spin-slow':    'spin 3s linear infinite',
        'bounce-slow':  'bounce 2s ease-in-out infinite',
        'gradient-x':   'gradientX 4s ease infinite',
      },
      keyframes: {
        fadeIn:       { from: { opacity: '0' }, to: { opacity: '1' } },
        fadeUp:       { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeDown:     { from: { opacity: '0', transform: 'translateY(-20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInLeft:  { from: { opacity: '0', transform: 'translateX(-30px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        slideInRight: { from: { opacity: '0', transform: 'translateX(30px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        scaleIn:      { from: { opacity: '0', transform: 'scale(0.9)' }, to: { opacity: '1', transform: 'scale(1)' } },
        shimmer:      { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
        float:        {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      transitionTimingFunction: {
        'bounce-in':  'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth':     'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
