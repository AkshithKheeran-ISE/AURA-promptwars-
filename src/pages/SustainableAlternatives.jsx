import React, { useState } from 'react';
import { 
  Leaf, 
  Car, 
  Flame, 
  Trash2, 
  Zap, 
  TrendingDown, 
  ShieldCheck, 
  CheckCircle2, 
  Users, 
  DollarSign, 
  Heart,
  Layers
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useApp } from '../context/AppContext';

const ALTERNATIVES_DATA = [
  {
    id: 'heating',
    title: 'Winter Space Heating',
    dirty: {
      title: 'Coal / Wood Sigdi or Cow Dung Cakes',
      impact: '14.2 kg CO2 & 120g PM2.5 per evening',
      danger: 'Emits lethal Carbon Monoxide and Carcinogenic Polycyclic Hydrocarbons (PAHs).',
      color: '#f43f5e'
    },
    clean: {
      title: 'Oil-Filled Radiator or Inverter Heat Pump',
      impact: '1.1 kg CO2 & 0g PM2.5 indoors',
      benefit: 'Gentle radiant warmth without burning oxygen or drying mucosal airways.',
      color: '#34d399'
    },
    annualSavings: '390 kg CO2 & 3.6 kg toxic soot per winter'
  },
  {
    id: 'commute',
    title: 'Daily Urban Commute',
    dirty: {
      title: 'Single-Occupancy Petrol / Diesel SUV',
      impact: '3.8 kg CO2 & 1.7g PM2.5 per 20km trip',
      danger: 'Creates heavy NO2 street canyon stagnation outside schools.',
      color: '#f43f5e'
    },
    clean: {
      title: 'Shared E-Rickshaw Feeder + Metro Rail',
      impact: '0.3 kg CO2 & 0.04g PM2.5 per trip',
      benefit: 'Zero street-level tailpipe emissions and bypasses traffic jams.',
      color: '#34d399'
    },
    annualSavings: '780 kg CO2 & 340g direct street soot'
  },
  {
    id: 'waste',
    title: 'Garden & Municipal Waste Disposal',
    dirty: {
      title: 'Open Smoldering of Fallen Leaves & Plastic',
      impact: '18.5 kg CO2 & 95g PM2.5 per 10kg pile',
      danger: 'Releases dioxins, furans, and black carbon directly into neighbor balconies.',
      color: '#f43f5e'
    },
    clean: {
      title: 'Community Aerobic Vermicomposting Pit',
      impact: '0.8 kg CO2 & 0g PM2.5 (produces rich compost)',
      benefit: 'Turns leaf litter into organic garden fertilizer for society parks.',
      color: '#34d399'
    },
    annualSavings: '450 kg CO2 & 2.4 kg PM2.5 per neighborhood'
  },
  {
    id: 'power',
    title: 'Emergency Power Backup',
    dirty: {
      title: 'Unmuffled 10kVA Diesel Generator (DG Set)',
      impact: '24.0 kg CO2 & 180g PM2.5 per 3 hours',
      danger: 'Vibrational noise pollution and unburned diesel soot plumes.',
      color: '#f43f5e'
    },
    clean: {
      title: 'Rooftop Solar + Lithium (LiFePO4) Inverter',
      impact: '0.0 kg CO2 & 0g PM2.5 at point of use',
      benefit: 'Instant silent switchover with 10-year lifespan and zero fuel cost.',
      color: '#34d399'
    },
    annualSavings: '920 kg CO2 & 5.1 kg PM2.5 per season'
  }
];

