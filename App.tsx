
import React, { useEffect } from 'react';
import { motion as motionImport, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import ThreeBackground from './components/ThreeBackground';
import NexusChat from './components/NexusChat';
import HeroSection from './components/HeroSection';
import GalleryGrid from './components/GalleryGrid';
import Footer from './components/Footer';
import { useStore } from './store';
import { fetchNASAData } from './services/externalApis';
import { GalleryItem } from './types';

// Fix: Cast motion to any to bypass pervasive type mismatch errors
const motion = motionImport as any;

const App: React.FC = () => {
  const { currentView, setNexusActive, addGalleryItems, setGalleryFetching } = useStore();

  useEffect(() => {
    setNexusActive(currentView === 'nexus');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, setNexusActive]);

  useEffect(() => {
    // Inject real NASA images into the gallery store on load
    const loadNASAData = async () => {
      setGalleryFetching(true);
      try {
        const data = await fetchNASAData(6);
        if (data.length > 0) {
          const nasaItems: GalleryItem[] = data.map((item, idx) => ({
            id: `nasa-${idx}-${Date.now()}`,
            title: item.title,
            description: item.explanation.slice(0, 100) + '...',
            imageUrl: item.url,
            category: 'Consciousness' // Cosmic images categorize as part of universal consciousness
          }));
          addGalleryItems(nasaItems);
        }
      } catch (e) {
        console.error("NASA Gallery Load Error", e);
      } finally {
        setGalleryFetching(false);
      }
    };
    loadNASAData();
  }, [addGalleryItems, setGalleryFetching]);

  return (
    <div className="min-h-screen selection:bg-indigo-500 selection:text-white bg-black font-inter antialiased">
      <ThreeBackground />
      <Navbar />

      <main className="relative z-10 pt-24 min-h-screen overflow-x-hidden">
        <AnimatePresence mode="wait">
          {currentView === 'about' && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              transition={{ duration: 0.8 }}
            >
              <HeroSection />
            </motion.div>
          )}

          {currentView === 'nexus' && (
            <motion.div
              key="nexus"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              className="container mx-auto px-8 py-20"
            >
              <div className="text-center mb-16">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
                  <span className="px-5 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-bold tracking-[0.5em] uppercase rounded-full backdrop-blur-md">
                    SINAPSIS DIRECTA
                  </span>
                </motion.div>
                <h2 className="text-7xl md:text-9xl font-display font-black text-white mb-6 tracking-tighter uppercase">EL NEXUS</h2>
                <p className="text-gray-600 font-mono text-[10px] tracking-[0.4em] uppercase font-bold opacity-60">Phase 1.0 :: NASA & IBM Cognitive Bridge</p>
              </div>
              <NexusChat />
            </motion.div>
          )}

          {currentView === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.8 }}
            >
              <GalleryGrid />
            </motion.div>
          )}

          {currentView === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="min-h-screen flex items-center justify-center py-40"
            >
              <div className="max-w-2xl w-full px-8 text-center space-y-16">
                <h2 className="text-7xl md:text-8xl font-display font-black text-white tracking-tighter uppercase">CONTACTO</h2>
                <div className="p-12 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-3xl space-y-10 glass">
                   <p className="text-gray-400 leading-relaxed text-xl font-light">Envía una señal a través del vacío. Nuestros receptores están activos.</p>
                   <div className="space-y-6">
                      <input className="w-full bg-black/50 border border-white/10 p-6 rounded-2xl text-white outline-none focus:border-indigo-500 transition-all font-mono text-sm" placeholder="IDENTIFICACION_NODO" />
                      <textarea className="w-full bg-black/50 border border-white/10 p-6 rounded-2xl text-white outline-none h-40 focus:border-indigo-500 transition-all font-mono text-sm resize-none" placeholder="MENSAJE_CUANTICO" />
                      <button className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black tracking-widest hover:bg-indigo-500 transition-all active:scale-[0.98]">
                        ENVIAR TRANSMISIÓN
                      </button>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default App;
