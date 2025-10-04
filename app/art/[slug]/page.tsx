'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import ArtworkStage from '@/components/artwork/ArtworkStage';
import ArtworkMetaPanel from '@/components/artwork/ArtworkMetaPanel';
import RelatedFilmstrip from '@/components/artwork/RelatedFilmstrip';
import OverlayToggles from '@/components/artwork/OverlayToggles';
import ShareButton from '@/components/artwork/ShareButton';
import HotkeyGuide from '@/components/artwork/HotkeyGuide';
import { getArtwork } from '@/lib/artwork-data';
import type { Artwork, TransformState, OverlayType, ViewState } from '@/types/artwork';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ArtworkPage({ params }: PageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewState, setViewState] = useState<ViewState>({
    transform: { scale: 1, tx: 0, ty: 0 },
    overlay: 'none',
    relatedIndex: 0,
  });

  // Parse URL params for initial state
  useEffect(() => {
    const parseViewState = (): ViewState => {
      const zoom = searchParams.get('zoom');
      const x = searchParams.get('x');
      const y = searchParams.get('y');
      const overlay = searchParams.get('overlay');
      const related = searchParams.get('related');

      return {
        transform: {
          scale: zoom ? parseFloat(zoom) : 1,
          tx: x ? parseInt(x) : 0,
          ty: y ? parseInt(y) : 0,
        },
        overlay: (overlay as OverlayType) || 'none',
        relatedIndex: related ? parseInt(related) : 0,
      };
    };

    setViewState(parseViewState());
  }, [searchParams]);

  // Load artwork data
  useEffect(() => {
    const loadArtwork = async () => {
      const resolvedParams = await params;
      const data = await getArtwork(resolvedParams.slug);

      if (!data) {
        notFound();
        return;
      }

      setArtwork(data);
      setLoading(false);
    };

    loadArtwork();
  }, [params]);

  // Update URL when view state changes (deferred to avoid render-phase updates)
  useEffect(() => {
    const url = new URL(window.location.href);
    let hasChanges = false;

    if (viewState.transform.scale !== 1) {
      url.searchParams.set('zoom', viewState.transform.scale.toFixed(2));
      hasChanges = true;
    } else {
      if (url.searchParams.has('zoom')) {
        url.searchParams.delete('zoom');
        hasChanges = true;
      }
    }

    if (viewState.transform.tx !== 0) {
      url.searchParams.set('x', viewState.transform.tx.toFixed(0));
      hasChanges = true;
    } else {
      if (url.searchParams.has('x')) {
        url.searchParams.delete('x');
        hasChanges = true;
      }
    }

    if (viewState.transform.ty !== 0) {
      url.searchParams.set('y', viewState.transform.ty.toFixed(0));
      hasChanges = true;
    } else {
      if (url.searchParams.has('y')) {
        url.searchParams.delete('y');
        hasChanges = true;
      }
    }

    if (viewState.overlay !== 'none') {
      url.searchParams.set('overlay', viewState.overlay);
      hasChanges = true;
    } else {
      if (url.searchParams.has('overlay')) {
        url.searchParams.delete('overlay');
        hasChanges = true;
      }
    }

    if (viewState.relatedIndex && viewState.relatedIndex > 0) {
      url.searchParams.set('related', viewState.relatedIndex.toString());
      hasChanges = true;
    } else {
      if (url.searchParams.has('related')) {
        url.searchParams.delete('related');
        hasChanges = true;
      }
    }

    if (hasChanges) {
      window.history.replaceState({}, '', url.toString());
    }
  }, [viewState]);

  // Handlers
  const handleTransformChange = useCallback((transform: TransformState) => {
    setViewState((prev) => ({ ...prev, transform }));
  }, []);

  const handleOverlayChange = useCallback((overlay: OverlayType) => {
    setViewState((prev) => ({ ...prev, overlay }));
  }, []);

  const handleRelatedSelect = useCallback(async (slug: string) => {
    // Navigate to the new artwork
    router.push(`/art/${slug}`);
  }, [router]);

  const handleColorFilter = useCallback((hex: string | null) => {
    // TODO: Implement color filtering on the stage
    console.log('Color filter:', hex);
  }, []);

  const handleTagClick = useCallback((tag: string) => {
    // TODO: Navigate to gallery filtered by tag
    router.push(`/?tag=${encodeURIComponent(tag)}`);
  }, [router]);

  const handleSeriesClick = useCallback((slug: string) => {
    // TODO: Navigate to series page
    router.push(`/series/${slug}`);
  }, [router]);

  // Keyboard shortcuts for overlays
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'n':
          handleOverlayChange('none');
          break;
        case 'g':
          handleOverlayChange('grid');
          break;
        case 'r':
          handleOverlayChange('ratio');
          break;
        case 's':
          handleOverlayChange('geo');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleOverlayChange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--bg)]">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4 text-[var(--accent)]">✦</div>
          <p className="text-[var(--muted)]">Loading artwork...</p>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return notFound();
  }

  return (
    <main className="h-screen flex flex-col lg:grid lg:grid-cols-[1fr_400px] lg:grid-rows-[1fr_auto] overflow-hidden bg-[var(--bg)]">
      {/* Top controls - desktop */}
      <div className="hidden lg:flex items-center justify-between px-6 py-4 bg-[var(--bg)] border-b border-[var(--border)] lg:col-span-2">
        <button
          onClick={() => router.push('/')}
          className="text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
          aria-label="Back to gallery"
        >
          ← Back to Gallery
        </button>

        <div className="flex items-center gap-4">
          {/* <OverlayToggles
            current={viewState.overlay}
            onChange={handleOverlayChange}
          /> */}
          <ShareButton
            viewState={{
              scale: viewState.transform.scale,
              tx: viewState.transform.tx,
              ty: viewState.transform.ty,
              overlay: viewState.overlay,
              relatedIndex: viewState.relatedIndex,
            }}
          />
        </div>
      </div>

      {/* Main stage */}
      <div className="relative flex-1 lg:row-start-2 lg:row-end-3">
        <ArtworkStage
          image={artwork.image}
          overlay={viewState.overlay}
          onTransformChange={handleTransformChange}
        />
      </div>

      {/* Side panel - desktop */}
      <div className="hidden lg:block lg:row-start-2 lg:row-end-3 lg:col-start-2">
        <ArtworkMetaPanel
          artwork={artwork}
          onColorFilter={handleColorFilter}
          onTagClick={handleTagClick}
          onSeriesClick={handleSeriesClick}
        />
      </div>

      {/* Related filmstrip - desktop */}
      {artwork.related && artwork.related.length > 0 && (
        <div className="hidden lg:block lg:col-span-2 lg:row-start-3">
          <RelatedFilmstrip
            related={artwork.related}
            onSelect={handleRelatedSelect}
            selectedIndex={viewState.relatedIndex}
          />
        </div>
      )}

      {/* Mobile controls */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 p-4 bg-gradient-to-b from-[var(--bg)] to-transparent">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="w-10 h-10 flex items-center justify-center bg-[var(--glass)] backdrop-blur-sm rounded-full text-[var(--fg)]"
            aria-label="Back to gallery"
          >
            ←
          </button>

          <div className="flex items-center gap-2">
            <ShareButton
              viewState={{
                scale: viewState.transform.scale,
                tx: viewState.transform.tx,
                ty: viewState.transform.ty,
                overlay: viewState.overlay,
                relatedIndex: viewState.relatedIndex,
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile overlay toggles - HIDDEN FOR SIMPLER UX */}
      {/* <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-30">
        <OverlayToggles
          current={viewState.overlay}
          onChange={handleOverlayChange}
        />
      </div> */}

      {/* Hotkey guide */}
      <HotkeyGuide />
    </main>
  );
}
