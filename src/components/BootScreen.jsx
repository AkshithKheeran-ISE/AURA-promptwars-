import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

const BOOT_LOGS = [
  'AURA CLIENT RUNTIME v4.2.1 (Urban Smog Defense)',
  'Initializing Web Crypto SHA-256 integrity engine ... OK',
  'Loading CPCB & EPA Delhi-NCR baseline telemetry .... OK',
  'Calibrating diurnal thermal inversion models ....... OK',
  'Initializing Corsi-Rosenthal & HEPA CADR formulas .. OK',
  'Checking GenAI model service & local fallback ...... OK',
  'Verifying immutable citizen community ledger ...... OK',
  'Urban smog defense modules armed & ready .......... OK'
];

export default function BootScreen({ onDone }) {
  const [step, setStep] = useState(0);
  const isDone = step >= BOOT_LOGS.length;

  useEffect(() => {
    if (isDone) return;
    const timer = setTimeout(() => {
      setStep((prev) => prev + 1);
    }, 220);
    return () => clearTimeout(timer);
  }, [step, isDone]);

  return (
    <div className="grid-bg fixed inset-0 z-[2000] grid place-items-center bg-[#030712] p-6">
      <div className="scanline"></div>

      <div className="relative w-full max-w-xl">
        {/* Radar Logo Header */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative">
            <div className="absolute inset-0 -m-8 rounded-full border border-cyan-400/20"></div>
            <div
              className="absolute inset-0 -m-8 animate-sweep rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, rgba(34,211,238,.35), transparent 30%)'
              }}
            ></div>
            <img
              src="./aura.svg"
              alt="AURA"
              className="relative h-24 w-24"
              style={{ filter: 'drop-shadow(0 0 25px rgba(34,211,238,.8))' }}
            />
          </div>

          <h1 className="mt-10 font-display text-5xl font-black tracking-[0.4em] text-white">
            AURA
          </h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.3em] text-cyan-300/80">
            Atmospheric Understanding & Real-time Air Quality Intelligence
          </p>
        </div>

        {/* Boot Terminal Box */}
        <div className="panel panel-corners p-5 font-mono text-xs shadow-glow">
          <div className="space-y-1.5">
            {BOOT_LOGS.slice(0, step).map((log, idx) => (
              <div
                key={idx}
                className={idx === 0 ? 'mb-2 font-bold text-cyan-300' : 'text-slate-300'}
              >
                <span className="text-cyan-500 font-bold">&gt;</span> {log.replace(' OK', '')}
                {log.endsWith('OK') && <span className="font-bold text-emerald-400"> OK</span>}
              </div>
            ))}
          </div>

          {!isDone && <span className="mt-2 inline-block h-3 w-2 animate-blink bg-cyan-300"></span>}

          {isDone && (
            <div className="mt-5 flex items-center justify-between border-t border-cyan-400/15 pt-4">
              <span className="flex items-center gap-2 font-bold tracking-widest text-emerald-300 text-xs">
                <ShieldCheck className="h-4 w-4" /> ACCESS GRANTED · SYSTEM LIVE
              </span>
              <button
                onClick={onDone}
                className="cursor-pointer rounded-lg bg-cyan-400 px-4 py-2 font-sans text-sm font-semibold text-[#030712] shadow-glow transition hover:bg-cyan-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                Enter Command Center &rarr;
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onDone}
          className="mx-auto mt-4 block cursor-pointer font-mono text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-300"
        >
          Skip Boot Sequence
        </button>
      </div>
    </div>
  );
}
