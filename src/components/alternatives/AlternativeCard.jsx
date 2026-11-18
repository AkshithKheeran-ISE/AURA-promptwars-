import React from 'react';
import PropTypes from 'prop-types';
import { Leaf, CheckCircle2 } from 'lucide-react';

/**
 * Reusable comparison card contrasting a high-emission winter habit against a clean sustainable alternative.
 */
export default function AlternativeCard({ item, isAdopted, onTogglePledge }) {
  return (
    <div
      className={`panel panel-corners p-5 space-y-4 transition ${
        isAdopted ? 'border-emerald-400/40 bg-[#08101e]' : 'border-cyan-400/10 bg-[#060d1b]'
      }`}
    >
      <div className="flex items-center justify-between border-b border-cyan-400/10 pb-2.5">
        <h3 className="text-base font-bold text-white font-sans">{item.title}</h3>
        <button
          onClick={() => onTogglePledge(item.id, item.clean.title)}
          className={`px-3 py-1 rounded text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
            isAdopted
              ? 'bg-emerald-400 text-black hover:bg-emerald-300'
              : 'bg-[#0c182c] border border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/20'
          }`}
        >
          {isAdopted ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" /> PLEDGED
            </>
          ) : (
            <>
              <Leaf className="h-3.5 w-3.5" /> ADOPT CLEAN ALTERNATIVE
            </>
          )}
        </button>
      </div>

      {/* Side by side comparison */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        {/* High Emission */}
        <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 space-y-1">
          <div className="font-mono text-[10px] text-rose-400 font-bold uppercase">
            High-Emission Habit
          </div>
          <div className="font-bold text-white text-xs">{item.dirty.title}</div>
          <div className="font-mono text-[10px] text-rose-300">{item.dirty.impact}</div>
          <p className="text-slate-400 text-[11px] font-sans leading-relaxed pt-1">
            {item.dirty.danger}
          </p>
        </div>

        {/* Sustainable Alternative */}
        <div className="p-3 rounded-lg bg-emerald-400/5 border border-emerald-400/20 space-y-1">
          <div className="font-mono text-[10px] text-emerald-400 font-bold uppercase">
            Sustainable Alternative
          </div>
          <div className="font-bold text-white text-xs">{item.clean.title}</div>
          <div className="font-mono text-[10px] text-emerald-300">{item.clean.impact}</div>
          <p className="text-slate-300 text-[11px] font-sans leading-relaxed pt-1">
            {item.clean.benefit}
          </p>
        </div>
      </div>

      <div className="rounded bg-[#030712] p-2.5 border border-cyan-400/10 font-mono text-[11px] text-cyan-300 flex items-center justify-between">
        <span>Annual Family Savings:</span>
        <span className="font-bold text-emerald-300">{item.annualSavings}</span>
      </div>
    </div>
  );
}

AlternativeCard.propTypes = {
  item: PropTypes.object.isRequired,
  isAdopted: PropTypes.bool.isRequired,
  onTogglePledge: PropTypes.func.isRequired
};
