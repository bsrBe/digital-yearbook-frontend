
import React, { useState } from 'react';
import { GraduationCap, PenLine, LogOut, Search, Bell } from 'lucide-react';
import { User, Role } from '../types';
import FriendRequests from './FriendRequests';

interface NavbarProps {
  view: string;
  setView: (view: any) => void;
  activeUser: User | null;
  onLogout: () => void;
  onSignYearbook: () => void;
  friendRequests: any[];
  onAcceptRequest: (userId: string) => void;
  onRejectRequest: (userId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  view,
  setView,
  activeUser,
  onLogout,
  onSignYearbook,
  friendRequests,
  onAcceptRequest,
  onRejectRequest
}) => {
  const [showRequests, setShowRequests] = useState(false);
  const pendingIncoming = friendRequests.filter(r => (r.recipient?._id || r.recipient) === activeUser?.id && r.status === 'pending').length;

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="w-full max-w-5xl glass-panel text-slate-900 rounded-full px-8 py-4 flex items-center justify-between shadow-soft pointer-events-auto bg-white/60 backdrop-blur-xl border border-white/50">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setView('home')}
        >
          <div className="p-2 bg-slate-900 text-gold-400 rounded-full group-hover:scale-110 transition-transform shadow-lg shadow-slate-900/20">
            <GraduationCap size={20} />
          </div>
          <h1 className="font-bold text-lg tracking-tight serif text-slate-900 hidden sm:block">Class of '25</h1>
        </div>

        <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-full backdrop-blur-sm">
          <NavPill label="Home" active={view === 'home'} onClick={() => setView('home')} />
          <NavPill label="Gallery" active={view === 'gallery'} onClick={() => setView('gallery')} />
          <NavPill label="Memories" active={view === 'memories'} onClick={() => setView('memories')} />
          <NavPill label="Chat" active={view === 'chat'} onClick={() => setView('chat')} />
          <NavPill label="Profile" active={view === 'profile'} onClick={() => setView('profile')} />
          {activeUser?.role === Role.ADMIN && (
            <NavPill label="Admin" active={view === 'admin'} onClick={() => setView('admin')} isSpecial />
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onSignYearbook}
            className="hidden sm:flex items-center gap-2 text-slate-500 hover:text-slate-900 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <PenLine size={16} /> <span className="hidden lg:inline">Sign Book</span>
          </button>

          {activeUser && (
            <div className="relative pointer-events-auto">
              <button
                onClick={() => setShowRequests(!showRequests)}
                className={`p-2 rounded-full transition-all relative ${showRequests ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
              >
                <Bell size={20} />
                {pendingIncoming > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {pendingIncoming}
                  </span>
                )}
              </button>
              {showRequests && (
                <FriendRequests
                  requests={friendRequests}
                  currentUserId={activeUser.id}
                  onAccept={(id) => {
                    onAcceptRequest(id);
                    setShowRequests(false);
                  }}
                  onReject={(id) => {
                    onRejectRequest(id);
                    setShowRequests(false);
                  }}
                  onClose={() => setShowRequests(false)}
                />
              )}
            </div>
          )}

          {activeUser && (
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200/60">
              <img
                src={activeUser.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(activeUser.fullName)}`}
                className="w-10 h-10 rounded-full object-cover cursor-pointer ring-2 ring-white shadow-sm hover:scale-105 transition-transform"
                onClick={() => setView('profile')}
              />
              <button onClick={onLogout} className="text-slate-400 hover:text-rose-500 transition-colors p-2 hover:bg-rose-50 rounded-full"><LogOut size={18} /></button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

const NavPill = ({ label, active, onClick, isSpecial }: { label: string, active: boolean, onClick: () => void, isSpecial?: boolean }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${active
      ? (isSpecial ? 'bg-slate-900 text-gold-400 shadow-md' : 'bg-white text-slate-900 shadow-sm')
      : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
      }`}
  >
    {label}
  </button>
);

export default Navbar;
