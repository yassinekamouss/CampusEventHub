/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "tp-dark": "#1a1a1a",
        "tp-blue": "#0066cc",
      },
    },
  },
  plugins: [],
};
