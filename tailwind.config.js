/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {},
	},
	plugins: [],
	safelist: ['bg-gray-400', 'text-black', 'bg-blue-600', 'bg-red-500', 'bg-black', 'bg-teal-400', 'bg-green-500', 'rounded-lg', 'px-2', 'py-1'],
};
