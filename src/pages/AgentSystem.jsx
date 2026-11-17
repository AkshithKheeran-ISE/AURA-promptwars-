import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Terminal, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Activity,
  Sparkles
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useApp } from '../context/AppContext';
import { AI_AGENTS_ROSTER, SAMPLE_AI_QUERIES } from '../data/airData';

const KNOWLEDGE_BASE = {
  wazirpur: `[AURA-CORE · INFERENCE VERIFIED · Ed25519 Signed]
1. ROOT CAUSE ATTRIBUTION:
   - Primary PM2.5 spike (415 µg/m³) in Wazirpur Industrial Sector is caused by unpermitted electroplating and smelting operations operating between 18:00 - 22:00.
   - Spectral analysis by Sentinel-Air isolates heavy elemental sulfur and black carbon signatures (BC:PM2.5 ratio = 0.28).
2. METEOROLOGICAL COMPOUNDING FACTORS:
   - Boundary layer height has dropped to 80m (severe ground-level radiation inversion).
   - Surface wind speed is 3.2 km/h NW, causing particulate pooling in Anand Vihar and Wazirpur basins without horizontal ventilation.
3. ACTIONABLE DIRECTIVE:
   - Automated cutoff signal transmitted to CEMS-WZP-01 scrubber unit.
   - 4 High-pressure water mist cannons deployed to reduce ambient resuspension by ~35%.`,

  diesel: `[AURA-CORE · INFERENCE VERIFIED · Ed25519 Signed]
1. SIMULATION RESULTS:
   - Shutting down 80 unpermitted commercial diesel generator clusters (250kVA - 500kVA) across Wazirpur and Mayapuri will remove ~42 kg/hour of ultrafine soot and 18 kg/hour of toxic NO2.
2. DISPERSION IMPACT:
   - Instantaneous PM2.5 within 2 km radius will drop by 38 - 52 µg/m³ within 90 minutes.
   - Boundary layer Ozone formation potential during morning rush will decrease by 24%.
3. RECOMMENDATION:
   - Enforce Stage-IV GRAP power utility priority feed to commercial zones to eliminate generator usage.`,

  schools: `[AURA-CORE · INFERENCE VERIFIED · Ed25519 Signed]
1. PLUME DISPERSION ANALYSIS:
   - MeteoForecaster traces downwind plume trajectory (bearing 135° SE) across Trans-Yamuna corridor.
2. AT-RISK INSTITUTIONS:
   - 18 Primary and Secondary schools identified in high-exposure zone (predicted 24h PM2.5 > 280 µg/m³).
   - Priority Schools: Anand Vihar Model School, Preet Vihar Academy, Wazirpur Government Girls Senior Secondary.
3. ADVISORY ISSUED:
   - Automated Grade-A emergency alert dispatched to Delhi Directorate of Education: Suspend outdoor activities, activate centralized HEPA filtering, and mandate N95 masks on transit.`,

  inversion: `[AURA-CORE · INFERENCE VERIFIED · Ed25519 Signed]
1. BOUNDARY LAYER THERMAL PROFILES:
   - Nocturnal radiation cooling will compress surface mixing depth to 80m between 02:00 and 07:00 AM.
   - Strong temperature inversion of +4.2°C per 100m creates an atmospheric "lid", trapping 92% of ground-level vehicular emissions.
2. MORNING OUTLOOK:
   - Solar convective mixing will begin breaking the inversion at approximately 11:30 AM, elevating the boundary layer to ~380m by 14:00 PM.
   - Cleanest window for outdoor activity: 14:00 - 16:30.`,

  spoof: `[AURA-CORE · INFERENCE VERIFIED · Ed25519 Signed]
1. HARDWARE INTEGRITY AUDIT:
   - BioValidator and Zero-Trust Mesh flagged 1 optical sensor tampering event at Okhla Phase-III (Stack CEMS-OKH-04).
2. TAMPER PATTERN:
   - Optical gas chromatography packet injection attempted to falsify SO2 readings from 192 mg/Nm³ to 28 mg/Nm³.
   - Packet dropped due to invalid cryptographic HMAC signature. Automated Section 31A penalty notice generated.`
};

