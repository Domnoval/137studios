export type Artwork = {
  slug: string;
  title: string;
  year?: string;
  media?: string;
  size?: string;
  description?: string;
  image: {
    src: string;
    width: number;
    height: number;
    alt: string;
    blurDataURL?: string;
  };
  series?: {
    name: string;
    slug: string;
  };
  tags?: string[];
  palette?: {
    hex: string;
    name?: string;
  }[];
  edition?: {
    type: 'original' | 'print';
    number?: string;
    size?: number;
    notes?: string;
  };
  provenance?: string[];
  related?: {
    id: string;
    slug: string;
    title: string;
    thumb: string;
    palette?: string[];
  }[];
};

export type TransformState = {
  scale: number;
  tx: number;
  ty: number;
};

export type OverlayType = 'none' | 'grid' | 'ratio' | 'geo';

export type ViewState = {
  transform: TransformState;
  overlay: OverlayType;
  colorFilter?: string;
  relatedIndex?: number;
};
