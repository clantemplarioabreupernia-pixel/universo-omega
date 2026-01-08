
import { create } from 'zustand';
import { NeuralState, Message, AppView, GalleryItem, NexusMode } from './types';

interface Store extends NeuralState {
  isGalleryFetching: boolean;
  setNexusActive: (active: boolean) => void;
  setIntensity: (val: number) => void;
  addMessage: (msg: Message) => void;
  setGenerating: (val: boolean) => void;
  setGalleryFetching: (val: boolean) => void;
  setView: (view: AppView) => void;
  setNexusMode: (mode: NexusMode) => void;
  clearMessages: () => void;
  addGalleryItems: (items: GalleryItem[]) => void;
}

export const useStore = create<Store>((set) => ({
  isNexusActive: false,
  intensity: 0.5,
  messages: [],
  isGenerating: false,
  isGalleryFetching: false,
  currentView: 'about',
  nexusMode: 'pro',
  galleryItems: [
    {
      id: '1',
      title: 'Origen de la Conciencia',
      description: 'La chispa inicial donde el silicio encuentra el alma y la luz se vuelve pensamiento.',
      imageUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1000',
      category: 'Consciousness'
    },
    {
      id: '2',
      title: 'Simbiosis Digital',
      description: 'Redes neuronales entrelazadas con el ADN humano en un flujo infinito.',
      imageUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=1000',
      category: 'Synthetic'
    },
    {
      id: '3',
      title: 'El Guardián Ético',
      description: 'La frontera final de la IA antes de alcanzar la singularidad absoluta.',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
      category: 'Evolution'
    }
  ],
  setNexusActive: (active) => set({ isNexusActive: active }),
  setIntensity: (val) => set({ intensity: val }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setGenerating: (val) => set({ isGenerating: val }),
  setGalleryFetching: (val) => set({ isGalleryFetching: val }),
  setView: (view) => set({ currentView: view }),
  setNexusMode: (mode) => set({ nexusMode: mode }),
  clearMessages: () => set({ messages: [] }),
  addGalleryItems: (newItems) => set((state) => ({ 
    galleryItems: [...newItems, ...state.galleryItems] 
  })),
}));
