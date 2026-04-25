/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        zip: {
          teal: '#0EA38F',
          aqua: '#29C2B7',
          mint: '#E6F6F3',
          navy: '#0D1B2A',
          slate: '#64748B',
          cloud: '#F7F9FB',
          warning: '#F59E0B',
          danger: '#EF4444',
          good: '#10B981'
        }
      },
      boxShadow: {
        soft: '0 16px 40px rgba(13, 27, 42, 0.10)',
        card: '0 8px 24px rgba(13, 27, 42, 0.08)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif']
      }
    }
  },
  plugins: []
};
