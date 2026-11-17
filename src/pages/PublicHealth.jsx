import React, { useState } from 'react';
import { 
  HeartPulse, 
  ShieldAlert, 
  Navigation, 
  Clock, 
  Send, 
  AlertCircle, 
  CheckCircle2, 
  Users, 
  Wind, 
  ShieldCheck,
  Compass,
  Smile,
  AlertTriangle
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useApp } from '../context/AppContext';
import { WARDS_DATA } from '../data/airData';

export default function PublicHealth() {
  const { 
    selectedWard, 
    setSelectedWardId, 
    addToast, 
    logAudit 
  } = useApp();

  const [activeWardId, setActiveWardId] = useState(selectedWard.id);
  const ward = WARDS_DATA.find(w => w.id === activeWardId) || selectedWard;

  const handleBroadcast = () => {
    addToast('Advisory Broadcasted', `Signed health advisory dispatched to 48,000 residents of ${ward.name}`, 'green');
    logAudit('Health Officer', `Dispatched authenticated public air advisory to ${ward.name}`, 'PUBLIC_SMS_GATEWAY', 'human');
  };

  // Advisory status computation
  const isSevere = ward.aqi > 300;
  const isPoor = ward.aqi > 200 && ward.aqi <= 300;

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        eyebrow="05 · Population Protection"
        title="Public Health & Citizen Advisory System"
        desc="Dynamic clean air routing, vulnerable cohort protection, optimal outdoor activity windows, and authenticated municipal advisories delivered over verified SMS and WhatsApp."
        right={
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">Select Ward:</span>
            <select
              value={activeWardId}
              onChange={(e) => {
                setActiveWardId(e.target.value);
                setSelectedWardId(e.target.value);
              }}
              className="rounded-lg border border-cyan-400/20 bg-[#0c182c] px-3 py-1.5 text-xs text-white focus:outline-none"
            >
              {WARDS_DATA.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} (AQI {w.aqi})
                </option>
              ))}
            </select>
          </div>
        }
      />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="panel panel-corners p-4 space-y-1">
          <div className="label text-slate-400">Vulnerable Citizens Exposed</div>
          <div className="font-display text-2xl font-bold text-rose-400">
            {isSevere ? '184,000' : isPoor ? '92,000' : '24,000'}
          </div>
          <div className="text-xs font-mono text-slate-400">Asthmatics, children & elderly</div>
        </div>

        <div className="panel panel-corners p-4 space-y-1">
          <div className="label text-slate-400">Mandated Respirator Tier</div>
          <div className="font-display text-2xl font-bold text-white">
            {isSevere ? 'N95 / FFP2' : isPoor ? 'N95 Respirator' : 'Standard Mask'}
          </div>
          <div className="text-xs font-mono text-cyan-300">95% Particulate filtration</div>
        </div>

        <div className="panel panel-corners p-4 space-y-1">
          <div className="label text-slate-400">Safest Exercise Window</div>
          <div className="font-display text-2xl font-bold text-emerald-400">
            14:00 – 16:30
          </div>
          <div className="text-xs font-mono text-slate-400">Peak thermal mixing window</div>
        </div>

        <div className="panel panel-corners p-4 space-y-1">
          <div className="label text-slate-400">Signed Advisories Sent</div>
          <div className="font-display text-2xl font-bold text-white">428,910</div>
          <div className="text-xs font-mono text-emerald-400">Ed25519 authenticated</div>
        </div>
      </div>

      {/* Main Signal Banner */}
      <div className={`panel p-6 border-l-6 ${
        isSevere 
          ? 'border-l-rose-500 bg-rose-500/10' 
          : isPoor 
          ? 'border-l-amber-400 bg-amber-400/10' 
          : 'border-l-emerald-400 bg-emerald-400/10'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="label" style={{ color: isSevere ? '#f43f5e' : isPoor ? '#fbbf24' : '#34d399' }}>
              DISTRICT CLEAN AIR SIGNAL · {ward.name}
            </span>
            <h2 className="text-2xl font-bold text-white font-display">
              {isSevere 
                ? 'CRITICAL RED ALERT — STRICTLY AVOID OUTDOOR EXERTION' 
                : isPoor 
                ? 'UNHEALTHY AIR QUALITY — SENSITIVE GROUPS REMAIN INDOORS' 
                : 'SATISFACTORY AIR QUALITY — OUTDOOR ACTIVITIES PERMITTED'}
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl">
              {isSevere 
                ? 'Severe PM2.5 concentrations exceeding 250 µg/m³ with heavy ground-level thermal inversion. All outdoor school sports prohibited. Industrial workers must rotate on HEPA clean rooms.'
                : isPoor
                ? 'High particulate density in downwind corridors. Avoid jogging or cycling along heavy ring roads. Indoor HEPA filtration strongly recommended.'
                : 'Ambient particulate matter within tolerable municipal baseline. Ventilation and morning recreation permissible.'}
            </p>
          </div>

          <button
            onClick={handleBroadcast}
            className="flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 font-sans text-sm font-bold text-black shadow-glow hover:bg-cyan-300 transition cursor-pointer"
          >
            <Send className="h-4 w-4" />
            Broadcast Advisory SMS & WhatsApp
          </button>
        </div>

        {/* Telemetry chips in banner */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono text-xs pt-3 border-t border-cyan-400/10">
          <div className="rounded-lg bg-black/40 p-2">
            <div className="text-slate-400 text-[10px]">Instantaneous AQI</div>
            <div className="font-bold text-white text-base mt-0.5">{ward.aqi}</div>
          </div>
          <div className="rounded-lg bg-black/40 p-2">
            <div className="text-slate-400 text-[10px]">Fine PM2.5</div>
            <div className="font-bold text-rose-400 text-base mt-0.5">{ward.pm25} µg/m³</div>
          </div>
          <div className="rounded-lg bg-black/40 p-2">
            <div className="text-slate-400 text-[10px]">Wind Dispersion</div>
            <div className="font-bold text-white text-base mt-0.5">{ward.wind} km/h</div>
          </div>
          <div className="rounded-lg bg-black/40 p-2">
            <div className="text-slate-400 text-[10px]">Inversion Ceiling</div>
            <div className="font-bold text-amber-300 text-base mt-0.5">{ward.inversion}</div>
          </div>
        </div>
      </div>

      {/* Middle Row: Safe Transit Router (Left) + Vulnerable Group Matrix (Right) */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Left: Clean Air Commute & Route Planner */}
        <div className="panel p-5 space-y-4">
          <div className="border-b border-cyan-400/10 pb-2 flex items-center justify-between">
            <div>
              <span className="label text-cyan-300">Intelligent Routing</span>
              <h3 className="text-lg font-bold text-white">Clean Air Commute & Transit Paths</h3>
            </div>
            <Navigation className="h-4 w-4 text-cyan-400" />
          </div>

          <p className="text-xs text-slate-400">
            AURA recalculates pedestrian and cycling navigation to avoid street canyon traps where heavy diesel freight exhaust accumulates.
          </p>

          <div className="space-y-3 font-mono text-xs">
            {/* Route 1 */}
            <div className="p-3 rounded-lg border border-emerald-400/30 bg-emerald-400/5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> RECOMMENDED: Ridge Canopy Green Corridor
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-400/20 px-1.5 py-0.5 rounded">
                  -48% PM2.5 Exposure
                </span>
              </div>
              <div className="text-slate-300 text-[11px]">
                Navigates via Palam Ridge Forest Path &gt; Sector 12 Park Line. Canopy trees absorb coarse particulates.
              </div>
              <div className="text-[10px] text-slate-500 flex justify-between">
                <span>Distance: 4.8 km · Estimated Time: 16 mins</span>
                <span className="text-emerald-300 font-bold">AQI 118 (Moderate)</span>
              </div>
            </div>

            {/* Route 2 */}
            <div className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" /> HAZARDOUS: Outer Ring Road Arterial Corridor
                </span>
                <span className="text-[10px] text-rose-400 bg-rose-500/20 px-1.5 py-0.5 rounded">
                  +180% Toxic NO2 Trap
                </span>
              </div>
              <div className="text-slate-300 text-[11px]">
                High-density stop-and-go truck idling corridor. Toxic nitrogen dioxide and unburned diesel soot trapped between flyovers.
              </div>
              <div className="text-[10px] text-slate-500 flex justify-between">
                <span>Distance: 3.9 km · High Stagnation</span>
                <span className="text-rose-400 font-bold">AQI 362 (Severe)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Vulnerable Population Cohort Rules */}
        <div className="panel p-5 space-y-4">
          <div className="border-b border-cyan-400/10 pb-2 flex items-center justify-between">
            <div>
              <span className="label text-amber-400">Clinical Safeguards</span>
              <h3 className="text-lg font-bold text-white">Vulnerable Cohort Action Matrix</h3>
            </div>
            <HeartPulse className="h-4 w-4 text-rose-400" />
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-lg bg-[#030712] border border-cyan-400/10 space-y-1">
              <div className="font-bold text-rose-300 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> Asthmatic & Respiratory Patients
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Maintain indoor air purifiers on high. Keep inhalers / bronchodilators within arm's reach. Avoid unventilated morning walks before 11:00 AM.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#030712] border border-cyan-400/10 space-y-1">
              <div className="font-bold text-amber-300 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400" /> Children & Primary Schools
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Prohibit all outdoor physical education, assemblies and sports. Keep classroom windows sealed with air scrubbing filters active.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#030712] border border-cyan-400/10 space-y-1">
              <div className="font-bold text-cyan-300 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400" /> Outdoor Gig Workers & Drivers
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Employers must provide certified N95 respirators with replacement every 4 hours. Provide access to sealed hydration stations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
