import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {
		base: './',
		server: {
			host: true,
			// port: 3000,
		},
		build: {
			outDir: './dist',
			rollupOptions: {
				output: {
					entryFileNames: '[name].js',
					assetFileNames: '[name].css',
				},
			},
		},
	};
});
