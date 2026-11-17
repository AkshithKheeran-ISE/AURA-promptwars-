import React from 'react';
import { useApp } from '../context/AppContext';

export default function ToastContainer() {
  const { toasts } = useApp();

  return (
    <div className="fixed bottom-4 right-4 z-[1000] space-y-2 pointer-events-none">
      {toasts.map((toast) => {
        const borderClass = 
          toast.tone === 'red' ? 'border-l-rose-500 bg-[#0c182c]/95' :
          toast.tone === 'green' ? 'border-l-emerald-400 bg-[#0c182c]/95' :
          'border-l-cyan-400 bg-[#0c182c]/95';

        return (
          <div 
            key={toast.id}
            className={`panel pointer-events-auto w-84 border-l-4 p-3.5 shadow-2xl transition-all animate-bounce-subtle ${borderClass}`}
          >
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>{toast.title}</span>
              <span className="font-mono text-[9px] text-slate-500">AURA NOTIF</span>
            </div>
            <div className="mt-1 text-xs text-slate-300 leading-relaxed">
              {toast.body}
            </div>
          </div>
        );
      })}
    </div>
  );
}
