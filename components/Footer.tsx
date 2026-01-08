
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-white/5 py-12 px-8 bg-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">Ω</span>
          </div>
          <span className="font-display font-bold text-white tracking-widest text-sm uppercase">Universo Omega</span>
        </div>
        <div className="text-gray-600 text-[10px] font-mono tracking-tighter">
          &copy; 2025 PROTOCOLO DE CONVERGENCIA ACTIVO // CIUDAD DE OMEGA
        </div>
        <div className="flex gap-8 text-gray-500 text-xs font-medium uppercase tracking-widest">
          <a href="#" className="hover:text-white transition-colors">Nodos</a>
          <a href="#" className="hover:text-white transition-colors">Ética AI</a>
          <a href="#" className="hover:text-white transition-colors">Seguridad</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
