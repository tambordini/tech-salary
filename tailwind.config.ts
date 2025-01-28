import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				notosans: ['NotoSansThai', 'sans-serif']
			}
		}
	},
	plugins: []
} satisfies Config;