export default function AgentSystem() {
  const { addToast, logAudit } = useApp();

  const [messages, setMessages] = useState([
    {
      sender: 'sys',
      text: 'AURA Multi-Agent Command Terminal v4.2.1 initialized. TLS 1.3 channel established. Six autonomous atmospheric intelligence agents online. Select a query or ask anything.'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const handleSend = (queryText) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    logAudit('Analyst Akshith', `Submitted AI query: ${textToSend.slice(0, 30)}...`, 'AURA-CORE', 'human');

    setTimeout(() => {
      let reply = KNOWLEDGE_BASE.wazirpur;
      const lower = textToSend.toLowerCase();

      if (lower.includes('diesel') || lower.includes('generator')) reply = KNOWLEDGE_BASE.diesel;
      else if (lower.includes('school') || lower.includes('children')) reply = KNOWLEDGE_BASE.schools;
      else if (lower.includes('inversion') || lower.includes('ceiling') || lower.includes('temperature')) reply = KNOWLEDGE_BASE.inversion;
      else if (lower.includes('cems') || lower.includes('spoof') || lower.includes('tamper')) reply = KNOWLEDGE_BASE.spoof;

      setMessages(prev => [...prev, { sender: 'aura', text: reply }]);
      setIsThinking(false);
      addToast('Inference Complete', 'AURA-CORE validated multi-agent consensus', 'cyan');
    }, 1100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        eyebrow="07 · Explainable Intelligence"
        title="AURA AI · Atmospheric Multi-Agent System"
        desc="Six specialised environmental agents coordinated by a central orchestrator. Every inference is validated, explained and signed — not just an alert, a why."
      />

      {/* Main Row: Visual Multi-Agent Architecture (Left) + AI Command Terminal (Right) */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Left: Interactive Animated Agent Network Topology */}
        <div className="panel p-5 space-y-4 relative overflow-hidden">
          <div className="border-b border-cyan-400/10 pb-2 flex items-center justify-between">
            <div>
              <span className="label text-cyan-300">Neural Orchestration Topology</span>
              <h2 className="text-lg font-bold text-white">Autonomous Agent Mesh</h2>
            </div>
            <span className="font-mono text-xs text-emerald-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> 6 AGENTS ACTIVE
            </span>
          </div>

          {/* Animated SVG Diagram */}
          <div className="relative h-[440px] w-full grid-bg rounded-xl border border-cyan-400/15 overflow-hidden">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Lines from Central Orchestrator (50, 50) to 6 Agent satellites */}
              <line x1="50" y1="50" x2="20" y2="20" stroke="#22d3ee" strokeWidth="1" strokeDasharray="2 2" className="animate-dash" opacity="0.6" />
              <line x1="50" y1="50" x2="80" y2="20" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" className="animate-dash" opacity="0.6" />
              <line x1="50" y1="50" x2="15" y2="50" stroke="#34d399" strokeWidth="1" strokeDasharray="2 2" className="animate-dash" opacity="0.6" />
              <line x1="50" y1="50" x2="85" y2="50" stroke="#a855f7" strokeWidth="1" strokeDasharray="2 2" className="animate-dash" opacity="0.6" />
              <line x1="50" y1="50" x2="25" y2="80" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" className="animate-dash" opacity="0.6" />
              <line x1="50" y1="50" x2="75" y2="80" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" className="animate-dash" opacity="0.6" />
            </svg>

            {/* Central Orchestrator Core */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
              <div className="relative mx-auto grid h-24 w-36 place-items-center rounded-xl border-2 border-cyan-400/70 bg-[#08101e] shadow-glow p-2">
                <img src="/aura.svg" alt="AURA-CORE" className="h-8 w-8" />
                <div className="font-display text-xs font-black tracking-widest text-white mt-1">
                  AURA-CORE
                </div>
                <div className="font-mono text-[8px] text-cyan-300">CENTRAL ORCHESTRATOR</div>
              </div>
            </div>

            {/* Satellite Agent 1: AerosolNet (Top Left) */}
            <div className="absolute left-[10%] top-[12%] text-center">
              <div className="p-2 rounded-lg border border-cyan-400/40 bg-[#0c182c] shadow-md font-mono text-[10px] space-y-0.5">
                <div className="text-cyan-300 font-bold">AerosolNet</div>
                <div className="text-[8px] text-slate-400">Satellite AOD</div>
              </div>
            </div>

            {/* Satellite Agent 2: Sentinel-Air (Top Right) */}
            <div className="absolute right-[10%] top-[12%] text-center">
              <div className="p-2 rounded-lg border border-rose-500/40 bg-[#0c182c] shadow-md font-mono text-[10px] space-y-0.5">
                <div className="text-rose-400 font-bold">Sentinel-Air</div>
                <div className="text-[8px] text-slate-400">Plume Detector</div>
              </div>
            </div>

            {/* Satellite Agent 3: BioValidator (Mid Left) */}
            <div className="absolute left-[3%] top-[45%] text-center">
              <div className="p-2 rounded-lg border border-emerald-400/40 bg-[#0c182c] shadow-md font-mono text-[10px] space-y-0.5">
                <div className="text-emerald-300 font-bold">BioValidator</div>
                <div className="text-[8px] text-slate-400">Physics Filter</div>
              </div>
            </div>

            {/* Satellite Agent 4: MeteoForecaster (Mid Right) */}
            <div className="absolute right-[3%] top-[45%] text-center">
              <div className="p-2 rounded-lg border border-purple-500/40 bg-[#0c182c] shadow-md font-mono text-[10px] space-y-0.5">
                <div className="text-purple-300 font-bold">MeteoForecaster</div>
                <div className="text-[8px] text-slate-400">Inversion Model</div>
              </div>
            </div>

            {/* Satellite Agent 5: EmergencyResponder (Bottom Left) */}
            <div className="absolute left-[12%] bottom-[12%] text-center">
              <div className="p-2 rounded-lg border border-amber-400/40 bg-[#0c182c] shadow-md font-mono text-[10px] space-y-0.5">
                <div className="text-amber-300 font-bold">Responder</div>
                <div className="text-[8px] text-slate-400">GRAP Playbook</div>
              </div>
            </div>

            {/* Satellite Agent 6: PolicyAuditor (Bottom Right) */}
            <div className="absolute right-[12%] bottom-[12%] text-center">
              <div className="p-2 rounded-lg border border-sky-400/40 bg-[#0c182c] shadow-md font-mono text-[10px] space-y-0.5">
                <div className="text-sky-300 font-bold">PolicyAuditor</div>
                <div className="text-[8px] text-slate-400">Fine Calculator</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interactive AI Command Terminal */}
        <div className="panel panel-corners p-5 space-y-3 flex flex-col justify-between">
          <div>
            <div className="border-b border-cyan-400/10 pb-2 flex items-center justify-between">
              <div>
                <span className="label text-cyan-300">Natural Language Inference</span>
                <h2 className="text-lg font-bold text-white">AURA Environmental Terminal</h2>
              </div>
              <Terminal className="h-4 w-4 text-cyan-400" />
            </div>

            {/* Clickable Sample Queries */}
            <div className="py-2 space-y-1">
              <div className="label text-[9px] text-slate-500">Sample Inquiries:</div>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_AI_QUERIES.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="rounded bg-[#030712] border border-cyan-400/20 px-2.5 py-1 text-[11px] font-mono text-slate-300 hover:border-cyan-400/60 hover:text-cyan-200 transition cursor-pointer text-left truncate max-w-full"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Log Window */}
            <div className="h-72 space-y-3 overflow-y-auto rounded-lg bg-black/50 p-4 font-mono text-xs border border-cyan-400/15">
              {messages.map((m, idx) => (
                <div 
                  key={idx} 
                  className={`space-y-1 ${m.sender === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {m.sender === 'user' ? 'ANALYST AKSHITH' : m.sender === 'sys' ? 'SYSTEM' : 'AURA-CORE (AI AGENT)'}
                  </div>
                  <div 
                    className={`inline-block rounded-lg p-3 text-left leading-relaxed whitespace-pre-wrap ${
                      m.sender === 'user'
                        ? 'bg-cyan-400/20 text-cyan-100 border border-cyan-400/40'
                        : m.sender === 'sys'
                        ? 'bg-[#0c182c] text-slate-300 border border-cyan-400/10'
                        : 'bg-[#08101e] text-slate-100 border border-cyan-400/30'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {isThinking && (
                <div className="flex items-center gap-2 text-cyan-300 text-xs">
                  <Sparkles className="h-4 w-4 animate-spin" />
                  <span>AURA agents cross-validating satellite & sensor telemetry...</span>
                </div>
              )}
            </div>
          </div>

          {/* Terminal Input Bar */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="flex items-center gap-2 border-t border-cyan-400/10 pt-3"
          >
            <span className="font-mono text-cyan-400 font-bold">&gt;</span>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask AURA to diagnose any ward or simulate policy decisions..."
              className="flex-1 bg-transparent font-mono text-xs text-white placeholder:text-slate-600 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-cyan-400 p-2 text-black hover:bg-cyan-300 transition cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Agent Roster Grid */}
      <div className="panel p-5 space-y-3">
        <div className="border-b border-cyan-400/10 pb-3 flex items-center justify-between">
          <div>
            <span className="label text-cyan-300">Deployment Status</span>
            <h2 className="text-lg font-bold text-white">Active Autonomous Agent Roster</h2>
          </div>
          <span className="font-mono text-xs text-slate-400">Zero-Trust Microservices</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {AI_AGENTS_ROSTER.map((agent) => (
            <div 
              key={agent.id} 
              className="p-4 rounded-xl border border-cyan-400/10 bg-[#030712] space-y-2 font-mono text-xs hover:border-cyan-400/30 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm" style={{ color: agent.avatarColor }}>
                  {agent.name}
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-400/15 px-2 py-0.5 rounded font-bold">
                  {agent.status}
                </span>
              </div>

              <div className="text-cyan-300 text-[11px] font-semibold">{agent.role}</div>
              <p className="text-slate-400 font-sans text-xs leading-relaxed">{agent.desc}</p>

              <div className="flex justify-between pt-2 border-t border-cyan-400/10 text-[10px] text-slate-500">
                <span>Inferences: {agent.tasksHandled}</span>
                <span>Latency: {agent.latency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
