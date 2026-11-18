import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import SectionHeader from '../components/SectionHeader';
import { useApp } from '../context/AppContext';
import AlternativeCard from '../components/alternatives/AlternativeCard';
import ALTERNATIVES_DATA from '../data/alternativesData.json';

function CommunityScaleSimulator({ householdScale, onScaleChange, metricReadouts }) {
  return (
    <div className="panel panel-corners p-6 border-cyan-400/30 bg-[#08101e] space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-400/10 pb-3">
        <div>
          <span className="label text-cyan-300">Neighborhood Impact Multiplier</span>
          <h2 className="text-xl font-bold text-white mt-0.5">
            Simulate Community-Wide Winter Transition
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Slide to observe how community collective action eliminates toxic smog plumes across
            your housing society or ward.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <label htmlFor="society-scale-slider" className="text-slate-400">
            Society Scale:
          </label>
          <span className="font-display text-xl font-bold text-cyan-300 px-3 py-1 rounded bg-[#030712] border border-cyan-400/20">
            {householdScale} Families
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <input
          id="society-scale-slider"
          type="range"
          min="10"
          max="500"
          step="10"
          value={householdScale}
          onChange={(e) => onScaleChange(Number(e.target.value))}
          aria-label="Neighborhood household scale multiplier"
          className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between font-mono text-[10px] text-slate-500">
          <span>Small Street (10 Homes)</span>
          <span>Housing Society (100 Homes)</span>
          <span>Sub-Ward Complex (500 Homes)</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-center pt-2">
        {metricReadouts.map((m, idx) => (
          <div key={idx} className="rounded-xl bg-[#030712] p-3.5 border border-cyan-400/15">
            <div className="text-slate-500 text-[10px]">{m.label}</div>
            <div className={`font-display text-2xl font-bold ${m.color} mt-1`}>{m.value}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

CommunityScaleSimulator.propTypes = {
  householdScale: PropTypes.number.isRequired,
  onScaleChange: PropTypes.func.isRequired,
  metricReadouts: PropTypes.array.isRequired
};

function computeAlternativeMetrics(householdScale, pledgeCount) {
  const totalCo2PreventedTons = Number(((householdScale * 1.8 * pledgeCount) / 4).toFixed(1));
  const totalPm25PreventedKg = Number(((householdScale * 8.4 * pledgeCount) / 4).toFixed(1));
  const asthmaCasesPrevented = Math.round(householdScale * 0.42 * pledgeCount);
  const fuelSavingsLakhsInr = Number(((householdScale * 24000 * pledgeCount) / 400000).toFixed(2));

  return [
    {
      label: 'Winter Carbon Avoided',
      value: `${totalCo2PreventedTons} Tons CO2`,
      sub: 'from transit & heating',
      color: 'text-cyan-300'
    },
    {
      label: 'Toxic Soot Prevented',
      value: `${totalPm25PreventedKg} kg PM2.5`,
      sub: 'spared from local lungs',
      color: 'text-emerald-400'
    },
    {
      label: 'High-Risk Exposure Mitigated',
      value: `~${asthmaCasesPrevented} Vulnerable Days`,
      sub: 'WHO 2021 model (illustrative)',
      color: 'text-rose-400'
    },
    {
      label: 'Community Fuel Savings',
      value: `₹ ${fuelSavingsLakhsInr} Lakhs`,
      sub: 'saved on petrol & coal',
      color: 'text-amber-300'
    }
  ];
}

function togglePledgeState(id, title, setAdoptedPledges, addToast, logAudit) {
  setAdoptedPledges((prev) => {
    if (prev.includes(id)) {
      addToast('Pledge Removed', `De-selected ${title}`, 'amber');
      return prev.filter((p) => p !== id);
    }
    addToast('Alternative Adopted', `Pledged to use ${title} for household smog defense!`, 'green');
    logAudit(
      'Household Member',
      `Adopted sustainable clean alternative: ${title}`,
      'Community Action',
      'human'
    );
    return [...prev, id];
  });
}

/**
 * Sustainable Community Alternatives & Footprint Calculator.
 * Enables households and RWAs to simulate collective transitions and adopt clean habits.
 */
export default function SustainableAlternatives() {
  const { addToast, logAudit } = useApp();
  const [householdScale, setHouseholdScale] = useState(50);
  const [adoptedPledges, setAdoptedPledges] = useState(['heating', 'commute']);

  const handlePledge = (id, title) => {
    togglePledgeState(id, title, setAdoptedPledges, addToast, logAudit);
  };

  const metricReadouts = useMemo(
    () => computeAlternativeMetrics(householdScale, adoptedPledges.length),
    [householdScale, adoptedPledges.length]
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="04 · Clean Transition"
        title="Sustainable Community Alternatives & Footprint"
        desc="Quantifying the direct neighborhood and health impact when families swap high-emission winter habits for clean sustainable alternatives."
        right={
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="rounded border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-emerald-300 font-bold">
              {adoptedPledges.length} Sustainable Alternatives Adopted
            </span>
          </div>
        }
      />

      <CommunityScaleSimulator
        householdScale={householdScale}
        onScaleChange={setHouseholdScale}
        metricReadouts={metricReadouts}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {ALTERNATIVES_DATA.map((item) => (
          <AlternativeCard
            key={item.id}
            item={item}
            isAdopted={adoptedPledges.includes(item.id)}
            onTogglePledge={handlePledge}
          />
        ))}
      </div>
    </div>
  );
}
