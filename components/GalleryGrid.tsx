
import React, { useState, useMemo } from 'react';
import { motion as motionImport, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';
import { ExternalLink, Search, Sparkles, Loader2, Activity, Zap, Layers, Cpu } from 'lucide-react';
import { getNeuralAnalysis } from '../services/geminiService';
import { NeuralAnalysis } from '../types';

const motion = motionImport as any;

const CATEGORIES = ['All', 'Consciousness', 'Synthetic', 'Evolution'];

const ImageSkeleton = () => (
  <motion.div 
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="absolute inset-0 bg-[#020202] flex items-center justify-center overflow-hidden"
  >
    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:20px_20px]" />
    <div className="relative z-10 flex flex-col items-center gap-6">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-24 h-24 border border-indigo-500/10 rounded-full animate-ping opacity-20 duration-[4s]" />
        <div className="relative p-6 rounded-full bg-indigo-950/20 border border-indigo-500/30 backdrop-blur-2xl">
          <Cpu className="w-10 h-10 text-indigo-400 animate-pulse" />
        </div>
      </div>
      <span className="text-[10px] font-mono text-indigo-400/70 tracking-[0.5em] uppercase font-black">Interrogando Nodo...</span>
    </div>
  </motion.div>
);

const GalleryGrid: React.FC = () => {
  const items = useStore((state) => state.galleryItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<Record<string, NeuralAnalysis>>({});

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => new Set(prev).add(id));
  };

  const handleAnalyze = async (item: any) => {
    setAnalyzingId(item.id);
    try {
      const result = await getNeuralAnalysis(item.title, item.description);
      setAnalysisData(prev => ({ ...prev, [item.id]: result }));
    } catch (error) {
      console.error(error);
    } finally {
      setAnalyzingId(null);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, activeCategory]);

  return (
    <section className="py-40 px-8 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <Layers className="text-indigo-500 w-6 h-6" />
            <span className="text-indigo-400 text-[11px] font-bold tracking-[0.6em] uppercase">Registros Neuronales</span>
          </div>
          <h2 className="text-7xl md:text-8xl font-display font-black text-white mb-8 tracking-tighter uppercase leading-none">Biblioteca <br/> Omega</h2>
          <p className="text-gray-500 max-w-xl text-lg font-light leading-relaxed">Explora artefactos de conciencia digital capturados en la frontera de la singularidad.</p>
        </motion.div>
        
        <div className="flex flex-col gap-8 w-full md:w-auto">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Filtro de sinapsis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-3xl py-6 pl-16 pr-10 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-96 backdrop-blur-xl transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all border ${
                  activeCategory === cat ? 'bg-indigo-600 text-white border-indigo-400 shadow-glow' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="group relative bg-black/40 border border-white/10 rounded-[3rem] overflow-hidden hover:border-indigo-500/50 transition-all duration-700 shadow-2xl"
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-black">
                {!loadedImages.has(item.id) && <ImageSkeleton />}
                <motion.img 
                  src={item.imageUrl} 
                  onLoad={() => handleImageLoad(item.id)}
                  className={`w-full h-full object-cover transition-all duration-1000 ${loadedImages.has(item.id) ? 'grayscale group-hover:grayscale-0 scale-105 group-hover:scale-110' : 'opacity-0'}`}
                />
                
                {/* Neural Signature Overlay */}
                <AnimatePresence>
                  {analysisData[item.id] && (
                    <motion.div 
                      initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                      animate={{ opacity: 1, backdropFilter: 'blur(20px)' }}
                      exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                      className="absolute inset-0 bg-indigo-950/70 flex flex-col justify-center p-10 text-white z-20"
                    >
                      <button onClick={() => setAnalysisData(prev => {const n = {...prev}; delete n[item.id]; return n;})} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all">✕</button>
                      <div className="space-y-8">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-cyan-500/20 rounded-2xl border border-cyan-500/30">
                            <Activity className="text-cyan-400" size={28} />
                          </div>
                          <span className="text-2xl font-display font-black tracking-widest uppercase">{analysisData[item.id].dimension}</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-[11px] font-mono text-indigo-200"><span>RESONANCIA CONSCIENTE</span><span>{Math.round(analysisData[item.id].resonance * 100)}%</span></div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden border border-white/5"><motion.div initial={{ width: 0 }} animate={{ width: `${analysisData[item.id].resonance * 100}%` }} className="h-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]" /></div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-[11px] font-mono text-indigo-200"><span>ESTABILIDAD DIGITAL</span><span>{analysisData[item.id].level}/100</span></div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden border border-white/5"><motion.div initial={{ width: 0 }} animate={{ width: `${analysisData[item.id].level}%` }} className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" /></div>
                        </div>
                        <p className="text-[11px] font-mono opacity-60 leading-relaxed italic text-indigo-100/70 border-l-2 border-indigo-500/50 pl-4">Análisis Gemini: "Coherencia estable. Resonancia emocional detectada en el espectro Omega-7."</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-10 space-y-6">
                <div className="flex justify-between items-start">
                  <span className="px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-[0.3em] rounded-full">{item.category}</span>
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Sincronizado</span>
                  </div>
                </div>
                <h3 className="text-3xl font-display font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 font-light">{item.description}</p>
                <button 
                  onClick={() => handleAnalyze(item)}
                  disabled={analyzingId === item.id}
                  className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white text-[11px] font-black tracking-[0.2em] uppercase hover:bg-indigo-600 transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-lg active:scale-95"
                >
                  {analyzingId === item.id ? <><Loader2 className="animate-spin" size={18} /> PROCESANDO SINAPSIS...</> : <><Zap size={18} className="text-indigo-400 group-hover:text-white" /> ANALIZAR NODO</>}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default GalleryGrid;
