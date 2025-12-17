import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node', // Käytetään perus Node-ympäristöä
    globals: true,
  },
});
