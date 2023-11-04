import { defineConfig } from 'cypress';

// 13.4.0
export default defineConfig({
  e2e: {
    baseUrl: !process.env.CI ? 'http://localhost:5173' : 'http://localhost:3000',
  },
});
