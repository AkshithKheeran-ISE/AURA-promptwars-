import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Check, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useApp } from '../context/AppContext';
import { IAQ_HACKS } from '../services/iaqHacks';

function IndoorAirSimulatorBanner({ selectedWard, exposureCalc }) {
  return (
    <div className="panel p-5 border-cyan-400/30 bg-[#08101e] flex flex-wrap items-center justify-between gap-4">
      <div>
        <span className="label text-cyan-300">Active Household Defense Simulation</span>
        <h2 className="text-xl font-bold text-white mt-0.5">
          Real-Time Indoor Particulate Reduction
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-xl">
          Outdoor Ambient:{' '}
          <span className="text-rose-400 font-mono font-bold">{selectedWard.pm25} µg/m³</span> (
          {selectedWard.name}) &rarr; Your Protected Indoor Air:{' '}
          <span className="text-emerald-400 font-mono font-bold">
            {exposureCalc.indoorPm25} µg/m³
          </span>
        </p>
      </div>

      <div className="flex items-center gap-4 font-mono">
        <div className="rounded-xl border border-cyan-400/20 bg-[#030712] p-3 text-center">
          <div className="text-[10px] text-slate-500">CLEAN AIR EFFICIENCY</div>
          <div className="font-display text-3xl font-extrabold text-emerald-400 mt-0.5">
            -{exposureCalc.percentageReduction}%
          </div>
          <div className="text-[9px] text-cyan-300 font-bold">SMOG SHIELDED</div>
        </div>
      </div>
    </div>
  );
}

IndoorAirSimulatorBanner.propTypes = {
  selectedWard: PropTypes.object.isRequired,
  exposureCalc: PropTypes.object.isRequired
};

function HackCardBlueprint({ hack }) {
  return (
    <div
      id={`hack-blueprint-${hack.id}`}
      className="space-y-3 pt-2 text-xs font-sans text-slate-300 border-t border-cyan-400/10"
    >
      <div>
        <div className="font-mono text-[10px] text-cyan-300 font-bold mb-1 uppercase">
          Required Materials:
        </div>
        <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-300">
          {hack.materials.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>

      <div>
        <div className="font-mono text-[10px] text-emerald-300 font-bold mb-1 uppercase">
          Step-by-Step Construction:
        </div>
        <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
          {hack.steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </div>

      <div className="p-2.5 rounded bg-[#030712] border border-cyan-400/10 font-mono text-[10px] text-slate-400">
        <strong className="text-cyan-300">Physical Principle:</strong> {hack.scientificExplanation}
      </div>
    </div>
  );
}

HackCardBlueprint.propTypes = {
  hack: PropTypes.object.isRequired
};

function IaqHackCard({ hack, isActive, isExpanded, onToggleActive, onToggleExpand }) {
  return (
    <div
      className={`panel panel-corners p-5 space-y-4 transition flex flex-col justify-between ${
        isActive
          ? 'border-cyan-400/50 bg-[#08101e] shadow-[inset_0_0_0_1px_rgba(34,211,238,0.25)]'
          : 'border-cyan-400/10 bg-[#060d1b] opacity-85 hover:opacity-100'
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2 border-b border-cyan-400/10 pb-2.5">
          <span
            className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border truncate max-w-[200px]"
            style={{
              color: hack.badgeColor,
              borderColor: `${hack.badgeColor}55`,
              backgroundColor: `${hack.badgeColor}15`
            }}
          >
            {hack.badge}
          </span>

          <button
            onClick={() => onToggleActive(hack.id)}
            aria-pressed={isActive}
            aria-label={`${isActive ? 'Deactivate' : 'Activate'} ${hack.title}`}
            className={`px-3 py-1 rounded text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
              isActive
                ? 'bg-emerald-400 text-black hover:bg-emerald-300 shadow-glow-green'
                : 'bg-[#0c182c] border border-cyan-400/30 text-cyan-300 hover:bg-cyan-400/20'
            }`}
          >
            {isActive ? (
              <>
                <Check className="h-3.5 w-3.5" /> ACTIVE
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" /> ACTIVATE
              </>
            )}
          </button>
        </div>

        <h3 className="text-base font-bold text-white font-sans">{hack.title}</h3>
        <div className="text-xs font-mono text-cyan-300">{hack.category}</div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="rounded bg-[#030712] p-2 border border-cyan-400/10">
            <span className="text-slate-500 text-[10px]">DIY Cost:</span>
            <div className="font-bold text-emerald-400 mt-0.5">₹ {hack.costInr}</div>
            <span className="text-slate-500 text-[9px] line-through">
              ₹ {hack.commercialAlternativeInr}
            </span>
          </div>

          <div className="rounded bg-[#030712] p-2 border border-cyan-400/10">
            <span className="text-slate-500 text-[10px]">Filtration Efficacy:</span>
            <div className="font-bold text-white mt-0.5">{hack.pm25ReductionPct}% PM2.5</div>
            <span className="text-cyan-300 text-[9px]">{hack.difficulty}</span>
          </div>
        </div>

        <div className="text-xs text-slate-300 font-sans leading-relaxed">
          <strong className="text-cyan-300">CADR Power:</strong> {hack.cadrRating}
        </div>

        <button
          onClick={onToggleExpand}
          aria-expanded={isExpanded}
          aria-controls={`hack-blueprint-${hack.id}`}
          className="w-full flex items-center justify-between text-xs font-mono text-cyan-300 hover:text-cyan-200 pt-2 border-t border-cyan-400/10 cursor-pointer"
        >
          <span>{isExpanded ? 'Hide Blueprint & Steps' : 'View Blueprint & Instructions'}</span>
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {isExpanded && <HackCardBlueprint hack={hack} />}
      </div>
    </div>
  );
}

IaqHackCard.propTypes = {
  hack: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggleActive: PropTypes.func.isRequired,
  onToggleExpand: PropTypes.func.isRequired
};

export default function IndoorAirHacks() {
  const { activeHacks, toggleHack, exposureCalc, selectedWard } = useApp();
  const [expandedHackId, setExpandedHackId] = useState('corsi_rosenthal');

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="03 · DIY Smog Defense"
        title="Indoor Air Quality (IAQ) Hacks Catalog"
        desc="Scientifically proven, low-cost domestic engineering hacks that slash indoor particulate infiltration by 65–92% without expensive commercial purifiers."
        right={
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="rounded border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-emerald-300">
              {activeHacks.length} Hacks Active in Your Household
            </span>
          </div>
        }
      />

      <IndoorAirSimulatorBanner selectedWard={selectedWard} exposureCalc={exposureCalc} />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {IAQ_HACKS.map((hack) => (
          <IaqHackCard
            key={hack.id}
            hack={hack}
            isActive={activeHacks.includes(hack.id)}
            isExpanded={expandedHackId === hack.id}
            onToggleActive={toggleHack}
            onToggleExpand={() => setExpandedHackId(expandedHackId === hack.id ? null : hack.id)}
          />
        ))}
      </div>
    </div>
  );
}
