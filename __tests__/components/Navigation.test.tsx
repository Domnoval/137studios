import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useSession } from 'next-auth/react'
import Navigation from '@/components/Navigation'

// Mock the useSession hook
jest.mock('next-auth/react')
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>

describe('Navigation Component', () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: jest.fn(),
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders navigation with logo and menu items', () => {
    render(<Navigation />)

    // Check logo
    expect(screen.getByText('137')).toBeInTheDocument()

    // Check desktop navigation items
    expect(screen.getByText('Gallery')).toBeInTheDocument()
    expect(screen.getByText('Installations')).toBeInTheDocument()
    expect(screen.getByText('Process')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()

    // Check oracle button
    expect(screen.getByLabelText(/access admin portal/i)).toBeInTheDocument()
  })

  it('shows mobile menu button on mobile viewport', () => {
    render(<Navigation />)

    const mobileMenuButton = screen.getByLabelText(/open mobile navigation menu/i)
    expect(mobileMenuButton).toBeInTheDocument()
    expect(mobileMenuButton).toHaveClass('md:hidden')
  })

  it('opens mobile menu when hamburger button is clicked', async () => {
    render(<Navigation />)

    const mobileMenuButton = screen.getByLabelText(/open mobile navigation menu/i)
    fireEvent.click(mobileMenuButton)

    await waitFor(() => {
      expect(screen.getByLabelText(/mobile navigation menu/i)).toBeInTheDocument()
    })
  })

  it('has proper accessibility attributes', () => {
    render(<Navigation />)

    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'Main navigation')

    const mobileMenuButton = screen.getByLabelText(/open mobile navigation menu/i)
    expect(mobileMenuButton).toHaveAttribute('aria-expanded')
    expect(mobileMenuButton).toHaveAttribute('aria-controls', 'mobile-menu')
  })

  it('navigates to admin login when oracle button is clicked', () => {
    const originalLocation = window.location
    delete window.location
    window.location = { ...originalLocation, href: '' }

    render(<Navigation />)

    const oracleButton = screen.getByLabelText(/access admin portal/i)
    fireEvent.click(oracleButton)

    expect(window.location.href).toBe('/admin/login')

    window.location = originalLocation
  })

  it('scrolls to top when logo is clicked', () => {
    const scrollToSpy = jest.spyOn(window, 'scrollTo').mockImplementation()

    render(<Navigation />)

    const logo = screen.getByLabelText(/137studios home/i)
    fireEvent.click(logo)

    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    })

    scrollToSpy.mockRestore()
  })

  it('applies correct styling when scrolled', () => {
    // Mock scrollY value
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: 100,
    })

    render(<Navigation />)

    // Trigger scroll event
    fireEvent.scroll(window, { target: { scrollY: 100 } })

    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('backdrop-blur-md')
  })

  it('handles keyboard navigation properly', () => {
    render(<Navigation />)

    const galleryButton = screen.getByText('Gallery')

    // Focus should be visible
    galleryButton.focus()
    expect(galleryButton).toHaveFocus()

    // Should handle Enter key
    fireEvent.keyDown(galleryButton, { key: 'Enter' })
    // Navigation behavior would be tested in integration tests
  })
})