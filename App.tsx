import React, { useState, useMemo, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { userApi, memoryApi, highlightApi, friendApi, signatureApi } from './services/api';
import Navbar from './components/Navbar';
import Home from './components/Home';
import StudentCard from './components/StudentCard';
import MemoriesPage from './components/MemoriesPage';
import SignatureModal from './components/SignatureModal';
import ProfileEditor from './components/ProfileEditor';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './components/LoginPage';
import ChatSystem from './components/ChatSystem';
import ChatPage from './components/ChatPage';
import GalleryExport from './components/GalleryExport';
import { Search, ArrowLeft, Heart, Share2, PenLine, ChevronDown, MessageSquare, UserPlus, UserCheck, Loader2, Download } from 'lucide-react';

// Types for API data
interface User {
  _id: string;
  email: string;
  fullName: string;
  role: 'student' | 'admin';
  department: string;
  graduationYear: number;
  studentId: string;
  profilePhoto: string;
  quote: string;
  bio: string;
  rememberMeFor: string;
  hobbies: string[];
  achievements: string[];
  phoneNumber?: string;
  telegram?: string;
  instagram?: string;
  twitter?: string;
  isActivated: boolean;
}

interface Memory {
  _id: string;
  userId: { _id: string; fullName: string; profilePhoto: string };
  content: string;
  likes: string[];
  createdAt: string;
}

interface Highlight {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  mediaType: 'image' | 'video';
  date: string;
}

type FriendStatus = 'none' | 'pending' | 'accepted' | 'blocked';

// Main App Content (uses auth context)
const AppContent: React.FC = () => {
  const { user, loading: authLoading, logout, refreshUser } = useAuth();

  const [view, setView] = useState<'home' | 'gallery' | 'memories' | 'profile' | 'admin' | 'chat'>('home');
  const [showExport, setShowExport] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);

  // Data state (from API)
  const [students, setStudents] = useState<User[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [friendIds, setFriendIds] = useState<string[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [signatures, setSignatures] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Friendship status tracker
  const [friendshipStatuses, setFriendshipStatuses] = useState<Record<string, FriendStatus>>({});

  // Fetch data on mount
  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    setDataLoading(true);
    try {
      const [usersData, memoriesData, highlightsData, friendsData, pendingData, blockedData] = await Promise.all([
        userApi.getAll(),
        memoryApi.getAll(),
        highlightApi.getAll(),
        friendApi.getAll(),
        friendApi.getPending(),
        friendApi.getBlocked(),
      ]);
      setStudents(usersData);
      setMemories(memoriesData);
      setHighlights(highlightsData);
      setFriendIds(friendsData);
      setPendingRequests(pendingData);

      const statusMap: Record<string, FriendStatus> = {};
      friendsData.forEach((id: string) => { statusMap[id.toString()] = 'accepted'; });
      blockedData.forEach((id: string) => { statusMap[id.toString()] = 'blocked'; });
      pendingData.forEach((req: any) => {
        const reqId = (req.requester._id || req.requester).toString();
        const recId = (req.recipient._id || req.recipient).toString();
        const myId = user._id.toString();

        const targetId = reqId === myId ? recId : reqId;
        // Priority: accepted > blocked > pending
        if (!statusMap[targetId]) statusMap[targetId] = 'pending';
      });
      setFriendshipStatuses(statusMap);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  // Periodic poll for social updates (friends, requests, blocked)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        const [friendsData, pendingData, blockedData] = await Promise.all([
          friendApi.getAll(),
          friendApi.getPending(),
          friendApi.getBlocked(),
        ]);

        setFriendIds(friendsData);
        setPendingRequests(pendingData);

        const statusMap: Record<string, FriendStatus> = {};
        friendsData.forEach((id: string) => { statusMap[id.toString()] = 'accepted'; });
        blockedData.forEach((id: string) => { statusMap[id.toString()] = 'blocked'; });
        pendingData.forEach((req: any) => {
          const reqId = (req.requester?._id || req.requester || "").toString();
          const recId = (req.recipient?._id || req.recipient || "").toString();
          const myId = user._id.toString();

          if (!reqId || !recId) return;
          const targetId = reqId === myId ? recId : reqId;
          if (!statusMap[targetId]) statusMap[targetId] = 'pending';
        });
        setFriendshipStatuses(statusMap);
      } catch (err) {
        console.error('Polling failed:', err);
      }
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [user]);

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.quote || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = deptFilter === 'All Departments' || s.department === deptFilter;
      return matchesSearch && matchesDept;
    });
  }, [searchTerm, deptFilter, students]);

  // Handlers
  const handleAddMemory = async (content: string) => {
    try {
      await memoryApi.create(content);
      const updated = await memoryApi.getAll();
      setMemories(updated);
    } catch (error) {
      console.error('Failed to add memory:', error);
    }
  };

  const handleToggleLike = async (memoryId: string) => {
    try {
      await memoryApi.toggleLike(memoryId);
      const updated = await memoryApi.getAll();
      setMemories(updated);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    try {
      await memoryApi.delete(id);
      setMemories(prev => prev.filter(m => m._id !== id));
    } catch (error) {
      console.error('Failed to delete memory:', error);
    }
  };

  const handleSendFriendRequest = async (targetId: string) => {
    try {
      await friendApi.sendRequest(targetId);
      await fetchAllData();
    } catch (error) {
      console.error('Failed to send friend request:', error);
      alert((error as Error).message || 'Failed to send request');
    }
  };

  const handleAcceptRequest = async (targetId: string) => {
    try {
      await friendApi.accept(targetId);
      await fetchAllData();
    } catch (error) {
      console.error('Failed to accept friend request:', error);
    }
  };

  const handleRejectRequest = async (targetId: string) => {
    try {
      await friendApi.reject(targetId);
      await fetchAllData();
    } catch (error) {
      console.error('Failed to reject friend request:', error);
    }
  };

  const handleSignYearbook = async (targetId: string, message: string, style: string) => {
    try {
      await signatureApi.sign(targetId, message, style);
      setIsSignModalOpen(false);
      // Refresh signatures for selected student
      if (selectedStudent) {
        const sigs = await signatureApi.getForUser(targetId);
        setSignatures(sigs);
      }
    } catch (error) {
      alert((error as Error).message);
    }
  };

  // Fetch signatures when viewing a student
  useEffect(() => {
    if (selectedStudent) {
      signatureApi.getForUser(selectedStudent._id).then(setSignatures).catch(console.error);
    }
  }, [selectedStudent]);

  // Show login if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  // Map user to expected format
  const activeUser = {
    ...user,
    id: user._id,
    fullName: user.fullName,
    profilePhoto: user.profilePhoto,
    role: user.role === 'admin' ? 'ADMIN' : 'STUDENT',
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative font-sans text-slate-900 selection:bg-gold-200 selection:text-gold-900">
      <div className="bg-noise"></div>
      <Navbar
        view={view} setView={setView} activeUser={activeUser as any}
        onLogout={logout}
        onSignYearbook={() => setIsSignModalOpen(true)}
        friendRequests={pendingRequests}
        onAcceptRequest={handleAcceptRequest}
        onRejectRequest={handleRejectRequest}
      />

      <main className="flex-grow">
        {dataLoading ? (
          <div className="flex items-center justify-center py-40">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
          </div>
        ) : (
          <>
            {view === 'home' && (
              <Home
                bestMemories={highlights.map(h => ({
                  id: h._id,
                  title: h.title,
                  description: h.description,
                  imageUrl: h.imageUrl,
                  videoUrl: h.videoUrl,
                  mediaType: h.mediaType,
                  date: h.date,
                }))}
                onExplore={() => setView('gallery')}
                onViewMemories={() => setView('memories')}
              />
            )}

            {view === 'gallery' && (
              <div className="max-w-7xl mx-auto px-4 pt-40 pb-20 space-y-16 animate-in fade-in duration-700">
                <header className="text-center space-y-4 max-w-2xl mx-auto">
                  <h1 className="text-6xl font-bold text-slate-900 serif leading-tight">Class of 2025</h1>
                  <p className="text-slate-500 text-lg">Every graduate has a story. Find your classmates and read their legacy.</p>
                </header>

                <div className="flex flex-col md:flex-row gap-6 items-center justify-center max-w-5xl mx-auto bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
                  <div className="relative flex-grow min-w-0">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                    <input
                      type="text" placeholder="Search by name, quote, or ID..." value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-[24px] focus:ring-4 focus:ring-rose-50 transition-all font-medium text-slate-700"
                    />
                  </div>
                  <div className="relative w-full md:w-64 shrink-0">
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" size={20} />
                    <select
                      value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
                      className="w-full appearance-none px-8 py-4 bg-slate-50 border-none rounded-[24px] focus:ring-4 focus:ring-rose-50 transition-all font-bold text-slate-600 cursor-pointer"
                    >
                      <option>All Departments</option>
                      <option>Science</option>
                      <option>Arts</option>
                      <option>Business</option>
                      <option>Engineering</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setShowExport(true)}
                    className="w-full md:w-auto flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[24px] font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-100 hover:-translate-y-1 active:scale-95 shrink-0"
                  >
                    <Download size={20} />
                    <span className="whitespace-nowrap">Export Yearbook</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 pt-10">
                  {filteredStudents.map(s => (
                    <StudentCard key={s._id} student={{ ...s, id: s._id } as any} onClick={() => setSelectedStudent(s)} />
                  ))}
                </div>
              </div>
            )}

            {view === 'memories' && (
              <div className="pt-40 pb-20 px-4">
                <MemoriesPage
                  memories={memories.map(m => ({
                    id: m._id,
                    userId: m.userId._id,
                    userName: m.userId.fullName,
                    userPhoto: m.userId.profilePhoto,
                    content: m.content,
                    timestamp: new Date(m.createdAt),
                    likes: m.likes.length,
                  }))}
                  currentUser={activeUser as any}
                  onShare={handleAddMemory}
                  onUserClick={(userId) => {
                    const user = students.find(s => s._id === userId);
                    if (user) {
                      setSelectedStudent(user);
                      setView('gallery');
                    }
                  }}
                />
              </div>
            )}

            {view === 'profile' && (
              <div className="pt-40 pb-20 px-4">
                <ProfileEditor user={activeUser as any} onSave={async (u: any) => {
                  await refreshUser();
                  setView('home');
                }} />
              </div>
            )}

            {view === 'chat' && (
              <ChatPage
                currentUser={activeUser as any}
                students={students}
                friends={friendIds}
                pendingRequests={pendingRequests}
                friendshipStatuses={friendshipStatuses}
                onConnect={handleSendFriendRequest}
                onRefreshData={fetchAllData}
                initialSelectedStudent={selectedStudent}
              />
            )}

            {view === 'admin' && activeUser.role === 'ADMIN' && (
              <div className="pt-40 pb-20 px-4">
                <AdminDashboard
                  students={students.map(s => ({ ...s, id: s._id })) as any}
                  onAddStudent={() => fetchAllData()}
                  onUpdateStudent={async (user: any) => {
                    try {
                      if (user.isActivated && !students.find(s => s._id === user.id)?.isActivated) {
                        // This is an approval action
                        await userApi.approve(user.id);
                      }
                      await fetchAllData();
                    } catch (error) {
                      console.error('Failed to update user:', error);
                    }
                  }}
                  onDeleteStudent={() => fetchAllData()}
                  memories={memories as any}
                  onDeleteMemory={handleDeleteMemory}
                  bestMemories={highlights as any}
                  onAddBestMemory={() => fetchAllData()}
                  onDeleteBestMemory={() => fetchAllData()}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Full-screen student view */}
      {selectedStudent && view !== 'chat' && (
        <div className="fixed inset-0 z-[60] bg-white overflow-y-auto animate-in slide-in-from-right duration-700">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <button
              onClick={() => setSelectedStudent(null)}
              className="flex items-center gap-3 text-slate-400 hover:text-slate-900 transition-all mb-12 group font-bold uppercase tracking-widest text-xs"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Gallery
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
              <div className="space-y-10 lg:sticky lg:top-28">
                <div className="aspect-[3/4] rounded-[60px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] relative bg-slate-100 group">
                  <img src={selectedStudent.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(selectedStudent.fullName)}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
                <div className="flex justify-center gap-6">
                  <ActionBtn icon={<Heart size={28} />} color="rose" onClick={() => { }} />
                  <ActionBtn icon={<Share2 size={28} />} color="indigo" onClick={() => { }} />
                  <ActionBtn icon={<PenLine size={28} />} color="slate" onClick={() => setIsSignModalOpen(true)} />
                </div>
              </div>

              <div className="space-y-16 pb-32">
                <div className="space-y-6">
                  <span className="bg-rose-50 text-rose-500 px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] inline-block border border-rose-100">
                    {selectedStudent.department}
                  </span>
                  <h1 className="text-8xl font-bold text-slate-900 serif leading-none">{selectedStudent.fullName}</h1>
                  <p className="text-3xl text-slate-400 font-light italic leading-relaxed border-l-[12px] border-rose-100 pl-10 py-4 mt-8">
                    "{selectedStudent.quote}"
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                  <InfoBlock title="Passions" items={selectedStudent.hobbies.length > 0 ? selectedStudent.hobbies : ['Not specified']} />
                  <InfoBlock title="Achievements" items={selectedStudent.achievements.length > 0 ? selectedStudent.achievements : ['Not specified']} />
                </div>

                {/* Contact Info Section */}
                {(selectedStudent.phoneNumber || selectedStudent.telegram || selectedStudent.instagram || selectedStudent.twitter) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-8 border-t border-slate-100">
                    {selectedStudent.phoneNumber && <InfoBlock title="Phone" items={[selectedStudent.phoneNumber]} />}
                    {selectedStudent.telegram && <InfoBlock title="Telegram" items={[`@${selectedStudent.telegram.replace('@', '')}`]} />}
                    {selectedStudent.instagram && <InfoBlock title="Instagram" items={[`@${selectedStudent.instagram.replace('@', '')}`]} />}
                    {selectedStudent.twitter && <InfoBlock title="Twitter" items={[`@${selectedStudent.twitter.replace('@', '')}`]} />}
                  </div>
                )}

                <div className="bg-slate-900 rounded-[56px] p-16 text-white space-y-6 shadow-2xl relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/20 rounded-full blur-3xl group-hover:bg-rose-500/30 transition-all"></div>
                  <h3 className="text-2xl font-bold serif flex items-center gap-3">
                    <Heart size={24} className="text-rose-400" /> Legacy Note
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-xl font-light">
                    {selectedStudent.rememberMeFor || 'No legacy note yet.'}
                  </p>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em]">The Journey</h3>
                  <p className="text-slate-600 leading-relaxed text-xl font-light">
                    {selectedStudent.bio || "No bio added yet."}
                  </p>
                </div>

                <div className="pt-16 border-t border-slate-100 flex flex-wrap gap-4">
                  {(() => {
                    const status = friendshipStatuses[selectedStudent._id] || 'none';
                    if (status === 'accepted') {
                      return (
                        <div className="flex gap-4 w-full">
                          <button onClick={() => setView('chat')} className="flex-grow bg-slate-900 text-white px-10 py-6 rounded-[28px] font-bold flex items-center justify-center gap-3 hover:bg-slate-800 shadow-2xl transition-all active:scale-95">
                            <MessageSquare size={24} /> Message {selectedStudent.fullName.split(' ')[0]}
                          </button>
                          <div className="px-10 py-6 bg-green-50 text-green-700 rounded-[28px] font-bold flex items-center gap-3 border border-green-100">
                            <UserCheck size={24} /> Friends
                          </div>
                        </div>
                      );
                    }
                    if (status === 'pending') {
                      return (
                        <button className="w-full bg-amber-50 text-amber-700 px-10 py-6 rounded-[28px] font-bold flex items-center justify-center gap-3 border border-amber-100 cursor-default">
                          Request Sent • Pending Approval
                        </button>
                      );
                    }
                    return (
                      <button
                        onClick={() => handleSendFriendRequest(selectedStudent._id)}
                        className="w-full bg-rose-500 text-white px-10 py-6 rounded-[28px] font-bold flex items-center justify-center gap-4 hover:bg-rose-600 transition-all shadow-xl shadow-rose-100 active:scale-95"
                      >
                        <UserPlus size={24} /> Connect as Classmates
                      </button>
                    );
                  })()}
                </div>

                <div className="space-y-12 pt-24 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-5xl font-bold text-slate-900 serif">Digital Signatures</h2>
                    {friendshipStatuses[selectedStudent._id] === 'accepted' && (
                      <button onClick={() => setIsSignModalOpen(true)} className="flex items-center gap-2 text-rose-500 font-bold text-sm uppercase tracking-widest hover:text-rose-600 transition-colors">
                        <PenLine size={20} /> Sign Guestbook
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-8">
                    {signatures.length > 0 ? (
                      signatures.map((s: any) => (
                        <div key={s._id} className="p-10 bg-slate-50/50 rounded-[40px] space-y-4 relative group border border-slate-100/50 hover:bg-white transition-all">
                          <p className={`text-2xl text-slate-700 leading-relaxed italic ${s.style === 'elegant' ? 'serif' : s.style === 'bold' ? 'font-bold' : ''}`}>
                            "{s.message}"
                          </p>
                          <div className="flex items-center justify-between pt-6">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">— {s.fromUserId?.fullName || 'Anonymous'}</p>
                            <span className="text-xs text-slate-300 font-medium">{new Date(s.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-24 text-center bg-white rounded-[56px] border-2 border-dashed border-slate-100 text-slate-400 italic">
                        {friendshipStatuses[selectedStudent._id] === 'accepted'
                          ? '"A blank page is just a story waiting to happen. Sign this graduate\'s yearbook."'
                          : 'Connect as friends to sign this yearbook.'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSignModalOpen && selectedStudent && friendshipStatuses[selectedStudent._id] === 'accepted' && (
        <SignatureModal
          students={students.map(s => ({ ...s, id: s._id })) as any}
          onClose={() => setIsSignModalOpen(false)}
          onSave={(targetId, message, fromName, style) => handleSignYearbook(targetId, message, style)}
          initialTargetId={selectedStudent._id}
        />
      )}
      {showExport && (
        <GalleryExport
          students={students.map(s => ({ ...s, id: s._id })) as any}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
};

// Helper components
const ActionBtn = ({ icon, color, onClick }: any) => {
  const styles: any = {
    rose: "bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white",
    indigo: "bg-indigo-50 text-indigo-500 hover:bg-indigo-500 hover:text-white",
    slate: "bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white"
  };
  return (
    <button onClick={onClick} className={`p-6 rounded-[32px] shadow-sm transition-all duration-500 hover:scale-110 hover:-translate-y-2 ${styles[color]}`}>
      {icon}
    </button>
  );
};

const InfoBlock = ({ title, items }: any) => (
  <div className="space-y-6">
    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] ml-2">{title}</h3>
    <div className="flex flex-wrap gap-3">
      {items.map((it: string) => (
        <span key={it} className="px-6 py-3 bg-white border border-slate-100 text-slate-700 rounded-2xl text-sm font-bold shadow-sm hover:shadow-md transition-shadow">
          {it}
        </span>
      ))}
    </div>
  </div>
);

export const getAvatarUrl = (name: string, photo?: string) => {
  if (photo) return photo;
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
};

// Wrap with AuthProvider
const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
