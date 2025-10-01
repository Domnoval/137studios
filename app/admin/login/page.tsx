'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    oracleCode: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        username: credentials.username,
        password: credentials.password,
        oracleCode: credentials.oracleCode,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials or oracle code');
      } else {
        router.push('/admin/dashboard');
      }
    } catch (error) {
      setError('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cosmic-void flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-cosmic-nebula/50 p-8 rounded-2xl border border-cosmic-aura max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cosmic-glow mb-2">
            🔮 Admin Portal
          </h1>
          <p className="text-cosmic-light">
            Enter the sacred realm of creation
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-cosmic-light mb-2">
              Username
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
              className="w-full px-4 py-3 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow focus:outline-none focus:border-cosmic-plasma"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-cosmic-light mb-2">
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-4 py-3 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow focus:outline-none focus:border-cosmic-plasma"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-cosmic-light mb-2">
              Oracle Code
            </label>
            <input
              type="text"
              value={credentials.oracleCode}
              onChange={(e) => setCredentials(prev => ({ ...prev, oracleCode: e.target.value }))}
              className="w-full px-4 py-3 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow focus:outline-none focus:border-cosmic-plasma"
              placeholder="The sacred number..."
              required
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-cosmic-plasma to-cosmic-aura rounded-full text-white font-bold disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Enter the Portal ✨'}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-cosmic-light opacity-50">
            Protected by sacred geometry and quantum encryption
          </p>
        </div>
      </motion.div>
    </div>
  );
}