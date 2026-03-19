/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#eef7ff',
          100: '#d9edff',
          200: '#bcdfff',
          300: '#8ecbff',
          400: '#59aeff',
          500: '#3b8ef8',
          600: '#1d6eed',
          700: '#1a5cd9',
          800: '#1c4baf',
          900: '#1c418a',
          950: '#152954',
        },
        slate: {
          850: '#1a2035',
          950: '#0d1117',
        },
      },
      screens: {
        'xs': '480px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'slide-in':   'slideIn 0.5s ease forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':      'float 6s ease-in-out infinite',
        'spin':       'spin 1s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'glow':      '0 0 40px rgba(29, 110, 237, 0.15)',
        'glow-sm':   '0 0 20px rgba(29, 110, 237, 0.1)',
        'card':      '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
        'card-hover':'0 4px 20px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
