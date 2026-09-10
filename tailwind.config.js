/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    container: { center: true, padding: '1.25rem', screens: { '2xl': '1400px' } },
    extend: {
      colors: {
        white: '#FFFFFF',
        ink: '#111111',
        accent: { DEFAULT: '#E53935', 50: '#FDECEC', 100: '#FBD5D4', 600: '#E53935', 700: '#C62828' },
        surface: { DEFAULT: '#FAFAFA', muted: '#F5F5F5' },
        border: { DEFAULT: '#E7E7E7' },
        success: '#1E8E5A',
      },
      fontFamily: { display: ['"Syne"', 'sans-serif'], sans: ['"Inter"', 'system-ui', 'sans-serif'] },
      borderRadius: { sm: '12px', md: '16px', lg: '20px', xl: '24px' },
      letterSpacing: { tightest: '-0.04em', wideish: '0.08em', widest2: '0.18em' },
      keyframes: {
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        'fade-up': { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        'slide-in-right': { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        'scale-in': { from: { opacity: 0, transform: 'scale(0.96)' }, to: { opacity: 1, transform: 'scale(1)' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in-right': 'slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scale-in 0.2s ease-out both',
        marquee: 'marquee 22s linear infinite',
      },
      transitionTimingFunction: { premium: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
