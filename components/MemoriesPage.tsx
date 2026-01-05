
import React, { useState } from 'react';
import { Memory, User } from '../types';
import { Search, Heart, MessageCircle, Share2 } from 'lucide-react';

interface MemoriesPageProps {
  memories: Memory[];
  currentUser: User;
  onShare: (content: string) => void;
  onUserClick?: (userId: string) => void;
}

const MemoriesPage: React.FC<MemoriesPageProps> = ({ memories, currentUser, onShare, onUserClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [newMemory, setNewMemory] = useState('');

  const filtered = memories.filter(m => m.content.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleShareClick = () => {
    if (newMemory.trim()) {
      onShare(newMemory);
      setNewMemory('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
      <header className="text-center space-y-4">
        <h1 className="text-5xl font-bold text-slate-900 serif">Our Shared Memories</h1>
        <p className="text-slate-500 max-w-xl mx-auto">A collection of thoughts, quotes, and memories from our graduating class.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input
            type="text"
            placeholder="Search memories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-rose-50 transition-all text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((memory) => (
          <div key={memory.id} className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <p className="text-slate-600 italic leading-relaxed text-lg flex-grow">"{memory.content}"</p>
            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={memory.userPhoto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(memory.userName)}
                  alt={memory.userName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <button
                  onClick={() => onUserClick?.(memory.userId)}
                  className="font-bold text-slate-900 hover:text-rose-500 transition-colors cursor-pointer text-left"
                >
                  {memory.userName}
                </button>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <button className="flex items-center gap-1 hover:text-rose-500 transition-colors"><Heart size={16} fill={memory.likes > 20 ? 'currentColor' : 'none'} /> <span className="text-xs">{memory.likes}</span></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-8 space-y-4 max-w-xl mx-auto">
        <textarea
          placeholder="Write your memory here..."
          value={newMemory}
          onChange={(e) => setNewMemory(e.target.value)}
          className="w-full p-6 bg-white border border-slate-100 rounded-[32px] focus:ring-4 focus:ring-rose-50 transition-all text-sm shadow-sm"
        />
        <button
          onClick={handleShareClick}
          disabled={!newMemory.trim()}
          className="bg-rose-500 text-white px-8 py-4 rounded-full font-bold shadow-2xl shadow-rose-100 hover:bg-rose-600 transition-all hover:scale-105 disabled:opacity-50"
        >
          Share Your Memory
        </button>
      </div>
    </div>
  );
};

export default MemoriesPage;
