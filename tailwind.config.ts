import type {Config} from 'tailwindcss';
import daisyui from 'daisyui';

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {},
	},
	daisyui: {
		themes: ['luxury'],
	},

	plugins: [daisyui],
} satisfies Config;

export default config;
