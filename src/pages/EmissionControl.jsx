import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Factory, 
  Lock, 
  Cpu, 
  Terminal, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  XCircle,
  ExternalLink
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useApp } from '../context/AppContext';
import { 
  INDUSTRIAL_CEMS_STATIONS, 
  LIVE_INGESTION_STREAM 
} from '../data/airData';

export default function EmissionControl() {
  const { addToast, logAudit } = useApp();
  const [packets, setPackets] = useState(LIVE_INGESTION_STREAM);

  const issuePenalty = (station) => {
    addToast('Penalty Order Issued', `Statutory penalty of ${station.fine} issued to ${station.name}`, 'red');
    logAudit('PolicyAuditor (AI)', `Levied environmental compensation fine of ${station.fine}`, station.id, 'agent');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        eyebrow="04 · Source Regulation"
        title="Industrial & Vehicular Emission Defense"
        desc="Zero-trust monitoring for every factory chimney stack (CEMS), continuous vehicular congestion corridor, and micro-sensor telemetry stream that feeds AURA."
      />

      {/* 5 Top Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <div className="panel panel-corners p-4 space-y-1">
          <div className="label text-slate-400">Compliance Posture</div>
          <div className="font-display text-2xl font-bold text-white">91/100</div>
          <div className="text-xs font-mono text-emerald-400">+3 pts this week</div>
        </div>
        <div className="panel panel-corners p-4 space-y-1">
          <div className="label text-slate-400">CEMS Stacks Monitored</div>
          <div className="font-display text-2xl font-bold text-white">412 Units</div>
          <div className="text-xs font-mono text-cyan-300">100% telemetry online</div>
        </div>
        <div className="panel panel-corners p-4 space-y-1">
          <div className="label text-slate-400">Tamper Attacks Blocked</div>
          <div className="font-display text-2xl font-bold text-white">28 Intercepted</div>
          <div className="text-xs font-mono text-emerald-400">Optical sensor bypasses</div>
        </div>
        <div className="panel panel-corners p-4 space-y-1">
          <div className="label text-slate-400">Encrypted Telemetry</div>
          <div className="font-display text-2xl font-bold text-white">4.2 TB</div>
          <div className="text-xs font-mono text-cyan-300">TLS 1.3 / mTLS</div>
        </div>
        <div className="panel panel-corners p-4 space-y-1">
          <div className="label text-slate-400">Cryptographic Keys Rotated</div>
          <div className="font-display text-2xl font-bold text-white">3,420</div>
          <div className="text-xs font-mono text-emerald-400">On schedule (24h)</div>
        </div>
      </div>

      {/* Middle Row: Emission Source Breakdown (Left) + Zero-Trust Attestation Grid (Right) */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left: Emission Source Breakdown */}
        <div className="panel p-5 space-y-4">
          <div className="border-b border-cyan-400/10 pb-2">
            <span className="label text-cyan-300">Source Apportionment</span>
            <h2 className="text-lg font-bold text-white">Urban Emission Category Mix</h2>
          </div>

          <div className="flex items-center gap-6 py-2">
            {/* SVG Donut Chart */}
            <div className="relative h-44 w-44 shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="35" stroke="#f43f5e" strokeWidth="12" strokeDasharray="86 134" fill="transparent" />
                <circle cx="50" cy="50" r="35" stroke="#38bdf8" strokeWidth="12" strokeDasharray="64 156" strokeDashoffset="-86" fill="transparent" />
                <circle cx="50" cy="50" r="35" stroke="#fbbf24" strokeWidth="12" strokeDasharray="40 180" strokeDashoffset="-150" fill="transparent" />
                <circle cx="50" cy="50" r="35" stroke="#a855f7" strokeWidth="12" strokeDasharray="30 190" strokeDashoffset="-190" fill="transparent" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-display text-2xl font-bold text-white">100%</span>
                <span className="text-[9px] font-mono text-slate-500">APPORTIONED</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs font-mono flex-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-rose-500" /> Vehicular Fleet
                </span>
                <span className="font-bold text-white">39%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" /> Industrial CEMS
                </span>
                <span className="font-bold text-white">29%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-amber-400" /> Construction Dust
                </span>
                <span className="font-bold text-white">18%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-purple-500" /> Biomass & Waste
                </span>
                <span className="font-bold text-white">14%</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-[#030712] p-3 border border-cyan-400/10 text-xs font-mono space-y-1">
            <div className="text-slate-400">Chemical Speciation Analysis:</div>
            <div className="text-cyan-300 text-[11px]">Primary tracer: Black Carbon & Elemental Sulfur (Wazirpur corridor)</div>
          </div>
        </div>

        {/* Right: Zero-Trust Sensor Attestation Grid (2 cols) */}
        <div className="panel p-5 xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-cyan-400/10 pb-2">
            <div>
              <span className="label text-emerald-400">Hardware Attestation</span>
              <h2 className="text-lg font-bold text-white">Micro-Sensor TPM Mesh Health Matrix</h2>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> 3,420 Attested
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="h-2 w-2 rounded-full bg-amber-400" /> 11 Drift
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="h-2 w-2 rounded-full bg-rose-500" /> 4 Quarantined
              </span>
            </div>
          </div>

          {/* 16x8 matrix representation */}
          <div className="grid grid-cols-16 gap-1.5 py-2">
            {Array.from({ length: 128 }).map((_, idx) => {
              const isDrift = idx === 14 || idx === 62 || idx === 98;
              const isQuarantine = idx === 43 || idx === 105;
              const color = isQuarantine ? 'bg-rose-500 shadow-glow-red' : isDrift ? 'bg-amber-400' : 'bg-emerald-400/70 hover:bg-emerald-400';

              return (
                <div 
                  key={idx} 
                  title={`Sensor Node #${idx + 1000} · ${isQuarantine ? 'QUARANTINED' : isDrift ? 'CONFIG DRIFT' : 'ATTESTED'}`}
                  className={`h-3 w-full rounded-sm transition cursor-pointer ${color}`} 
                />
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-3 text-center font-mono text-xs pt-1">
            <div className="rounded-lg bg-[#030712] p-2 border border-cyan-400/10">
              <div className="text-slate-500 text-[10px]">Telemetry Encryption</div>
              <div className="font-bold text-emerald-300 mt-0.5">AES-256-GCM</div>
            </div>
            <div className="rounded-lg bg-[#030712] p-2 border border-cyan-400/10">
              <div className="text-slate-500 text-[10px]">Hardware Root of Trust</div>
              <div className="font-bold text-emerald-300 mt-0.5">TPM 2.0 Hardened</div>
            </div>
            <div className="rounded-lg bg-[#030712] p-2 border border-cyan-400/10">
              <div className="text-slate-500 text-[10px]">Firmware Signatures</div>
              <div className="font-bold text-emerald-300 mt-0.5">Ed25519 Verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Firewall & Packet Ingestion Stream */}
      <div className="panel p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-cyan-400/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse shadow-glow-red" />
            <h2 className="text-lg font-bold text-white">Live Ingestion Stream & Tamper Interceptor</h2>
          </div>
          <span className="font-mono text-xs text-cyan-300">STREAMING ACTIVE</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-cyan-400/10 text-slate-500">
                <th className="pb-2 font-normal">Packet ID</th>
                <th className="pb-2 font-normal">Timestamp</th>
                <th className="pb-2 font-normal">Telemetry Source</th>
                <th className="pb-2 font-normal">Target Ingestion</th>
                <th className="pb-2 font-normal">Security Protocol</th>
                <th className="pb-2 font-normal">Pollutant Payload</th>
                <th className="pb-2 font-normal">Filter Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-400/5">
              {packets.map((pkt) => (
                <tr key={pkt.id} className="hover:bg-white/5 transition">
                  <td className="py-2.5 text-cyan-300 font-bold">{pkt.id}</td>
                  <td className="py-2.5 text-slate-400">{pkt.time}</td>
                  <td className="py-2.5 text-slate-200">{pkt.source}</td>
                  <td className="py-2.5 text-slate-400">{pkt.target}</td>
                  <td className="py-2.5 text-slate-300">{pkt.protocol}</td>
                  <td className="py-2.5 text-white font-semibold">{pkt.pollutant}</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      pkt.action === 'DROP' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                      pkt.action === 'FLAG' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' :
                      'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                    }`}>
                      {pkt.action}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Industrial Offenders & Compliance Notices */}
      <div className="panel p-5 space-y-3">
        <div className="border-b border-cyan-400/10 pb-3 flex items-center justify-between">
          <div>
            <span className="label text-rose-400">Statutory Enforcement</span>
            <h2 className="text-lg font-bold text-white">High-Emission CEMS Stack Violations</h2>
          </div>
          <span className="font-mono text-xs text-slate-400">CPCB Section 31A Powers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-cyan-400/10 text-slate-500">
                <th className="pb-2 font-normal">Facility & Stack ID</th>
                <th className="pb-2 font-normal">Ward Location</th>
                <th className="pb-2 font-normal">Target Pollutant</th>
                <th className="pb-2 font-normal">Observed vs Standard</th>
                <th className="pb-2 font-normal">Violation Assessment</th>
                <th className="pb-2 font-normal">Statutory Penalty</th>
                <th className="pb-2 font-normal">Enforcement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-400/5">
              {INDUSTRIAL_CEMS_STATIONS.map((cems) => (
                <tr key={cems.id} className="hover:bg-white/5 transition">
                  <td className="py-3">
                    <div className="font-bold text-white">{cems.name}</div>
                    <div className="text-[10px] text-cyan-300">{cems.id}</div>
                  </td>
                  <td className="py-3 text-slate-300">{cems.ward}</td>
                  <td className="py-3 text-slate-200">{cems.pollutant}</td>
                  <td className="py-3 text-white font-bold">
                    {cems.actual} <span className="text-slate-500 font-normal">/ {cems.limit}</span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      cems.status.includes('VIOLATION') ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      cems.status.includes('TAMPER') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {cems.status}
                    </span>
                  </td>
                  <td className="py-3 text-rose-400 font-bold">{cems.fine}</td>
                  <td className="py-3">
                    {cems.fine !== '₹ 0' ? (
                      <button
                        onClick={() => issuePenalty(cems)}
                        className="rounded border border-rose-500/50 bg-rose-500/20 px-2.5 py-1 text-[11px] text-rose-200 hover:bg-rose-500/30 transition cursor-pointer"
                      >
                        Issue Penalty Order
                      </button>
                    ) : (
                      <span className="text-emerald-400 text-[11px]">Compliant</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
