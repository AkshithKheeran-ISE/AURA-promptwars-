import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, Sparkles, CheckCircle2, Users } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useUi, useHousehold } from '../context/AppContext';
import {
  FAMILY_ARCHETYPES,
  DAILY_ROUTINE_SLOTS,
  generatePersonalizedGuidance
} from '../services/routineEngine';

function ArchetypeDwellingToolbar({
  familyArchetype,
  onArchetypeChange,
  dwellingType,
  onDwellingChange
}) {
  return (
    <div className="panel p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-slate-400 flex items-center gap-1.5">
          <Users className="h-4 w-4 text-cyan-400" /> Household Archetype:
        </span>
        {FAMILY_ARCHETYPES.map((arch) => (
          <button
            key={arch.id}
            onClick={() => onArchetypeChange(arch.id)}
            className={`px-3 py-1.5 rounded-lg border transition cursor-pointer text-left ${
              familyArchetype === arch.id
                ? 'bg-cyan-400/20 border-cyan-400 text-cyan-200 shadow-glow font-bold'
                : 'border-cyan-400/10 text-slate-400 hover:bg-white/5'
            }`}
          >
            {arch.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-slate-400">Dwelling:</span>
        <select
          value={dwellingType}
          onChange={(e) => onDwellingChange(e.target.value)}
          className="rounded-lg border border-cyan-400/20 bg-[#0c182c] px-2.5 py-1 text-white focus:outline-none"
        >
          <option value="apartment_high">
            High-Rise (8th Floor+) — Lower road dust, high wind
          </option>
          <option value="apartment_low">Ground / 1st Floor — High street canyon soot</option>
          <option value="independent">Independent House — High window draft infiltration</option>
        </select>
      </div>
    </div>
  );
}

ArchetypeDwellingToolbar.propTypes = {
  familyArchetype: PropTypes.string.isRequired,
  onArchetypeChange: PropTypes.func.isRequired,
  dwellingType: PropTypes.string.isRequired,
  onDwellingChange: PropTypes.func.isRequired
};

function ProtocolDirectiveBanner({ currentGuidance, selectedWard }) {
  return (
    <div className="panel p-5 border-l-4 border-l-cyan-400 bg-cyan-400/5 flex flex-wrap items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="label text-cyan-300 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          {currentGuidance.title}
        </div>
        <div className="text-lg font-bold text-white font-display">{currentGuidance.keyRule}</div>
        <div className="text-xs text-slate-300">
          Air Purifier Setting:{' '}
          <strong className="text-emerald-300">{currentGuidance.hepaSetting}</strong> · Prohibited:{' '}
          <span className="text-rose-300">{currentGuidance.avoidAction}</span>
        </div>
      </div>

      <div className="rounded-xl border border-cyan-400/20 bg-black/40 p-3 text-center font-mono">
        <div className="text-[10px] text-slate-400">CURRENT INVERSION CEILING</div>
        <div className="text-xl font-bold text-amber-300 mt-0.5">{selectedWard.inversion}</div>
        <div className="text-[9px] text-slate-400">{selectedWard.name}</div>
      </div>
    </div>
  );
}

ProtocolDirectiveBanner.propTypes = {
  currentGuidance: PropTypes.object.isRequired,
  selectedWard: PropTypes.object.isRequired
};

/** @param {any} props */
function DailyRoutineSlotCard({ slot }) {
  return (
    <div className="panel panel-corners p-5 space-y-3 hover:border-cyan-400/40 transition">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-400/10 pb-2.5">
        <div className="flex items-center gap-3">
          <span className="rounded bg-black/50 border border-cyan-400/20 px-2.5 py-1 font-mono text-xs font-bold text-cyan-300">
            {slot.timeSlot}
          </span>
          <h3 className="text-base font-bold text-white">{slot.title}</h3>
        </div>
        <span
          className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border"
          style={{
            color: slot.badgeColor,
            borderColor: `${slot.badgeColor}66`,
            backgroundColor: `${slot.badgeColor}15`
          }}
        >
          {slot.actionBadge}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 text-xs">
        <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 space-y-1">
          <div className="font-mono text-[10px] font-bold text-rose-400 flex items-center gap-1.5 uppercase">
            <AlertTriangle className="h-3 w-3" /> Conventional High-Risk Habit
          </div>
          <p className="text-slate-300 leading-relaxed font-sans">{slot.standardPractice}</p>
          <div className="text-[10px] font-mono text-slate-400 pt-1 border-t border-rose-500/10">
            Atmospheric Condition: {slot.smogCondition} ({slot.inversionHeight})
          </div>
        </div>

        <div className="p-3 rounded-lg bg-emerald-400/5 border border-emerald-400/20 space-y-1">
          <div className="font-mono text-[10px] font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
            <CheckCircle2 className="h-3 w-3" /> AURA Low-Emission Smog Routine
          </div>
          <p className="text-slate-200 leading-relaxed font-sans font-medium">
            {slot.smogHackRoutine}
          </p>
          <div className="text-[10px] font-mono text-cyan-300 pt-1 border-t border-emerald-400/10 flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Direct Health Impact: {slot.impactExplanation}
          </div>
        </div>
      </div>
    </div>
  );
}

DailyRoutineSlotCard.propTypes = {
  slot: PropTypes.object.isRequired
};

function HouseholdImpactQuantificationCard({ exposureCalc, selectedWard, communitySavings }) {
  return (
    <div className="panel p-6 border-cyan-400/30 bg-[#08101e]">
      <div className="border-b border-cyan-400/10 pb-3 flex items-center justify-between">
        <div>
          <span className="label text-cyan-300">Explainable Impact Quantification</span>
          <h2 className="text-lg font-bold text-white">
            Your Household 24-Hour Smog Shield Impact
          </h2>
        </div>
        <span className="font-mono text-xs text-emerald-400">Validated Mathematical Model</span>
      </div>

      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-center">
        <div className="rounded-lg bg-[#030712] p-3 border border-cyan-400/15">
          <div className="text-slate-400 text-[10px]">Inhaled PM2.5 Inhalation</div>
          <div className="font-display text-2xl font-bold text-emerald-400 mt-1">
            -{exposureCalc.percentageReduction}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {exposureCalc.reductionMicrograms} µg soot avoided
          </div>
        </div>

        <div className="rounded-lg bg-[#030712] p-3 border border-cyan-400/15">
          <div className="text-slate-400 text-[10px]">Indoor Air Quality Index</div>
          <div className="font-display text-2xl font-bold text-white mt-1">
            {exposureCalc.indoorPm25} µg
          </div>
          <div className="text-[10px] text-cyan-300 mt-0.5">
            vs Outdoor {selectedWard.pm25} µg/m³
          </div>
        </div>

        <div className="rounded-lg bg-[#030712] p-3 border border-cyan-400/15">
          <div className="text-slate-400 text-[10px]">Community CO2 Prevented</div>
          <div className="font-display text-2xl font-bold text-cyan-300 mt-1">
            {communitySavings.co2SavedKg} kg
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">via clean commute & heating</div>
        </div>

        <div className="rounded-lg bg-[#030712] p-3 border border-cyan-400/15">
          <div className="text-slate-400 text-[10px]">Health & Fuel Savings</div>
          <div className="font-display text-2xl font-bold text-amber-300 mt-1">
            ₹ {communitySavings.totalFinancialSavingsInr}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Medicines & gas saved today</div>
        </div>
      </div>
    </div>
  );
}

HouseholdImpactQuantificationCard.propTypes = {
  exposureCalc: PropTypes.object.isRequired,
  selectedWard: PropTypes.object.isRequired,
  communitySavings: PropTypes.object.isRequired
};

export default function DailyRoutines() {
  const {
    familyArchetype,
    setFamilyArchetype,
    dwellingType,
    setDwellingType,
    selectedWard,
    exposureCalc,
    communitySavings
  } = useHousehold();
  const { addToast, logAudit } = useUi();

  const currentGuidance = useMemo(
    () => generatePersonalizedGuidance(familyArchetype, selectedWard.aqi),
    [familyArchetype, selectedWard.aqi]
  );

  const handleArchetypeChange = (id) => {
    setFamilyArchetype(id);
    addToast(
      'Profile Updated',
      `Customized routine generated for ${FAMILY_ARCHETYPES.find((a) => a.id === id)?.label}`,
      'cyan'
    );
    logAudit('Family Lead', `Switched household archetype to ${id}`, 'Routine Engine', 'human');
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="02 · Lifestyle Adaptation"
        title="Low-Emission Smog-Adapted Daily Routines"
        desc="Dynamic schedules calibrated to hourly atmospheric inversion dynamics, minimizing toxic particulate lung deposition for children, commuters, and vulnerable seniors."
      />

      <ArchetypeDwellingToolbar
        familyArchetype={familyArchetype}
        onArchetypeChange={handleArchetypeChange}
        dwellingType={dwellingType}
        onDwellingChange={setDwellingType}
      />

      <ProtocolDirectiveBanner currentGuidance={currentGuidance} selectedWard={selectedWard} />

      <div className="space-y-4">
        {DAILY_ROUTINE_SLOTS.map((slot, idx) => (
          <DailyRoutineSlotCard key={idx} slot={slot} />
        ))}
      </div>

      <HouseholdImpactQuantificationCard
        exposureCalc={exposureCalc}
        selectedWard={selectedWard}
        communitySavings={communitySavings}
      />
    </div>
  );
}
