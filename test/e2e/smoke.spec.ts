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

  await page
    .getByLabel(/Paste garden note/i)
    .fill('Tomato and basil bed with white powder on cucumber leaves.')
  await page.getByRole('button', { name: /Analyze text/i }).click()
  await expect(page.getByText(/Text evidence classifier active/i)).toBeVisible()
  await expect(page.getByRole('button', { name: /Apply crop guesses/i })).toBeVisible()

  const csvDownload = page.waitForEvent('download')
  await page.getByRole('button', { name: /Harvest CSV/i }).click()
  await expect((await csvDownload).suggestedFilename()).toContain('harvest.csv')

  const stateDownload = page.waitForEvent('download')
  await page.getByRole('button', { name: /State JSON/i }).click()
  await expect((await stateDownload).suggestedFilename()).toContain('garden-state.json')

  await page.getByRole('button', { name: /Share link/i }).click()
  await expect(page).toHaveURL(/#garden=/)
})
