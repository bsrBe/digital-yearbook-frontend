
import React, { useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatSystem from './ChatSystem';
import { User } from '../types';
import { MessageSquareDashed } from 'lucide-react';

interface ChatPageProps {
    currentUser: User;
    students: User[];
    friends: string[];
    pendingRequests: any[];
    friendshipStatuses: Record<string, string>;
    onConnect: (userId: string) => void;
    onRefreshData: () => void;
    initialSelectedStudent: User | null;
}

const ChatPage: React.FC<ChatPageProps> = ({
    currentUser,
    students,
    friends,
    pendingRequests,
    friendshipStatuses,
    onConnect,
    onRefreshData,
    initialSelectedStudent
}) => {
    const [selectedStudent, setSelectedStudent] = useState<User | null>(initialSelectedStudent);

    const isBlocked = selectedStudent ? friendshipStatuses[selectedStudent._id] === 'blocked' : false;

    return (
        <div className="flex h-[calc(100vh-140px)] max-w-7xl mx-auto glass-panel bg-white/70 backdrop-blur-2xl rounded-[40px] border border-white/50 shadow-2xl overflow-hidden mt-24 mb-10">
            <ChatSidebar
                students={students}
                friends={friends}
                pendingRequests={pendingRequests}
                friendshipStatuses={friendshipStatuses}
                currentUserId={currentUser._id || (currentUser as any).id}
                selectedRecipientId={selectedStudent?._id || null}
                onSelectRecipient={setSelectedStudent}
                onConnect={onConnect}
            />

            <div className="flex-grow flex flex-col bg-slate-50/30">
                {selectedStudent ? (
                    <ChatSystem
                        recipient={selectedStudent}
                        currentUser={currentUser}
                        friendshipStatus={friendshipStatuses[selectedStudent._id] || 'none'}
                        onBack={() => setSelectedStudent(null)}
                        isBlocked={isBlocked}
                        onBlockUpdate={onRefreshData}
                        onConnect={onConnect}
                    />
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center p-8 text-center space-y-6">
                        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-100/50">
                            <MessageSquareDashed size={64} className="text-indigo-400 animate-pulse" />
                        </div>
                        <div className="max-w-xs">
                            <h3 className="text-2xl font-bold text-slate-800 serif">Your Conversations</h3>
                            <p className="mt-2 text-slate-400 text-sm font-medium">
                                Select a friend from the list to start chatting, or find other classmates to connect with.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-100">Search Students</span>
                            <span className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold uppercase tracking-widest border border-emerald-100">Live Chat</span>
                            <span className="px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-xs font-bold uppercase tracking-widest border border-amber-100">Media Sharing</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
