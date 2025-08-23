import { defineConfig } from "tailwindcss";

export default defineConfig({
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				pallet: {
					lightGray: "#d7d8d7",
					darkNavy: "#02022d",
					vividGreen: "#1bd03f",
				},
			},
		},
	},
	darkMode: "class", // optional if you want dark mode support
	plugins: [],
});
