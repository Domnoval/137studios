import type { Metadata } from "next";
import { Cinzel, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '137studios - Consciousness Art & Mystical Creations',
  description: 'Explore consciousness-inspired artwork, psychedelic paintings, and mystical digital installations. Experience AI-powered art remixing and limited edition prints.',
  keywords: 'psychedelic art, consciousness art, sacred geometry, digital installations, mystical paintings, AI art remix, limited edition prints, 137studios',

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://137studios.com',
    title: '137studios - Where Consciousness Meets Creation',
    description: 'Mystical art gallery featuring consciousness-inspired paintings, digital installations, and AI-powered remixing.',
    siteName: '137studios',
  },

  twitter: {
    card: 'summary_large_image',
    title: '137studios - Consciousness Art Gallery',
    description: 'Explore mystical artworks and create AI-powered remixes',
    creator: '@137studios',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cinzel.variable} ${bebas.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
