/**
 * GhostChat — Message Bubble (Pro)
 */

import { motion } from 'framer-motion';
import { Check, CheckCheck, Ghost, Lock } from 'lucide-react';
import { useChatStore } from '../stores';
import type { DecryptedMessage } from '../types';

interface MessageBubbleProps {
  message: DecryptedMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const dissolvingIds = useChatStore((s) => s.dissolvingIds);
  const isDissolving = dissolvingIds.has(message.id);
  const isOutgoing = !message.incoming;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={
        isDissolving
          ? {
              opacity: 0,
              scale: 0.9,
              filter: 'blur(10px)',
              y: -8,
            }
          : { opacity: 1, y: 0, scale: 1 }
      }
      transition={{ 
        duration: isDissolving ? 0.8 : 0.25, 
        ease: [0.23, 1, 0.32, 1] 
      }}
      className={`flex ${isOutgoing ? 'justify-end' : 'justify-start'} px-6 mb-1.5`}
    >
      <div className={`flex flex-col ${isOutgoing ? 'items-end' : 'items-start'} max-w-[80%]`}>
        <div
          className={`relative px-4 py-2.5 rounded-[20px] shadow-apple ${
            isOutgoing
              ? 'bg-accent-glow text-white rounded-tr-[4px]'
              : 'bg-elevated text-ghost-white rounded-tl-[4px]'
          }`}
        >
          <p className="text-[14.5px] leading-[1.4] tracking-tight whitespace-pre-wrap break-words">
            {message.content}
          </p>
          
          {/* Technical sub-indicator (visible on hover or focus) */}
          <div className={`absolute bottom-0 ${isOutgoing ? '-left-6' : '-right-6'} opacity-0 group-hover:opacity-100 transition-opacity`}>
             <Lock size={10} className="text-ghost-dim" />
          </div>
        </div>

        {/* Status Line */}
        <div className={`flex items-center gap-2 mt-1 px-1`}>
          {message.ephemeral && (
            <div className="flex items-center gap-1 text-accent-safe/70">
              <Ghost size={11} />
              {message.expiresAt && (
                <span className="text-[10px] font-mono tabular-nums">
                  {formatRemaining(message.expiresAt - Date.now())}
                </span>
              )}
            </div>
          )}
          
          <span className="text-[10px] text-ghost-dim font-medium tracking-tight">
            {formatMessageTime(message.timestamp)}
          </span>

          {isOutgoing && (
            <div className="flex items-center">
              {message.read ? (
                <CheckCheck size={13} className="text-accent-safe" />
              ) : message.delivered ? (
                <CheckCheck size={13} className="text-ghost-dim/60" />
              ) : (
                <Check size={13} className="text-ghost-dim/40" />
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function formatMessageTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return 'exp';
  const secs = Math.ceil(ms / 1000);
  if (secs < 60) return `${secs}s`;
  const mins = Math.ceil(secs / 60);
  if (mins < 60) return `${mins}m`;
  const hours = Math.ceil(mins / 60);
  return `${hours}h`;
}

function formatMessageTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return 'expiring';
  const secs = Math.ceil(ms / 1000);
  if (secs < 60) return `${secs}s`;
  const mins = Math.ceil(secs / 60);
  if (mins < 60) return `${mins}m`;
  const hours = Math.ceil(mins / 60);
  return `${hours}h`;
}
