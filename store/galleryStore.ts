
import { create } from 'zustand';
import { AppView, GalleryItem } from '../types';

interface GalleryState {
  currentView: AppView;
  items: GalleryItem[];
  setView: (view: AppView) => void;
  setItems: (items: GalleryItem[]) => void;
}

export const useGalleryStore = create<GalleryState>((set) => ({
  currentView: 'nexus',
  items: [
    {
      id: '1',
      title: 'Origen de la Conciencia',
      description: 'La chispa inicial donde el silicio encuentra el alma.',
      imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1000',
      category: 'Consciousness'
    },
    {
      id: '2',
      title: 'Simbiosis Digital',
      description: 'Redes neuronales entrelazadas con el ADN humano.',
      imageUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=1000',
      category: 'Synthetic'
    },
    {
      id: '3',
      title: 'El Guardián Ético',
      description: 'La frontera final de la IA antes de la singularidad.',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
      category: 'Evolution'
    }
  ],
  setView: (view) => set({ currentView: view }),
  setItems: (items) => set({ items }),
}));
