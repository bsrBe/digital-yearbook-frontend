
import React, { useState, useRef, useEffect } from 'react';
import { User, ChatMessage } from '../types';
import { Send, Image as ImageIcon, Smile, ArrowLeft, MoreHorizontal } from 'lucide-react';

interface ChatSystemProps {
  currentUser: User;
  recipient: User;
  onBack: () => void;
}

const ChatSystem: React.FC<ChatSystemProps> = ({ currentUser, recipient, onBack }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: recipient.id,
      text: `Hey ${currentUser.fullName}! Can't believe we're finally graduating.`,
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      type: 'text'
    },
    {
      id: '2',
      senderId: recipient.id,
      text: "Did you finish your senior project yet?",
      timestamp: new Date(Date.now() - 1000 * 60 * 55),
      type: 'text'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: message,
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate auto-reply
    setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: recipient.id,
        text: "That's awesome! Let's catch up later at the library.",
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-w-2xl mx-auto">
      {/* Header */}
      <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full md:hidden">
            <ArrowLeft size={20} />
          </button>
          <div className="relative">
            <img src={recipient.profilePhoto} alt="" className="w-10 h-10 rounded-full object-cover" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 leading-tight">{recipient.fullName}</h3>
            <p className="text-xs text-slate-400 font-medium">{recipient.department}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${
                isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none'
              }`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-[10px] mt-1 ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-center gap-2 bg-slate-100 rounded-2xl px-4 py-2">
          <button className="text-slate-400 hover:text-indigo-600 transition-colors"><Smile size={20} /></button>
          <button className="text-slate-400 hover:text-indigo-600 transition-colors"><ImageIcon size={20} /></button>
          <input 
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Write a message..."
            className="flex-grow bg-transparent border-none focus:ring-0 text-sm py-2"
          />
          <button 
            onClick={handleSend}
            disabled={!message.trim()}
            className="text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition-transform"
          >
            <Send size={20} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSystem;
