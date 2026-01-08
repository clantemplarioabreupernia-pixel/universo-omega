
import React from 'react';
import { motion as motionImport } from 'framer-motion';
import { Zap, LayoutGrid, Cpu, Info, Mail } from 'lucide-react';
import { useStore } from '../store';

// Fix: Cast motion to any to bypass pervasive type mismatch errors in the current environment
const motion = motionImport as any;

const Navbar: React.FC = () => {
  const { currentView, setView } = useStore();

  const navItems = [
    { id: 'about', label: 'INICIO', icon: Info },
    { id: 'nexus', label: 'EL NEXUS', icon: Cpu },
    { id: 'gallery', label: 'GALERÍA', icon: LayoutGrid },
    { id: 'contact', label: 'CONTACTO', icon: Mail },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-8 bg-black/40 backdrop-blur-2xl border-b border-white/5"
    >
      <div 
        className="flex items-center gap-4 cursor-pointer group" 
        onClick={() => setView('about')}
      >
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/30 group-hover:scale-110 transition-transform duration-500">
          <Zap className="text-white w-7 h-7" />
        </div>
        <div className="flex flex-col">
          <span className="font-display text-xl font-black tracking-tighter text-white leading-none">
            OMEGA <span className="text-indigo-400">UNIVERSE</span>
          </span>
          <span className="text-[9px] font-mono text-gray-500 tracking-[0.2em] uppercase">Phase 1.0 Converge</span>
        </div>
      </div>
      
      <div className="hidden md:flex items-center gap-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as any)}
            className={`flex items-center gap-3 px-6 py-2.5 rounded-2xl text-[11px] font-bold tracking-[0.2em] transition-all duration-300 ${
              currentView === item.id 
                ? 'bg-white text-black shadow-xl' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon size={14} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-6">
        <button className="hidden lg:block text-[10px] font-mono text-indigo-500 hover:text-indigo-400 font-bold tracking-widest transition-colors animate-pulse">
          SISTEMA ACTIVO
        </button>
        <div className="w-[1px] h-6 bg-white/10 hidden md:block" />
        <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white hover:text-black transition-all">
          <Info size={18} />
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
