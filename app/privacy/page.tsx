'use client';

import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
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
              🔮 Privacy Policy
            </span>
          </motion.h1>
          <p className="text-cosmic-light">
            Your privacy is sacred to us. This policy explains how we collect, use, and protect your personal information.
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
          <h2 className="text-2xl font-bold text-cosmic-glow mb-4">Information We Collect</h2>
          <div className="space-y-4 text-cosmic-light">
            <div>
              <h3 className="text-lg font-semibold text-cosmic-aura mb-2">Personal Information</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Email address (for admin authentication)</li>
                <li>IP address (for security and rate limiting)</li>
                <li>Browser information (for technical support)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cosmic-aura mb-2">Artwork Data</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Uploaded artwork files and metadata</li>
                <li>Remix requests and AI-generated descriptions</li>
                <li>Gallery interaction data (views, clicks)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cosmic-aura mb-2">Technical Data</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Website usage analytics</li>
                <li>Performance monitoring data</li>
                <li>Error logs and debugging information</li>
              </ul>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-cosmic-nebula/30 p-6 rounded-lg border border-cosmic-aura"
        >
          <h2 className="text-2xl font-bold text-cosmic-glow mb-4">How We Use Your Information</h2>
          <div className="text-cosmic-light space-y-2">
            <p><strong className="text-cosmic-aura">Service Operation:</strong> To provide and maintain our art platform services</p>
            <p><strong className="text-cosmic-aura">Security:</strong> To protect against unauthorized access and abuse</p>
            <p><strong className="text-cosmic-aura">Improvement:</strong> To analyze usage patterns and improve user experience</p>
            <p><strong className="text-cosmic-aura">Communication:</strong> To respond to inquiries and provide customer support</p>
            <p><strong className="text-cosmic-aura">Legal Compliance:</strong> To comply with applicable laws and regulations</p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-cosmic-nebula/30 p-6 rounded-lg border border-cosmic-aura"
        >
          <h2 className="text-2xl font-bold text-cosmic-glow mb-4">Data Sharing and Third Parties</h2>
          <div className="text-cosmic-light space-y-4">
            <p>We work with trusted third-party services:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-cosmic-aura">Vercel:</strong> Website hosting and file storage</li>
              <li><strong className="text-cosmic-aura">OpenAI:</strong> AI-powered artwork descriptions</li>
              <li><strong className="text-cosmic-aura">Printful/Printify:</strong> Print-on-demand fulfillment</li>
            </ul>
            <p className="text-sm">
              We do not sell, rent, or share your personal information with third parties for marketing purposes.
            </p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-cosmic-nebula/30 p-6 rounded-lg border border-cosmic-aura"
        >
          <h2 className="text-2xl font-bold text-cosmic-glow mb-4">Your Rights</h2>
          <div className="text-cosmic-light space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-cosmic-aura mb-2">GDPR Rights (EU Users)</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Objection:</strong> Object to processing of your personal data</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cosmic-aura mb-2">CCPA Rights (California Users)</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Know what personal information is collected</li>
                <li>Know if personal information is sold or disclosed</li>
                <li>Say no to the sale of personal information</li>
                <li>Access personal information</li>
                <li>Equal service and price, even if you exercise privacy rights</li>
              </ul>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-cosmic-nebula/30 p-6 rounded-lg border border-cosmic-aura"
        >
          <h2 className="text-2xl font-bold text-cosmic-glow mb-4">Data Security</h2>
          <div className="text-cosmic-light space-y-2">
            <p>We implement industry-standard security measures:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Encrypted data transmission (HTTPS)</li>
              <li>Secure file storage with access controls</li>
              <li>Regular security audits and monitoring</li>
              <li>Limited access to personal information</li>
              <li>Secure authentication systems</li>
            </ul>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-cosmic-nebula/30 p-6 rounded-lg border border-cosmic-aura"
        >
          <h2 className="text-2xl font-bold text-cosmic-glow mb-4">Cookies and Tracking</h2>
          <div className="text-cosmic-light space-y-2">
            <p>We use minimal tracking technologies:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-cosmic-aura">Essential Cookies:</strong> Required for website functionality</li>
              <li><strong className="text-cosmic-aura">Authentication:</strong> To maintain your login session</li>
              <li><strong className="text-cosmic-aura">Preferences:</strong> To remember your settings</li>
            </ul>
            <p className="text-sm">
              We do not use advertising cookies or third-party tracking scripts.
            </p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-cosmic-nebula/30 p-6 rounded-lg border border-cosmic-aura"
        >
          <h2 className="text-2xl font-bold text-cosmic-glow mb-4">Contact Us</h2>
          <div className="text-cosmic-light">
            <p>For privacy-related questions or to exercise your rights:</p>
            <div className="mt-4 space-y-2">
              <p><strong className="text-cosmic-aura">Email:</strong> privacy@137studios.com</p>
              <p><strong className="text-cosmic-aura">Response Time:</strong> Within 30 days</p>
            </div>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-cosmic-light text-sm"
        >
          <p>
            This privacy policy may be updated periodically. We will notify users of significant changes.
          </p>
        </motion.div>
      </div>
    </div>
  );
}