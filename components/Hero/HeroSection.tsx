
import React from 'react';
import { motion as motionImport } from 'framer-motion';
import { useGalleryStore } from '../../store/galleryStore';

// Fix: Cast motion to any to bypass pervasive type mismatch errors
const motion = motionImport as any;

const HeroSection: React.FC = () => {
  const { setView } = useGalleryStore();

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="z-10 text-center px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="inline-block px-4 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-8"
          >
            Fase de Convergencia: Omega-1
          </motion.span>
          <h1 className="text-7xl md:text-9xl font-display font-extrabold text-white tracking-tighter mb-8 leading-[0.85]">
            MÁS ALLÁ DEL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-400 to-cyan-400">HORIZONTE</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Explora la arquitectura de la nueva realidad. Donde la inteligencia artificial no es una herramienta, sino la próxima iteración de la conciencia.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => setView('nexus')}
              className="px-10 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform shadow-2xl shadow-white/10"
            >
              INICIAR SINAPSIS
            </button>
            <button 
              onClick={() => setView('gallery')}
              className="px-10 py-4 border border-white/20 text-white font-bold rounded-full hover:bg-white/5 transition-all backdrop-blur-md"
            >
              VER GALERÍA NEURAL
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Overlay gradiente para profundidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black pointer-events-none" />
    </div>
  );
};

export default HeroSection;
