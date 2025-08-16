/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { brand: { DEFAULT: "#22c55e", dark: "#16a34a" } },
      boxShadow: { soft: "0 10px 30px rgba(0,0,0,0.15)" },
      borderRadius: { xl2: "1.25rem" }
    }
  },
  plugins: []
}
