import { defineConfig } from "tailwindcss";

export default defineConfig({
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {},
	darkMode: "class", // optional if you want dark mode support
	plugins: [],
});
