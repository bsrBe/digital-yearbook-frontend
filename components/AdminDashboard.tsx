
import React, { useState } from 'react';
import { User, Memory, BestMemory, Role } from '../types';
import { Plus, Trash2, Edit2, X, Search, Users, Heart, Star, Check, AlertCircle } from 'lucide-react';

interface AdminDashboardProps {
  students: User[];
  onAddStudent: (s: User) => void;
  onUpdateStudent: (s: User) => void;
  onDeleteStudent: (id: string) => void;
  memories: Memory[];
  onDeleteMemory: (id: string) => void;
  bestMemories: BestMemory[];
  onAddBestMemory: (m: BestMemory) => void;
  onDeleteBestMemory: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students, onAddStudent, onUpdateStudent, onDeleteStudent,
  memories, onDeleteMemory,
  bestMemories, onAddBestMemory, onDeleteBestMemory
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'memories' | 'best' | 'pending'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isBestModalOpen, setIsBestModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<User | null>(null);

  // Form states
  const [studentForm, setStudentForm] = useState({
    fullName: '', department: 'Science', email: '', studentId: '', profilePhoto: ''
  });
  const [bestForm, setBestForm] = useState({
    title: '', description: '', date: '', imageUrl: '', videoUrl: '', mediaType: 'image' as 'image' | 'video'
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, onSuccess: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSuccess(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      onUpdateStudent({ ...editingStudent, ...studentForm });
    } else {
      onAddStudent({
        ...studentForm,
        id: Date.now().toString(),
        role: Role.STUDENT,
        graduationYear: 2024,
        // Use uploaded photo or fallback to random seed if empty
        profilePhoto: studentForm.profilePhoto || `https://picsum.photos/seed/${Date.now()}/600/800`,
        quote: "The future belongs to the curious.",
        bio: "Excited to graduate!",
        rememberMeFor: "Being a team player.",
        hobbies: [], achievements: [], signatures: [], socialLinks: {},
        isActivated: false
      } as User);
    }
    closeStudentModal();
  };

  const handleBestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddBestMemory({ ...bestForm, id: Date.now().toString() });
    setIsBestModalOpen(false);
    setBestForm({ title: '', description: '', date: '', imageUrl: '', videoUrl: '', mediaType: 'image' });
  };

  const openEditStudent = (s: User) => {
    setEditingStudent(s);
    setStudentForm({
      fullName: s.fullName,
      department: s.department,
      email: s.email,
      studentId: s.studentId,
      profilePhoto: s.profilePhoto
    });
    setIsStudentModalOpen(true);
  };

