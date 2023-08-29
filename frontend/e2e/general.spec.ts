import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { expect, test } from '@playwright/test';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../app.config.json'), 'utf-8'));

test('has title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(config.appName);
});
