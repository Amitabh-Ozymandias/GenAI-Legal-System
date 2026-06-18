/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4fa', 100: '#dbe5f1', 200: '#b6cae3', 300: '#85a6cf',
          400: '#5982b7', 500: '#3b669c', 600: '#2c507e', 700: '#243f63',
          800: '#1c2f4a', 900: '#0f1f3a', 950: '#0a1628'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif']
      },
      boxShadow: {
        soft: '0 2px 8px -2px rgba(15, 31, 58, 0.08), 0 4px 16px -4px rgba(15, 31, 58, 0.06)',
        card: '0 4px 24px -8px rgba(15, 31, 58, 0.12)'
      }
    }
  },
  plugins: []
}
