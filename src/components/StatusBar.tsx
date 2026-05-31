/**
 * GhostChat — Status Bar (Pro)
 */

import { Wifi, Database, HardDrive, ShieldCheck } from "lucide-react";
import { useAppStore } from "../stores";

export function StatusBar() {
  const torStatus = useAppStore((s) => s.torStatus);
  const torProgress = useAppStore((s) => s.torProgress);
  const nodeOnline = useAppStore((s) => s.nodeOnline);
  const peerCount = useAppStore((s) => s.peerCount);
  const dbReady = useAppStore((s) => s.dbReady);

  return (
    <footer className="h-6 flex items-center justify-between px-4 bg-void border-t border-border-subtle text-[10px] font-medium tracking-tight select-none z-50">
      <div className="flex items-center gap-4">
        <StatusDot 
          active={nodeOnline} 
          label={nodeOnline ? 'P2P' : 'P2P Offline'} 
          icon={<Wifi size={10} />} 
        />
        <StatusDot 
          active={torStatus === 'connected'} 
          label={torStatus === 'connected' ? 'Tor' : torStatus === 'bootstrapping' ? `Tor ${torProgress}%` : 'Tor Off'} 
          icon={<TorIcon />} 
          pulse={torStatus === 'bootstrapping'}
        />
      </div>

      <div className="flex items-center gap-1.5 text-ghost-dim/40 font-semibold tracking-widest uppercase text-[9px]">
        <ShieldCheck size={10} />
        <span>Military Grade Encryption</span>
      </div>

      <div className="flex items-center gap-4">
        <StatusDot active={dbReady} label="Vault" icon={<Database size={10} />} />
        <div className="flex items-center gap-1.5 text-ghost-dim">
          <HardDrive size={10} />
          <span className="font-mono tabular-nums">{peerCount} Peers</span>
        </div>
      </div>
    </footer>
  );
}

function StatusDot({ 
  active, 
  label, 
  icon, 
  pulse = false 
}: { 
  active: boolean; 
  label: string; 
  icon: React.ReactNode; 
  pulse?: boolean;
}) {
  return (
    <div className={`flex items-center gap-1.5 transition-colors ${active ? 'text-accent-safe' : 'text-ghost-dim'}`}>
      <div className={`${pulse ? 'animate-pulse' : ''}`}>{icon}</div>
      <span className="opacity-80">{label}</span>
    </div>
  );
}

function TorIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
