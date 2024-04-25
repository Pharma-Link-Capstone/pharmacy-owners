/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./components/**/*.{js,ts,vue}",
    "./layouts/**/*.{js,ts,vue}",
    "./pages/**/*.{js,ts,vue}",
  ],
  theme: {
    screens: {
      iphone5: "320px",
      // => @media (min-width: 320px) { for iphone 5 }

      samsg: "360px",
      // => @media (min-width: 320px) { for Samsung phone }

      xxxs: "360px",
      // => @media (min-width: 380px) { ... }

      xxs: "380px",
      // => @media (min-width: 380px) { ... }

      xs: "512px",
      // => @media (min-width: 512px) { ... }

      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }
      mdx: "800px",
      // => @media (min-width: 800px) { ... }
      mdxx: "850px",
      // => @media (min-width: 850px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }

      "3xl": "1600px",
      // => @media (min-width: 1600px) { ... }

      "4xl": "1920px",
      // => @media (min-width: 1920px) { ... }
    },
    extend: {
      boxShadow: {
        "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
        opaq: "0 4px 16px 6px rgba(0,0,0,0.4)",
        full: "0 3px 1px -2px rgba(0,0,0, 0.2), 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12) ",
      },
      colors: {
        primary: {
          50: "#f4f7fe",
          100: "#dee6fb",
          200: "#c4d5f9",
          300: "#9cb9f4",
          400: "#6d94ed",
          500: "#4b71e6",
          600: "#3652db",
          700: "#2d40c8",
          800: "#2a35a3",
          900: "#273281",
          950: "#1c214f",
        },
        secondary: {
          50: "#fcfbea",
          100: "#faf4c7",
          200: "#f6e892",
          300: "#f0d454",
          400: "#e9bd23",
          500: "#d9a719",
          600: "#bc8112",
          700: "#965d12",
          800: "#7c4a17",
          900: "#6a3d19",
          950: "#3e200a",
        },
        gray: {
          50: "#f6f6f6",
          100: "#e7e7e7",
          200: "#d1d1d1",
          300: "#b0b0b0",
          400: "#888888",
          500: "#6d6d6d",
          600: "#5d5d5d",
          700: "#4f4f4f",
          800: "#454545",
          900: "#3d3d3d",
          950: "#313131",
        },
        "primary-dark": {
          50: "#f6f8f9",
          100: "#ebeff3",
          200: "#d3dce4",
          300: "#adbdcc",
          400: "#809ab0",
          500: "#607e97",
          600: "#4c657d",
          700: "#3e5266",
          800: "#364656",
          900: "#1D232C",
          950: "#161b21",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
