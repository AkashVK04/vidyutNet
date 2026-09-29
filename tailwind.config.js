/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          950: '#040914',
          900: '#070e1d',
          850: '#0a1426',
          800: '#0d1a30',
          700: '#13233f',
          600: '#1c3152',
          500: '#2a4468',
        },
        line: 'rgba(148, 178, 222, 0.12)',
      },
      boxShadow: {
        panel: '0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.6)',
      },
      keyframes: {
        ping2: { '0%': { transform: 'scale(1)', opacity: 0.7 }, '100%': { transform: 'scale(2.6)', opacity: 0 } },
        sweep: { to: { transform: 'rotate(360deg)' } },
        flow: { to: { strokeDashoffset: '-24' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        ping2: 'ping2 1.6s cubic-bezier(0,0,0.2,1) infinite',
        sweep: 'sweep 4s linear infinite',
        flow: 'flow 1s linear infinite',
        shimmer: 'shimmer 1.4s infinite',
      },
    },
  },
  plugins: [],
};
