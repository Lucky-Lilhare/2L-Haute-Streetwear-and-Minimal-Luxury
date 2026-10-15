/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B0B0D',
          darker: '#070708',
          surface: '#121215',
          card: '#16161A',
          cardHover: '#1B1B20',
          border: '#24242A',
          borderLight: '#32323A',
          muted: '#8E8E96',
          light: '#F8F8F9',
          accent: '#E6D5B8', // Minimal warm platinum / champagne
          white: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['"Inter"', '"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Inter"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        'tightest': '-0.035em',
        'tighter': '-0.02em',
        'wide-sm': '0.04em',
        'widest-md': '0.12em',
        'widest-lg': '0.18em',
      },
      boxShadow: {
        'subtle': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
        'dark-xl': '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        fadeIn: 'fadeIn 0.25s ease-out forwards',
      }
    },
  },
  plugins: [],
}
