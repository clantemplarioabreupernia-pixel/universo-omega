
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  type?: 'text' | 'image' | 'video' | 'audio';
  mediaUrl?: string;
  groundingChunks?: {
    web?: { uri?: string; title?: string };
    maps?: { uri?: string; title?: string };
  }[];
  isThinking?: boolean;
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
export type NexusMode = 'pro' | 'flash' | 'image' | 'video' | 'live' | 'thought';

export interface NeuralState {
  isNexusActive: boolean;
  intensity: number;
  messages: Message[];
  isGenerating: boolean;
  currentView: AppView;
  nexusMode: NexusMode;
  galleryItems: GalleryItem[];
}
