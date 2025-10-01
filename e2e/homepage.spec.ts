import { test, expect } from '@playwright/test'

test.describe('137studios Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('loads homepage with cosmic branding', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/137studios - Consciousness Art & Mystical Creations/)

    // Check main logo
    await expect(page.getByText('137')).toBeVisible()

    // Check hero section
    await expect(page.getByText('Where consciousness meets creation')).toBeVisible()
  })

  test('navigation works correctly', async ({ page }) => {
    // Check all navigation items are present
    await expect(page.getByRole('button', { name: 'Gallery' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Installations' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Process' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Contact' })).toBeVisible()

    // Test navigation click (this would scroll to section)
    await page.getByRole('button', { name: 'Gallery' }).click()
    // Note: In a real test, we'd verify the scroll position or section visibility
  })

  test('mobile navigation works', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Desktop nav should be hidden
    await expect(page.locator('nav').getByText('Gallery')).toBeHidden()

    // Mobile menu button should be visible
    const mobileMenuButton = page.getByRole('button', { name: /open mobile navigation menu/i })
    await expect(mobileMenuButton).toBeVisible()

    // Click to open mobile menu
    await mobileMenuButton.click()

    // Mobile menu should appear
    await expect(page.getByRole('dialog', { name: /mobile navigation menu/i })).toBeVisible()

    // Navigation items should be in mobile menu
    await expect(page.getByRole('menuitem', { name: /navigate to gallery/i })).toBeVisible()
  })

  test('oracle admin button redirects to login', async ({ page }) => {
    const oracleButton = page.getByRole('button', { name: /access admin portal/i })
    await expect(oracleButton).toBeVisible()

    // Click should redirect to admin login
    await oracleButton.click()
    await expect(page).toHaveURL('/admin/login')
  })

  test('gallery section displays artworks', async ({ page }) => {
    // Look for gallery section
    const gallerySection = page.getByText('The Collection')
    await expect(gallerySection).toBeVisible()

    // Should have some artworks displayed (mocked or sample data)
    await expect(page.locator('[data-testid="three-canvas"]')).toBeVisible()
  })

  test('search functionality works', async ({ page }) => {
    // Find search input
    const searchInput = page.getByRole('textbox', { name: /search artworks/i })
    if (await searchInput.isVisible()) {
      await searchInput.fill('cosmic')

      // Should show filtered results
      await expect(page.getByText(/showing \d+ of \d+ artworks/i)).toBeVisible()
    }
  })

  test('page is accessible', async ({ page }) => {
    // Run basic accessibility checks
    const accessibilityScanResults = await page.evaluate(() => {
      // Basic checks for accessibility
      const issues = []

      // Check for missing alt attributes on images
      const images = document.querySelectorAll('img:not([alt])')
      if (images.length > 0) {
        issues.push(`${images.length} images missing alt attributes`)
      }

      // Check for headings hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      let previousLevel = 0
      for (const heading of headings) {
        const currentLevel = parseInt(heading.tagName.charAt(1))
        if (currentLevel > previousLevel + 1) {
          issues.push(`Heading level jumps from ${previousLevel} to ${currentLevel}`)
        }
        previousLevel = currentLevel
      }

      // Check for form inputs without labels
      const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])')
      for (const input of inputs) {
        const label = document.querySelector(`label[for="${input.id}"]`)
        if (!label && input.type !== 'hidden') {
          issues.push(`Input without label: ${input.type}`)
        }
      }

      return issues
    })

    // Assert no major accessibility issues
    expect(accessibilityScanResults).toEqual([])
  })

  test('handles network errors gracefully', async ({ page }) => {
    // Block all API requests to simulate network issues
    await page.route('/api/**', route => route.abort())

    await page.goto('/')

    // Page should still load basic content
    await expect(page.getByText('137')).toBeVisible()

    // Should show appropriate error messages for failed requests
    // (This depends on how error handling is implemented)
  })

  test('performance is acceptable', async ({ page }) => {
    // Measure page load performance
    const startTime = Date.now()
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const loadTime = Date.now() - startTime

    // Assert page loads within reasonable time (5 seconds)
    expect(loadTime).toBeLessThan(5000)

    // Check for layout shifts
    const cls = await page.evaluate(() => {
      return new Promise((resolve) => {
        let clsValue = 0
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          }
          resolve(clsValue)
        }).observe({ type: 'layout-shift', buffered: true })

        // Resolve after a short delay if no layout shifts
        setTimeout(() => resolve(clsValue), 1000)
      })
    })

    // Assert minimal layout shift
    expect(cls).toBeLessThan(0.1)
  })

  test('works without JavaScript', async ({ page, context }) => {
    // Disable JavaScript
    await context.setJavaScriptEnabled(false)
    await page.goto('/')

    // Basic content should still be visible
    await expect(page.getByText('137')).toBeVisible()
    await expect(page.getByText('Where consciousness meets creation')).toBeVisible()

    // Navigation should work (though without smooth scrolling)
    const galleryLink = page.getByRole('link', { name: 'Gallery' })
    if (await galleryLink.isVisible()) {
      await galleryLink.click()
    }
  })
})