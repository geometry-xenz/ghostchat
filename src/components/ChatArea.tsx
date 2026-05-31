/**
 * GhostChat — Chat Area (Pro)
 */

import { motion } from 'framer-motion';
import { Lock, Zap, ShieldCheck } from 'lucide-react';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { useChatStore, useContactStore } from '../stores';
import { useRef, useEffect } from 'react';

export function ChatArea() {
  const { activePeerId, messages } = useChatStore();
  const contacts = useContactStore((s) => s.contacts);
  const activeContact = contacts.find((c) => c.peerId === activePeerId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages.length]);

  if (!activePeerId || !activeContact) {
    return <EmptyState />;
  }

  return (
    <div className="flex-1 flex flex-col bg-void relative h-full">
      <ChatHeader
        peerId={activeContact.peerId}
        displayName={activeContact.displayName}
        online={activeContact.online}
        isVerified={activeContact.isVerified}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-6">
        <div className="max-w-[800px] mx-auto w-full">
          {/* Encryption status indicator */}
          <div className="flex justify-center mb-10 mt-2">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/30 text-ghost-dim/60 text-[10px] font-semibold uppercase tracking-wider">
                <Lock size={10} />
                <span>End-to-End Encrypted</span>
              </div>
              <p className="text-[11px] text-ghost-dim/40 max-w-[240px] text-center leading-normal mt-1">
                Messages are secured with Double Ratchet and AES-256-GCM. 
                Your keys never leave this device.
              </p>
            </div>
          </div>

          <div className="flex flex-col">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>
      </div>

      <MessageInput />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-void text-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-[400px]"
      >
        <div className="w-20 h-20 bg-accent-glow rounded-[22px] flex items-center justify-center mx-auto mb-8 shadow-apple">
          <ShieldCheck size={40} className="text-white" strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">GhostChat</h2>
        <p className="text-ghost-dim text-[15px] leading-relaxed mb-8">
          Pure P2P messaging. No servers. No metadata. 
          Just secure, direct communication.
        </p>
        
        <div className="grid grid-cols-1 gap-4 text-left">
           <FeatureItem 
            icon={<Lock size={16} className="text-accent-glow" />} 
            title="Double Ratchet Privacy" 
            desc="Self-healing encryption for every message." 
          />
           <FeatureItem 
            icon={<Zap size={16} className="text-accent-safe" />} 
            title="Sovereign Networking" 
            desc="Direct connections via libp2p and Tor." 
          />
        </div>
      </motion.div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex gap-4 items-start p-4 rounded-2xl bg-surface/30 border border-white/5">
      <div className="mt-1">{icon}</div>
      <div>
        <h4 className="text-[13px] font-semibold text-white leading-none mb-1">{title}</h4>
        <p className="text-[12px] text-ghost-dim leading-tight">{desc}</p>
      </div>
    </div>
  );
}
