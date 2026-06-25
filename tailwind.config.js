/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        scholar: {
          bg: '#F9FAFB',
          'bg-dark': '#18181B',
          surface: '#FFFFFF',
          'surface-dark': '#27272A',
          border: '#E4E4E7',
          'border-dark': '#3F3F46',
          accent: '#10B981',
          'accent-hover': '#059669',
          'accent-light': '#D1FAE5',
          secondary: '#3B82F6',
          'secondary-light': '#DBEAFE',
          text: '#18181B',
          'text-dark': '#F4F4F5',
          muted: '#71717A',
          'muted-dark': '#A1A1AA',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'modal': '0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)',
        'glow-green': '0 0 16px rgba(16,185,129,0.15)',
      },
      animation: {
        'check-pulse': 'check-pulse 0.3s ease-out',
        'fade-slide-up': 'fade-slide-up 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
      keyframes: {
        'check-pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
        'fade-slide-up': {
          'from': { opacity: '0', transform: 'translateY(8px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          'from': { opacity: '0', transform: 'scale(0.95)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
