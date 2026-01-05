
import React from 'react';
import { BestMemory } from '../types';
import { Calendar, Plus } from 'lucide-react';

interface BestMemoriesPageProps {
  memories: BestMemory[];
  isAdmin: boolean;
  onAdd: () => void;
}

const BestMemoriesPage: React.FC<BestMemoriesPageProps> = ({ memories, isAdmin, onAdd }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
            <Calendar size={12} /> Curated Highlights
          </div>
          <h1 className="text-5xl font-bold text-slate-900 serif leading-tight">Moments That Defined Us</h1>
          <p className="text-xl text-slate-500">A look back at the most impactful stories, events, and milestones of the Class of 2025.</p>
        </div>
        {isAdmin && (
          <button
            onClick={onAdd}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all hover:-translate-y-1"
          >
            <Plus size={20} /> Add Highlight
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {memories.map((memory, index) => (
          <div key={memory.id} className={`group space-y-6 ${index % 2 === 1 ? 'md:mt-24' : ''}`}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[40px] shadow-2xl">
              <img
                src={memory.imageUrl}
                alt={memory.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  {memory.date}
                </span>
              </div>
            </div>
            <div className="px-4 space-y-3">
              <h2 className="text-3xl font-bold text-slate-900 serif">{memory.title}</h2>
              <p className="text-lg text-slate-500 leading-relaxed">{memory.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestMemoriesPage;
