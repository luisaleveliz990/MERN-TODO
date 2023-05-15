module.exports = {
    content: ["./src/**/*.{js,jsx}","./node_moduels/flowbite/**/*.js"],
    safelist: [],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
        },
    },
    plugins: [
        require('flowbite/plugin')
    ],
};
