
import React from 'react';
import { motion as motionImport } from 'framer-motion';
import { useGalleryStore } from '../../store/galleryStore';
import { ExternalLink, Search } from 'lucide-react';

// Fix: Cast motion to any to bypass pervasive type mismatch errors
const motion = motionImport as any;

const GalleryGrid: React.FC = () => {
  const { items } = useGalleryStore();

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h2 className="text-4xl font-display font-bold text-white mb-4">Galería de Arte Neural</h2>
          <p className="text-gray-500 max-w-xl">
            Artefactos visuales generados a través de la interpretación cuántica de sentimientos humanos.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar sinapsis..."
              className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-6 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="group relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden"
          >
            <div className="aspect-[4/5] overflow-hidden">
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
              <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-2">{item.category}</span>
              <h3 className="text-2xl font-display font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm mb-6 line-clamp-2">{item.description}</p>
              <button className="w-full py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm font-bold hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
                ANALIZAR NODO <ExternalLink size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default GalleryGrid;
