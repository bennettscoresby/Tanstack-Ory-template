/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        container: {
            center: true,
        },
        extend: {
            colors: {
                'text': 'var(--color-text)',
                'background': 'var(--color-background)',
                'primary': 'var(--color-primary)',
                'secondary': 'var(--color-secondary)',
                'accent': 'var(--color-accent)',
            },
        },
    },
    plugins: [],
}