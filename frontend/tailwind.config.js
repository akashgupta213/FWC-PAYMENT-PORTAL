export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue:      '#2E60A9',
          blueDark:  '#1e4a8a',
          blueLight: '#EFF6FF',
          yellow:    '#FFCC00',
          indigo:    '#4F46E5',
        }
      },
      fontFamily: {
        sans:  ['DM Sans', 'sans-serif'],
        serif: ['DM Serif Display', 'serif'],
      },
      boxShadow: {
        card:  '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)',
        float: '0 8px 32px rgba(46,96,169,0.15)',
      }
    }
  },
  plugins: []
};