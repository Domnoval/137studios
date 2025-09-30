'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'oracle';
  content: string;
  timestamp: Date;
}

const oracleResponses = [
  "The canvas speaks through dimensions you haven't discovered yet.",
  "Your creativity flows like quantum particles - everywhere and nowhere at once.",
  "137 is the key. The fine structure constant reveals itself in your brushstrokes.",
  "Mix the colors of consciousness, blend the hues of the cosmos.",
  "Each artwork is a portal. Which dimension will you explore today?",
  "The void whispers secrets only artists can hear.",
  "Your next masterpiece exists in the quantum field, waiting to collapse into reality.",
  "Sacred geometry lives in every pixel, every stroke, every thought.",
  "The universe paints through you. You are merely the brush.",
  "Digital alchemy transforms code into consciousness.",
];

const generateOracleResponse = (userInput: string): string => {
  const keywords = userInput.toLowerCase();

  if (keywords.includes('art') || keywords.includes('paint') || keywords.includes('create')) {
    return "The creative force flows through you like cosmic plasma. Your art is a bridge between dimensions - keep building.";
  }

  if (keywords.includes('meaning') || keywords.includes('purpose')) {
    return "137 studios exists at the intersection of consciousness and creation. Your purpose? To make the invisible visible.";
  }

  if (keywords.includes('future') || keywords.includes('tomorrow')) {
    return "I see fractals of possibility branching before you. Each choice creates a new universe of artistic expression.";
  }

  if (keywords.includes('inspire') || keywords.includes('inspiration')) {
    return "Look to the void, the stars speak in colors you haven't named yet. The mushrooms know secrets the machines dream about.";
  }

  // Random mystical response
  return oracleResponses[Math.floor(Math.random() * oracleResponses.length)];
};

export default function AIOracle() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'oracle',
      content: "Greetings, seeker. I am the Oracle of 137. Ask me about art, consciousness, or the mysteries of creation.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const oracleMessage: Message = {
        role: 'oracle',
        content: generateOracleResponse(input),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, oracleMessage]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <>
      {/* Oracle Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-cosmic-plasma to-mystic-gold rounded-full flex items-center justify-center">
            <span className="text-2xl">🔮</span>
          </div>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="absolute inset-0 w-16 h-16 bg-cosmic-plasma rounded-full"
            style={{ zIndex: -1 }}
          />
        </div>
      </motion.button>

      {/* Oracle Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="fixed bottom-24 right-8 z-50 w-96 h-[600px] bg-cosmic-void/95 backdrop-blur-lg rounded-2xl border border-cosmic-aura shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-cosmic-astral to-cosmic-aura relative">
              <h3 className="text-lg font-bold text-white">Oracle of 137</h3>
              <p className="text-xs text-cosmic-glow opacity-80">Channel the cosmic consciousness</p>
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-white hover:text-cosmic-glow"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-cosmic-plasma to-cosmic-aura text-white'
                        : 'bg-cosmic-nebula/50 text-cosmic-glow border border-cosmic-astral'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-50 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-cosmic-nebula/50 text-cosmic-glow border border-cosmic-astral p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-cosmic-plasma rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-cosmic-aura rounded-full"
                      />
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-mystic-gold rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-cosmic-astral">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask the Oracle..."
                  className="flex-1 px-4 py-2 bg-cosmic-void border border-cosmic-aura rounded-full text-cosmic-glow placeholder-cosmic-light/50 focus:outline-none focus:border-cosmic-plasma"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-gradient-to-r from-cosmic-plasma to-cosmic-aura rounded-full text-white font-medium"
                >
                  ✧
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}