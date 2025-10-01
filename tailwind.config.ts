import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      spacing: {
        'section': '6rem',      // 96px - section vertical spacing
        'section-sm': '4rem',   // 64px - smaller section spacing
        'content': '3rem',      // 48px - content block spacing
        'element': '2rem',      // 32px - element spacing
        'tight': '1rem',        // 16px - tight spacing
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cosmic: {
          void: '#0a0a0a',
          nebula: '#1a0033',
          astral: '#2d1b69',
          aura: '#6b46c1',
          plasma: '#9333ea',
          light: '#c084fc',
          glow: '#e9d5ff',
        },
        mystic: {
          gold: '#fbbf24',
          copper: '#b45309',
          silver: '#e5e7eb',
          obsidian: '#111827',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'morph': 'morph 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 60s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40%/50% 60% 30% 60%' },
        }
      }
    },
  },
  plugins: [],
} satisfies Config;