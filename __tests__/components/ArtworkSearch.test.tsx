import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ArtworkSearch from '@/components/ArtworkSearch'

const mockArtworks = [
  {
    id: 1,
    title: 'Cosmic Birth',
    category: 'painting' as const,
    size: '72x48',
    medium: 'Acrylic on Canvas',
    year: 2024,
    price: '$8,888',
    description: 'The universe\'s first breath, captured in swirling nebulas of consciousness.',
    color: '#9333ea',
    tags: ['nebula', 'cosmic', 'consciousness', 'birth', 'universe']
  },
  {
    id: 2,
    title: 'Digital Ayahuasca',
    category: 'digital' as const,
    size: '∞x∞',
    medium: 'Generative Algorithm',
    year: 2024,
    price: 'ETH 1.37',
    description: 'Machine dreams meet plant wisdom in this algorithmic vision quest.',
    color: '#00ffff',
    tags: ['ayahuasca', 'digital', 'psychedelic', 'algorithm', 'vision', 'shamanic']
  },
  {
    id: 3,
    title: 'Void Walker',
    category: 'painting' as const,
    size: '96x72',
    medium: 'Mixed Media',
    year: 2023,
    price: '$13,700',
    description: 'A figure traversing the spaces between realities, neither here nor there.',
    color: '#1a0033',
    tags: ['void', 'liminal', 'reality', 'space', 'figure', 'traversal']
  }
]

const mockOnFilter = jest.fn()

