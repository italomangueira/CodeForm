/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        onPrimary: "var(--color-on-primary)",
        background: "var(--color-background)",
        // ...adicione os outros conforme necessário
      },
      fontFamily: {
        brand: "var(--font-brand)",
        plain: "var(--font-plain)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
