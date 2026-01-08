
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  groundingChunks?: {
    web?: {
      uri?: string;
      title?: string;
    };
  }[];
}

export interface NeuralState {
  isNexusActive: boolean;
  intensity: number;
  messages: Message[];
  isGenerating: boolean;
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface NeuralAnalysis {
  level: number;
  resonance: number;
  dimension: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'Consciousness' | 'Synthetic' | 'Evolution';
}

export type AppView = 'nexus' | 'gallery' | 'about' | 'contact';
