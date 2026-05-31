/**
 * GhostChat — Chat Header (Pro)
 */

import { motion } from 'framer-motion';
import { Shield, ShieldCheck, Phone, MoreVertical, Video } from 'lucide-react';
import { Identicon } from './Identicon';
import { useAppStore } from '../stores';

interface ChatHeaderProps {
  peerId: string;
  displayName: string;
  online: boolean;
  isVerified: boolean;
  latencyMs?: number;
}

export function ChatHeader({ peerId, displayName, online, isVerified, latencyMs }: ChatHeaderProps) {
  const openModal = useAppStore((s) => s.openModal);
  
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-void/50 backdrop-blur-xl sticky top-0 z-10">
      <div className="flex items-center gap-3.5">
        <div className="relative group cursor-pointer">
          <Identicon peerId={peerId} size={36} />
          {online && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent-safe rounded-full border-[2.5px] border-void" />
          )}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <h2 className="text-ghost-white text-[15px] font-semibold tracking-tight leading-tight">
              {displayName || peerId.slice(0, 16) + '...'}
            </h2>
            {isVerified && (
              <ShieldCheck size={14} className="text-accent-safe mt-0.5" />
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[11px] font-medium tracking-tight ${online ? 'text-accent-safe' : 'text-ghost-dim'}`}>
              {online ? 'Online' : 'Offline'}
            </span>
            {latencyMs !== undefined && online && (
              <span className="text-[10px] font-mono text-ghost-dim/60 tabular-nums">{latencyMs}ms</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <HeaderButton 
          icon={<Video size={19} />} 
          title="Video call" 
          disabled 
        />
        <HeaderButton 
          icon={<Phone size={18} />} 
          title="Voice call" 
          disabled 
        />
        <div className="w-[1px] h-4 bg-border-subtle mx-2" />
        <HeaderButton
          onClick={() => openModal('key-verification', { peerId })}
          icon={isVerified ? <ShieldCheck size={19} /> : <Shield size={19} />}
          title={isVerified ? 'Connection verified' : 'Verify connection'}
          className={isVerified ? 'text-accent-safe' : 'text-ghost-dim'}
        />
        <HeaderButton 
          icon={<MoreVertical size={19} />} 
          title="Details"
        />
      </div>
    </header>
  );
}

function HeaderButton({ 
  icon, 
  onClick, 
  title, 
  disabled = false,
  className = ""
}: { 
  icon: React.ReactNode; 
  onClick?: () => void; 
  title: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg transition-all duration-150 active:scale-95 ${
        disabled 
          ? 'opacity-20 cursor-not-allowed' 
          : 'text-accent-glow hover:bg-white/5 active:bg-white/10'
      } ${className}`}
      title={title}
    >
      {icon}
    </button>
  );
}
