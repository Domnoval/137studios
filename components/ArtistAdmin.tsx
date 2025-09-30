'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MysticalUploader from './MysticalUploader';

interface NewArtwork {
  title: string;
  category: 'painting' | 'digital' | 'print' | 'installation';
  medium: string;
  size: string;
  year: number;
  price: string;
  description: string;
}

export default function ArtistAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const [newArtwork, setNewArtwork] = useState<NewArtwork>({
    title: '',
    category: 'painting',
    medium: '',
    size: '',
    year: new Date().getFullYear(),
    price: '',
    description: '',
  });
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  const handleUpload = (files: File[]) => {
    setUploadedImages(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newArtwork.title || uploadedImages.length === 0) {
      alert('Please fill in the title and upload at least one image');
      return;
    }

    // Here you'd integrate with your backend/database
    const artworkData = {
      ...newArtwork,
      images: uploadedImages,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    console.log('New artwork:', artworkData);

    // Reset form
    setNewArtwork({
      title: '',
      category: 'painting',
      medium: '',
      size: '',
      year: new Date().getFullYear(),
      price: '',
      description: '',
    });
    setUploadedImages([]);

    alert('Artwork manifested successfully! ✨');
  };

  // Secret admin access (replace with real auth)
  const [adminCode, setAdminCode] = useState('');
  const isAuthorized = adminCode === '137' || isOpen;

  if (!isAuthorized) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-cosmic-void/95 backdrop-blur-lg z-50 flex items-center justify-center"
      >
        <div className="bg-cosmic-nebula/50 p-8 rounded-2xl border border-cosmic-aura max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-cosmic-glow mb-4 text-center">
            Artist Portal Access
          </h2>
          <p className="text-cosmic-light mb-6 text-center">
            Enter the sacred code to manifest new artworks
          </p>
          <input
            type="password"
            value={adminCode}
            onChange={(e) => setAdminCode(e.target.value)}
            placeholder="Enter code..."
            className="w-full px-4 py-3 bg-cosmic-void border border-cosmic-aura rounded-full text-cosmic-glow placeholder-cosmic-light/50 focus:outline-none focus:border-cosmic-plasma mb-4"
            onKeyPress={(e) => e.key === 'Enter' && setIsOpen(true)}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="w-full py-3 bg-gradient-to-r from-cosmic-plasma to-cosmic-aura rounded-full text-white font-bold"
          >
            Enter the Sacred Realm
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-cosmic-void/95 backdrop-blur-lg z-50 overflow-y-auto"
        >
          <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">
                  <span className="bg-gradient-to-r from-cosmic-plasma to-mystic-gold bg-clip-text text-transparent">
                    Artist Portal
                  </span>
                </h1>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 border border-cosmic-aura rounded-full text-cosmic-light hover:bg-cosmic-aura/20"
                >
                  Exit Portal
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Image Upload */}
                <div>
                  <h3 className="text-xl font-bold text-cosmic-glow mb-4">Upload Artwork Images</h3>
                  <MysticalUploader
                    onUpload={handleUpload}
                    mode="artist"
                    maxFiles={5}
                  />
                </div>

                {/* Artwork Details */}
                <div className="bg-cosmic-nebula/30 rounded-2xl p-6 border border-cosmic-astral">
                  <h3 className="text-xl font-bold text-cosmic-glow mb-6">Artwork Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-cosmic-light mb-2">Title *</label>
                      <input
                        type="text"
                        value={newArtwork.title}
                        onChange={(e) => setNewArtwork({...newArtwork, title: e.target.value})}
                        className="w-full px-4 py-3 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow focus:outline-none focus:border-cosmic-plasma"
                        placeholder="Cosmic Birth, Digital Ayahuasca..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-cosmic-light mb-2">Category *</label>
                      <select
                        value={newArtwork.category}
                        onChange={(e) => setNewArtwork({...newArtwork, category: e.target.value as any})}
                        className="w-full px-4 py-3 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow focus:outline-none focus:border-cosmic-plasma"
                      >
                        <option value="painting">Painting</option>
                        <option value="digital">Digital</option>
                        <option value="print">Print</option>
                        <option value="installation">Installation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-cosmic-light mb-2">Medium</label>
                      <input
                        type="text"
                        value={newArtwork.medium}
                        onChange={(e) => setNewArtwork({...newArtwork, medium: e.target.value})}
                        className="w-full px-4 py-3 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow focus:outline-none focus:border-cosmic-plasma"
                        placeholder="Acrylic on Canvas, Digital, Mixed Media..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-cosmic-light mb-2">Size</label>
                      <input
                        type="text"
                        value={newArtwork.size}
                        onChange={(e) => setNewArtwork({...newArtwork, size: e.target.value})}
                        className="w-full px-4 py-3 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow focus:outline-none focus:border-cosmic-plasma"
                        placeholder="72x48, ∞x∞, Room Scale..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-cosmic-light mb-2">Year</label>
                      <input
                        type="number"
                        value={newArtwork.year}
                        onChange={(e) => setNewArtwork({...newArtwork, year: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow focus:outline-none focus:border-cosmic-plasma"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-cosmic-light mb-2">Price</label>
                      <input
                        type="text"
                        value={newArtwork.price}
                        onChange={(e) => setNewArtwork({...newArtwork, price: e.target.value})}
                        className="w-full px-4 py-3 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow focus:outline-none focus:border-cosmic-plasma"
                        placeholder="$8,888, ETH 1.37, Commission..."
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm text-cosmic-light mb-2">Description</label>
                    <textarea
                      value={newArtwork.description}
                      onChange={(e) => setNewArtwork({...newArtwork, description: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow focus:outline-none focus:border-cosmic-plasma resize-none"
                      placeholder="Describe the mystical journey behind this piece..."
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end">
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-cosmic-plasma to-cosmic-aura rounded-full text-white font-bold text-lg"
                  >
                    Manifest Artwork ✨
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}