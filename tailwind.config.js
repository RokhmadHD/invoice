/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        // BARU: Tambahkan baris ini
        'shopee-receipt': "url('/shopee-background.png')",
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', 'monospace'], // <-- Tambahkan ini
      },
    },
  },
  plugins: [],
};
  