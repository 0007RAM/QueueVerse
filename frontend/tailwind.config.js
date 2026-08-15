/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Deep midnight command-center background scale
        midnight: {
          950: '#030712',
          900: '#06101b',
          800: '#081522',
          700: '#0a1929',
          600: '#111827',
          500: '#172554',
        },
        // Ice-blue / cyan accent scale (replaces the old gold accent)
        accent: {
          100: '#dbeafe',
          200: '#93c5fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#60a5fa',
          600: '#3b82f6',
          700: '#2563eb',
        },
        // Premium neon glow tones used for pulses / scan-lines / highlights
        glow: {
          300: '#6ee7ff',
          400: '#4facfe',
          500: '#00e5ff',
        },
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Sora', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'glow-gradient': 'linear-gradient(135deg, #38BDF8 0%, #00E5FF 100%)',
        'glow-gradient-soft': 'linear-gradient(135deg, rgba(56,189,248,0.16) 0%, rgba(0,229,255,0.06) 100%)',
        'radial-glow': 'radial-gradient(circle at 50% 0%, rgba(56,189,248,0.18), transparent 60%)',
        'aurora-1': 'radial-gradient(circle, rgba(0,229,255,0.25), transparent 70%)',
        'aurora-2': 'radial-gradient(circle, rgba(96,165,250,0.22), transparent 70%)',
        'aurora-3': 'radial-gradient(circle, rgba(125,211,252,0.18), transparent 70%)',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.4), 0 1px 2px -1px rgba(0,0,0,0.4)',
        glow: '0 0 0 1px rgba(56,189,248,0.25), 0 8px 30px -8px rgba(0,229,255,0.35)',
        'glow-lg': '0 0 40px -6px rgba(0,229,255,0.5), 0 0 0 1px rgba(56,189,248,0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 1.5s infinite',
        shimmer: 'shimmer 2.2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'gradient-x': 'gradient-x 6s ease infinite',
        aurora: 'aurora 18s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(4%, -6%) scale(1.08)' },
          '66%': { transform: 'translate(-5%, 4%) scale(0.96)' },
        },
      },
      backgroundSize: {
        '200%': '200% 200%',
      },
    },
  },
  plugins: [],
}