export default function SustainableAlternatives() {
  const { addToast, logAudit } = useApp();
  const [householdScale, setHouseholdScale] = useState(50);
  const [adoptedPledges, setAdoptedPledges] = useState(['heating', 'commute']);

  const handlePledge = (id, title) => {
    if (adoptedPledges.includes(id)) {
      setAdoptedPledges(prev => prev.filter(p => p !== id));
      addToast('Pledge Removed', `De-selected ${title}`, 'amber');
    } else {
      setAdoptedPledges(prev => [...prev, id]);
      addToast('Alternative Adopted', `Pledged to use ${title} for household smog defense!`, 'green');
      logAudit('Household Member', `Adopted sustainable clean alternative: ${title}`, 'Community Action', 'human');
    }
  };

  // Scaled calculations based on society size
  const totalCo2PreventedTons = Number(((householdScale * 1.8 * adoptedPledges.length) / 4).toFixed(1));
  const totalPm25PreventedKg = Number(((householdScale * 8.4 * adoptedPledges.length) / 4).toFixed(1));
  const asthmaCasesPrevented = Math.round(householdScale * 0.42 * adoptedPledges.length);
  const fuelSavingsLakhsInr = Number(((householdScale * 24000 * adoptedPledges.length) / 400000).toFixed(2));

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Interactive Neighborhood Scale Multiplier Simulator */}
      <div className="panel panel-corners p-6 border-cyan-400/30 bg-[#08101e] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-400/10 pb-3">
          <div>
            <span className="label text-cyan-300">Neighborhood Impact Multiplier</span>
            <h2 className="text-xl font-bold text-white mt-0.5">
              Simulate Community-Wide Winter Transition
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Slide to observe how community collective action eliminates toxic smog plumes across your housing society or ward.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-slate-400">Society Scale:</span>
            <span className="font-display text-xl font-bold text-cyan-300 px-3 py-1 rounded bg-[#030712] border border-cyan-400/20">
              {householdScale} Families
            </span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="10"
            max="500"
            step="10"
            value={householdScale}
            onChange={(e) => setHouseholdScale(Number(e.target.value))}
            className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between font-mono text-[10px] text-slate-500">
            <span>Small Street (10 Homes)</span>
            <span>Housing Society (100 Homes)</span>
            <span>Sub-Ward Complex (500 Homes)</span>
          </div>
        </div>

        {/* Scaled Metric Readouts */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-center pt-2">
          <div className="rounded-xl bg-[#030712] p-3.5 border border-cyan-400/15">
            <div className="text-slate-500 text-[10px]">Winter Carbon Avoided</div>
            <div className="font-display text-2xl font-bold text-cyan-300 mt-1">
              {totalCo2PreventedTons} Tons CO2
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">from transit & heating</div>
          </div>

          <div className="rounded-xl bg-[#030712] p-3.5 border border-cyan-400/15">
            <div className="text-slate-500 text-[10px]">Toxic Soot Prevented</div>
            <div className="font-display text-2xl font-bold text-emerald-400 mt-1">
              {totalPm25PreventedKg} kg PM2.5
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">spared from local lungs</div>
          </div>

          <div className="rounded-xl bg-[#030712] p-3.5 border border-cyan-400/15">
            <div className="text-slate-500 text-[10px]">Asthma Emergencies Avoided</div>
            <div className="font-display text-2xl font-bold text-rose-400 mt-1">
              {asthmaCasesPrevented} Children & Seniors
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">pediatric ER visits averted</div>
          </div>

          <div className="rounded-xl bg-[#030712] p-3.5 border border-cyan-400/15">
            <div className="text-slate-500 text-[10px]">Community Fuel Savings</div>
            <div className="font-display text-2xl font-bold text-amber-300 mt-1">
              ₹ {fuelSavingsLakhsInr} Lakhs
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">saved on petrol & coal</div>
          </div>
        </div>
      </div>

      {/* Comparison Matrix of 4 Everyday Choices */}
      <div className="grid gap-6 md:grid-cols-2">
        {ALTERNATIVES_DATA.map((item) => {
          const isAdopted = adoptedPledges.includes(item.id);

          return (
            <div 
              key={item.id}
              className={`panel panel-corners p-5 space-y-4 transition ${
                isAdopted 
                  ? 'border-emerald-400/40 bg-[#08101e]' 
                  : 'border-cyan-400/10 bg-[#060d1b]'
              }`}
            >
              <div className="flex items-center justify-between border-b border-cyan-400/10 pb-2.5">
                <h3 className="text-base font-bold text-white font-sans">{item.title}</h3>
                <button
                  onClick={() => handlePledge(item.id, item.clean.title)}
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
        })}
      </div>
    </div>
  );
}
