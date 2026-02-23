
import React from 'react';
import { UserCheck, UserX, Clock, UserPlus } from 'lucide-react';

interface FriendRequest {
    _id: string;
    requester: {
        _id: string;
        fullName: string;
        profilePhoto: string;
        department: string;
    };
    recipient: {
        _id: string;
        fullName: string;
        profilePhoto: string;
        department: string;
    };
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
}

interface FriendRequestsProps {
    requests: FriendRequest[];
    currentUserId: string;
    onAccept: (userId: string) => void;
    onReject: (userId: string) => void;
    onClose: () => void;
}

const FriendRequests: React.FC<FriendRequestsProps> = ({
    requests,
    currentUserId,
    onAccept,
    onReject,
    onClose
}) => {
    const incoming = requests.filter(r => r.recipient && r.requester && (r.recipient._id || r.recipient) === currentUserId && r.status === 'pending');
    const outgoing = requests.filter(r => r.requester && r.recipient && (r.requester._id || r.requester) === currentUserId && r.status === 'pending');

    return (
        <div className="fixed sm:absolute top-24 sm:top-full left-1/2 sm:left-auto -translate-x-1/2 sm:translate-x-0 mt-0 sm:mt-4 sm:right-0 w-[calc(100vw-2rem)] sm:w-80 bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden z-[70] animate-in fade-in zoom-in duration-300 pointer-events-auto">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-900 serif">Connections</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <UserX size={18} />
                </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-4 space-y-6 text-left">
                {/* Incoming Requests */}
                <section className="space-y-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                        <UserPlus size={12} className="text-rose-500" /> Received Requests
                    </h4>
                    {incoming.length > 0 ? (
                        incoming.map(req => (
                            <div key={req._id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100/50 group">
                                <img
                                    src={(req.requester.profilePhoto || req.requester.profilePhoto === "") ? req.requester.profilePhoto : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(req.requester.fullName)}`}
                                    className="w-10 h-10 rounded-full object-cover"
                                    alt=""
                                />
                                <div className="flex-grow min-w-0">
                                    <p className="font-bold text-sm text-slate-800 truncate">{req.requester.fullName}</p>
                                    <p className="text-[10px] text-slate-400 font-medium truncate">{req.requester.department}</p>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => onAccept(req.requester._id)}
                                        className="p-2 bg-white text-green-500 hover:bg-green-500 hover:text-white rounded-full shadow-sm transition-all"
                                        title="Accept"
                                    >
                                        <UserCheck size={14} />
                                    </button>
                                    <button
                                        onClick={() => onReject(req.requester._id)}
                                        className="p-2 bg-white text-rose-500 hover:bg-rose-500 hover:text-white rounded-full shadow-sm transition-all"
                                        title="Reject"
                                    >
                                        <UserX size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-4 text-center text-slate-400 text-xs italic">No new requests</div>
                    )}
                </section>

                {/* Outgoing Requests */}
                <section className="space-y-4 pt-4 border-t border-slate-50">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                        <Clock size={12} className="text-indigo-500" /> Sent Requests
                    </h4>
                    {outgoing.length > 0 ? (
                        outgoing.map(req => (
                            <div key={req._id} className="flex items-center gap-3 p-3 bg-slate-50/30 rounded-2xl border border-dashed border-slate-100">
                                <img
                                    src={(req.recipient.profilePhoto || req.recipient.profilePhoto === "") ? req.recipient.profilePhoto : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(req.recipient.fullName)}`}
                                    className="w-10 h-10 rounded-full object-cover opacity-50"
                                    alt=""
                                />
                                <div className="flex-grow min-w-0">
                                    <p className="text-xs font-bold text-slate-600 truncate">{req.recipient.fullName}</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <Clock size={10} className="text-amber-500" />
                                        <p className="text-[9px] text-amber-600 font-bold uppercase tracking-wider">Pending</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-2 text-center text-slate-300 text-xs italic">No pending sent requests</div>
                    )}
                </section>
            </div>

            <div className="p-4 bg-slate-900 text-gold-400 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest">Connect with your classmates</p>
            </div>
        </div>
    );
};

export default FriendRequests;
