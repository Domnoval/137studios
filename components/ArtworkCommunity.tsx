'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import SocialShare from './SocialShare';

interface Comment {
  id: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

interface Reaction {
  type: 'love' | 'mind_blown' | 'cosmic' | 'transcendent' | 'mystical';
  emoji: string;
  label: string;
  count: number;
  isSelected?: boolean;
}

interface ArtworkCommunityProps {
  artworkId: string;
  artworkTitle: string;
  artworkUrl?: string;
  initialLikes?: number;
  initialComments?: Comment[];
  initialReactions?: Reaction[];
}

export default function ArtworkCommunity({
  artworkId,
  artworkTitle,
  artworkUrl,
  initialLikes = 0,
  initialComments = [],
  initialReactions = []
}: ArtworkCommunityProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [reactions, setReactions] = useState<Reaction[]>(
    initialReactions.length > 0 ? initialReactions : [
      { type: 'love', emoji: '💜', label: 'Love', count: 0 },
      { type: 'mind_blown', emoji: '🤯', label: 'Mind Blown', count: 0 },
      { type: 'cosmic', emoji: '🌌', label: 'Cosmic', count: 0 },
      { type: 'transcendent', emoji: '✨', label: 'Transcendent', count: 0 },
      { type: 'mystical', emoji: '🔮', label: 'Mystical', count: 0 }
    ]
  );

  const [newComment, setNewComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const totalReactions = reactions.reduce((sum, reaction) => sum + reaction.count, 0);
  const shareUrl = `${window.location.origin}/artwork/${artworkId}`;

  useEffect(() => {
    fetchCommunityData();
  }, [artworkId]);

  const fetchCommunityData = async () => {
    try {
      const response = await fetch(`/api/artwork/${artworkId}/community`);
      if (response.ok) {
        const data = await response.json();
        setComments(data.comments || []);
        setReactions(data.reactions || reactions);
      }
    } catch (error) {
      console.error('Failed to fetch community data:', error);
    }
  };

  const handleReaction = async (reactionType: string) => {
    if (!session) {
      // Prompt user to sign in
      window.location.href = '/admin/login';
      return;
    }

    try {
      const response = await fetch(`/api/artwork/${artworkId}/reaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: reactionType })
      });

      if (response.ok) {
        const data = await response.json();
        setReactions(prev => prev.map(reaction =>
          reaction.type === reactionType
            ? { ...reaction, count: data.count, isSelected: data.isSelected }
            : reaction
        ));
      }
    } catch (error) {
      console.error('Failed to update reaction:', error);
    }
  };

  const handleComment = async () => {
    if (!session) {
      window.location.href = '/admin/login';
      return;
    }

    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/artwork/${artworkId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prev => [data.comment, ...prev]);
        setNewComment('');
        setIsCommenting(false);
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!session) {
      window.location.href = '/admin/login';
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST'
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prev => prev.map(comment =>
          comment.id === commentId
            ? { ...comment, likes: data.likes, isLiked: data.isLiked }
            : comment
        ));
      }
    } catch (error) {
      console.error('Failed to like comment:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-cosmic-nebula/20 backdrop-blur-sm border border-cosmic-aura/30 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-cosmic-glow">
          🌟 Community Vibes
        </h3>
        <SocialShare
          url={shareUrl}
          title={`Check out "${artworkTitle}" by 137studios`}
          description="Consciousness-inspired artwork that transcends dimensions"
          imageUrl={artworkUrl}
          hashtags={['137studios', 'consciousnessart', 'mysticart']}
        />
      </div>

      {/* Reactions */}
      <div className="mb-6">
        <h4 className="text-sm text-cosmic-light mb-3">
          Energy Resonance ({totalReactions} souls connected)
        </h4>
        <div className="flex flex-wrap gap-2">
          {reactions.map((reaction) => (
            <motion.button
              key={reaction.type}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleReaction(reaction.type)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-cosmic-aura ${
                reaction.isSelected
                  ? 'bg-cosmic-plasma border-cosmic-plasma text-white'
                  : 'border-cosmic-aura/50 hover:border-cosmic-aura hover:bg-cosmic-aura/10 text-cosmic-light'
              }`}
              aria-label={`React with ${reaction.label}`}
            >
              <span className="text-lg">{reaction.emoji}</span>
              <span className="text-sm font-medium">{reaction.count}</span>
              <span className="text-xs hidden sm:inline">{reaction.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Comments Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm text-cosmic-light">
            Consciousness Reflections ({comments.length})
          </h4>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowComments(!showComments)}
            className="text-sm text-cosmic-aura hover:text-cosmic-plasma transition-colors focus:outline-none focus:ring-2 focus:ring-cosmic-aura rounded"
          >
            {showComments ? '🔼 Hide' : '🔽 Show'} Comments
          </motion.button>
        </div>

        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              {/* Add Comment */}
              {session ? (
                <div className="space-y-3">
                  {!isCommenting ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setIsCommenting(true)}
                      className="w-full p-3 text-left text-cosmic-light bg-cosmic-void/30 border border-cosmic-aura/30 rounded-lg hover:border-cosmic-aura/50 transition-colors focus:outline-none focus:ring-2 focus:ring-cosmic-aura"
                    >
                      Share your consciousness experience...
                    </motion.button>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Express your thoughts on this mystical creation..."
                        className="w-full p-3 bg-cosmic-void/30 border border-cosmic-aura rounded-lg text-cosmic-glow placeholder-cosmic-light/50 focus:outline-none focus:border-cosmic-plasma focus:ring-2 focus:ring-cosmic-plasma/50 resize-none"
                        rows={3}
                        maxLength={500}
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-cosmic-light">
                          {newComment.length}/500 characters
                        </span>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setIsCommenting(false);
                              setNewComment('');
                            }}
                            className="px-4 py-2 text-sm text-cosmic-light hover:text-cosmic-glow transition-colors focus:outline-none focus:ring-2 focus:ring-cosmic-aura rounded"
                          >
                            Cancel
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleComment}
                            disabled={loading || !newComment.trim()}
                            className="px-4 py-2 bg-cosmic-plasma hover:bg-cosmic-plasma/80 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-cosmic-aura"
                          >
                            {loading ? 'Posting...' : 'Post ✨'}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-cosmic-light mb-3">Sign in to share your consciousness experience</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = '/admin/login'}
                    className="px-4 py-2 bg-cosmic-astral hover:bg-cosmic-astral/80 text-white rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-cosmic-aura"
                  >
                    🔮 Enter the Realm
                  </motion.button>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-4 pt-4 border-t border-cosmic-aura/30">
                <AnimatePresence>
                  {comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-cosmic-void/20 rounded-lg p-4 border border-cosmic-aura/20"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cosmic-plasma to-cosmic-aura flex items-center justify-center text-white font-bold text-sm">
                            {comment.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-cosmic-glow">{comment.user.name}</p>
                            <p className="text-xs text-cosmic-light">{formatTimeAgo(comment.createdAt)}</p>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleLikeComment(comment.id)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cosmic-aura ${
                            comment.isLiked
                              ? 'text-cosmic-plasma'
                              : 'text-cosmic-light hover:text-cosmic-aura'
                          }`}
                          aria-label={`Like comment by ${comment.user.name}`}
                        >
                          <span>{comment.isLiked ? '💜' : '🤍'}</span>
                          <span className="text-xs">{comment.likes}</span>
                        </motion.button>
                      </div>
                      <p className="text-cosmic-light leading-relaxed">{comment.content}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {comments.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-cosmic-light mb-2">🌌 No reflections yet</p>
                    <p className="text-sm text-cosmic-light/70">
                      Be the first to share your consciousness experience
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}