/**
 * GhostChat — Message Input (Pro)
 */

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Ghost, Clock, Plus } from 'lucide-react';
import { useChatStore } from '../stores';
import { TTL_PRESETS } from '../types';
import { useState, useRef, type KeyboardEvent, useEffect } from 'react';

export function MessageInput() {
  const { inputText, setInputText, ephemeralMode, toggleEphemeral, currentTtl, setCurrentTtl } = useChatStore();
  const [showTtlMenu, setShowTtlMenu] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;
    window.dispatchEvent(new CustomEvent('ghostchat:send', {
      detail: { text: inputText.trim(), ephemeral: ephemeralMode, ttl: currentTtl },
    }));
    setInputText('');
    if (inputRef.current) {
      inputRef.current.style.height = '40px';
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = '40px';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 160)}px`;
    }
  };

  useEffect(adjustHeight, [inputText]);

  const ttlOptions = [
    { label: 'Off', value: TTL_PRESETS.PERMANENT },
    { label: '5s', value: TTL_PRESETS.FIVE_SECONDS },
    { label: '1m', value: TTL_PRESETS.ONE_MINUTE },
    { label: '1h', value: TTL_PRESETS.ONE_HOUR },
    { label: '24h', value: TTL_PRESETS.TWENTY_FOUR_HOURS },
  ];

  return (
    <div className="px-6 py-4 bg-void border-t border-border-subtle">
      <AnimatePresence>
        {showTtlMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-3 flex gap-1.5 p-1.5 glass rounded-[18px] w-fit shadow-apple"
          >
            {ttlOptions.map(({ label, value }) => (
              <button
                key={label}
                onClick={() => { setCurrentTtl(value); setShowTtlMenu(false); }}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all ${
                  currentTtl === value
                    ? 'bg-accent-glow text-white'
                    : 'text-ghost-dim hover:bg-white/5 hover:text-ghost-white'
                }`}
              >
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-end gap-3">
        {/* Attachment/Extra Actions */}
        <button className="p-2 text-ghost-dim hover:text-ghost-white transition-colors mb-0.5">
          <Plus size={22} strokeWidth={2.5} />
        </button>

        {/* Input Wrapper */}
        <div className={`flex-1 flex items-end gap-2 px-1 py-1 rounded-[24px] border transition-all duration-200 ${
          ephemeralMode 
            ? 'bg-accent-glow/5 border-accent-glow/30' 
            : 'bg-elevated border-border-subtle focus-within:border-white/20'
        }`}>
          
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={ephemeralMode ? "Ghost message..." : "iMessage"}
            rows={1}
            className="flex-1 bg-transparent text-ghost-white text-[15px] px-3 py-1.5 outline-none resize-none placeholder:text-ghost-dim/50 min-h-[40px]"
          />

          <div className="flex items-center gap-0.5 pr-1.5 pb-1">
             {/* Ghost toggle */}
            <button
              onClick={toggleEphemeral}
              className={`p-1.5 rounded-full transition-all ${
                ephemeralMode ? 'text-accent-safe' : 'text-ghost-dim hover:text-ghost-dim/80'
              }`}
              title="Ghost Mode"
            >
              <Ghost size={18} fill={ephemeralMode ? 'currentColor' : 'none'} />
            </button>

            {/* TTL toggle */}
            <button
              onClick={() => setShowTtlMenu(!showTtlMenu)}
              className={`p-1.5 rounded-full transition-all ${
                currentTtl > 0 ? 'text-accent-glow' : 'text-ghost-dim hover:text-ghost-dim/80'
              }`}
              title="Timer"
            >
              <Clock size={18} fill={currentTtl > 0 ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        {/* Send Button */}
        <motion.button
          onClick={handleSend}
          disabled={!inputText.trim()}
          className={`mb-0.5 p-2 rounded-full transition-all ${
            inputText.trim()
              ? 'bg-accent-glow text-white shadow-apple active:scale-90'
              : 'bg-elevated text-ghost-dim/20 cursor-not-allowed'
          }`}
          whileTap={inputText.trim() ? { scale: 0.9 } : undefined}
        >
          <ArrowUp size={22} strokeWidth={3} />
        </motion.button>
      </div>
    </div>
  );
}

function formatTtl(ms: number): string {
  if (ms < 60000) return `${ms / 1000}s`;
  if (ms < 3600000) return `${ms / 60000}m`;
  return `${ms / 3600000}h`;
}
