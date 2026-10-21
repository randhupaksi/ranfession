import { expect, test } from '@playwright/test'

test('a reader can begin, reveal the confession, and replay the story', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => pageErrors.push(error.message))

  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1, name: 'Some things are worth saying.' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Enable ambience' })).toHaveAttribute('aria-pressed', 'false')
  await expect(page.getByRole('heading', { name: 'I like you.', exact: true })).toHaveCount(0)

  await page.getByRole('button', { name: 'Begin', exact: true }).click()
  await expect(page.getByRole('main', { name: 'A few honest words' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'I like you.', exact: true })).toHaveCount(0)

  const firstChapterHeading = page.getByRole('heading', { name: 'It started with something small.' })
  await firstChapterHeading.scrollIntoViewIfNeeded()
  await expect(firstChapterHeading).toBeVisible()

  const reveal = page.getByRole('button', { name: 'Reveal', exact: true })
  await reveal.focus()
  await reveal.press('Enter')
  await expect(page.getByRole('heading', { name: 'I like you.', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Whatever you feel, thank you for reading.' })).toBeAttached()

  await page.getByRole('button', { name: 'Read again', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Some things are worth saying.' })).toBeVisible()
  await expect(page.getByRole('main', { name: 'A few honest words' })).toHaveCount(0)
  expect(pageErrors).toEqual([])
})

test('the reveal stays usable on a phone with reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByRole('button', { name: 'Begin', exact: true }).click()

  await expect(page.getByRole('main', { name: 'A few honest words' })).toBeVisible()
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)

  await page.getByRole('button', { name: 'Reveal', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'I like you.', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Read again', exact: true })).toBeAttached()
  const revealedOverflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(revealedOverflow).toBeLessThanOrEqual(0)
})
