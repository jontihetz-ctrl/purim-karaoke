import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        wa: {
          bg: "#111b21",
          sidebar: "#202c33",
          panel: "#202c33",
          input: "#2a3942",
          border: "#2a3942",
          green: "#00a884",
          "green-dark": "#005c4b",
          "green-msg": "#005c4b",
          "gray-msg": "#202c33",
          text: "#e9edef",
          sub: "#8696a0",
        },
      },
    },
  },
  plugins: [],
};
export default config;
