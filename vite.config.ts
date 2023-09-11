import {sveltekit} from '@sveltejs/kit/vite';
import {defineConfig} from 'vitest/config';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import okLab from '@csstools/postcss-oklab-function';
import type {Plugin} from 'postcss';
import tailwindConfig from './tailwind.config.js';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
	css: {
		postcss: {
			plugins: [tailwindcss(tailwindConfig) as Plugin, autoprefixer(), okLab()],
		},
	},
});
