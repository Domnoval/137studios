'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrintOption {
  type: 'canvas' | 'poster' | 'shirt' | 'mug' | 'phone-case' | 'sticker';
  name: string;
  recommended: boolean;
  basePrice: number;
}

interface LimitedEdition {
  enabled: boolean;
  quantity: number;
  pricing: 'standard' | 'premium' | 'collectors';
}

interface Props {
  onClose?: () => void;
}

export default function EnhancedArtistAdmin({ onClose }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  // Form data
  const [artworkData, setArtworkData] = useState({
    title: '',
    category: 'painting',
    medium: '',
    size: '',
    year: new Date().getFullYear(),
    price: '',
    description: '',
    tags: '',
  });

  const [printOptions, setPrintOptions] = useState<PrintOption[]>([
    { type: 'canvas', name: 'Canvas Print', recommended: true, basePrice: 89 },
    { type: 'poster', name: 'Art Poster', recommended: true, basePrice: 25 },
    { type: 'shirt', name: 'Art Shirt', recommended: false, basePrice: 35 },
    { type: 'mug', name: 'Art Mug', recommended: false, basePrice: 18 },
    { type: 'phone-case', name: 'Phone Case', recommended: false, basePrice: 22 },
    { type: 'sticker', name: 'Sticker Pack', recommended: true, basePrice: 8 },
  ]);

  const [limitedEdition, setLimitedEdition] = useState<LimitedEdition>({
    enabled: false,
    quantity: 100,
    pricing: 'standard'
  });

  const [selectedPrintTypes, setSelectedPrintTypes] = useState<string[]>(['canvas', 'poster']);

  const analyzeImageForPrint = (file: File) => {
    // Simulate AI analysis of artwork for print suitability
    const isPortrait = Math.random() > 0.5;
    const hasText = Math.random() > 0.7;
    const isColorful = Math.random() > 0.6;

    // Update recommendations based on analysis
    setPrintOptions(prev => prev.map(option => ({
      ...option,
      recommended:
        (option.type === 'canvas' && isPortrait) ||
        (option.type === 'poster' && !hasText) ||
        (option.type === 'shirt' && isColorful) ||
        (option.type === 'sticker' && !isPortrait)
    })));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);

    if (files.length > 0) {
      analyzeImageForPrint(files[0]);
      setCurrentStep(2);
    }
  };

  const togglePrintType = (type: string) => {
    setSelectedPrintTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleSubmit = async () => {
    const uploadData = {
      artwork: artworkData,
      files: selectedFiles,
      printOptions: selectedPrintTypes,
      limitedEdition,
      timestamp: new Date().toISOString(),
    };

    console.log('Uploading artwork with print options:', uploadData);

    // Here you'd integrate with:
    // 1. Vercel Blob for file storage
    // 2. Database for metadata
    // 3. Printful/Printify APIs for product creation

    alert('✨ Artwork uploaded and print products created!');
    setIsOpen(false);
  };

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
                    🎨 Mystical Art Upload
                  </span>
                </h1>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onClose?.();
                  }}
                  className="px-6 py-2 border border-cosmic-aura rounded-full text-cosmic-light hover:bg-cosmic-aura/20"
                >
                  Close Portal
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex justify-center mb-8">
                <div className="flex space-x-4">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        currentStep >= step
                          ? 'bg-gradient-to-r from-cosmic-plasma to-cosmic-aura text-white'
                          : 'border border-cosmic-aura text-cosmic-light'
                      }`}
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 1: File Upload */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-cosmic-glow text-center">Upload Your Mystical Creation</h3>

                  <div className="border-2 border-dashed border-cosmic-aura rounded-2xl p-12 text-center hover:border-cosmic-plasma transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="artwork-upload"
                    />
                    <label htmlFor="artwork-upload" className="cursor-pointer">
                      <div className="text-6xl mb-4">🎨</div>
                      <p className="text-xl text-cosmic-glow mb-2">Drop your art here or click to select</p>
                      <p className="text-cosmic-light">JPEG, PNG, WebP up to 5TB</p>
                    </label>
                  </div>

                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-bold text-cosmic-glow">Selected Files:</h4>
                      {selectedFiles.map((file, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-cosmic-nebula/30 rounded-lg">
                          <span className="text-cosmic-light">{file.name}</span>
                          <span className="text-cosmic-aura">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Print Options */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-cosmic-glow text-center">🖼️ Print Product Options</h3>

                  <div className="bg-cosmic-nebula/30 p-6 rounded-lg border border-cosmic-astral">
                    <h4 className="text-lg font-bold text-cosmic-glow mb-4">AI Analysis Complete ✨</h4>
                    <p className="text-cosmic-light mb-4">Based on your artwork, here are the recommended print products:</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {printOptions.map((option) => (
                      <motion.div
                        key={option.type}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => togglePrintType(option.type)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedPrintTypes.includes(option.type)
                            ? 'bg-gradient-to-br from-cosmic-astral to-cosmic-aura border-cosmic-plasma'
                            : 'bg-cosmic-void/50 border-cosmic-astral hover:border-cosmic-aura'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-bold text-cosmic-glow">{option.name}</h5>
                          {option.recommended && (
                            <span className="text-xs bg-mystic-gold text-cosmic-void px-2 py-1 rounded-full">
                              AI ✓
                            </span>
                          )}
                        </div>
                        <p className="text-cosmic-light text-sm mb-2">Base: ${option.basePrice}</p>
                        <div className="w-full h-2 bg-cosmic-void rounded-full">
                          <div className={`h-full rounded-full ${
                            option.recommended ? 'bg-mystic-gold' : 'bg-cosmic-aura'
                          }`} style={{ width: `${option.recommended ? 90 : 60}%` }} />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Limited Edition Options */}
                  <div className="bg-cosmic-nebula/30 p-6 rounded-lg border border-cosmic-astral">
                    <h4 className="text-lg font-bold text-cosmic-glow mb-4">🌟 Limited Edition Settings</h4>

                    <div className="space-y-4">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={limitedEdition.enabled}
                          onChange={(e) => setLimitedEdition(prev => ({ ...prev, enabled: e.target.checked }))}
                          className="w-5 h-5 accent-cosmic-plasma"
                        />
                        <span className="text-cosmic-light">Make this a limited edition release</span>
                      </label>

                      {limitedEdition.enabled && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-cosmic-light mb-2">Edition Size</label>
                            <input
                              type="number"
                              value={limitedEdition.quantity}
                              onChange={(e) => setLimitedEdition(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                              className="w-full px-4 py-2 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-cosmic-light mb-2">Pricing Tier</label>
                            <select
                              value={limitedEdition.pricing}
                              onChange={(e) => setLimitedEdition(prev => ({ ...prev, pricing: e.target.value as any }))}
                              className="w-full px-4 py-2 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow"
                            >
                              <option value="standard">Standard (+0%)</option>
                              <option value="premium">Premium (+50%)</option>
                              <option value="collectors">Collectors (+100%)</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-3 border border-cosmic-aura rounded-full text-cosmic-light hover:bg-cosmic-aura/20"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="flex-1 py-3 bg-gradient-to-r from-cosmic-plasma to-cosmic-aura rounded-full text-white font-bold"
                    >
                      Continue to Details
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Artwork Details */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-cosmic-glow text-center">📝 Artwork Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-cosmic-light mb-2">Title *</label>
                      <input
                        type="text"
                        value={artworkData.title}
                        onChange={(e) => setArtworkData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow"
                        placeholder="Cosmic Birth, Digital Ayahuasca..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-cosmic-light mb-2">Category</label>
                      <select
                        value={artworkData.category}
                        onChange={(e) => setArtworkData(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow"
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
                        value={artworkData.medium}
                        onChange={(e) => setArtworkData(prev => ({ ...prev, medium: e.target.value }))}
                        className="w-full px-4 py-3 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow"
                        placeholder="Acrylic on Canvas, Digital, Mixed Media..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-cosmic-light mb-2">Original Price</label>
                      <input
                        type="text"
                        value={artworkData.price}
                        onChange={(e) => setArtworkData(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full px-4 py-3 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow"
                        placeholder="$8,888, ETH 1.37, Commission..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-cosmic-light mb-2">Description</label>
                    <textarea
                      value={artworkData.description}
                      onChange={(e) => setArtworkData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow resize-none"
                      placeholder="Describe the mystical journey behind this piece..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-cosmic-light mb-2">Tags (comma separated)</label>
                    <input
                      type="text"
                      value={artworkData.tags}
                      onChange={(e) => setArtworkData(prev => ({ ...prev, tags: e.target.value }))}
                      className="w-full px-4 py-3 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow"
                      placeholder="psychedelic, sacred geometry, consciousness, cosmic..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-3 border border-cosmic-aura rounded-full text-cosmic-light hover:bg-cosmic-aura/20"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 py-4 bg-gradient-to-r from-cosmic-plasma to-cosmic-aura rounded-full text-white font-bold text-lg"
                    >
                      🚀 Manifest Artwork & Create Products
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}