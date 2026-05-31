/**
 * GhostChat — Network Status Panel (Pro)
 */

import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Activity, Shield } from 'lucide-react';

export function NetworkStatusPanel() {
  const [capabilities, setCapabilities] = useState<{ nat_type: string, external_ip: string | null, ipv6_capable: boolean } | null>(null);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const result = await invoke<any>('get_network_capabilities');
        setCapabilities(result);
      } catch (err) {
        console.error('Failed to grab network caps:', err);
      }
    }
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-4 py-3 bg-white/5 text-ghost-dim text-[11px] border-t border-white/5 flex flex-col gap-1.5 font-medium">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-white/80">
          <Activity size={12} className="text-accent-glow" />
          <span className="tracking-tight">System Status</span>
        </div>
        <Shield size={12} className="text-accent-safe opacity-50" />
      </div>
      
      <div className="flex justify-between items-center">
        <span className="opacity-60">Topology</span>
        <span className="text-white/70 font-mono tracking-tight">{capabilities?.nat_type || 'Scanning...'}</span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="opacity-60">Egress IP</span>
        <span className="text-white/70 font-mono tracking-tight truncate max-w-[120px]">
          {capabilities?.external_ip || 'Hidden'}
        </span>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="opacity-60">IPv6 Stack</span>
        <span className={`font-mono tracking-tight ${capabilities?.ipv6_capable ? 'text-accent-safe' : 'text-ghost-dim'}`}>
          {capabilities?.ipv6_capable ? 'ACTIVE' : 'INACTIVE'}
        </span>
      </div>
    </div>
  );
}
