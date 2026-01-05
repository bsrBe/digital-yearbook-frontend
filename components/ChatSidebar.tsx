
import React, { useState, useMemo } from 'react';
import { Search, UserPlus, MessageSquare, Clock, UserCheck } from 'lucide-react';
import { User } from '../types';

interface ChatSidebarProps {
    students: User[];
    friends: string[];
    pendingRequests: any[];
    friendshipStatuses: Record<string, string>;
    currentUserId: string;
    selectedRecipientId: string | null;
    onSelectRecipient: (user: User) => void;
    onConnect: (userId: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
    students,
    friends,
    pendingRequests,
    friendshipStatuses,
    currentUserId,
    selectedRecipientId,
    onSelectRecipient,
    onConnect,
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = useMemo(() => {
        const list = students.filter(s => s._id !== currentUserId && s.isActivated);

        const filtered = !searchTerm ? list : list.filter(s =>
            s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.department.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return filtered.sort((a, b) => {
            const statusA = friendshipStatuses[a._id] || 'none';
            const statusB = friendshipStatuses[b._id] || 'none';

            // Custom sort order
            const priority: Record<string, number> = {
                'accepted': 0,
                'blocked': 1,
                'pending': 2,
                'none': 3
            };

            const pA = priority[statusA] ?? 4;
            const pB = priority[statusB] ?? 4;

            if (pA !== pB) return pA - pB;
            return a.fullName.localeCompare(b.fullName);
        });
    }, [students, friendshipStatuses, searchTerm, currentUserId]);

    const getStatus = (userId: string) => {
        return (friendshipStatuses[userId] as any) || 'none';
    };

    return (
        <div className="flex flex-col h-full bg-white border-r border-slate-100 w-full md:w-80 shrink-0">
            <div className="p-6 space-y-4 text-left">
                <h2 className="text-2xl font-bold text-slate-900 serif">Messages</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                    />
                </div>
            </div>

            <div className="flex-grow overflow-y-auto px-2 pb-6 space-y-1">
                {filteredData.length > 0 ? (
                    filteredData.map(student => {
                        const status = getStatus(student._id);
                        const isSelected = selectedRecipientId === student._id;

                        return (
                            <div
                                key={student._id}
                                onClick={() => onSelectRecipient(student)}
                                className={`flex items-center gap-3 p-3 rounded-2xl transition-all group cursor-pointer ${isSelected
                                    ? 'bg-indigo-50 shadow-sm shadow-indigo-100/50'
                                    : 'hover:bg-slate-50'
                                    }`}
                            >
                                <div className="relative shrink-0 text-left">
                                    <img
                                        src={student.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(student.fullName)}`}
                                        className={`w-12 h-12 rounded-full object-cover ring-2 ${isSelected ? 'ring-indigo-200' : 'ring-white shadow-sm'}`}
                                        alt=""
                                    />
                                    {status === 'accepted' && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                    )}
                                </div>

                                <div className="flex-grow min-w-0 text-left">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className={`font-bold text-sm truncate ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                                            {student.fullName}
                                            {status === 'blocked' && <span className="ml-2 text-[8px] bg-rose-100 text-rose-600 px-1 py-0.5 rounded uppercase tracking-tighter">Blocked</span>}
                                        </p>
                                        {status === 'accepted' ? (
                                            <MessageSquare size={12} className={isSelected ? 'text-indigo-400' : 'text-slate-300'} />
                                        ) : status === 'pending' ? (
                                            <Clock size={12} className="text-amber-400" />
                                        ) : null}
                                    </div>
                                    <p className={`text-[10px] font-medium truncate ${isSelected ? 'text-indigo-500' : 'text-slate-400'}`}>
                                        {student.department}
                                    </p>
                                </div>

                                {status === 'pending' && (
                                    <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[8px] font-bold uppercase tracking-tighter rounded-md">
                                        Requested
                                    </span>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-10">
                        <p className="text-slate-400 text-sm font-medium italic">No students found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;