describe('ArtworkSearch Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders search interface with all filter options', () => {
    render(<ArtworkSearch artworks={mockArtworks} onFilter={mockOnFilter} />)

    // Search input
    expect(screen.getByLabelText(/search artworks/i)).toBeInTheDocument()

    // Filter toggle button
    expect(screen.getByLabelText(/expand search filters/i)).toBeInTheDocument()

    // Results summary
    expect(screen.getByText('Showing 3 of 3 artworks')).toBeInTheDocument()
  })

  it('filters artworks by search query', async () => {
    const user = userEvent.setup()

    render(<ArtworkSearch artworks={mockArtworks} onFilter={mockOnFilter} />)

    const searchInput = screen.getByLabelText(/search artworks/i)
    await user.type(searchInput, 'cosmic')

    await waitFor(() => {
      expect(mockOnFilter).toHaveBeenCalledWith([mockArtworks[0]]) // Only "Cosmic Birth" matches
    })
  })

  it('expands and shows advanced filters', async () => {
    const user = userEvent.setup()

    render(<ArtworkSearch artworks={mockArtworks} onFilter={mockOnFilter} />)

    const expandButton = screen.getByLabelText(/expand search filters/i)
    await user.click(expandButton)

    await waitFor(() => {
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/year created/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/price range/i)).toBeInTheDocument()
    })
  })

  it('filters by category', async () => {
    const user = userEvent.setup()

    render(<ArtworkSearch artworks={mockArtworks} onFilter={mockOnFilter} />)

    // Expand filters
    const expandButton = screen.getByLabelText(/expand search filters/i)
    await user.click(expandButton)

    // Select digital category
    const categorySelect = screen.getByLabelText(/category/i)
    await user.selectOptions(categorySelect, 'digital')

    await waitFor(() => {
      expect(mockOnFilter).toHaveBeenCalledWith([mockArtworks[1]]) // Only "Digital Ayahuasca"
    })
  })

  it('filters by year', async () => {
    const user = userEvent.setup()

    render(<ArtworkSearch artworks={mockArtworks} onFilter={mockOnFilter} />)

    // Expand filters
    const expandButton = screen.getByLabelText(/expand search filters/i)
    await user.click(expandButton)

    // Select 2023
    const yearSelect = screen.getByLabelText(/year created/i)
    await user.selectOptions(yearSelect, '2023')

    await waitFor(() => {
      expect(mockOnFilter).toHaveBeenCalledWith([mockArtworks[2]]) // Only "Void Walker"
    })
  })

  it('filters by price range', async () => {
    const user = userEvent.setup()

    render(<ArtworkSearch artworks={mockArtworks} onFilter={mockOnFilter} />)

    // Expand filters
    const expandButton = screen.getByLabelText(/expand search filters/i)
    await user.click(expandButton)

    // Select price range $5,000 - $10,000 (should match nothing)
    const priceSelect = screen.getByLabelText(/price range/i)
    await user.selectOptions(priceSelect, '5000-10000')

    await waitFor(() => {
      expect(mockOnFilter).toHaveBeenCalledWith([]) // No artworks in this price range
    })
  })

  it('combines multiple filters', async () => {
    const user = userEvent.setup()

    render(<ArtworkSearch artworks={mockArtworks} onFilter={mockOnFilter} />)

    // Search for "cosmic"
    const searchInput = screen.getByLabelText(/search artworks/i)
    await user.type(searchInput, 'cosmic')

    // Expand filters
    const expandButton = screen.getByLabelText(/expand search filters/i)
    await user.click(expandButton)

    // Select painting category
    const categorySelect = screen.getByLabelText(/category/i)
    await user.selectOptions(categorySelect, 'painting')

    await waitFor(() => {
      expect(mockOnFilter).toHaveBeenCalledWith([mockArtworks[0]]) // "Cosmic Birth" matches both
    })
  })

  it('shows active filter tags', async () => {
    const user = userEvent.setup()

    render(<ArtworkSearch artworks={mockArtworks} onFilter={mockOnFilter} />)

    // Add search query
    const searchInput = screen.getByLabelText(/search artworks/i)
    await user.type(searchInput, 'cosmic')

    // Expand filters
    const expandButton = screen.getByLabelText(/expand search filters/i)
    await user.click(expandButton)

    // Select category
    const categorySelect = screen.getByLabelText(/category/i)
    await user.selectOptions(categorySelect, 'painting')

    await waitFor(() => {
      expect(screen.getByText('Search: "cosmic"')).toBeInTheDocument()
      expect(screen.getByText('Painting')).toBeInTheDocument()
    })
  })

  it('clears all filters', async () => {
    const user = userEvent.setup()

    render(<ArtworkSearch artworks={mockArtworks} onFilter={mockOnFilter} />)

    // Add search query
    const searchInput = screen.getByLabelText(/search artworks/i)
    await user.type(searchInput, 'cosmic')

    // Clear filters
    const clearButton = screen.getByText(/clear all filters/i)
    await user.click(clearButton)

    await waitFor(() => {
      expect(searchInput).toHaveValue('')
      expect(mockOnFilter).toHaveBeenCalledWith(mockArtworks) // All artworks
    })
  })

  it('updates results count correctly', async () => {
    const user = userEvent.setup()

    render(<ArtworkSearch artworks={mockArtworks} onFilter={mockOnFilter} />)

    // Initially shows all artworks
    expect(screen.getByText('Showing 3 of 3 artworks')).toBeInTheDocument()

    // Filter to reduce results
    const searchInput = screen.getByLabelText(/search artworks/i)
    await user.type(searchInput, 'cosmic')

    await waitFor(() => {
      expect(screen.getByText('Showing 1 of 3 artworks')).toBeInTheDocument()
    })
  })

  it('handles edge cases gracefully', () => {
    render(<ArtworkSearch artworks={[]} onFilter={mockOnFilter} />)

    expect(screen.getByText('Showing 0 of 0 artworks')).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<ArtworkSearch artworks={mockArtworks} onFilter={mockOnFilter} />)

    const searchInput = screen.getByLabelText(/search artworks/i)
    expect(searchInput).toHaveAttribute('type', 'text')
    expect(searchInput).toHaveAttribute('placeholder')

    const expandButton = screen.getByLabelText(/expand search filters/i)
    expect(expandButton).toHaveAttribute('aria-label')
  })
})