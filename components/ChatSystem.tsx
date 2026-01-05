
import React, { useState, useRef, useEffect } from 'react';
import { User, ChatMessage } from '../types';
import { Send, Image as ImageIcon, Smile, ArrowLeft, MoreHorizontal, Loader2, ShieldOff, ShieldCheck, Trash2, X, UserX, UserPlus, Clock } from 'lucide-react';
import { chatApi, friendApi } from '../services/api';

interface ChatSystemProps {
  recipient: User;
  currentUser: User;
  friendshipStatus: string;
  onBack: () => void;
  isBlocked: boolean;
  onBlockUpdate: () => void;
  onConnect: (userId: string) => void;
}

const ChatSystem: React.FC<ChatSystemProps> = ({
  recipient,
  currentUser,
  friendshipStatus,
  onBack,
  isBlocked,
  onBlockUpdate,
  onConnect
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emojis = ['😊', '😂', '🥰', '😍', '😎', '👍', '🔥', '✨', '🎓', '🎉', '❤️', '🙌', '🤔', '😢', '👏', '🥳', '🚀', '💪', '💯', '🌈', '🍦', '🍕', '💻', '📚', '⚡', '🌟', '🦄', '🍀', '🦋', '🎈'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [recipient._id]);

  const fetchMessages = async () => {
    try {
      const data = await chatApi.getConversation(recipient._id);
      const formatted = data.map((m: any) => ({
        id: m._id,
        senderId: m.senderId,
        text: m.content,
        type: m.messageType || 'text',
        mediaUrl: m.mediaUrl,
        timestamp: new Date(m.createdAt),
      }));
      setMessages(formatted);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (text?: string, type: 'text' | 'image' = 'text', mediaUrl?: string) => {
    const content = text || message;
    if (!content.trim() && type === 'text') return;

    if (type === 'text') setMessage('');

    try {
      await chatApi.sendMessage(recipient._id, content, type, mediaUrl);
      fetchMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. You might be blocked.');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = await chatApi.uploadImage(file);
      await handleSend('Sent an image', 'image', data.url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleBlockAction = async () => {
    setIsBlocking(true);
    try {
      if (isBlocked) {
        await friendApi.unblock(recipient._id);
      } else {
        await friendApi.block(recipient._id);
      }
      await onBlockUpdate();
      setShowOptions(false);
    } catch (error) {
      console.error('Block action failed:', error);
      alert('Action failed');
    } finally {
      setIsBlocking(false);
    }
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await onConnect(recipient._id);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white md:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden w-full relative">
      {/* Header */}
      <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full md:hidden">
            <ArrowLeft size={20} />
          </button>
          <div className="relative">
            <img src={recipient.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(recipient.fullName)}`} alt="" className="w-10 h-10 rounded-full object-cover" />
            {!isBlocked && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 leading-tight">
              {recipient.fullName}
              {isBlocked && <span className="ml-2 text-[10px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded">Blocked</span>}
            </h3>
            <p className="text-xs text-slate-400 font-medium">{recipient.department}</p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 hover:bg-slate-50 rounded-full text-slate-400"
          >
            <MoreHorizontal size={20} />
          </button>

          {showOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
              <button
                onClick={handleBlockAction}
                disabled={isBlocking}
                className={`w-full px-4 py-2.5 text-left text-sm font-medium flex items-center gap-3 ${isBlocked ? 'text-emerald-600 hover:bg-emerald-50' : 'text-rose-600 hover:bg-rose-50'} ${isBlocking ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isBlocking ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : isBlocked ? (
                  <ShieldCheck size={18} />
                ) : (
                  <UserX size={18} />
                )}
                {isBlocking ? 'Processing...' : isBlocked ? 'Unblock User' : 'Block User'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Discovery Banner */}
      {!isBlocked && friendshipStatus === 'none' && (
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 flex items-center justify-between text-white relative z-0">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white/20 rounded-xl">
              <UserPlus size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold">Not in your contacts yet</p>
              <p className="text-[11px] opacity-80">Add {recipient.fullName} to your friends to stay connected</p>
            </div>
          </div>
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="px-4 py-2 bg-white text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors shadow-lg flex items-center gap-2 min-w-[100px] justify-center"
          >
            {isConnecting ? <Loader2 size={14} className="animate-spin" /> : <UserPlus size={14} />}
            {isConnecting ? 'Sending...' : 'Add Contact'}
          </button>
        </div>
      )}

      {!isBlocked && friendshipStatus === 'pending' && (
        <div className="px-6 py-3 bg-amber-50 border-b border-amber-100 flex items-center gap-3 text-amber-700">
          <Clock size={16} />
          <p className="text-xs font-medium">Friend request sent. Waiting for response...</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isMe = msg.senderId === (currentUser._id || (currentUser as any).id);
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl p-1 shadow-sm ${isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none'
                }`}>
                {msg.type === 'image' && msg.mediaUrl && (
                  <img src={msg.mediaUrl} alt="" className="rounded-xl max-w-full h-auto mb-1" />
                )}
                <div className="px-3 py-1.5">
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        {isBlocked ? (
          <div className="bg-slate-50 rounded-2xl p-3 text-center">
            <p className="text-xs font-medium text-slate-400 italic">You cannot message a blocked user.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {showEmojiPicker && (
              <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl animate-in slide-in-from-bottom-2 duration-200">
                {emojis.map(e => (
                  <button key={e} onClick={() => { setMessage(m => m + e); setShowEmojiPicker(false); }} className="text-xl hover:scale-125 transition-transform">{e}</button>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 bg-slate-100 rounded-2xl px-4 py-2">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`transition-colors ${showEmojiPicker ? 'text-indigo-600' : 'text-slate-400 hover:text-indigo-600'}`}
              >
                <Smile size={20} />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-slate-400 hover:text-indigo-600 transition-colors"
                disabled={uploading}
              >
                {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImageIcon size={20} />}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Write a message..."
                className="flex-grow bg-transparent border-none focus:ring-0 text-sm py-2"
              />
              <button
                onClick={() => handleSend()}
                disabled={!message.trim() || uploading}
                className="text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition-transform"
              >
                <Send size={20} fill="currentColor" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSystem;
