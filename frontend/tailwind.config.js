/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,js,jsx,ts,tsx}",
        "./public/**/*.{html,js,jsx,ts,tsx}",
        './node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        darkMode: false,
        extend: {},
    },
    plugins: [
        require('@headlessui/tailwindcss'),
        require('flowbite/plugin'),
    ]
}

