import React from 'react';
import { useUi } from '../context/AppContext';

const TONE_BORDER_CLASSES = {
  red: 'border-l-rose-500 bg-[#0c182c]/95',
  rose: 'border-l-rose-500 bg-[#0c182c]/95',
  green: 'border-l-emerald-400 bg-[#0c182c]/95',
  emerald: 'border-l-emerald-400 bg-[#0c182c]/95',
  amber: 'border-l-amber-400 bg-[#0c182c]/95',
  yellow: 'border-l-amber-400 bg-[#0c182c]/95'
};
const DEFAULT_BORDER_CLASS = 'border-l-cyan-400 bg-[#0c182c]/95';

export default function ToastContainer() {
  const { toasts } = useUi();

  return (
    <div className="fixed bottom-4 right-4 z-[1000] space-y-2 pointer-events-none">
      {toasts.map((toast) => {
        const borderClass = TONE_BORDER_CLASSES[toast.tone] || DEFAULT_BORDER_CLASS;

        return (
          <div
            key={toast.id}
            className={`panel pointer-events-auto w-84 border-l-4 p-3.5 shadow-2xl transition-all animate-bounce-subtle ${borderClass}`}
          >
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>{toast.title}</span>
              <span className="font-mono text-[9px] text-slate-400">AURA NOTIF</span>
            </div>
            <div className="mt-1 text-xs text-slate-300 leading-relaxed">{toast.body}</div>
          </div>
        );
      })}
    </div>
  );
}
