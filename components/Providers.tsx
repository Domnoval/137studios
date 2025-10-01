'use client';

import { SessionProvider } from 'next-auth/react';
import { TranceProvider } from '@/lib/TranceContext';
import { CollectionProvider } from '@/lib/CollectionContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CollectionProvider>
        <TranceProvider>
          {children}
        </TranceProvider>
      </CollectionProvider>
    </SessionProvider>
  );
}
