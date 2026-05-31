/**
 * GhostChat — Add Contact Modal (Pro)
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Copy, Plus } from 'lucide-react';
import { useAppStore } from '../stores';
import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

export function AddContactModal() {
  const { activeModal, closeModal } = useAppStore();
  const ourPeerId = useAppStore((s) => s.ourPeerId);
  const [peerIdInput, setPeerIdInput] = useState('');
  const [multiaddrInput, setMultiaddrInput] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [copied, setCopied] = useState(false);
  const [listenAddrs, setListenAddrs] = useState<string[]>([]);

  useEffect(() => {
    if (activeModal === 'add-contact') {
      invoke<string[]>('get_listen_addrs').then(setListenAddrs).catch(() => {});
    }
  }, [activeModal]);

  if (activeModal !== 'add-contact') return null;

  const handleAdd = () => {
    if (!peerIdInput.trim()) return;
    window.dispatchEvent(new CustomEvent('ghostchat:add-contact', {
      detail: {
        peerId: peerIdInput.trim(),
        displayName: displayName.trim(),
        multiaddr: multiaddrInput.trim() || null,
      },
    }));
    closeModal();
  };

  const copyOurId = async () => {
    if (ourPeerId) {
      try {
        await navigator.clipboard.writeText(ourPeerId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        try {
          const { writeText } = await import('@tauri-apps/plugin-clipboard-manager');
          await writeText(ourPeerId);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (e) {
          console.error('Copy failed:', e);
        }
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div
          className="absolute inset-0 bg-void/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        />
        
        <motion.div
          className="relative bg-surface border border-white/10 rounded-[28px] w-full max-w-[420px] shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 pt-8 pb-4 text-center">
            <div className="w-12 h-12 bg-accent-glow/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Plus size={24} className="text-accent-glow" />
            </div>
            <h3 className="text-white text-[19px] font-bold tracking-tight">Add Contact</h3>
            <p className="text-ghost-dim text-[13px] mt-1">Connect with another peer directly.</p>
          </div>

          {/* Body */}
          <div className="px-6 py-2 space-y-5">
            {/* Identity Sharing */}
            <div className="p-3.5 rounded-[18px] bg-white/5 border border-white/5 group relative">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] text-ghost-dim font-bold uppercase tracking-widest">Your Identity</span>
                <button
                  onClick={copyOurId}
                  className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${copied ? 'text-accent-safe' : 'text-accent-glow hover:text-accent-glow/80'}`}
                >
                  {copied ? 'Copied' : 'Copy ID'}
                </button>
              </div>
              <code className="block text-[11px] text-white/90 font-mono break-all leading-relaxed bg-black/30 p-2 rounded-lg">
                {ourPeerId || 'Initializing...'}
              </code>
            </div>

            {/* Peer ID input */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-ghost-dim font-bold uppercase tracking-widest ml-1">Contact PeerID</label>
              <input
                type="text"
                value={peerIdInput}
                onChange={(e) => setPeerIdInput(e.target.value)}
                placeholder="Paste PeerID"
                className="w-full bg-elevated/50 text-white text-[14px] px-4 py-3 rounded-xl border border-white/5 focus:border-accent-glow/50 focus:bg-elevated outline-none transition-all placeholder:text-white/20 font-mono"
              />
            </div>

             {/* Multiaddr input */}
             <div className="space-y-1.5">
              <label className="text-[11px] text-ghost-dim font-bold uppercase tracking-widest ml-1">Optional Multiaddr</label>
              <input
                type="text"
                value={multiaddrInput}
                onChange={(e) => setMultiaddrInput(e.target.value)}
                placeholder="/ip4/x.x.x.x/tcp/4001"
                className="w-full bg-elevated/50 text-white text-[14px] px-4 py-3 rounded-xl border border-white/5 focus:border-accent-glow/50 focus:bg-elevated outline-none transition-all placeholder:text-white/20 font-mono"
              />
            </div>

            {/* Display name */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-ghost-dim font-bold uppercase tracking-widest ml-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Satoshi"
                className="w-full bg-elevated/50 text-white text-[14px] px-4 py-3 rounded-xl border border-white/5 focus:border-accent-glow/50 focus:bg-elevated outline-none transition-all placeholder:text-white/20"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 flex flex-col gap-2">
            <button
              onClick={handleAdd}
              disabled={!peerIdInput.trim()}
              className={`w-full py-3.5 rounded-xl font-bold text-[15px] transition-all ${
                peerIdInput.trim()
                  ? 'bg-accent-glow text-white shadow-apple active:scale-[0.98]'
                  : 'bg-white/5 text-white/20 cursor-not-allowed'
              }`}
            >
              Connect
            </button>
            <button
              onClick={closeModal}
              className="w-full py-3 text-[14px] font-semibold text-ghost-dim hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function Check({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-safe">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
