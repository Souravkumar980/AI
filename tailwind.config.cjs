/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          DEFAULT: '#FF9933',
          dark: '#E06B00',
          light: '#FFB366',
          pop: '#FF7700',
        },
        tirangaGreen: {
          DEFAULT: '#138808',
          dark: '#0C5905',
          light: '#28A745',
        },
        chakraNavy: {
          DEFAULT: '#000080',
          dark: '#000055',
          light: '#1A237E',
        },
        popYellow: '#FFE600',
        popPink: '#FF007F',
        popCyan: '#00E5FF',
        popRed: '#FF2A2A',
        popDark: '#111111',
        popCream: '#FFFDF9',
        cardBg: '#FFFBEB',
      },
      fontFamily: {
        comic: ['Bangers', 'Impact', 'sans-serif'],
        condensed: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        display: ['"Space Grotesk"', 'Outfit', 'sans-serif'],
        body: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'pop': '4px 4px 0px #000000',
        'pop-lg': '7px 7px 0px #000000',
        'pop-xl': '10px 10px 0px #000000',
        'pop-sm': '2px 2px 0px #000000',
        'pop-hover': '2px 2px 0px #000000',
        'neo-raised': '6px 6px 12px #d1d5db, -6px -6px 12px #ffffff',
        'neo-inset': 'inset 3px 3px 6px #d1d5db, inset -3px -3px 6px #ffffff',
        'neo-pop': 'inset 2px 2px 0px rgba(255,255,255,0.7), 5px 5px 0px #000000',
      },
      borderWidth: {
        '3': '3px',
        '5': '5px',
      }
    },
  },
  plugins: [],
};
