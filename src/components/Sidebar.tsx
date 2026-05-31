/**
 * GhostChat — Sidebar (Pro)
 */

import { motion } from 'framer-motion';
import { Search, Edit, Settings, Plus } from 'lucide-react';
import { ContactItem } from './ContactItem';
import { Identicon } from './Identicon';
import { useAppStore, useContactStore } from '../stores';
import { NetworkStatusPanel } from './NetworkStatusPanel';

export function Sidebar() {
  const { torStatus, ourPeerId, openModal, peerCount } = useAppStore();
  const { searchQuery, setSearchQuery, filteredContacts } = useContactStore();
  const contacts = filteredContacts();

  return (
    <aside className="w-[300px] min-w-[300px] h-full flex flex-col bg-surface/30 backdrop-blur-xl border-r border-border-subtle">
      {/* Header */}
      <div className="px-6 pt-10 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-white">Messages</h1>
          <div className="flex items-center gap-1">
             <SidebarAction 
              onClick={() => openModal('add-contact')}
              icon={<Edit size={18} />} 
              title="New Message" 
            />
          </div>
        </div>

        {/* Search */}
        <div className="relative group">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ghost-dim group-focus-within:text-accent-glow transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-elevated/50 text-ghost-white text-[14px] pl-9 pr-4 py-1.5 rounded-lg border border-transparent focus:bg-elevated/80 outline-none transition-all placeholder:text-ghost-dim/60"
          />
        </div>
      </div>

      {/* Contact list */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5 custom-scrollbar">
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <ContactItem
              key={contact.peerId}
              peerId={contact.peerId}
              displayName={contact.displayName}
              online={contact.online}
              isVerified={contact.isVerified}
            />
          ))
        ) : (
          <EmptyContacts onAdd={() => openModal('add-contact')} />
        )}
      </div>

      {/* Footer / Identity */}
      <div className="p-4 border-t border-border-subtle bg-surface/50">
        <div 
          onClick={() => openModal('settings')}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 active:bg-white/10 transition-all cursor-pointer group"
        >
          {ourPeerId ? (
            <Identicon peerId={ourPeerId} size={36} />
          ) : (
            <div className="w-9 h-9 rounded-full bg-elevated flex items-center justify-center">
              <Plus size={16} className="text-ghost-dim" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] font-semibold leading-tight">My Identity</p>
            <p className="text-ghost-dim text-[11px] font-mono truncate opacity-60">
              {ourPeerId || 'Initializing...'}
            </p>
          </div>
          <Settings size={16} className="text-ghost-dim group-hover:text-white transition-colors" />
        </div>
      </div>
    </aside>
  );
}

function SidebarAction({ icon, onClick, title }: { icon: React.ReactNode; onClick: () => void; title: string }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-full text-accent-glow hover:bg-white/5 active:bg-white/10 transition-all"
      title={title}
    >
      {icon}
    </button>
  );
}

function EmptyContacts({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center py-12">
      <p className="text-ghost-dim text-[13px] font-medium">No Conversations</p>
      <button
        onClick={onAdd}
        className="mt-3 text-accent-glow text-[13px] font-semibold hover:underline"
      >
        Start a new chat
      </button>
    </div>
  );
}
