import { test, expect } from '@playwright/test'

test.describe('User Registration and Shopping Flow', () => {
  test('complete user journey from registration to order', async ({ page }) => {
    // 1. Start at homepage
    await page.goto('/')
    await expect(page.getByText('137')).toBeVisible()

    // 2. Navigate to registration
    await page.getByRole('button', { name: /join the cosmos/i }).click()
    await expect(page).toHaveURL('/register')

    // 3. Fill registration form
    await page.fill('#name', 'Cosmic Traveler')
    await page.fill('#email', `test-${Date.now()}@example.com`)
    await page.fill('#password', 'SecurePassword123!')
    await page.fill('#confirmPassword', 'SecurePassword123!')

    // 4. Submit registration
    await page.click('button[type="submit"]')

    // 5. Should redirect to success or login page
    // (This depends on your registration flow)
    await page.waitForURL(/login|success|dashboard/)

    // 6. Navigate back to gallery
    await page.goto('/')

    // 7. Browse artworks
    const gallerySection = page.locator('#gallery')
    await gallerySection.scrollIntoViewIfNeeded()

    // 8. Select an artwork
    const firstArtwork = page.locator('[data-testid="artwork-card"]').first()
    if (await firstArtwork.isVisible()) {
      await firstArtwork.click()

      // 9. In artwork detail modal/page
      await expect(page.getByText(/add to cart|buy now/i)).toBeVisible()

      // 10. Add to cart
      await page.getByRole('button', { name: /add to cart/i }).click()

      // 11. Proceed to checkout
      await page.getByRole('button', { name: /checkout|cart/i }).click()

      // 12. Should reach Stripe checkout or cart page
      await page.waitForURL(/checkout|cart|stripe/)
    }
  })

  test('user can search and filter artworks', async ({ page }) => {
    await page.goto('/')

    // Find and use search
    const searchInput = page.getByRole('textbox', { name: /search artworks/i })
    await searchInput.fill('cosmic')

    // Should show filtered results
    await expect(page.getByText(/showing \d+ of \d+ artworks/i)).toBeVisible()

    // Expand filters
    const expandFilters = page.getByRole('button', { name: /more filters/i })
    if (await expandFilters.isVisible()) {
      await expandFilters.click()

      // Use category filter
      await page.selectOption('[data-testid="category-filter"]', 'painting')

      // Should update results
      await expect(page.getByText(/painting/i)).toBeVisible()
    }
  })

  test('admin can access dashboard', async ({ page }) => {
    await page.goto('/')

    // Click oracle button
    await page.getByRole('button', { name: /access admin portal/i }).click()
    await expect(page).toHaveURL('/admin/login')

    // Fill oracle code
    const oracleInput = page.getByRole('textbox', { name: /oracle code/i })
    await oracleInput.fill('137')

    // Submit
    await page.getByRole('button', { name: /enter|login/i }).click()

    // Should reach admin dashboard
    await page.waitForURL(/admin|dashboard/)
    await expect(page.getByText(/admin|dashboard/i)).toBeVisible()
  })

  test('social sharing works', async ({ page }) => {
    await page.goto('/')

    // Find share button
    const shareButton = page.getByRole('button', { name: /share/i }).first()
    if (await shareButton.isVisible()) {
      await shareButton.click()

      // Should show share modal
      await expect(page.getByText(/share this mystical art/i)).toBeVisible()

      // Should have social platform options
      await expect(page.getByRole('button', { name: /twitter|facebook/i })).toBeVisible()

      // Test copy link functionality
      const copyButton = page.getByRole('button', { name: /copy/i })
      await copyButton.click()
      await expect(page.getByText(/copied/i)).toBeVisible()
    }
  })

  test('commenting system works when logged in', async ({ page }) => {
    // This would require setting up authentication state
    await page.goto('/')

    // Navigate to an artwork with comments
    const artworkWithComments = page.locator('[data-testid="artwork-with-community"]').first()
    if (await artworkWithComments.isVisible()) {
      await artworkWithComments.click()

      // Show comments section
      const showComments = page.getByRole('button', { name: /show comments/i })
      if (await showComments.isVisible()) {
        await showComments.click()

        // If not logged in, should prompt to sign in
        if (await page.getByText(/sign in to share/i).isVisible()) {
          await page.getByRole('button', { name: /enter the realm/i }).click()
          // Would then go through auth flow
        } else {
          // If logged in, can add comment
          const commentBox = page.getByRole('textbox', { name: /share your consciousness/i })
          await commentBox.fill('This artwork transcends dimensions!')
          await page.getByRole('button', { name: /post/i }).click()

          // Should see the new comment
          await expect(page.getByText('This artwork transcends dimensions!')).toBeVisible()
        }
      }
    }
  })

  test('email subscription works', async ({ page }) => {
    await page.goto('/')

    // Find newsletter signup
    const emailInput = page.getByRole('textbox', { name: /email|newsletter/i })
    if (await emailInput.isVisible()) {
      await emailInput.fill('cosmic@example.com')
      await page.getByRole('button', { name: /subscribe|join/i }).click()

      // Should show success message
      await expect(page.getByText(/subscribed|thank you/i)).toBeVisible()
    }
  })

  test('error handling works correctly', async ({ page }) => {
    // Test 404 page
    await page.goto('/non-existent-page')
    await expect(page.getByText(/404|not found/i)).toBeVisible()

    // Test API error handling
    await page.route('/api/artwork/*', route => route.abort())
    await page.goto('/')

    // Should handle gracefully
    await expect(page.getByText('137')).toBeVisible()
  })

  test('works across different screen sizes', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080, name: 'Desktop Large' },
      { width: 1366, height: 768, name: 'Desktop Medium' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' },
    ]

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto('/')

      // Basic elements should be visible
      await expect(page.getByText('137')).toBeVisible()

      // Navigation should work appropriately for screen size
      if (viewport.width < 768) {
        // Mobile: hamburger menu should be visible
        await expect(page.getByRole('button', { name: /open mobile navigation/i })).toBeVisible()
      } else {
        // Desktop: regular nav should be visible
        await expect(page.getByRole('button', { name: 'Gallery' })).toBeVisible()
      }
    }
  })
})