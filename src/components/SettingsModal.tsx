/**
 * GhostChat — Settings Modal (Pro)
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Globe, Database, Ghost, ChevronRight, LogOut } from 'lucide-react';
import { useAppStore, useChatStore } from '../stores';
import { useState } from 'react';

export function SettingsModal() {
  const { activeModal, closeModal, torStatus, nodeOnline, ourPeerId, version, setTorStatus } = useAppStore();
  const [restarting, setRestarting] = useState(false);
  const [memoryOnly, setMemoryOnly] = useState(false);
  const [defaultEphemeral, setDefaultEphemeral] = useState(false);
  const { toggleEphemeral, currentTtl, setCurrentTtl } = useChatStore();

  if (activeModal !== 'settings') return null;

  const isTorActive = torStatus === 'connected';

  const handleTorToggle = async () => {
    if (restarting) return;
    if (isTorActive) await handleDisableTor();
    else await handleEnableTor();
  };

  const handleEnableTor = async () => {
    setRestarting(true);
    setTorStatus('bootstrapping', 10);
    localStorage.setItem('ghostchat_use_tor', 'true');
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke('start_tor');
      const maxWait = 60000;
      const startTime = Date.now();
      while (Date.now() - startTime < maxWait) {
        const status = await invoke<{ state: string; bootstrap_progress: number }>('get_tor_status');
        setTorStatus('bootstrapping', status.bootstrap_progress);
        if (status.state === 'connected') break;
        await new Promise(r => setTimeout(r, 2000));
      }
      const { getCachedIdentity } = await import('../lib/storage/identity-store');
      const identity = getCachedIdentity();
      if (identity) {
        const { bytesToHex } = await import('@noble/hashes/utils');
        await invoke('stop_p2p_node');
        await invoke('start_p2p_node', { identityKeyHex: bytesToHex(identity.privateKey), useTor: true });
      }
      setTorStatus('connected', 100);
    } catch { setTorStatus('inactive'); }
    setRestarting(false);
  };

  const handleDisableTor = async () => {
    setRestarting(true);
    localStorage.removeItem('ghostchat_use_tor');
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke('stop_tor');
      const { getCachedIdentity } = await import('../lib/storage/identity-store');
      const identity = getCachedIdentity();
      if (identity) {
        const { bytesToHex } = await import('@noble/hashes/utils');
        await invoke('stop_p2p_node');
        await invoke('start_p2p_node', { identityKeyHex: bytesToHex(identity.privateKey), useTor: false });
      }
      setTorStatus('inactive');
    } catch { setTorStatus('inactive'); }
    setRestarting(false);
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
          className="relative bg-surface border border-white/10 rounded-[28px] w-full max-w-[480px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 pt-8 pb-4 text-center sticky top-0 bg-surface z-10 border-b border-white/5">
             <h3 className="text-white text-[19px] font-bold tracking-tight">Settings</h3>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6 space-y-8">
            {/* Identity Group */}
            <div className="space-y-2">
              <h4 className="text-[11px] text-ghost-dim font-bold uppercase tracking-widest ml-1">Identity</h4>
              <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                <SettingsRow 
                  label="PeerID" 
                  value={ourPeerId ? `${ourPeerId.slice(0, 8)}...${ourPeerId.slice(-8)}` : 'Initializing...'} 
                  mono 
                />
                <SettingsRow label="Version" value={`v${version}`} />
              </div>
            </div>

            {/* Privacy Group */}
            <div className="space-y-2">
              <h4 className="text-[11px] text-ghost-dim font-bold uppercase tracking-widest ml-1">Security & Privacy</h4>
              <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                <SettingsToggle 
                  label="Tor Routing" 
                  icon={<Globe size={18} className="text-accent-glow" />}
                  enabled={isTorActive} 
                  onClick={handleTorToggle}
                  loading={restarting}
                />
                <SettingsToggle 
                  label="Memory Mode" 
                  icon={<Database size={18} className="text-accent-safe" />}
                  enabled={memoryOnly}
                  onClick={() => setMemoryOnly(!memoryOnly)}
                />
                <SettingsToggle 
                  label="Ghost Mode" 
                  icon={<Ghost size={18} className="text-cyber-cyan" />}
                  enabled={defaultEphemeral}
                  onClick={() => { setDefaultEphemeral(!defaultEphemeral); toggleEphemeral(); }}
                />
              </div>
            </div>

            {/* Messages Group */}
            <div className="space-y-2">
              <h4 className="text-[11px] text-ghost-dim font-bold uppercase tracking-widest ml-1">Messages</h4>
              <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                  <span className="text-[14px] text-white font-medium">Auto-Dissolve</span>
                  <select 
                    value={currentTtl}
                    onChange={(e) => setCurrentTtl(parseInt(e.target.value))}
                    className="bg-transparent text-accent-glow text-[14px] font-semibold outline-none cursor-pointer"
                  >
                    <option value="0">Off</option>
                    <option value="5000">5s</option>
                    <option value="60000">1m</option>
                    <option value="3600000">1h</option>
                    <option value="86400000">24h</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="space-y-2">
               <h4 className="text-[11px] text-accent-danger font-bold uppercase tracking-widest ml-1">Advanced</h4>
               <button 
                onClick={() => confirm('Wipe all data?') && console.log('Wipe')}
                className="w-full bg-accent-danger/10 hover:bg-accent-danger/20 text-accent-danger px-4 py-3 rounded-2xl text-[14px] font-bold transition-all flex items-center justify-between"
               >
                 <span>Wipe Application Data</span>
                 <LogOut size={16} />
               </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-void/30 border-t border-white/5">
            <button
              onClick={closeModal}
              className="w-full py-3.5 rounded-xl bg-accent-glow text-white font-bold text-[15px] shadow-apple active:scale-[0.98] transition-all"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function SettingsRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-0">
      <span className="text-[14px] text-white font-medium">{label}</span>
      <span className={`text-[13px] text-ghost-dim ${mono ? 'font-mono bg-black/30 px-2 py-0.5 rounded' : ''}`}>{value}</span>
    </div>
  );
}

function SettingsToggle({ label, icon, enabled, onClick, loading = false }: { label: string; icon: React.ReactNode; enabled: boolean; onClick: () => void; loading?: boolean }) {
  return (
    <div 
      className="flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-[14px] text-white font-medium">{label}</span>
      </div>
      <button
        className={`w-[46px] h-[26px] rounded-full transition-all flex items-center px-[2px] ${enabled ? 'bg-accent-safe' : 'bg-white/10'}`}
      >
        <motion.div 
          className="w-[22px] h-[22px] bg-white rounded-full shadow-sm flex items-center justify-center"
          animate={{ x: enabled ? 20 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {loading && <div className="w-3 h-3 border-2 border-accent-glow border-t-transparent rounded-full animate-spin" />}
        </motion.div>
      </button>
    </div>
  );
}
