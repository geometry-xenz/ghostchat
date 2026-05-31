/**
 * GhostChat — Key Verification Modal (Pro)
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, QrCode, Lock } from 'lucide-react';
import { useAppStore } from '../stores';
import { Identicon } from './Identicon';

export function KeyVerificationModal() {
  const { activeModal, modalData, closeModal } = useAppStore();

  if (activeModal !== 'key-verification' || !modalData?.peerId) return null;

  const peerId = modalData.peerId as string;
  const safetyNumber = generateSafetyNumber(peerId);

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
          className="relative bg-surface border border-white/10 rounded-[28px] w-full max-w-[440px] shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 pt-8 pb-4 text-center">
            <div className="w-12 h-12 bg-accent-safe/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={24} className="text-accent-safe" />
            </div>
            <h3 className="text-white text-[19px] font-bold tracking-tight">Verify Connection</h3>
            <p className="text-ghost-dim text-[13px] mt-1">Confirm that your connection to this peer is secure.</p>
          </div>

          <div className="px-6 py-2 space-y-6">
            {/* Peer Info */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
              <Identicon peerId={peerId} size={44} />
              <div className="min-w-0">
                <p className="text-white text-[14px] font-semibold truncate">{peerId}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-safe" />
                  <span className="text-[11px] text-accent-safe font-bold uppercase tracking-wider">E2E Secured</span>
                </div>
              </div>
            </div>

            {/* Safety Number Grid */}
            <div className="space-y-2">
               <div className="flex justify-between items-center ml-1">
                 <h4 className="text-[11px] text-ghost-dim font-bold uppercase tracking-widest">Safety Number</h4>
                 <Lock size={12} className="text-ghost-dim/40" />
               </div>
               <div className="grid grid-cols-3 gap-2">
                 {safetyNumber.map((num, i) => (
                   <div key={i} className="bg-black/40 p-2.5 rounded-xl border border-white/5 text-center">
                     <span className="text-accent-glow font-mono text-[14px] font-bold tracking-wider">{num}</span>
                   </div>
                 ))}
               </div>
            </div>

            {/* Verification Instruction */}
            <div className="bg-accent-glow/5 p-4 rounded-2xl border border-accent-glow/10">
               <p className="text-[12px] text-ghost-dim leading-relaxed text-center">
                 Verify these numbers with your contact. If they match, your connection is verified and safe from interference.
               </p>
            </div>

            {/* QR Scanner Placeholder */}
            <div className="flex justify-center pb-2">
               <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group">
                 <QrCode size={20} className="text-ghost-dim group-hover:text-white" />
                 <span className="text-[14px] font-semibold text-ghost-dim group-hover:text-white">Scan QR Code</span>
               </button>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 flex flex-col gap-2">
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('ghostchat:verify', { detail: { peerId } }));
                closeModal();
              }}
              className="w-full py-3.5 rounded-xl bg-accent-safe text-white font-bold text-[15px] shadow-apple active:scale-[0.98] transition-all"
            >
              Verify Connection
            </button>
            <button
              onClick={closeModal}
              className="w-full py-3 text-[14px] font-semibold text-ghost-dim hover:text-white transition-colors"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function generateSafetyNumber(peerId: string): string[] {
  const nums: string[] = [];
  for (let i = 0; i < 6; i++) {
    const charCode = peerId.charCodeAt(i * 3 % peerId.length);
    nums.push(String(charCode % 10000).padStart(4, '0'));
  }
  return nums;
}
