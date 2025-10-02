'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: 'uploading' | 'analyzing' | 'ready' | 'error';
  progress: number;
  response?: any;
  error?: string;
}

interface AIArtworkUploaderProps {
  onComplete?: (artworks: any[]) => void;
  maxFiles?: number;
}

export default function SmartArtworkUploader({
  onComplete,
  maxFiles = 5,
}: AIArtworkUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFiles = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles) return;

      const filesArray = Array.from(selectedFiles).slice(0, maxFiles - files.length);

      const newFiles: UploadedFile[] = filesArray.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        file,
        preview: URL.createObjectURL(file),
        status: 'uploading',
        progress: 0,
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      // Upload each file
      newFiles.forEach((uploadFile) => {
        uploadArtwork(uploadFile);
      });
    },
    [files.length, maxFiles]
  );

  // Upload single artwork with AI analysis
  const uploadArtwork = async (uploadFile: UploadedFile) => {
    try {
      const formData = new FormData();
      formData.append('file', uploadFile.file);

      // Update status to analyzing
      updateFileStatus(uploadFile.id, { status: 'analyzing', progress: 50 });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      // Update with AI analysis results
      updateFileStatus(uploadFile.id, {
        status: 'ready',
        progress: 100,
        response: data,
      });
    } catch (error) {
      updateFileStatus(uploadFile.id, {
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed',
      });
    }
  };

  // Update file status helper
  const updateFileStatus = (id: string, updates: Partial<UploadedFile>) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  // Drag and drop handlers
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (files.length >= maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      handleFiles(e.dataTransfer.files);
    },
    [files.length, handleFiles, maxFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Remove file
  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Accept AI suggestion
  const acceptAISuggestion = (id: string, field: string, value: any) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === id && f.response
          ? {
              ...f,
              response: {
                ...f.response,
                aiSuggestions: {
                  ...f.response.aiSuggestions,
                  [field]: value,
                },
              },
            }
          : f
      )
    );
  };

  // Save all ready artworks to database
  const saveAll = async () => {
    const readyArtworks = files.filter((f) => f.status === 'ready');

    if (readyArtworks.length === 0) return;

    try {
      const response = await fetch('/api/artwork/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          artworks: readyArtworks.map((f) => f.response),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save artworks');
      }

      const data = await response.json();

      // Success! Redirect to gallery or dashboard
      alert(`✨ ${data.saved} artwork${data.saved !== 1 ? 's' : ''} saved to gallery!`);

      if (onComplete) {
        onComplete(data.artworks);
      } else {
        // Redirect to gallery
        window.location.href = '/admin/dashboard';
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save artworks. Please try again.');
    }
  };

  const readyCount = files.filter((f) => f.status === 'ready').length;
  const canSave = readyCount > 0;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-cosmic-void via-cosmic-nebula/50 to-cosmic-astral/30 backdrop-blur-md overflow-y-auto cursor-default">
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bebas text-mystic-gold tracking-wide">
              Smart Artwork Uploader
            </h1>
            <button
              onClick={() => (window.location.href = '/admin/dashboard')}
              className="text-cosmic-light hover:text-cosmic-glow text-2xl"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Drop Zone */}
          {files.length < maxFiles && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-lg p-12 mb-8 cursor-pointer transition-all shadow-2xl
                ${
                  isDragging
                    ? 'border-mystic-gold bg-cosmic-plasma/30 scale-105 shadow-mystic-gold/50'
                    : 'border-cosmic-aura bg-cosmic-nebula/70 hover:border-mystic-gold hover:bg-cosmic-nebula/90 hover:shadow-cosmic-aura/50'
                }
              `}
            >
              {/* Cosmic particle effect (simplified) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
                {/* Gradient overlay for better visibility */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-cosmic-plasma/5 to-mystic-gold/10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-cosmic-aura/30 rounded-full animate-spin-slow" />
              </div>

              <div className="relative text-center">
                <div className="text-6xl mb-4 text-mystic-gold">☁️</div>
                <h2 className="text-2xl font-cinzel text-cosmic-glow mb-2">
                  Channel Your Art
                </h2>
                <p className="text-cosmic-light mb-2">
                  Drop files or click to browse
                </p>
                <p className="text-sm text-cosmic-aura">
                  JPG, PNG, WebP • Max 10MB per file • Up to {maxFiles} at a
                  time
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />
            </motion.div>
          )}

          {/* Uploaded Files Grid */}
          <AnimatePresence>
            {files.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {files.map((uploadFile) => (
                  <FileCard
                    key={uploadFile.id}
                    uploadFile={uploadFile}
                    onRemove={removeFile}
                    onAcceptSuggestion={acceptAISuggestion}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Bottom Actions */}
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between p-6 bg-cosmic-nebula/50 rounded-lg border border-cosmic-aura"
            >
              <div className="text-cosmic-light">
                {readyCount} of {files.length} ready to save
              </div>
              <button
                onClick={saveAll}
                disabled={!canSave}
                className={`px-8 py-3 rounded-full font-bold text-lg transition-all
                  ${
                    canSave
                      ? 'bg-gradient-to-r from-cosmic-plasma to-cosmic-aura text-white hover:scale-105'
                      : 'bg-cosmic-aura/30 text-cosmic-aura/50 cursor-not-allowed'
                  }
                `}
              >
                ✨ Save {readyCount} Artwork{readyCount !== 1 ? 's' : ''} to
                Gallery
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// File Card Component
function FileCard({
  uploadFile,
  onRemove,
  onAcceptSuggestion,
}: {
  uploadFile: UploadedFile;
  onRemove: (id: string) => void;
  onAcceptSuggestion: (id: string, field: string, value: any) => void;
}) {
  const { id, file, preview, status, response, error } = uploadFile;
  const aiSuggestions = response?.aiSuggestions;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-cosmic-nebula/70 rounded-lg border border-cosmic-aura overflow-hidden shadow-lg hover:shadow-cosmic-aura/30 transition-shadow"
    >
      {/* Image Preview */}
      <div className="relative h-48 bg-gradient-to-br from-cosmic-void to-cosmic-astral/30">
        <img
          src={preview}
          alt={file.name}
          className="w-full h-full object-cover"
        />

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          {status === 'uploading' && (
            <span className="px-3 py-1 bg-cosmic-plasma/90 text-white text-sm rounded-full">
              ⬆️ Uploading...
            </span>
          )}
          {status === 'analyzing' && (
            <span className="px-3 py-1 bg-cosmic-plasma/90 text-white text-sm rounded-full animate-pulse">
              🔮 Analyzing...
            </span>
          )}
          {status === 'ready' && (
            <span className="px-3 py-1 bg-mystic-gold/90 text-cosmic-void text-sm rounded-full">
              ✓ Ready
            </span>
          )}
          {status === 'error' && (
            <span className="px-3 py-1 bg-red-500/90 text-white text-sm rounded-full">
              ✗ Error
            </span>
          )}
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(id)}
          className="absolute top-2 left-2 w-8 h-8 bg-cosmic-void/80 hover:bg-cosmic-void text-cosmic-light hover:text-white rounded-full transition-colors"
        >
          ✕
        </button>
      </div>

      {/* AI Suggestions */}
      {status === 'ready' && aiSuggestions && (
        <div className="p-4 space-y-3">
          {/* Confidence Score */}
          {aiSuggestions.confidence && (
            <div className="text-xs text-cosmic-light">
              AI Confidence: {Math.round(aiSuggestions.confidence * 100)}%
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-xs text-cosmic-aura uppercase">
              Suggested Title
            </label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={aiSuggestions.title}
                onChange={(e) =>
                  onAcceptSuggestion(id, 'title', e.target.value)
                }
                className="flex-1 bg-cosmic-void/50 border border-cosmic-aura rounded px-3 py-2 text-cosmic-glow focus:border-mystic-gold outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-cosmic-aura uppercase">
              Description
            </label>
            <textarea
              value={aiSuggestions.description}
              onChange={(e) =>
                onAcceptSuggestion(id, 'description', e.target.value)
              }
              rows={3}
              className="w-full mt-1 bg-cosmic-void/50 border border-cosmic-aura rounded px-3 py-2 text-cosmic-light text-sm focus:border-mystic-gold outline-none"
            />
          </div>

          {/* Price */}
          <div>
            <label className="text-xs text-cosmic-aura uppercase">
              Suggested Price
            </label>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={aiSuggestions.price}
                onChange={(e) =>
                  onAcceptSuggestion(id, 'price', e.target.value)
                }
                className="flex-1 bg-cosmic-void/50 border border-cosmic-aura rounded px-3 py-2 text-mystic-gold font-bold focus:border-mystic-gold outline-none"
              />
              {aiSuggestions.priceRange && (
                <span className="text-xs text-cosmic-aura">
                  (${aiSuggestions.priceRange.min} - $
                  {aiSuggestions.priceRange.max})
                </span>
              )}
            </div>
          </div>

          {/* Tags */}
          {aiSuggestions.tags && aiSuggestions.tags.length > 0 && (
            <div>
              <label className="text-xs text-cosmic-aura uppercase">
                Suggested Tags
              </label>
              <div className="flex flex-wrap gap-2 mt-1">
                {aiSuggestions.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-cosmic-plasma/30 text-cosmic-light text-xs rounded border border-cosmic-aura"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Style & Mood */}
          <div className="flex gap-4 text-xs">
            {aiSuggestions.style && (
              <div>
                <span className="text-cosmic-aura">Style:</span>{' '}
                <span className="text-cosmic-light">{aiSuggestions.style}</span>
              </div>
            )}
            {aiSuggestions.mood && (
              <div>
                <span className="text-cosmic-aura">Mood:</span>{' '}
                <span className="text-cosmic-light">{aiSuggestions.mood}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error State */}
      {status === 'error' && error && (
        <div className="p-4 text-red-400 text-sm">{error}</div>
      )}
    </motion.div>
  );
}
