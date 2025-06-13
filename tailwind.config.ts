import { type Config } from 'tailwindcss';

export default {
    darkMode: 'class',
    content: {
        relative: true,
        files: [
            './app/**/*.{js,ts,jsx,tsx}',
            './public/**/*.{html,js}',
        ],
    },
    theme: {
        extend: {
            fontFamily: {
                sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
} satisfies Config;