/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#05060b',
          subtle: '#090b14',
          panel: 'rgba(255, 255, 255, 0.035)',
          'panel-hi': 'rgba(255, 255, 255, 0.06)',
          card: '#0a0d1a',
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.09)',
          hi: 'rgba(255, 255, 255, 0.16)',
        },
        brand: {
          blue: '#5b8cff',
          blue2: '#3b63e0',
          purple: '#9b7bff',
          cyan: '#22d3ee',
          pink: '#f472b6',
        },
        status: {
          good: '#34d399',
          'good-bg': 'rgba(52, 211, 153, 0.12)',
          warn: '#fbbf24',
          'warn-bg': 'rgba(251, 191, 36, 0.12)',
          bad: '#f87171',
          'bad-bg': 'rgba(248, 113, 113, 0.12)',
        },
        dim: {
          DEFAULT: '#8991ab',
          dark: '#5c6480',
          light: '#eef0f8',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"SF Mono"', 'SFMono-Regular', 'Consolas', '"Liberation Mono"', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'glow-blue': '0 0 30px rgba(91, 140, 255, 0.35)',
        'glow-purple': '0 0 30px rgba(155, 123, 255, 0.35)',
        'glow-cyan': '0 0 30px rgba(34, 211, 238, 0.35)',
        'card-3d': '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(91, 140, 255, 0.15)',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
