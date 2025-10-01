'use client';

import { motion } from 'framer-motion';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-cosmic-void text-cosmic-glow">
      {/* Header */}
      <div className="border-b border-cosmic-aura bg-cosmic-nebula/30 p-8">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-cosmic-plasma to-mystic-gold bg-clip-text text-transparent">
              📜 Terms of Service
            </span>
          </motion.h1>
          <p className="text-cosmic-light">
            By using 137studios, you agree to these terms and conditions.
          </p>
          <p className="text-sm text-cosmic-aura mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-8 space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-cosmic-nebula/30 p-6 rounded-lg border border-cosmic-aura"
        >
          <h2 className="text-2xl font-bold text-cosmic-glow mb-4">Acceptance of Terms</h2>
          <div className="text-cosmic-light space-y-2">
            <p>
              By accessing and using 137studios (the &quot;Service&quot;), you accept and agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our Service.
            </p>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the Service constitutes acceptance of modified terms.
            </p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-cosmic-nebula/30 p-6 rounded-lg border border-cosmic-aura"
        >
          <h2 className="text-2xl font-bold text-cosmic-glow mb-4">Service Description</h2>
          <div className="text-cosmic-light space-y-2">
            <p>137studios is an digital art platform that provides:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Gallery of original consciousness-inspired artworks</li>
              <li>AI-powered artwork remixing capabilities</li>
              <li>Print-on-demand services for artwork</li>
              <li>Interactive 3D gallery experience</li>
              <li>Commission services for custom artwork</li>
            </ul>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-cosmic-nebula/30 p-6 rounded-lg border border-cosmic-aura"
        >
          <h2 className="text-2xl font-bold text-cosmic-glow mb-4">Intellectual Property Rights</h2>
          <div className="text-cosmic-light space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-cosmic-aura mb-2">Original Artworks</h3>
              <p>
                All original artworks displayed on 137studios are the exclusive intellectual property of the artist.
                Unauthorized reproduction, distribution, or commercial use is strictly prohibited.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cosmic-aura mb-2">AI-Generated Remixes</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Remixes are derivative works based on original artworks</li>
                <li>Purchasers receive a limited license for personal use</li>
                <li>Commercial use requires separate licensing agreement</li>
                <li>Artist retains all underlying copyright to original work</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cosmic-aura mb-2">Website Content</h3>
              <p>
                The website design, code, text, and user interface are protected by copyright and trademark laws.
                137studios and related marks are trademarks of the artist.
              </p>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-cosmic-nebula/30 p-6 rounded-lg border border-cosmic-aura"
        >
          <h2 className="text-2xl font-bold text-cosmic-glow mb-4">User Conduct</h2>
          <div className="text-cosmic-light space-y-2">
            <p>Users agree to use the Service responsibly and agree NOT to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Attempt to gain unauthorized access to the system</li>
              <li>Use automated scripts or bots to access the Service</li>
              <li>Engage in any activity that disrupts or interferes with the Service</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Use the Service for any illegal or unauthorized purpose</li>
            </ul>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-cosmic-nebula/30 p-6 rounded-lg border border-cosmic-aura"
        >
          <h2 className="text-2xl font-bold text-cosmic-glow mb-4">Purchase Terms</h2>
          <div className="text-cosmic-light space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-cosmic-aura mb-2">Payment</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>All payments are processed securely through third-party providers</li>
                <li>Prices are displayed in USD unless otherwise specified</li>
                <li>Payment is required before order fulfillment</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cosmic-aura mb-2">Delivery</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Digital artworks are delivered via email or download link</li>
                <li>Physical prints are fulfilled through third-party print services</li>
                <li>Delivery times vary based on product type and location</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cosmic-aura mb-2">Refunds</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Digital products: Refunds considered on case-by-case basis</li>
                <li>Physical products: Subject to print provider's return policy</li>
                <li>Custom commissions: 50% deposit non-refundable</li>
              </ul>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-cosmic-nebula/30 p-6 rounded-lg border border-cosmic-aura"
        >
          <h2 className="text-2xl font-bold text-cosmic-glow mb-4">AI Remix License</h2>
          <div className="text-cosmic-light space-y-4">
            <p>When you purchase an AI-generated remix, you receive:</p>
            <div>
              <h3 className="text-lg font-semibold text-cosmic-aura mb-2">Personal Use License</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Display in personal spaces (home, office)</li>
                <li>Share on personal social media with attribution</li>
                <li>Use as desktop wallpaper or personal device background</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cosmic-aura mb-2">Restrictions</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>No commercial use without separate agreement</li>
                <li>No resale or redistribution</li>
                <li>No modification without permission</li>
                <li>No removal of artist attribution</li>
              </ul>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-cosmic-nebula/30 p-6 rounded-lg border border-cosmic-aura"
        >
          <h2 className="text-2xl font-bold text-cosmic-glow mb-4">Disclaimer of Warranties</h2>
          <div className="text-cosmic-light space-y-2">
            <p>
              The Service is provided &quot;as is&quot; without warranties of any kind. We do not guarantee:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Continuous, uninterrupted service availability</li>
              <li>Error-free operation</li>
              <li>Compatibility with all devices or browsers</li>
              <li>Specific results from AI-generated content</li>
            </ul>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-cosmic-nebula/30 p-6 rounded-lg border border-cosmic-aura"
        >
          <h2 className="text-2xl font-bold text-cosmic-glow mb-4">Limitation of Liability</h2>
          <div className="text-cosmic-light space-y-2">
            <p>
              To the maximum extent permitted by law, 137studios shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages, including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Loss of profits or revenue</li>
              <li>Loss of data or content</li>
              <li>Business interruption</li>
              <li>Cost of substitute services</li>
            </ul>
            <p className="text-sm mt-4">
              Total liability shall not exceed the amount paid by the user for the specific service.
            </p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-cosmic-nebula/30 p-6 rounded-lg border border-cosmic-aura"
        >
          <h2 className="text-2xl font-bold text-cosmic-glow mb-4">Governing Law and Disputes</h2>
          <div className="text-cosmic-light space-y-2">
            <p>
              These terms are governed by the laws of [JURISDICTION TO BE SPECIFIED].
              Any disputes will be resolved through binding arbitration.
            </p>
            <p>
              If any provision of these terms is found unenforceable, the remaining provisions remain in full effect.
            </p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-cosmic-nebula/30 p-6 rounded-lg border border-cosmic-aura"
        >
          <h2 className="text-2xl font-bold text-cosmic-glow mb-4">Contact Information</h2>
          <div className="text-cosmic-light">
            <p>For questions about these Terms of Service:</p>
            <div className="mt-4 space-y-2">
              <p><strong className="text-cosmic-aura">Email:</strong> legal@137studios.com</p>
              <p><strong className="text-cosmic-aura">Response Time:</strong> Within 5 business days</p>
            </div>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="text-center text-cosmic-light text-sm"
        >
          <p>
            By continuing to use 137studios, you acknowledge that you have read, understood,
            and agree to be bound by these Terms of Service.
          </p>
        </motion.div>
      </div>
    </div>
  );
}