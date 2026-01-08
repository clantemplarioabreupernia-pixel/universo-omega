
import React from 'react';
import { motion as motionImport } from 'framer-motion';
import { Zap, LayoutGrid, Cpu, Info } from 'lucide-react';
import { useGalleryStore } from '../../store/galleryStore';

// Fix: Cast motion to any to bypass pervasive type mismatch errors
const motion = motionImport as any;

const Navbar: React.FC = () => {
  const { setView, currentView } = useGalleryStore();

  const navItems = [
    { id: 'about', label: 'INICIO', icon: Info },
    { id: 'nexus', label: 'EL NEXUS', icon: Cpu },
    { id: 'gallery', label: 'GALERÍA', icon: LayoutGrid },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-black/50 backdrop-blur-xl border-b border-white/5"
    >
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('about')}>
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Zap className="text-white w-6 h-6" />
        </div>
        <span className="font-display text-xl font-bold tracking-tighter text-white hidden sm:block">
          OMEGA <span className="text-indigo-400">UNIVERSE</span>
        </span>
      </div>
      
      <div className="flex items-center gap-2 md:gap-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest transition-all ${
              currentView === item.id 
                ? 'bg-white text-black' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <item.icon size={14} />
            <span className="hidden md:block">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="hidden lg:flex items-center gap-4">
        <div className="h-4 w-[1px] bg-white/10 mx-2" />
        <button className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 transition-colors">
          V1.0.4-STABLE
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
