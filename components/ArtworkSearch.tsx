'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Artwork {
  id: number;
  title: string;
  category: 'painting' | 'digital' | 'print' | 'installation';
  size: string;
  medium: string;
  year: number;
  price: string;
  description: string;
  color: string;
  tags?: string[];
}

interface ArtworkSearchProps {
  artworks: Artwork[];
  onFilter: (filteredArtworks: Artwork[]) => void;
}

export default function ArtworkSearch({ artworks, onFilter }: ArtworkSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [isExpanded, setIsExpanded] = useState(false);

  const categories = ['all', 'painting', 'digital', 'print', 'installation'];
  const years = ['all', ...Array.from(new Set(artworks.map(art => art.year))).sort((a, b) => b - a)];
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'under-1000', label: 'Under $1,000' },
    { value: '1000-5000', label: '$1,000 - $5,000' },
    { value: '5000-10000', label: '$5,000 - $10,000' },
    { value: 'over-10000', label: 'Over $10,000' },
    { value: 'commission', label: 'Commission Only' },
  ];

  // Filter artworks based on all criteria
  const filteredArtworks = useMemo(() => {
    let filtered = artworks;

    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(artwork =>
        artwork.title.toLowerCase().includes(query) ||
        artwork.description.toLowerCase().includes(query) ||
        artwork.medium.toLowerCase().includes(query) ||
        artwork.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(artwork => artwork.category === selectedCategory);
    }

    // Year filter
    if (selectedYear !== 'all') {
      filtered = filtered.filter(artwork => artwork.year === Number(selectedYear));
    }

    // Price range filter
    if (priceRange !== 'all') {
      filtered = filtered.filter(artwork => {
        const price = artwork.price.toLowerCase();

        if (priceRange === 'commission') {
          return price.includes('commission');
        }

        // Extract numeric value (handles $, ETH, etc.)
        const numericPrice = parseFloat(price.replace(/[^0-9.,]/g, '').replace(',', ''));

        switch (priceRange) {
          case 'under-1000':
            return numericPrice < 1000;
          case '1000-5000':
            return numericPrice >= 1000 && numericPrice <= 5000;
          case '5000-10000':
            return numericPrice >= 5000 && numericPrice <= 10000;
          case 'over-10000':
            return numericPrice > 10000;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [artworks, searchQuery, selectedCategory, selectedYear, priceRange]);

  // Update parent component when filters change
  useMemo(() => {
    onFilter(filteredArtworks);
  }, [filteredArtworks, onFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedYear('all');
    setPriceRange('all');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedYear !== 'all' || priceRange !== 'all';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-cosmic-nebula/30 backdrop-blur-sm border border-cosmic-aura rounded-2xl p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-cosmic-glow">
          ✨ Discover Mystical Art
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-cosmic-light hover:text-cosmic-glow transition-colors"
          aria-label={isExpanded ? "Collapse search filters" : "Expand search filters"}
        >
          {isExpanded ? '🔼 Less' : '🔽 More Filters'}
        </motion.button>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <label htmlFor="artwork-search" className="block text-sm text-cosmic-light mb-2">
          Search artworks, descriptions, or techniques
        </label>
        <input
          id="artwork-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter mystical keywords..."
          className="w-full px-4 py-3 bg-cosmic-void/50 border border-cosmic-aura rounded-lg text-cosmic-glow placeholder-cosmic-light/50 focus:outline-none focus:border-cosmic-plasma focus:ring-2 focus:ring-cosmic-plasma/50"
        />
      </div>

      {/* Filter Results Summary */}
      <div className="mb-4 text-center">
        <span className="text-cosmic-light text-sm">
          Showing {filteredArtworks.length} of {artworks.length} artworks
        </span>
        {hasActiveFilters && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearFilters}
            className="ml-4 text-xs text-cosmic-aura hover:text-cosmic-plasma underline"
          >
            Clear all filters
          </motion.button>
        )}
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label htmlFor="category-filter" className="block text-sm text-cosmic-light mb-2">
                  Category
                </label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-cosmic-void/50 border border-cosmic-aura rounded-lg text-cosmic-glow focus:outline-none focus:border-cosmic-plasma focus:ring-2 focus:ring-cosmic-plasma/50"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div>
                <label htmlFor="year-filter" className="block text-sm text-cosmic-light mb-2">
                  Year Created
                </label>
                <select
                  id="year-filter"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 bg-cosmic-void/50 border border-cosmic-aura rounded-lg text-cosmic-glow focus:outline-none focus:border-cosmic-plasma focus:ring-2 focus:ring-cosmic-plasma/50"
                >
                  {years.map(year => (
                    <option key={year} value={year}>
                      {year === 'all' ? 'All Years' : year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label htmlFor="price-filter" className="block text-sm text-cosmic-light mb-2">
                  Price Range
                </label>
                <select
                  id="price-filter"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-3 py-2 bg-cosmic-void/50 border border-cosmic-aura rounded-lg text-cosmic-glow focus:outline-none focus:border-cosmic-plasma focus:ring-2 focus:ring-cosmic-plasma/50"
                >
                  {priceRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filter Tags */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-cosmic-aura/30">
                <span className="text-xs text-cosmic-light">Active filters:</span>
                {searchQuery && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-2 py-1 bg-cosmic-plasma/20 text-cosmic-glow text-xs rounded-full border border-cosmic-plasma/50"
                  >
                    Search: "{searchQuery}"
                  </motion.span>
                )}
                {selectedCategory !== 'all' && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-2 py-1 bg-cosmic-aura/20 text-cosmic-glow text-xs rounded-full border border-cosmic-aura/50"
                  >
                    {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                  </motion.span>
                )}
                {selectedYear !== 'all' && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-2 py-1 bg-cosmic-astral/20 text-cosmic-glow text-xs rounded-full border border-cosmic-astral/50"
                  >
                    Year: {selectedYear}
                  </motion.span>
                )}
                {priceRange !== 'all' && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-2 py-1 bg-mystic-gold/20 text-cosmic-glow text-xs rounded-full border border-mystic-gold/50"
                  >
                    {priceRanges.find(r => r.value === priceRange)?.label}
                  </motion.span>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}