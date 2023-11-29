import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    {
      name: 'a-vitest-plugin-that-changes-config',
      config: () => ({
        test: {
          setupFiles: ['./global-setup-test.js'],
          watch: false,
        },
      }),
    },
  ],
});
