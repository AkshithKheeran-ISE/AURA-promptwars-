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

const PARSED_TICKER_ITEMS = [...LIVE_TICKER_ITEMS, ...LIVE_TICKER_ITEMS].map((item, idx) => {
  const [prefix, rest] = item.split(']');
  return {
    id: `ticker-${idx}-${prefix.replace(/[^a-zA-Z0-9]/g, '')}`,
    prefix: `${prefix}]`,
    rest
  };
});

export default function LiveTicker() {
  return (
    <div className="relative flex h-8 items-center overflow-hidden border-b border-cyan-400/10 bg-[#08101e]/60">
      {/* Fixed SIMULATED TELEMETRY Badge */}
      <div className="z-10 flex h-full items-center gap-2 bg-amber-500/90 px-3 font-mono text-[10px] font-bold tracking-widest text-slate-950 shadow-md">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-950" />
        SIMULATED TELEMETRY
      </div>

      {/* Marquee Scroller */}
      <div className="flex animate-ticker whitespace-nowrap">
        {PARSED_TICKER_ITEMS.map((item) => (
          <span key={item.id} className="mx-6 font-mono text-[11px] text-slate-300">
            <span className="text-cyan-300 font-bold">{item.prefix}</span>
            {item.rest}
          </span>
        ))}
      </div>
    </div>
  );
}
