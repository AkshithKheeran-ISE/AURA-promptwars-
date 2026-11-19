import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Sparkles, CheckCircle2, Layers, Leaf, Users, Clock } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useUi, useHousehold, useAlerts } from '../context/AppContext';
import { WARDS_DATA, DATA_PROVENANCE_TIERS } from '../data/airData';
import { FAMILY_ARCHETYPES } from '../services/routineEngine';
import FamilyMetricCards from '../components/command/FamilyMetricCards';
import WardSelectorGrid from '../components/command/WardSelectorGrid';
import IndoorShieldCard from '../components/command/IndoorShieldCard';
import InversionDiurnalChart from '../components/command/InversionDiurnalChart';

function getAqiColor(aqi) {
  if (aqi <= 100) return '#34d399';
  if (aqi <= 200) return '#fbbf24';
  if (aqi <= 300) return '#fb923c';
  return '#f43f5e';
}

function CommandProfileToolbar({
  familyArchetype,
  onSelectArchetype,
  selectedWardId,
  onSelectWardId
}) {
  return (
    <div className="panel p-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-slate-400 flex items-center gap-1.5">
          <Users className="h-4 w-4 text-cyan-400" /> Tailored Profile:
        </span>
        {FAMILY_ARCHETYPES.map((arch) => (
          <button
            key={arch.id}
            onClick={() => onSelectArchetype(arch.id, arch.label)}
            className={`px-3 py-1 rounded-lg border transition cursor-pointer text-xs ${
              familyArchetype === arch.id
                ? 'bg-cyan-400/20 border-cyan-400 text-cyan-200 font-bold'
                : 'border-cyan-400/10 text-slate-400 hover:bg-white/5'
            }`}
          >
            {arch.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 text-slate-400 text-xs">
        <label htmlFor="target-ward-select">Target Ward:</label>
        <select
          id="target-ward-select"
          value={selectedWardId}
          onChange={(e) => onSelectWardId(e.target.value)}
          aria-label="Select target monitoring ward"
          className="rounded-lg border border-cyan-400/20 bg-[#0c182c] px-2.5 py-1 text-white focus:outline-none"
        >
          {WARDS_DATA.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name} (AQI {w.aqi})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

CommandProfileToolbar.propTypes = {
  familyArchetype: PropTypes.string.isRequired,
  onSelectArchetype: PropTypes.func.isRequired,
  selectedWardId: PropTypes.string.isRequired,
  onSelectWardId: PropTypes.func.isRequired
};

function ProvenanceTransparencyBar() {
  return (
    <div className="panel p-4 border border-cyan-400/20 bg-[#08101e]/80 space-y-3 font-mono text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-400/10 pb-2">
        <div className="flex items-center gap-2 text-cyan-300 font-bold tracking-wide uppercase text-[11px]">
          <Layers className="h-4 w-4 text-cyan-400" />
          Environmental Data Provenance & Science Transparency
        </div>
        <span className="text-[10px] text-slate-400">
          CPCB / EPA / WRF-Chem Atmospheric Calibrations
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Object.values(DATA_PROVENANCE_TIERS).map((tier) => (
          <div
            key={tier.id}
            className="p-3 rounded-lg bg-[#030712] border border-cyan-400/15 space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-[11px]">{tier.label}</span>
              <span
                className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                style={{ backgroundColor: `${tier.badgeColor}20`, color: tier.badgeColor }}
              >
                {tier.isSimulation ? 'SIMULATION / MODEL' : 'STATUTORY REAL'}
              </span>
            </div>
            <p className="text-[10px] text-slate-300 font-sans leading-relaxed">{tier.method}</p>
            <div className="text-[9px] text-slate-500 pt-1 border-t border-cyan-400/10 truncate">
              Source: {tier.source}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmergencyPlaybookSummary({ onNavigateHacks }) {
  const checklist = [
    { title: 'Window Foam Weatherstripped', sub: 'Draft infiltration down to 25%' },
    { title: 'Microfiber Wet-Mopping Only', sub: 'Dry sweeping strictly banned' },
    { title: 'N95 Mask Fit Tested for Children', sub: 'Nasal bridge sealed with paper tape' }
  ];

  return (
    <div className="panel p-5 space-y-3 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="border-b border-cyan-400/10 pb-2 flex items-center justify-between">
          <span className="label text-cyan-300">Active Defense Checklist</span>
          <span className="text-emerald-400 font-mono text-[10px] font-bold">100% READY</span>
        </div>
        {checklist.map((item, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-lg bg-[#030712] border border-cyan-400/15 flex items-start gap-2.5"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white text-xs">{item.title}</div>
              <div className="text-[10px] text-slate-400">{item.sub}</div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onNavigateHacks}
        className="w-full text-center text-xs text-cyan-300 hover:underline pt-2 border-t border-cyan-400/10 cursor-pointer font-mono"
      >
        Explore All 6 Low-Cost IAQ Hacks &rarr;
      </button>
    </div>
  );
}

EmergencyPlaybookSummary.propTypes = {
  onNavigateHacks: PropTypes.func.isRequired
};

function CommandNavigationShortcuts({ onNavigate, activeHacksCount }) {
  return (
    <>
      <button
        onClick={() => onNavigate('routines')}
        className="flex items-center gap-2 rounded-lg border border-cyan-400/20 bg-[#0c182c] px-3 py-1.5 text-xs font-mono text-cyan-300 hover:bg-cyan-400/10 transition cursor-pointer"
      >
        <Clock className="h-3.5 w-3.5" /> Smog Routines
      </button>
      <button
        onClick={() => onNavigate('hacks')}
        className="flex items-center gap-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 text-xs font-mono text-emerald-300 hover:bg-emerald-500/30 transition cursor-pointer"
      >
        <Sparkles className="h-3.5 w-3.5" /> DIY IAQ Hacks ({activeHacksCount} Active)
      </button>
      <button
        onClick={() => onNavigate('alternatives')}
        className="flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-mono font-bold text-black shadow-glow hover:bg-cyan-300 transition cursor-pointer"
      >
        <Leaf className="h-3.5 w-3.5" /> Clean Alternatives
      </button>
    </>
  );
}

CommandNavigationShortcuts.propTypes = {
  onNavigate: PropTypes.func.isRequired,
  activeHacksCount: PropTypes.number.isRequired
};

export default function CommandCenter() {
  const { setPage, addToast } = useUi();
  const {
    selectedWard,
    setSelectedWardId,
    familyArchetype,
    setFamilyArchetype,
    exposureCalc,
    communitySavings,
    healthRisk,
    activeHacks
  } = useHousehold();
  const { alerts } = useAlerts();

  const sortedWards = useMemo(() => [...WARDS_DATA].sort((a, b) => b.aqi - a.aqi), []);

  const outdoorColor = getAqiColor(selectedWard.aqi);

  const handleSelectWard = (ward) => {
    setSelectedWardId(ward.id);
    addToast('Ward Focused', `Active telemetry switched to ${ward.name}`, 'cyan');
  };

  const handleSelectArchetype = (id, label) => {
    setFamilyArchetype(id);
    addToast('Profile Switched', `Active calculations adjusted for ${label}`, 'cyan');
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="01 · Household Atmospheric Defense"
        title="Family & Community Smog Command Center"
        desc="Real-time boundary layer inversion tracking, indoor vs outdoor air quality telemetry, and explainable low-emission lifestyle guidance for urban households."
        right={
          <CommandNavigationShortcuts onNavigate={setPage} activeHacksCount={activeHacks.length} />
        }
      />

      <FamilyMetricCards
        selectedWard={selectedWard}
        outdoorColor={outdoorColor}
        exposureCalc={exposureCalc}
        communitySavings={communitySavings}
        alertsCount={alerts.length}
      />

      <CommandProfileToolbar
        familyArchetype={familyArchetype}
        onSelectArchetype={handleSelectArchetype}
        selectedWardId={selectedWard.id}
        onSelectWardId={setSelectedWardId}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <WardSelectorGrid
          selectedWard={selectedWard}
          onSelectWard={handleSelectWard}
          onNavigateMap={() => setPage('map')}
          wards={sortedWards}
        />
        <IndoorShieldCard
          selectedWard={selectedWard}
          outdoorColor={outdoorColor}
          exposureCalc={exposureCalc}
          healthRisk={healthRisk}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <InversionDiurnalChart selectedWard={selectedWard} />
        </div>
        <EmergencyPlaybookSummary onNavigateHacks={() => setPage('hacks')} />
      </div>

      <ProvenanceTransparencyBar />
    </div>
  );
}
