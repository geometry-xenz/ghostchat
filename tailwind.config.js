/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'void': '#000000',
        'surface': '#1c1c1e', // Apple secondary
        'elevated': '#2c2c2e', // Apple tertiary
        'ghost-white': '#ffffff',
        'ghost-dim': '#8e8e93', // Apple gray
        'accent-glow': '#007aff', // Apple Blue
        'accent-safe': '#30d158', // Apple Green
        'accent-danger': '#ff3b30', // Apple Red
        'border-subtle': '#38383a', // Apple border
        'cyber-cyan': '#00f0ff', // Technical accent
        'cyber-green': '#00ff9f', // Success accent
      },
      fontFamily: {
        'mono': ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        'sans': ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Inter"', 'system-ui', 'sans-serif'],
        'code': ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'precise-pulse': 'precisePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0, 0, 0.2, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0, 0, 0.2, 1)',
      },
      keyframes: {
        precisePulse: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'cyber': '0 0 1px 0 rgba(255, 255, 255, 0.1), 0 4px 12px 0 rgba(0, 0, 0, 0.5)',
        'apple': '0 0 0 0.5px rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [],
};
