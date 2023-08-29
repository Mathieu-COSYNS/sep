import { expect, test } from '@playwright/test';

test('successful', async ({ page }) => {
  await page.route('**/login/', async (route) => {
    const json = { id: 4, name: 'test', admin: false, token: 'b6dd1e54fe79ff5b3b7fe9a6e38c3f2550cc3fe0' };
    await route.fulfill({ json });
  });

  await page.goto('/');
  await page.waitForURL(/\/connexion\/$/);

  await expect(page.getByText('Bonjour, sep')).toHaveCount(0);

  await page.getByLabel('Nom*').click();
  await page.getByLabel('Nom*').fill('test');
  await page.getByLabel('Mot de passe*').click();
  await page.getByLabel('Mot de passe*').fill('$test$1234');
  await page.getByLabel('Mot de passe*').blur();
  await page.getByRole('button', { name: 'Se connecter' }).click();

  await page.waitForURL(/\/stock\/$/);
  await page.getByRole('banner').getByLabel('menu').press('Enter');
  await expect(page.getByText('Bonjour, test')).toBeVisible();
});

test('successful keyboard', async ({ page }) => {
  await page.route('**/login/', async (route) => {
    const json = { id: 4, name: 'test', admin: false, token: 'c6dd1e54fe79ff5b3b7fe9a6e38c3f2550cc3fe0' };
    await route.fulfill({ json });
  });

  await page.goto('/');
  await page.waitForURL(/\/connexion\/$/);

  await expect(page.getByText('Bonjour, sep')).toHaveCount(0);

  await page.getByLabel('Nom*').click();
  await page.getByLabel('Nom*').fill('test');
  await page.keyboard.press('Tab');
  await page.getByLabel('Mot de passe*').fill('$test$1234');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');

  await page.waitForURL(/\/stock\/$/);
  await page.getByRole('banner').getByLabel('menu').press('Enter');
  await expect(page.getByText('Bonjour, test')).toBeVisible();
});

test('wrong username', async ({ page }) => {
  await page.route('**/login/', async (route) => {
    const json = { non_field_errors: ["Impossible de se connecter avec les informations d'identification fournies."] };
    await route.fulfill({ status: 400, json });
  });

  await page.goto('/');
  await page.waitForURL(/\/connexion\/$/);

  await expect(page.getByText('Bonjour, sep')).toHaveCount(0);

  await page.getByLabel('Nom*').click();
  await page.getByLabel('Nom*').fill('test');
  await page.getByLabel('Nom*').press('Tab');
  await page.getByLabel('Mot de passe*').fill('wrong');
  await page.getByRole('button', { name: 'Se connecter' }).click();

  await page.waitForURL(/\/connexion\/$/);
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByRole('alert')).toHaveAttribute('color', 'danger');

  await page.goto('/stock/');
  await expect(page.getByRole('heading').filter({ hasText: '403' })).toBeVisible();
});

test('wrong password', async ({ page }) => {
  await page.route('**/login/', async (route) => {
    const json = { non_field_errors: ["Impossible de se connecter avec les informations d'identification fournies."] };
    await route.fulfill({ status: 400, json });
  });

  await page.goto('/');
  await page.waitForURL(/\/connexion\/$/);

  await expect(page.getByText('Bonjour, sep')).toHaveCount(0);

  await page.getByLabel('Nom*').click();
  await page.getByLabel('Nom*').fill('wrong');
  await page.getByLabel('Nom*').press('Tab');
  await page.getByLabel('Mot de passe*').fill('test1234');
  await page.getByRole('button', { name: 'Se connecter' }).click();

  await page.waitForURL(/\/connexion\/$/);
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByRole('alert')).toHaveAttribute('color', 'danger');

  await page.goto('/stock/');
  await expect(page.getByRole('heading').filter({ hasText: '403' })).toBeVisible();
});
