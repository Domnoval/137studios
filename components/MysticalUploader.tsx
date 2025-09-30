'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
}

interface MysticalUploaderProps {
  onUpload?: (files: File[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
  mode?: 'artist' | 'visitor';
}

export default function MysticalUploader({
  onUpload,
  maxFiles = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  mode = 'artist'
}: MysticalUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createFilePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const simulateUpload = async (file: UploadedFile): Promise<void> => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadedFiles(prev =>
        prev.map(f => f.id === file.id ? { ...f, progress } : f)
      );
    }

    // Mark as complete
    setUploadedFiles(prev =>
      prev.map(f => f.id === file.id ? { ...f, status: 'success' } : f)
    );
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file =>
      acceptedTypes.includes(file.type) && file.size < 10 * 1024 * 1024 // 10MB limit
    );

    if (validFiles.length === 0) return;

    setIsUploading(true);

    const newFiles: UploadedFile[] = await Promise.all(
      validFiles.slice(0, maxFiles).map(async (file) => {
        const preview = await createFilePreview(file);
        return {
          id: Date.now() + Math.random().toString(),
          file,
          preview,
          status: 'uploading' as const,
          progress: 0,
        };
      })
    );

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Start uploads
    await Promise.all(newFiles.map(simulateUpload));

    setIsUploading(false);
    onUpload?.(validFiles);
  }, [acceptedTypes, maxFiles, onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="w-full space-y-6">
      {/* Drop Zone */}
      <motion.div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
          isDragOver
            ? 'border-cosmic-plasma bg-cosmic-plasma/10 scale-105'
            : 'border-cosmic-aura hover:border-cosmic-plasma hover:bg-cosmic-aura/5'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Floating orbs */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              className="absolute w-2 h-2 bg-cosmic-light rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
            />
          ))}
        </div>

        <motion.div
          animate={isDragOver ? { scale: 1.1 } : { scale: 1 }}
          className="relative z-10"
        >
          <div className="text-6xl mb-4">
            {mode === 'artist' ? '🎨' : '✨'}
          </div>
          <h3 className="text-2xl font-bold text-cosmic-glow mb-2">
            {mode === 'artist' ? 'Upload Your Art' : 'Upload to Remix'}
          </h3>
          <p className="text-cosmic-light mb-4">
            {isDragOver
              ? 'Release to manifest your vision...'
              : 'Drag & drop or click to select files'
            }
          </p>
          <div className="text-sm text-cosmic-aura">
            <p>Supports: JPEG, PNG, WebP</p>
            <p>Max size: 10MB per file</p>
            <p>Max files: {maxFiles}</p>
          </div>
        </motion.div>

        {/* Mystical border effect */}
        <motion.div
          animate={isDragOver ? { opacity: 1 } : { opacity: 0 }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-cosmic-plasma/20 to-transparent rounded-2xl"
        />
      </motion.div>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-bold text-cosmic-glow">
              {isUploading ? 'Channeling your art...' : 'Upload Complete'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative bg-cosmic-void/50 rounded-lg overflow-hidden border border-cosmic-astral"
                >
                  {/* Preview Image */}
                  <div className="aspect-square bg-cosmic-nebula relative">
                    <img
                      src={file.preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />

                    {/* Progress Overlay */}
                    {file.status === 'uploading' && (
                      <div className="absolute inset-0 bg-cosmic-void/80 flex items-center justify-center">
                        <div className="text-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-8 h-8 border-2 border-cosmic-plasma border-t-transparent rounded-full mx-auto mb-2"
                          />
                          <p className="text-cosmic-light text-sm">{file.progress}%</p>
                        </div>
                      </div>
                    )}

                    {/* Success Overlay */}
                    {file.status === 'success' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        ✓
                      </motion.div>
                    )}

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFile(file.id)}
                      className="absolute top-2 left-2 w-6 h-6 bg-red-500/80 rounded-full flex items-center justify-center text-white hover:bg-red-500"
                    >
                      ×
                    </button>
                  </div>

                  {/* File Info */}
                  <div className="p-3">
                    <p className="text-sm text-cosmic-light truncate">{file.file.name}</p>
                    <p className="text-xs text-cosmic-aura">
                      {(file.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}