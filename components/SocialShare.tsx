'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  imageUrl?: string;
  hashtags?: string[];
}

export default function SocialShare({ url, title, description, imageUrl, hashtags = [] }: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const defaultHashtags = ['137studios', 'consciousnessart', 'mysticart', 'psychedelicart'];
  const allHashtags = [...hashtags, ...defaultHashtags].slice(0, 5);

  const shareData = {
    url: encodeURIComponent(url),
    title: encodeURIComponent(title),
    description: encodeURIComponent(description || 'Explore consciousness-inspired artwork from 137studios'),
    hashtags: encodeURIComponent(allHashtags.join(',')),
    image: encodeURIComponent(imageUrl || '')
  };

  const socialPlatforms = [
    {
      name: 'Twitter',
      icon: '🐦',
      color: 'bg-blue-500',
      url: `https://twitter.com/intent/tweet?text=${shareData.title}&url=${shareData.url}&hashtags=${shareData.hashtags}`,
      description: 'Share on Twitter'
    },
    {
      name: 'Facebook',
      icon: '📘',
      color: 'bg-blue-600',
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareData.url}&quote=${shareData.title}`,
      description: 'Share on Facebook'
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      color: 'bg-blue-700',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareData.url}&title=${shareData.title}&summary=${shareData.description}`,
      description: 'Share on LinkedIn'
    },
    {
      name: 'Reddit',
      icon: '📱',
      color: 'bg-orange-500',
      url: `https://reddit.com/submit?url=${shareData.url}&title=${shareData.title}`,
      description: 'Share on Reddit'
    },
    {
      name: 'Pinterest',
      icon: '📌',
      color: 'bg-red-500',
      url: `https://pinterest.com/pin/create/button/?url=${shareData.url}&description=${shareData.title}&media=${shareData.image}`,
      description: 'Pin to Pinterest'
    },
    {
      name: 'WhatsApp',
      icon: '💬',
      color: 'bg-green-500',
      url: `https://wa.me/?text=${shareData.title}%20${shareData.url}`,
      description: 'Share via WhatsApp'
    },
    {
      name: 'Telegram',
      icon: '✈️',
      color: 'bg-blue-400',
      url: `https://t.me/share/url?url=${shareData.url}&text=${shareData.title}`,
      description: 'Share on Telegram'
    },
    {
      name: 'Email',
      icon: '📧',
      color: 'bg-gray-600',
      url: `mailto:?subject=${shareData.title}&body=${shareData.description}%0A%0A${shareData.url}`,
      description: 'Share via Email'
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShare = (platform: typeof socialPlatforms[0]) => {
    window.open(platform.url, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  // Check if Web Share API is available
  const canUseWebShare = typeof navigator !== 'undefined' && navigator.share;

  const handleWebShare = async () => {
    if (canUseWebShare) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
      } catch (error) {
        console.error('Web share failed:', error);
        setIsOpen(true);
      }
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative">
      {/* Share Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleWebShare}
        className="flex items-center gap-2 px-4 py-2 bg-cosmic-astral/50 hover:bg-cosmic-astral/70 rounded-full text-cosmic-glow border border-cosmic-aura transition-colors focus:outline-none focus:ring-2 focus:ring-cosmic-aura"
        aria-label="Share this artwork"
      >
        <span>✨</span>
        <span>Share</span>
      </motion.button>

      {/* Share Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-cosmic-void/80 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Share Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-cosmic-nebula/90 backdrop-blur-xl border border-cosmic-aura rounded-2xl p-6 max-w-md w-full mx-4 z-50"
              role="dialog"
              aria-modal="true"
              aria-labelledby="share-dialog-title"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 id="share-dialog-title" className="text-xl font-bold text-cosmic-glow">
                  ✨ Share This Mystical Art
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-cosmic-astral/50 flex items-center justify-center text-cosmic-light hover:text-cosmic-glow focus:outline-none focus:ring-2 focus:ring-cosmic-aura"
                  aria-label="Close share dialog"
                >
                  ✕
                </motion.button>
              </div>

              {/* Share Preview */}
              <div className="bg-cosmic-void/30 rounded-lg p-4 mb-6 border border-cosmic-aura/30">
                <h4 className="font-medium text-cosmic-glow mb-2">{title}</h4>
                {description && (
                  <p className="text-sm text-cosmic-light mb-2">{description}</p>
                )}
                <p className="text-xs text-cosmic-aura">#{allHashtags.join(' #')}</p>
              </div>

              {/* Copy Link */}
              <div className="mb-6">
                <label className="block text-sm text-cosmic-light mb-2">Share Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={url}
                    readOnly
                    className="flex-1 px-3 py-2 bg-cosmic-void/50 border border-cosmic-aura rounded-lg text-cosmic-glow text-sm focus:outline-none focus:border-cosmic-plasma"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={copyToClipboard}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-cosmic-aura ${
                      copied
                        ? 'bg-green-500 text-white'
                        : 'bg-cosmic-plasma hover:bg-cosmic-plasma/80 text-white'
                    }`}
                    aria-label="Copy link to clipboard"
                  >
                    {copied ? '✓ Copied' : '📋 Copy'}
                  </motion.button>
                </div>
              </div>

              {/* Social Platforms */}
              <div>
                <h4 className="text-sm text-cosmic-light mb-3">Share on Social Media</h4>
                <div className="grid grid-cols-4 gap-3">
                  {socialPlatforms.map((platform) => (
                    <motion.button
                      key={platform.name}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleShare(platform)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-lg ${platform.color} hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-cosmic-aura`}
                      title={platform.description}
                      aria-label={platform.description}
                    >
                      <span className="text-lg">{platform.icon}</span>
                      <span className="text-xs text-white font-medium">{platform.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-cosmic-aura/30 text-center">
                <p className="text-xs text-cosmic-light opacity-70">
                  Spread consciousness through art ✨
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simplified share button for inline use
export function QuickShare({ url, title, className = '' }: { url: string; title: string; className?: string }) {
  const [shared, setShared] = useState(false);

  const handleQuickShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch (error) {
        // Fallback to copy
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } else {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleQuickShare}
      className={`w-8 h-8 rounded-full bg-cosmic-astral/50 hover:bg-cosmic-astral/70 flex items-center justify-center text-cosmic-light hover:text-cosmic-glow transition-colors focus:outline-none focus:ring-2 focus:ring-cosmic-aura ${className}`}
      aria-label={shared ? 'Shared!' : 'Share this artwork'}
    >
      {shared ? '✓' : '✨'}
    </motion.button>
  );
}