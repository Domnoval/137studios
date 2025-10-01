'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import EnhancedArtistAdmin from '@/components/EnhancedArtistAdmin';

export default function AdminDashboard() {
  const sessionResult = useSession();
  const { data: session, status } = sessionResult || { data: null, status: 'loading' };
  const router = useRouter();
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/admin/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-cosmic-void flex items-center justify-center">
        <div className="text-cosmic-glow">Loading sacred portal...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cosmic-void text-cosmic-glow">
      {/* Header */}
      <div className="border-b border-cosmic-aura bg-cosmic-nebula/30 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-cosmic-plasma to-mystic-gold bg-clip-text text-transparent">
                🎨 137studios Admin
              </span>
            </h1>
            <p className="text-cosmic-light">Welcome, {session.user?.name}</p>
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUpload(true)}
              className="px-6 py-3 bg-gradient-to-r from-cosmic-plasma to-cosmic-aura rounded-full text-white font-bold"
            >
              Upload Artwork ✨
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-6 py-3 border border-cosmic-aura rounded-full text-cosmic-light hover:bg-cosmic-aura/20"
            >
              Sign Out
            </motion.button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-cosmic-nebula/30 p-6 rounded-lg border border-cosmic-aura">
            <h3 className="text-lg font-bold text-cosmic-glow mb-2">Total Artworks</h3>
            <p className="text-3xl font-bold text-mystic-gold">6</p>
          </div>

          <div className="bg-cosmic-nebula/30 p-6 rounded-lg border border-cosmic-aura">
            <h3 className="text-lg font-bold text-cosmic-glow mb-2">Total Views</h3>
            <p className="text-3xl font-bold text-cosmic-aura">1,337</p>
          </div>

          <div className="bg-cosmic-nebula/30 p-6 rounded-lg border border-cosmic-aura">
            <h3 className="text-lg font-bold text-cosmic-glow mb-2">Revenue</h3>
            <p className="text-3xl font-bold text-cosmic-plasma">$13,700</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-cosmic-nebula/30 p-6 rounded-lg border border-cosmic-aura mb-8">
          <h3 className="text-xl font-bold text-cosmic-glow mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-cosmic-void border border-cosmic-astral rounded-lg text-center hover:border-cosmic-aura"
              onClick={() => setShowUpload(true)}
            >
              <div className="text-2xl mb-2">🎨</div>
              <div className="text-sm">Upload Art</div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-cosmic-void border border-cosmic-astral rounded-lg text-center hover:border-cosmic-aura"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm">Analytics</div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-cosmic-void border border-cosmic-astral rounded-lg text-center hover:border-cosmic-aura"
            >
              <div className="text-2xl mb-2">🛒</div>
              <div className="text-sm">Orders</div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-cosmic-void border border-cosmic-astral rounded-lg text-center hover:border-cosmic-aura"
            >
              <div className="text-2xl mb-2">⚙️</div>
              <div className="text-sm">Settings</div>
            </motion.button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-cosmic-nebula/30 p-6 rounded-lg border border-cosmic-aura">
          <h3 className="text-xl font-bold text-cosmic-glow mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-cosmic-void/50 rounded-lg">
              <div>
                <p className="text-cosmic-glow">New remix created for &quot;Cosmic Birth&quot;</p>
                <p className="text-sm text-cosmic-light">2 hours ago</p>
              </div>
              <div className="text-mystic-gold">+$137</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-cosmic-void/50 rounded-lg">
              <div>
                <p className="text-cosmic-glow">Canvas print ordered - &quot;Digital Ayahuasca&quot;</p>
                <p className="text-sm text-cosmic-light">5 hours ago</p>
              </div>
              <div className="text-mystic-gold">+$89</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-cosmic-void/50 rounded-lg">
              <div>
                <p className="text-cosmic-glow">Gallery view milestone: 1000 views</p>
                <p className="text-sm text-cosmic-light">1 day ago</p>
              </div>
              <div className="text-cosmic-aura">🎉</div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50">
          <EnhancedArtistAdmin onClose={() => setShowUpload(false)} />
        </div>
      )}
    </div>
  );
}