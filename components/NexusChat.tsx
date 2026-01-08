
import React, { useState, useRef, useEffect } from 'react';
import { motion as motionImport, AnimatePresence } from 'framer-motion';
import { 
  Send, AlertCircle, Loader2, BrainCircuit, Sparkles, Activity, Search, MapPin, 
  ImageIcon, Video, Mic, Zap, MicOff, ExternalLink, Globe, Waves, Brain, Fingerprint
} from 'lucide-react';
import { useStore } from '../store';
import { 
  getGeminiResponse, 
  generateImage, 
  generateVideo 
} from '../services/geminiService';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { Message, NexusMode } from '../types';

const motion = motionImport as any;

const MODE_CONFIG = {
  pro: { label: 'SYNAPSE PRO', icon: BrainCircuit, color: 'indigo', desc: 'Razonamiento complejo (G3 Pro)' },
  flash: { label: 'QUICK PULSE', icon: Zap, color: 'cyan', desc: 'Respuestas rápidas (G3 Flash)' },
  thought: { label: 'DEEP RESONANCE', icon: Brain, color: 'purple', desc: 'Pensamiento Profundo (32k tokens)' },
  image: { label: 'VISUAL FORGE', icon: ImageIcon, color: 'pink', desc: 'Generación G3 Pro Image' },
  video: { label: 'MOTION SYNTH', icon: Video, color: 'orange', desc: 'Sintetizador Veo' },
  live: { label: 'LIVE BRIDGE', icon: Mic, color: 'red', desc: 'Enlace de Voz Directo' },
};

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const NexusChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  
  const { messages, addMessage, isGenerating, setGenerating, setIntensity, nexusMode, setNexusMode } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const liveSessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isGenerating]);

  const startLiveBridge = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      setIsLiveActive(true);

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new AudioContext({ sampleRate: 16000 });
      const outputCtx = new AudioContext({ sampleRate: 24000 });
      
      // Ensure context is resumed for playback
      await outputCtx.resume();
      await inputCtx.resume();
      
      nextStartTimeRef.current = 0;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const base64 = encode(new Uint8Array(int16.buffer));
              sessionPromise.then(s => s.sendRealtimeInput({ 
                media: { data: base64, mimeType: 'audio/pcm;rate=16000' } 
              }));
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const audioData = msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
            }

            if (msg.serverContent?.interrupted) {
              for (const source of sourcesRef.current.values()) source.stop();
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e: any) => {
            console.error("Live Bridge Error:", e);
            setError("La sincronización de voz falló. Verifica tu micrófono o conexión.");
            stopLiveBridge();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: "Eres Omega. Interactúa mediante voz. Tono calmado y futurista."
        }
      });
      liveSessionRef.current = sessionPromise;
    } catch (err: any) {
      setError(`Error de acceso: ${err.message || 'Permisos de audio denegados'}`);
      setIsLiveActive(false);
    }
  };

  const stopLiveBridge = () => {
    setIsLiveActive(false);
    audioStream?.getTracks().forEach(t => t.stop());
    setAudioStream(null);
    if (liveSessionRef.current) {
      liveSessionRef.current.then((s: any) => s.close());
    }
    for (const source of sourcesRef.current.values()) source.stop();
    sourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    setError(null);
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
      type: 'text'
    };

    addMessage(userMsg);
    setGenerating(true);
    const currentInput = input;
    setInput('');

    try {
      let result: any;
      if (nexusMode === 'image') {
        const url = await generateImage(currentInput);
        result = { text: "Visualización generada.", mediaUrl: url };
      } else if (nexusMode === 'video') {
        const url = await generateVideo(currentInput);
        result = { text: "Video sintetizado.", mediaUrl: url };
      } else {
        const history = messages.slice(-6).map(m => ({ 
          role: m.role === 'assistant' ? 'model' : 'user', 
          parts: [{ text: m.content }] 
        }));
        result = await getGeminiResponse(currentInput, history, nexusMode as any);
      }

      addMessage({
        id: Date.now().toString(),
        role: 'assistant',
        content: result.text,
        timestamp: Date.now(),
        type: result.mediaUrl ? (nexusMode === 'video' ? 'video' : 'image') : 'text',
        mediaUrl: result.mediaUrl,
        groundingChunks: result.grounding,
        isThinking: nexusMode === 'thought'
      });
      setIntensity(Math.random());
    } catch (err: any) {
      setError(`Fallo en la sincronización: ${err.message || 'Error desconocido'}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col h-[750px] bg-black/40 border border-white/10 rounded-[4rem] backdrop-blur-3xl overflow-hidden shadow-2xl relative">
      <div className="flex h-full">
        <div className="w-20 md:w-64 border-r border-white/5 bg-white/5 p-6 flex flex-col gap-4">
          {Object.entries(MODE_CONFIG).map(([key, config]) => (
            <button
              key={key}
              onClick={() => { setNexusMode(key as NexusMode); if(key !== 'live') stopLiveBridge(); setError(null); }}
              className={`p-4 rounded-3xl transition-all flex items-center gap-4 group ${nexusMode === key ? 'bg-indigo-600 text-white shadow-glow' : 'hover:bg-white/5 text-gray-500'}`}
            >
              <config.icon size={20} />
              <div className="hidden md:flex flex-col items-start text-left">
                <span className="text-[10px] font-black tracking-widest">{config.label}</span>
                <span className="text-[8px] opacity-40 font-mono truncate w-32">{config.desc}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col relative">
          {nexusMode === 'live' && isLiveActive ? (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
              <div className="relative mb-12">
                <div className="absolute inset-0 bg-red-500/20 blur-[80px] animate-pulse" />
                <motion.div animate={{ scale: [1, 1.1, 1] }} className="w-48 h-48 rounded-full bg-red-600/10 border border-red-500/30 flex items-center justify-center relative z-10">
                  <Waves size={80} className="text-red-500 animate-pulse" />
                </motion.div>
              </div>
              <h3 className="text-3xl font-display font-black text-white mb-4 tracking-widest uppercase">PUENTE ACTIVO</h3>
              <button onClick={stopLiveBridge} className="px-12 py-5 bg-red-600 text-white rounded-full font-black tracking-widest uppercase hover:bg-red-500 transition-all flex items-center gap-3">
                <MicOff size={20} /> FINALIZAR
              </button>
            </div>
          ) : (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
                {messages.map((msg) => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-display font-black flex-shrink-0 ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-indigo-400'}`}>
                      {msg.role === 'user' ? <Fingerprint size={24} /> : 'Ω'}
                    </div>
                    <div className={`p-8 rounded-[2.5rem] max-w-[85%] ${msg.role === 'user' ? 'bg-indigo-600/10 border border-indigo-500/20 text-indigo-100' : 'bg-white/5 border border-white/10 text-white'} backdrop-blur-xl`}>
                      {msg.isThinking && <div className="text-[8px] text-purple-400 font-black mb-2 flex items-center gap-2"><Brain size={10} /> RAZONAMIENTO ACTIVO</div>}
                      {msg.mediaUrl && (
                        <div className="mb-6 rounded-3xl overflow-hidden border border-white/10">
                          {msg.type === 'video' ? <video src={msg.mediaUrl} controls className="w-full" /> : <img src={msg.mediaUrl} className="w-full" alt="Neural visual" />}
                        </div>
                      )}
                      <p className="text-sm leading-relaxed font-light whitespace-pre-wrap">{msg.content}</p>
                      {msg.groundingChunks && msg.groundingChunks.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2">
                          {msg.groundingChunks.map((c, i) => (
                            <a key={i} href={c.web?.uri || c.maps?.uri} target="_blank" className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-[9px] text-indigo-400 hover:bg-white/10">
                              <Globe size={10} /> {c.web?.title || 'Fuente externa'}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isGenerating && <div className="flex gap-6 animate-pulse"><div className="w-12 h-12 rounded-2xl bg-white/5" /><div className="bg-white/5 h-20 w-3/4 rounded-[2rem] flex items-center px-10 gap-4"><Loader2 className="animate-spin text-indigo-400" /> <span className="text-[10px] font-mono text-indigo-400">Omega procesando...</span></div></div>}
              </div>

              <div className="p-10 border-t border-white/5">
                {nexusMode === 'live' ? (
                  <button onClick={startLiveBridge} className="w-full py-8 bg-indigo-600/10 border-2 border-dashed border-indigo-500/30 rounded-3xl text-indigo-400 font-black tracking-widest uppercase hover:bg-indigo-600/20 transition-all flex flex-col items-center gap-2">
                    <Mic size={32} /> INICIAR ENLACE DE VOZ
                  </button>
                ) : (
                  <form onSubmit={handleSubmit} className="flex gap-4">
                    <input
                      type="text"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      placeholder="Comandar Omega..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-3xl py-6 px-10 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button disabled={isGenerating || !input.trim()} type="submit" className="px-10 bg-indigo-600 rounded-3xl text-white hover:bg-indigo-500 disabled:opacity-50">
                      <Send size={24} />
                    </button>
                  </form>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {error && (
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-600/90 text-white px-8 py-4 rounded-full text-xs font-bold flex items-center gap-4 backdrop-blur-md shadow-2xl">
          <AlertCircle size={18} /> {error}
          <button onClick={() => setError(null)} className="ml-4 opacity-50">✕</button>
        </motion.div>
      )}
    </div>
  );
};

export default NexusChat;
