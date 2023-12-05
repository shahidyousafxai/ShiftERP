
const {
primaryColor,
secondaryColor,
secondaryTextColor,
charcoalBlack,
darkGray,
dark,
danger,
disabledButton,
success,
lightGray,
black,
white,
bgGray,
borderGray,  
} = require("./src/helpers/GlobalVariables");

/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'primaryColor': primaryColor,
        'secondaryTextColor': secondaryTextColor,
        'charcoalBlack': charcoalBlack,
        'black': black,
        'success': success,
        'danger': danger,
        'disabledButton': disabledButton,
        'lightGray': lightGray,
        'secondaryColor': secondaryColor,
        'darkGray': darkGray,
        'dark': dark,
        'white': white,
        'bgGray': bgGray,
        'borderGray': borderGray,
      },
    },
  },
  plugins: [],
};