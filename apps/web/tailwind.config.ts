import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
		"./content/**/*.{md,mdx}",
		"./node_modules/fumadocs-ui/dist/**/*.js",
	],
	theme: {
		extend: {},
	},
	plugins: [require("@tailwindcss/typography")],
};

export default config;
