import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF8F5',
        ink: '#1C1B19',
        stone: {
          200: '#E5E2DC',
          300: '#D6D3CD',
        },
        accent: '#2F5D50',
        mastery: {
          strong: '#889D89',
          fair: '#C39953',
          weak: '#C47B62',
          critical: '#A95C4A',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-newsreader)', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
