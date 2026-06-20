module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brandViolet: '#7c3aed',
        brandBlue: '#06b6d4',
      },
      boxShadow: {
        'glow-md': '0 8px 30px rgba(99,102,241,0.12)'
      }
    }
  },
  plugins: []
}
