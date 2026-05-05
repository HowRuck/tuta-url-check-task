import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	root: "src",
	plugins: [tailwindcss()],
	resolve: {
		tsconfigPaths: true,
	},
	server: {
		port: 3000,
	},
});
