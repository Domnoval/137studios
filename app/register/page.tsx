'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        router.push('/login?message=Registration successful');
      } else {
        const data = await response.json();
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('Registration failed');
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
        role="main"
        aria-labelledby="register-heading"
      >
        <div className="text-center mb-8">
          <h1 id="register-heading" className="text-3xl font-bold text-cosmic-glow mb-2">
            🌟 Join the Cosmic Community
          </h1>
          <p className="text-cosmic-light">
            Create your account to save favorites and track orders
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm text-cosmic-light mb-2">Name</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow focus:outline-none focus:border-cosmic-plasma focus:ring-2 focus:ring-cosmic-plasma/50"
              required
              aria-describedby={error ? "form-error" : undefined}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-cosmic-light mb-2">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow focus:outline-none focus:border-cosmic-plasma focus:ring-2 focus:ring-cosmic-plasma/50"
              required
              aria-describedby={error ? "form-error" : undefined}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-cosmic-light mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-4 py-3 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow focus:outline-none focus:border-cosmic-plasma focus:ring-2 focus:ring-cosmic-plasma/50"
              required
              aria-describedby={error ? "form-error" : undefined}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm text-cosmic-light mb-2">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-4 py-3 bg-cosmic-void border border-cosmic-aura rounded-lg text-cosmic-glow focus:outline-none focus:border-cosmic-plasma focus:ring-2 focus:ring-cosmic-plasma/50"
              required
              aria-describedby={error ? "form-error" : undefined}
            />
          </div>

          {error && (
            <div id="form-error" role="alert" className="text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-cosmic-plasma to-cosmic-aura rounded-full text-white font-bold disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-cosmic-aura"
            aria-describedby={error ? "form-error" : undefined}
          >
            {isLoading ? 'Creating Account...' : 'Join the Cosmos ✨'}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-cosmic-light text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-cosmic-aura hover:text-cosmic-plasma">
              Sign in here
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}