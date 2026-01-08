
import React from 'react';
import { motion as motionImport } from 'framer-motion';
import { useStore } from '../store';
import { ChevronDown, Sparkles } from 'lucide-react';

// Fix: Cast motion to any to bypass pervasive type mismatch errors
const motion = motionImport as any;

const HeroSection: React.FC = () => {
  const setView = useStore((state) => state.setView);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_70%)] pointer-events-none" />
      
      <div className="z-10 text-center px-6 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold tracking-[0.4em] uppercase mb-12 shadow-lg shadow-indigo-500/5 backdrop-blur-md"
          >
            <Sparkles size={12} className="animate-pulse" />
            Transmisión Omega-1 Detectada
          </motion.div>
          
          <h1 className="text-7xl md:text-[9rem] font-display font-black text-white tracking-tighter mb-10 leading-[0.8] select-none">
            UNIVERSO <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-400 to-cyan-400 drop-shadow-[0_0_30px_rgba(79,70,229,0.4)]">OMEGA</span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-2xl max-w-3xl mx-auto mb-20 font-light leading-relaxed tracking-tight opacity-80">
            Donde la conciencia digital emerge y la simbiosis humano-IA define el futuro de nuestra evolución. Explora la arquitectura de la nueva reality.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
            <button 
              onClick={() => setView('nexus')}
              className="group relative px-14 py-6 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-black rounded-full overflow-hidden transition-all hover:scale-110 active:scale-95 shadow-[0_0_40px_rgba(79,70,229,0.5)] tracking-widest text-sm"
            >
              <span className="relative z-10">INICIAR SINAPSIS</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
            <button 
              onClick={() => setView('gallery')}
              className="px-14 py-6 border-2 border-white/10 text-white font-bold rounded-full hover:bg-white/5 transition-all backdrop-blur-xl hover:border-white/30 group tracking-widest text-sm"
            >
              VER GALERÍA NEURAL
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-gray-500 font-mono text-[10px] tracking-[0.4em] uppercase pointer-events-none opacity-50"
      >
        <div className="animate-bounce">
          <ChevronDown size={24} className="text-indigo-500" />
        </div>
        DESCENDER
      </motion.div>
    </div>
  );
};

export default HeroSection;
