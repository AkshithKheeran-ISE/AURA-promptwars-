import React from 'react';

const LIVE_TICKER_ITEMS = [
  '[AURA-WZP-08] Severe PM2.5 spike: 415 µg/m³ · Wazirpur Smelting Belt · GRAP Stage IV Active',
  '[DRONE-UAV-01] Aerial FLIR mapped VOC plume 440ppm · Jahangirpuri Logistics Sector',
  '[BIO-SENTINEL] Boundary inversion ceiling compressed to 80m · Stagnant night trapping active',
  '[CEMS-OKH-04] Incinerator Line 2 bypass attempt intercepted · Automated valve cutoff triggered',
  '[METEO-FEED] Surface winds dropping to 3.2 km/h NW · Unfavourable dispersion outlook',
  '[CPCB-DISPATCH] 4 High-pressure anti-smog water cannons deployed to Anand Vihar Corridor',
  '[LEDGER] Citizen waste burning report REP-AURA-8101 cryptographically verified on ledger',
  '[TRAFFIC-CONTROL] Heavy commercial freight diverted to Western Peripheral Expressway'
];

export default function LiveTicker() {
  const repeated = [...LIVE_TICKER_ITEMS, ...LIVE_TICKER_ITEMS];

  return (
    <div className="relative flex h-8 items-center overflow-hidden border-b border-cyan-400/10 bg-[#08101e]/60">
      {/* Fixed LIVE Badge */}
      <div className="z-10 flex h-full items-center gap-2 bg-rose-500/90 px-3 font-mono text-[10px] font-bold tracking-widest text-white shadow-md">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
        LIVE
      </div>

      {/* Marquee Scroller */}
      <div className="flex animate-ticker whitespace-nowrap">
        {repeated.map((item, idx) => {
          const [prefix, rest] = item.split(']');
          return (
            <span key={idx} className="mx-6 font-mono text-[11px] text-slate-300">
              <span className="text-cyan-300 font-bold">{prefix}]</span>
              {rest}
            </span>
          );
        })}
      </div>
    </div>
  );
}
