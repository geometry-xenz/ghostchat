/**
 * GhostChat — Main Application (Pro)
 */

import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { StatusBar } from './components/StatusBar';
import { AddContactModal } from './components/AddContactModal';
import { SettingsModal } from './components/SettingsModal';
import { KeyVerificationModal } from './components/KeyVerificationModal';
import { useGhostChat } from './hooks/useGhostChat';

export default function App() {
  useGhostChat();
  
  return (
    <div className="flex flex-col h-screen w-screen bg-void overflow-hidden select-none font-sans text-ghost-white">
      {/* Top Drag Area (for Tauri) */}
      <div className="h-6 w-full drag absolute top-0 pointer-events-none z-[100]" />

      {/* Main layout */}
      <div className="flex flex-1 min-h-0 relative">
        <Sidebar />
        <main className="flex-1 min-w-0 bg-void">
          <ChatArea />
        </main>
      </div>

      <StatusBar />

      {/* Modals */}
      <AddContactModal />
      <SettingsModal />
      <KeyVerificationModal />
    </div>
  );
}
