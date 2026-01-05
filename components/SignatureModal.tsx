
import React, { useState } from 'react';
import { X, PenLine } from 'lucide-react';
import { User } from '../types';

interface SignatureModalProps {
  students: User[];
  onClose: () => void;
  onSave: (targetId: string, message: string, name: string, style: 'casual' | 'elegant' | 'bold') => void;
  initialTargetId?: string;
}

const SignatureModal: React.FC<SignatureModalProps> = ({ students, onClose, onSave, initialTargetId }) => {
  const [targetId, setTargetId] = useState(initialTargetId || 'all');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [style, setStyle] = useState<'casual' | 'elegant' | 'bold'>('casual');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-50 text-rose-500 rounded-lg">
              <PenLine size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold serif text-slate-900">Sign the Yearbook</h3>
              <p className="text-xs text-slate-400">Leave a personal message that will be treasured.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Who are you signing for?</label>
            <select 
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm"
            >
              <option value="all">The Entire Class</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Message</label>
            <textarea 
              required
              placeholder="Write your heartfelt message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Your Name</label>
            <input 
              required
              placeholder="How you want to be remembered"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Signature Style</label>
            <div className="flex gap-4">
              {['casual', 'elegant', 'bold'].map((s) => (
                <label key={s} className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="style" 
                    className="hidden" 
                    checked={style === s} 
                    onChange={() => setStyle(s as any)} 
                  />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${style === s ? 'border-rose-500' : 'border-slate-200'}`}>
                    {style === s && <div className="w-2 h-2 bg-rose-500 rounded-full"></div>}
                  </div>
                  <span className={`text-sm font-medium capitalize ${style === s ? 'text-rose-600' : 'text-slate-400'}`}>
                    {s}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onSave(targetId, message, name, style)}
            className="w-full bg-rose-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-rose-100 hover:bg-rose-600 transition-all"
          >
            Sign Yearbook
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignatureModal;
