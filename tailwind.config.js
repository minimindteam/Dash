/** @type {import('tailwindcss').Config} */
export default {
<<<<<<< HEAD
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
=======
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A00B0',
        secondary: '#FF007F',
        lightGray: '#F3F4F6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

>>>>>>> 744cfbcf1cbd974b8fa4e99d749c9c3b251fbfd8
