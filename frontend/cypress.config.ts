import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: !process.env.CI ? 'http://localhost:5173' : 'http://localhost:3000',
  },
});
