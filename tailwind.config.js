module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      keyframes: {
        progressBar: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        progressBar: 'progressBar 2s ease-in-out infinite'
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
};