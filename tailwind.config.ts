import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        hud: ['Orbitron', 'monospace'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        hud: {
          bg: '#f0f8ff',
          card: '#ffffff',
          panel: '#f8fafc',
          border: '#3b82f6',
          cyan: '#06b6d4',
          gold: '#f59e0b',
          green: '#10b981',
          red: '#ef4444',
          purple: '#8b5cf6',
          orange: '#f97316',
          blue: '#3b82f6',
          pink: '#ec4899',
          indigo: '#6366f1',
          teal: '#14b8a6',
        },
        bright: {
          blue: '#3b82f6',
          cyan: '#06b6d4',
          purple: '#8b5cf6',
          gold: '#f59e0b',
          green: '#10b981',
          pink: '#ec4899',
          orange: '#f97316',
          red: '#ef4444',
        }
      },
      backgroundImage: {
        'gradient-aurora': 'linear-gradient(135deg, #667eea, #764ba2, #f093fb, #f5576c, #4facfe)',
        'gradient-crystal': 'linear-gradient(135deg, #a8edea, #fed6e3, #d299c2)',
        'gradient-ocean': 'linear-gradient(135deg, #43e97b, #38f9d7, #4facfe)',
        'gradient-sunrise': 'linear-gradient(135deg, #ff9a9e, #fecfef, #ffecd2)',
      },
      screens: { 'xs': '480px' },
      animation: {
        'aurora': 'auroraShift 8s ease infinite',
        'crystal': 'crystalShift 6s ease infinite',
        'ocean': 'oceanShift 7s ease infinite',
      }
    },
  },
  plugins: [],
}

export default config
