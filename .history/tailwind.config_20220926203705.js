/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#36393f',
        lightprimary: '#484c54', // 10%
        secondary: '#202225',
        tertiary: '#2F3136',
        lighttertiary: '#42444b', // 10%
        scamred: '#713B48',
        scamyellow: '#71763C',
        progressblue: '#3BB9FF',
        progressgold: '#ffae00',
        primaryblue: '#1d4ed8',
      },
      minWidth: (theme) => ({
        ...theme('spacing'),
      }),
    },
    screens: {
      xs: '400px',
      // => @media (min-width: 375px) { ... }

      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
  },
  variants: {},
  plugins: [],
};
