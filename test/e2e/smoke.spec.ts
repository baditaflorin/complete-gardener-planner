import { expect, test } from '@playwright/test'

test('loads the Pages planner and supports one happy path', async ({ page }) => {
  await page.goto('./')

  await expect(page.getByRole('heading', { name: 'Complete Gardener Planner' })).toBeVisible()
  await expect(page.getByRole('link', { name: /Star on GitHub/i })).toHaveAttribute(
    'href',
    'https://github.com/baditaflorin/complete-gardener-planner',
  )
  await expect(page.getByRole('link', { name: /Support/i })).toHaveAttribute(
    'href',
    'https://www.paypal.com/paypalme/florinbadita',
  )
  await expect(page.getByText(/Version 0.2.0/i)).toBeVisible()
  await expect(page.getByText(/Commit/i)).toBeVisible()
  await expect(page.getByRole('heading', { name: /Static data v1/i })).toBeVisible()

  await page.getByLabel('Carrot').check()
  await expect(page.getByRole('heading', { name: /kg expected/i })).toBeVisible()
  await expect(page.getByText(/Carrot/).first()).toBeVisible()
})
