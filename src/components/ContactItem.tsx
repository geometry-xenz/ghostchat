/**
 * GhostChat — Contact List Item (Pro)
 */

import { motion } from 'framer-motion';
import { Identicon } from './Identicon';
import { useChatStore } from '../stores';
import { ShieldCheck } from 'lucide-react';

interface ContactItemProps {
  peerId: string;
  displayName: string;
  lastMessage?: string;
  lastMessageTime?: number;
  unreadCount?: number;
  online?: boolean;
  isVerified?: boolean;
}

export function ContactItem({
  peerId,
  displayName,
  lastMessage,
  lastMessageTime,
  unreadCount = 0,
  online = false,
  isVerified = false,
}: ContactItemProps) {
  const { activePeerId, setActivePeer } = useChatStore();
  const isActive = activePeerId === peerId;

  return (
    <button
      onClick={() => setActivePeer(peerId)}
      className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-all duration-150 rounded-xl relative group ${
        isActive
          ? 'bg-accent-glow'
          : 'hover:bg-white/5 active:bg-white/10'
      }`}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <Identicon peerId={peerId} size={48} />
        {online && (
          <div className={`absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-accent-safe rounded-full border-[2.5px] ${isActive ? 'border-accent-glow' : 'border-surface'}`} />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-1 min-w-0">
            <span className={`text-[14px] font-semibold truncate ${isActive ? 'text-white' : 'text-white'}`}>
              {displayName || peerId.slice(0, 12)}
            </span>
            {isVerified && (
              <ShieldCheck size={12} className={isActive ? 'text-white/80' : 'text-accent-safe'} />
            )}
          </div>
          {lastMessageTime && (
            <span className={`text-[11px] font-medium tabular-nums ${isActive ? 'text-white/70' : 'text-ghost-dim'}`}>
              {formatTime(lastMessageTime)}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between gap-2">
          <p className={`text-[13px] leading-tight truncate ${
            isActive ? 'text-white/80' : 'text-ghost-dim'
          } ${unreadCount > 0 ? 'font-semibold text-white' : ''}`}>
            {lastMessage || 'No messages yet'}
          </p>
          
          {unreadCount > 0 && !isActive && (
            <div className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-accent-glow text-white text-[10px] font-bold px-1 animate-scale-in shadow-apple">
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

function formatTime(timestamp: number): string {
  const d = new Date(timestamp);
  const now = new Date();
  
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  }
  
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) {
    return d.toLocaleDateString([], { weekday: 'short' });
  }
  
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}
