
import React, { useState } from 'react';
import { BestMemory } from '../types';
import { ChevronRight, Play, X, Download, Maximize2 } from 'lucide-react';

interface HomeProps {
  bestMemories: BestMemory[];
  onExplore: () => void;
  onViewMemories: () => void;
}

const Home: React.FC<HomeProps> = ({ bestMemories, onExplore, onViewMemories }) => {
  const [selectedMemory, setSelectedMemory] = useState<BestMemory | null>(null);

  const handleDownload = (e: React.MouseEvent, m: BestMemory) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = m.mediaType === 'video' ? (m.videoUrl || '') : m.imageUrl;
    link.download = `yearbook - ${m.title.toLowerCase().replace(/\s+/g, '-')} `;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1523050335456-c38a7046d28c?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover opacity-20 scale-105 animate-pulse-slow"
            alt="Graduation Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-50/80 to-slate-50"></div>
        </div>

        {/* Abstract Background Blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-200/30 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-rose-200/20 rounded-full blur-3xl translate-y-1/2"></div>

        <div className="relative z-10 space-y-10 max-w-5xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Live Yearbook</span>
          </div>

          <h1 className="text-8xl md:text-[9rem] font-bold text-slate-900 serif leading-none tracking-tight text-balance drop-shadow-sm">
            The Class <br />
            <span className="italic font-light text-slate-600">of</span> 2024
          </h1>

          <p className="text-xl md:text-2xl text-slate-500 font-light max-w-2xl mx-auto leading-relaxed text-balance">
            A collection of moments, milestones, and memories that define our journey together. Forever captured, forever ours.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <button
              onClick={onExplore}
              className="bg-slate-900 text-white px-10 py-5 rounded-full font-bold text-lg shadow-2xl shadow-slate-900/30 hover:scale-105 hover:bg-slate-800 transition-all duration-300 active:scale-95 flex items-center gap-3"
            >
              Explore Graduates <span className="text-gold-400">→</span>
            </button>
            <button
              onClick={onViewMemories}
              className="px-10 py-5 rounded-full font-bold text-slate-600 hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100"
            >
              View Memories
            </button>
          </div>
        </div>
      </section>

      {/* Cherished Moments Section */}
      <section className="max-w-7xl mx-auto px-4 space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-5xl font-bold text-slate-900 serif">Cherished Moments</h2>
          <p className="text-slate-500">Highlights from our senior year</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {bestMemories.slice(0, 3).map((m, i) => (
            <div
              key={m.id}
              onClick={() => setSelectedMemory(m)}
              className="group relative bg-white rounded-[40px] overflow-hidden shadow-soft hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 border border-white/50 cursor-pointer"
              style={{ animationDelay: `${i * 100} ms` }}
            >
              <div className="aspect-[3/4] overflow-hidden relative">
                <img src={m.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700"></div>

                {m.mediaType === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30 group-hover:scale-110 transition-transform">
                      <Play fill="currentColor" size={24} className="ml-1" />
                    </div>
                  </div>
                )}

                <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {m.date}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl font-bold serif text-white mb-2 leading-tight">{m.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 line-clamp-2">
                  {m.description}
                </p>
                <div className="pt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity delay-200">
                  <div className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-widest">
                    <Maximize2 size={12} /> Preview
                  </div>
                  <button onClick={(e) => handleDownload(e, m)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                    <Download size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quote Section */}
      <section className="max-w-5xl mx-auto px-4 text-center py-24 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-serif text-slate-100 leading-none select-none pointer-events-none">
          "
        </div>
        <div className="relative z-10 space-y-8">
          <p className="text-3xl md:text-5xl font-medium text-slate-800 leading-tight serif text-balance">
            We didn't realize we were making memories, we just knew we were having fun.
          </p>
          <div className="inline-block border-t border-slate-300 pt-6">
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">Class President</p>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedMemory && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-300">
          <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
            <h3 className="text-white/50 text-sm font-bold uppercase tracking-widest">{selectedMemory.title}</h3>
            <div className="flex gap-4">
              <button
                onClick={(e) => handleDownload(e, selectedMemory)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <Download size={20} />
              </button>
              <button
                onClick={() => setSelectedMemory(null)}
                className="p-3 bg-white/10 hover:bg-rose-500 rounded-full text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-grow flex items-center justify-center p-4">
            {selectedMemory.mediaType === 'video' ? (
              <video
                src={selectedMemory.videoUrl}
                controls
                autoPlay
                className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl"
              />
            ) : (
              <img
                src={selectedMemory.imageUrl}
                className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl"
              />
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8 text-center bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white/80 text-lg max-w-2xl mx-auto">{selectedMemory.description}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200/60 text-center">
        <div className="inline-flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
          <span className="font-serif italic text-slate-900">YearbookPro</span>
          <span className="text-xs text-slate-400">• Class of 2025</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
