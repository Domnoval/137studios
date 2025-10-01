import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'

// Mock session data for testing
export const mockSession = {
  user: {
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    role: 'USER' as const,
  },
  expires: '2025-01-01',
}

export const mockAdminSession = {
  user: {
    id: 'admin-user-id',
    name: 'Admin User',
    email: 'admin@137studios.com',
    role: 'admin' as const,
  },
  expires: '2025-01-01',
}

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  session?: typeof mockSession | null
}

export function renderWithProviders(
  ui: ReactElement,
  { session = null, ...renderOptions }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <SessionProvider session={session}>
        {children}
      </SessionProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Mock artwork data for testing
export const mockArtwork = {
  id: 1,
  title: 'Test Cosmic Art',
  category: 'painting' as const,
  size: '24x36',
  medium: 'Digital',
  year: 2024,
  price: '$1,337',
  description: 'A test artwork for cosmic consciousness',
  color: '#9333ea',
  tags: ['test', 'cosmic', 'art'],
}

export const mockArtworks = [
  mockArtwork,
  {
    id: 2,
    title: 'Digital Dreams',
    category: 'digital' as const,
    size: '∞x∞',
    medium: 'Algorithm',
    year: 2024,
    price: 'ETH 0.137',
    description: 'Dreams rendered in code',
    color: '#00ffff',
    tags: ['digital', 'dreams', 'algorithm'],
  },
]

// Mock API responses
export const mockApiResponse = (data: any, ok = true, status = 200) => {
  return Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  } as Response)
}

// Mock fetch for API testing
export const mockFetch = (responseData: any, ok = true, status = 200) => {
  global.fetch = jest.fn().mockResolvedValue(mockApiResponse(responseData, ok, status))
}

// Reset mocks between tests
export const resetMocks = () => {
  jest.clearAllMocks()
  if (global.fetch) {
    (global.fetch as jest.Mock).mockReset()
  }
}

// Wait for async updates
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))

// Simulate user events
export const simulateUserEvent = async (element: HTMLElement, eventType: string) => {
  const event = new Event(eventType, { bubbles: true })
  element.dispatchEvent(event)
  await waitForAsync()
}

// Test database utilities (for integration tests)
export const createTestUser = () => ({
  id: 'test-user-' + Date.now(),
  email: `test-${Date.now()}@example.com`,
  name: 'Test User',
  role: 'USER' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
})

export const createTestArtwork = () => ({
  id: 'test-artwork-' + Date.now(),
  title: 'Test Artwork ' + Date.now(),
  category: 'PAINTING' as const,
  description: 'A test artwork',
  year: 2024,
  price: '100.00',
  color: '#000000',
  createdAt: new Date(),
  updatedAt: new Date(),
})

// Performance testing utilities
export const measurePerformance = async (fn: () => Promise<void>) => {
  const start = performance.now()
  await fn()
  const end = performance.now()
  return end - start
}

// Accessibility testing helpers
export const checkAccessibility = (container: HTMLElement) => {
  const issues: string[] = []

  // Check for missing alt attributes
  const images = container.querySelectorAll('img:not([alt])')
  if (images.length > 0) {
    issues.push(`${images.length} images missing alt attributes`)
  }

  // Check for buttons without accessible names
  const buttons = container.querySelectorAll('button:not([aria-label]):not([aria-labelledby])')
  buttons.forEach((button) => {
    if (!button.textContent?.trim()) {
      issues.push('Button without accessible name found')
    }
  })

  // Check for form inputs without labels
  const inputs = container.querySelectorAll('input:not([aria-label]):not([aria-labelledby])')
  inputs.forEach((input) => {
    const inputElement = input as HTMLInputElement
    if (inputElement.type !== 'hidden') {
      const label = container.querySelector(`label[for="${inputElement.id}"]`)
      if (!label) {
        issues.push(`Input without label: ${inputElement.type}`)
      }
    }
  })

  return issues
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'