  const closeStudentModal = () => {
    setIsStudentModalOpen(false);
    setEditingStudent(null);
    setStudentForm({ fullName: '', department: 'Science', email: '', studentId: '', profilePhoto: '' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 serif">Admin Control Center</h1>
          <p className="text-slate-500">Manage students, curate memories, and oversee the community.</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-[20px] shadow-inner">
          <TabBtn active={activeTab === 'pending'} onClick={() => setActiveTab('pending')} icon={<AlertCircle size={16} />} label="Pending" />
          <TabBtn active={activeTab === 'students'} onClick={() => setActiveTab('students')} icon={<Users size={16} />} label="Class Directory" />
          <TabBtn active={activeTab === 'memories'} onClick={() => setActiveTab('memories')} icon={<Heart size={16} />} label="Moderation" />
          <TabBtn active={activeTab === 'best'} onClick={() => setActiveTab('best')} icon={<Star size={16} />} label="Highlights" />
        </div>
      </header>

      {/* SEARCH & FILTERS (Shared) */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input
            placeholder={`Search ${activeTab}...`}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl text-sm border-none focus:ring-2 focus:ring-rose-200 transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          {activeTab === 'students' && (
            <button
              onClick={() => setIsStudentModalOpen(true)}
              className="bg-rose-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-rose-600 shadow-lg shadow-rose-100 transition-all active:scale-95"
            >
              <Plus size={18} /> Add New Student
            </button>
          )}
          {activeTab === 'best' && (
            <button
              onClick={() => setIsBestModalOpen(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              <Plus size={18} /> Add Highlight
            </button>
          )}
        </div>
      </div>

      {/* CONTENT TABS */}
      {activeTab === 'pending' && (
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 serif">Pending Approvals</h2>
            <p className="text-slate-500 text-sm mt-1">Review and approve new user registrations</p>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">
                <th className="px-8 py-5">User Profile</th>
                <th className="px-8 py-5">Student ID</th>
                <th className="px-8 py-5">Department</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.filter(s => !s.isActivated).length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center text-slate-400">
                    <AlertCircle size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-bold">No pending approvals</p>
                    <p className="text-xs mt-1">All users have been approved</p>
                  </td>
                </tr>
              ) : (
                students.filter(s => !s.isActivated && s.fullName.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
                  <tr key={s.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-8 py-5 flex items-center gap-4">
                      <img src={s.profilePhoto} className="w-12 h-12 rounded-2xl object-cover shadow-sm ring-2 ring-white" />
                      <div>
                        <p className="font-bold text-slate-900 text-base">{s.fullName}</p>
                        <p className="text-xs text-slate-400">{s.email}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-slate-600">{s.studentId}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm text-slate-600">{s.department}</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => onUpdateStudent({ ...s, isActivated: true })}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-2xl font-bold hover:bg-green-600 shadow-lg shadow-green-100 transition-all active:scale-95"
                      >
                        <Check size={18} /> Approve
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50/50">
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">
                <th className="px-8 py-5">Full Profile</th>
                <th className="px-8 py-5">Academic ID</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.filter(s => s.fullName.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
                <tr key={s.id} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-5 flex items-center gap-4">
                    <img src={s.profilePhoto} className="w-12 h-12 rounded-2xl object-cover shadow-sm ring-2 ring-white" />
                    <div>
                      <p className="font-bold text-slate-900 text-base">{s.fullName}</p>
                      <p className="text-xs text-slate-400">{s.email}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-slate-600">{s.studentId}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{s.department}</p>
                  </td>
                  <td className="px-8 py-5">
                    <button
                      onClick={() => onUpdateStudent({ ...s, isActivated: !s.isActivated })}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform ${s.isActivated ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}
                    >
                      {s.isActivated ? <Check size={10} /> : <AlertCircle size={10} />}
                      {s.isActivated ? 'Active' : 'Pending'}
                    </button>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button onClick={() => openEditStudent(s)} className="p-2.5 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-colors"><Edit2 size={18} /></button>
                      <button onClick={() => { if (confirm('Delete student?')) onDeleteStudent(s.id) }} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'memories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {memories.length > 0 ? memories.filter(m => m.content.toLowerCase().includes(searchTerm.toLowerCase())).map(m => (
            <div key={m.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative group hover:shadow-xl transition-all duration-500">
              <button
                onClick={() => onDeleteMemory(m.id)}
                className="absolute top-6 right-6 p-2.5 text-slate-300 hover:text-rose-500 bg-white rounded-2xl shadow-sm opacity-0 group-hover:opacity-100 transition-all active:scale-90"
              >
                <Trash2 size={18} />
              </button>
              <div className="flex items-center gap-4 mb-6">
                <img src={m.userPhoto} className="w-10 h-10 rounded-2xl object-cover ring-4 ring-slate-50" />
                <div>
                  <p className="text-sm font-bold text-slate-900">{m.userName}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(m.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-slate-600 italic leading-relaxed text-lg">"{m.content}"</p>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Heart size={32} />
              </div>
              <p className="text-slate-400 font-medium">No shared memories to moderate yet.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'best' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {bestMemories.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase())).map(m => (
            <div key={m.id} className="bg-white rounded-[48px] overflow-hidden border border-slate-100 shadow-sm group hover:shadow-2xl transition-all duration-700">
              <div className="h-64 relative overflow-hidden">
                <img src={m.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                <button
                  onClick={() => onDeleteBestMemory(m.id)}
                  className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md text-white rounded-2xl hover:bg-rose-500 transition-all border border-white/20"
                >
                  <Trash2 size={20} />
                </button>
                <div className="absolute bottom-8 left-8">
                  <span className="bg-rose-500 text-white px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                    {m.date}
                  </span>
                </div>
              </div>
              <div className="p-10 space-y-4">
                <h3 className="text-3xl font-bold serif text-slate-900">{m.title}</h3>
                <p className="text-slate-500 leading-relaxed text-lg">{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALS */}
      {isStudentModalOpen && (
        <Modal onClose={closeStudentModal} title={editingStudent ? "Update Graduate" : "Enroll New Graduate"}>
          <form onSubmit={handleStudentSubmit} className="space-y-6">
            <Input label="Full Name" value={studentForm.fullName} onChange={v => setStudentForm({ ...studentForm, fullName: v })} />
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, (url) => setStudentForm(prev => ({ ...prev, profilePhoto: url })))}
                className="w-full px-5 py-4 bg-slate-50 rounded-[20px] text-sm font-medium border-none focus:ring-2 focus:ring-rose-200 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
              />
              {editingStudent && <p className="text-xs text-slate-400 pl-2">Leave empty to keep existing photo</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Email Address" type="email" value={studentForm.email} onChange={v => setStudentForm({ ...studentForm, email: v })} />
              <Input label="Student ID" value={studentForm.studentId} onChange={v => setStudentForm({ ...studentForm, studentId: v })} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Assigned Faculty / Dept</label>
              <select
                className="w-full px-5 py-4 bg-slate-50 rounded-[20px] text-sm font-medium border-none focus:ring-2 focus:ring-rose-200"
                value={studentForm.department}
                onChange={e => setStudentForm({ ...studentForm, department: e.target.value })}
              >
                <option>Science</option>
                <option>Arts</option>
                <option>Business</option>
                <option>Engineering</option>
              </select>
            </div>
            <button className="w-full bg-rose-500 text-white py-5 rounded-[24px] font-bold mt-4 shadow-xl shadow-rose-100 hover:bg-rose-600 transition-all active:scale-95">
              {editingStudent ? "Save Changes" : "Create Profile"}
            </button>
          </form>
        </Modal>
      )}

      {isBestModalOpen && (
        <Modal onClose={() => setIsBestModalOpen(false)} title="Feature a Milestone">
          <form onSubmit={handleBestSubmit} className="space-y-6">
            <Input label="Milestone Title" value={bestForm.title} onChange={v => setBestForm({ ...bestForm, title: v })} />

            {/* Media Type Toggle */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Media Type:</span>
              <button
                type="button"
                onClick={() => setBestForm(prev => ({ ...prev, mediaType: 'image', videoUrl: '' }))}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${bestForm.mediaType === 'image' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
              >
                Image
              </button>
              <button
                type="button"
                onClick={() => setBestForm(prev => ({ ...prev, mediaType: 'video' }))}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${bestForm.mediaType === 'video' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
              >
                Video
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Occurrence Date" placeholder="e.g. May 2024" value={bestForm.date} onChange={v => setBestForm({ ...bestForm, date: v })} />
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">
                  {bestForm.mediaType === 'video' ? 'Cover Thumbnail' : 'Cover Image'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, (url) => setBestForm(prev => ({ ...prev, imageUrl: url })))}
                  className="w-full px-5 py-4 bg-slate-50 rounded-[20px] text-sm font-medium border-none focus:ring-2 focus:ring-indigo-200 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
            </div>

            {/* Video Upload - only shown for video type */}
            {bestForm.mediaType === 'video' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Video File</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileUpload(e, (url) => setBestForm(prev => ({ ...prev, videoUrl: url })))}
                  className="w-full px-5 py-4 bg-slate-50 rounded-[20px] text-sm font-medium border-none focus:ring-2 focus:ring-purple-200 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">Narration</label>
              <textarea
                className="w-full px-5 py-4 bg-slate-50 rounded-[24px] text-sm min-h-[120px] border-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Describe the significance of this moment..."
                value={bestForm.description}
                onChange={e => setBestForm({ ...bestForm, description: e.target.value })}
              />
            </div>
            <button className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-bold mt-4 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
              Publish Milestone
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

const TabBtn = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${active ? 'bg-white text-rose-500 shadow-md scale-105' : 'text-slate-400 hover:text-slate-600 hover:scale-105'}`}
  >
    {icon} {label}
  </button>
);

const Modal = ({ onClose, title, children }: any) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
    <div className="relative bg-white w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
      <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
        <h3 className="text-2xl font-bold serif text-slate-900">{title}</h3>
        <button onClick={onClose} className="p-3 hover:bg-white rounded-full transition-colors shadow-sm"><X size={20} /></button>
      </div>
      <div className="p-10">{children}</div>
    </div>
  </div>
);

const Input = ({ label, value, onChange, type = "text", placeholder = "" }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2">{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full px-5 py-4 bg-slate-50 rounded-[20px] text-sm font-medium border-none focus:ring-2 focus:ring-rose-200 transition-all"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

export default AdminDashboard;
