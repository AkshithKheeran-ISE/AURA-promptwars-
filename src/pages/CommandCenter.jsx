import React from 'react';
import { Sparkles, CheckCircle2, Layers, Leaf, Users, Clock } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useApp } from '../context/AppContext';
import { WARDS_DATA, DATA_PROVENANCE_TIERS } from '../data/airData';
import { FAMILY_ARCHETYPES } from '../services/routineEngine';
import FamilyMetricCards from '../components/command/FamilyMetricCards';
import WardSelectorGrid from '../components/command/WardSelectorGrid';
import IndoorShieldCard from '../components/command/IndoorShieldCard';
import InversionDiurnalChart from '../components/command/InversionDiurnalChart';

function getAqiColor(aqi) {
  if (aqi <= 100) return '#34d399'; // Emerald
  if (aqi <= 200) return '#fbbf24'; // Amber
  if (aqi <= 300) return '#fb923c'; // Orange
  return '#f43f5e'; // Rose
}

/**
 * Family & Community Smog Command Center Page.
 * Visualizes live air metrics, diurnal inversion forecasts, and household protection shields.
 */
export default function CommandCenter() {
  const {
    setPage,
    selectedWard,
    setSelectedWardId,
    familyArchetype,
    setFamilyArchetype,
    exposureCalc,
    communitySavings,
    healthRisk,
    alerts,
    activeHacks,
    addToast
  } = useApp();

  const outdoorColor = getAqiColor(selectedWard.aqi);

  const handleSelectWard = (ward) => {
    setSelectedWardId(ward.id);
    addToast('Ward Focused', `Active telemetry switched to ${ward.name}`, 'cyan');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        eyebrow="01 · Household Atmospheric Defense"
        title="Family & Community Smog Command Center"
        desc="Real-time boundary layer inversion tracking, indoor vs outdoor air quality telemetry, and explainable low-emission lifestyle guidance for urban households."
        right={
          <>
            <button
              onClick={() => setPage('routines')}
              className="flex items-center gap-2 rounded-lg border border-cyan-400/20 bg-[#0c182c] px-3 py-1.5 text-xs font-mono text-cyan-300 hover:bg-cyan-400/10 transition cursor-pointer"
            >
              <Clock className="h-3.5 w-3.5" />
              Smog Routines
            </button>
            <button
              onClick={() => setPage('hacks')}
              className="flex items-center gap-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 text-xs font-mono text-emerald-300 hover:bg-emerald-500/30 transition cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              DIY IAQ Hacks ({activeHacks.length} Active)
            </button>
            <button
              onClick={() => setPage('alternatives')}
              className="flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-mono font-bold text-black shadow-glow hover:bg-cyan-300 transition cursor-pointer"
            >
              <Leaf className="h-3.5 w-3.5" />
              Clean Alternatives
            </button>
          </>
        }
      />

      {/* 6 Top Metric Cards specifically for Families */}
      <FamilyMetricCards
        selectedWard={selectedWard}
        outdoorColor={outdoorColor}
        exposureCalc={exposureCalc}
        communitySavings={communitySavings}
        alertsCount={alerts.length}
      />

      {/* Household Profile Toolbar */}
      <div className="panel p-4 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Users className="h-4 w-4 text-cyan-400" /> Tailored Profile:
          </span>
          {FAMILY_ARCHETYPES.map((arch) => (
            <button
              key={arch.id}
              onClick={() => {
                setFamilyArchetype(arch.id);
                addToast(
                  'Profile Switched',
                  `Active calculations adjusted for ${arch.label}`,
                  'cyan'
                );
              }}
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
            value={selectedWard.id}
            onChange={(e) => setSelectedWardId(e.target.value)}
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

      {/* Main Grid: Sector Matrix (Left) + Indoor vs Outdoor Telemetry (Right) */}
      <div className="grid gap-6 xl:grid-cols-3">
        <WardSelectorGrid
          selectedWard={selectedWard}
          onSelectWard={handleSelectWard}
          onNavigateMap={() => setPage('map')}
        />
        <IndoorShieldCard
          selectedWard={selectedWard}
          exposureCalc={exposureCalc}
          activeHacksCount={activeHacks.length}
          healthRisk={healthRisk}
        />
      </div>

      {/* Secondary Row: 24-Hour Diurnal Inversion Curve (Left) + Family Smog Playbook (Right) */}
      <div className="grid gap-6 xl:grid-cols-3">
        <InversionDiurnalChart />

        {/* Right: Family Emergency Checklist */}
        <div className="panel p-5 space-y-4">
          <div className="border-b border-cyan-400/10 pb-3 flex items-center justify-between">
            <div>
              <span className="label text-rose-400">Family Safeguards</span>
              <h2 className="text-lg font-bold text-white">Daily Smog Checklist</h2>
            </div>
            <span className="font-mono text-xs text-rose-300">Stage IV Active</span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-[#030712] border border-cyan-400/15 flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">Corsi-Rosenthal Box Running</div>
                <div className="text-[10px] text-slate-400">92% particulate removal active</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#030712] border border-cyan-400/15 flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">Window Foam Weatherstripped</div>
                <div className="text-[10px] text-slate-400">Draft infiltration down to 25%</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#030712] border border-cyan-400/15 flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">Microfiber Wet-Mopping Only</div>
                <div className="text-[10px] text-slate-400">Dry sweeping strictly banned</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#030712] border border-cyan-400/15 flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">N95 Mask Fit Tested for Children</div>
                <div className="text-[10px] text-slate-400">
                  Nasal bridge sealed with paper tape
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setPage('hacks')}
            className="w-full text-center text-xs text-cyan-300 hover:underline pt-2 border-t border-cyan-400/10 cursor-pointer font-mono"
          >
            Explore All 6 Low-Cost IAQ Hacks &rarr;
          </button>
        </div>
      </div>

      {/* Environmental Data Provenance & Science Transparency Bar */}
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
                  style={{
                    backgroundColor: `${tier.badgeColor}20`,
                    color: tier.badgeColor
                  }}
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
    </div>
  );
}
