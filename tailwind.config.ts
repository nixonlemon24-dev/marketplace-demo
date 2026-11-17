import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const c = (n: string) => `hsl(var(--${n}))`;
const pair = (n: string) => ({ DEFAULT: c(n), foreground: c(`${n}-foreground`) });

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: c("border"), input: c("input"), ring: c("ring"), background: c("background"), foreground: c("foreground"),
        primary: pair("primary"), secondary: pair("secondary"), muted: pair("muted"),
        accent: pair("accent"), destructive: pair("destructive"), card: pair("card"),
      },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
      fontFamily: { sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"] },
    },
  },
  plugins: [animate],
};
export default config;
