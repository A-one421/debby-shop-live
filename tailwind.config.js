export default {
  content: ['./index.html','./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: { 50:'#fffbeb', 400:'#D4AF37', 500:'#C5A028', 600:'#B49020' },
        dark: { 900:'#0a0a0a', 800:'#121212' }
      },
      fontFamily: {
        sans: ['Inter','sans-serif'],
        serif: ['Playfair Display','serif']
      }
    }
  },
  plugins: []
}
