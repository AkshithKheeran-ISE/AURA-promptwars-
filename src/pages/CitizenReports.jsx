import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, RotateCcw, Lock } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useApp } from '../context/AppContext';
import { validateCitizenReport, computeMerkleRoot } from '../utils/sanitize';

export default function CitizenReports() {
  const {
    citizenReports,
    addCitizenReport,
    advanceReportStage,
    simulateTamper,
    verifyLedger,
    ledgerTampered,
    addToast
  } = useApp();

  const [formData, setFormData] = useState({
    location: 'Wazirpur Industrial Sector',
    issueType: 'Open Waste & Garbage Burning',
    reporter: '',
    urgency: 'High',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description.trim()) return;

    const rawPayload = {
      location: formData.location,
      issue: `${formData.issueType} — ${formData.description}`,
      reporter: formData.reporter || 'Anonymous Resident',
      urgency: formData.urgency
    };

    const validation = validateCitizenReport(rawPayload);
    if (!validation.isValid) {
      addToast('Validation Error', validation.errors[0] || 'Invalid report fields', 'rose');
      return;
    }

    addCitizenReport(validation.sanitized);

    setFormData({
      location: 'Wazirpur Industrial Sector',
      issueType: 'Open Waste & Garbage Burning',
      reporter: '',
      urgency: 'High',
      description: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        eyebrow="06 · Community Signal"
        title="Secure Citizen Air & Smog Reports"
        desc="Every shoreline and ward observation is hashed with SHA-256 and chained to the previous one — a tamper-evident ledger, so no report can be silently altered or deleted."
        right={
          <div className="flex items-center gap-2">
            <button
              onClick={simulateTamper}
              className="flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/20 px-3 py-1.5 font-mono text-xs text-rose-200 hover:bg-rose-500/30 transition cursor-pointer"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              Simulate Tamper
            </button>
            <button
              onClick={verifyLedger}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-400/40 bg-emerald-400/20 px-3 py-1.5 font-mono text-xs text-emerald-200 hover:bg-emerald-400/30 transition cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Verify Ledger
            </button>
          </div>
        }
      />

      {/* Tamper Warning Banner if ledger is tampered */}
      {ledgerTampered && (
        <div className="panel p-4 border-rose-500 bg-rose-500/20 text-rose-200 shadow-glow-red flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-6 w-6 text-rose-400 shrink-0 animate-pulse" />
            <div>
              <div className="font-bold text-sm">SECURITY ALERT: Cryptographic Chain Broken!</div>
              <div className="text-xs font-mono text-rose-300">
                Block #2 payload was modified out-of-band. The recalculated SHA-256 hash does not
                match next block&apos;s prevHash pointer.
              </div>
            </div>
          </div>
          <button
            onClick={verifyLedger}
            className="rounded bg-rose-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-600 transition cursor-pointer shrink-0 font-mono"
          >
            Re-verify & Restore
          </button>
        </div>
      )}

      {/* Main Grid: Report Form (Left) + Cryptographic Chain Visualization (Right) */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left: Log a shoreline/ward report form */}
        <div className="panel p-5 space-y-4">
          <div className="border-b border-cyan-400/10 pb-2">
            <span className="label text-cyan-300">Incident Intake</span>
            <h2 className="text-lg font-bold text-white">Log Air Hazard Observation</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs font-mono">
            <div>
              <label htmlFor="rep-location" className="text-slate-400 block mb-1">
                Ward / Location:
              </label>
              <select
                id="rep-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-lg border border-cyan-400/20 bg-[#0c182c] px-3 py-2 text-white focus:outline-none"
              >
                <option value="Wazirpur Industrial Sector">Wazirpur Industrial Sector</option>
                <option value="Anand Vihar Transit Terminal">Anand Vihar Transit Terminal</option>
                <option value="Okhla Phase-III Industrial">Okhla Phase-III Industrial</option>
                <option value="Rohini Outer Ring Road">Rohini Outer Ring Road</option>
                <option value="Mayapuri Scrap Market">Mayapuri Scrap Market</option>
                <option value="Riverfront East Yamuna">Riverfront East Yamuna</option>
              </select>
            </div>

            <div>
              <label htmlFor="rep-issue-type" className="text-slate-400 block mb-1">
                Hazard Category:
              </label>
              <select
                id="rep-issue-type"
                value={formData.issueType}
                onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                className="w-full rounded-lg border border-cyan-400/20 bg-[#0c182c] px-3 py-2 text-white focus:outline-none"
              >
                <option value="Open Waste & Garbage Burning">Open Waste & Garbage Burning</option>
                <option value="Visible Black Factory Chimney Smoke">
                  Visible Black Factory Chimney Smoke
                </option>
                <option value="Uncovered Demolition & Construction Dust">
                  Uncovered Demolition & Construction Dust
                </option>
                <option value="Noxious Chemical / Acidic Odor">
                  Noxious Chemical / Acidic Odor
                </option>
                <option value="Illegal High-Capacity Diesel Genset">
                  Illegal High-Capacity Diesel Genset
                </option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="rep-reporter" className="text-slate-400 block mb-1">
                  Reporter Name/Role:
                </label>
                <input
                  id="rep-reporter"
                  type="text"
                  placeholder="e.g. Resident Welfare"
                  value={formData.reporter}
                  onChange={(e) => setFormData({ ...formData, reporter: e.target.value })}
                  className="w-full rounded-lg border border-cyan-400/20 bg-[#0c182c] px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="rep-urgency" className="text-slate-400 block mb-1">
                  Urgency:
                </label>
                <select
                  id="rep-urgency"
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  className="w-full rounded-lg border border-cyan-400/20 bg-[#0c182c] px-3 py-2 text-white focus:outline-none"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="rep-description" className="text-slate-400 block mb-1">
                Observations & Specifics:
              </label>
              <textarea
                id="rep-description"
                rows="3"
                placeholder="What did you observe? e.g. Thick rubber fumes smoldering near railway underpass..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="w-full rounded-lg border border-cyan-400/20 bg-[#0c182c] px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-cyan-400 py-2.5 font-sans text-xs font-bold text-black shadow-glow hover:bg-cyan-300 transition cursor-pointer"
            >
              Sign & Hash to Immutable Ledger &rarr;
            </button>
          </form>
        </div>

        {/* Right: Cryptographic Hash Chain Visualization (2 Cols) */}
        <div className="panel p-5 xl:col-span-2 space-y-4">
          <div className="border-b border-cyan-400/10 pb-2 flex items-center justify-between">
            <div>
              <span className="label text-emerald-400">Cryptographic Integrity</span>
              <h2 className="text-lg font-bold text-white">SHA-256 Hash-Chained Blocks</h2>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
              <Lock className="h-3.5 w-3.5 text-cyan-400" />
              <span>Chain Depth: {citizenReports.length} Blocks</span>
            </div>
          </div>

          {/* Horizontal Hash Chain Cards */}
          <div className="flex gap-3 overflow-x-auto pb-3 pt-1">
            {citizenReports.map((rep, idx) => {
              const isCorrupt = ledgerTampered && idx === 1;

              return (
                <div
                  key={rep.id}
                  className={`w-72 shrink-0 p-3.5 rounded-xl border font-mono text-xs space-y-2 transition relative ${
                    isCorrupt
                      ? 'border-rose-500 bg-rose-500/20 shadow-glow-red animate-pulse'
                      : 'border-cyan-400/20 bg-[#030712] hover:border-cyan-400/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300">BLOCK #{idx + 1}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${isCorrupt ? 'bg-rose-500 text-white' : 'bg-emerald-400/15 text-emerald-300'}`}
                    >
                      {isCorrupt ? 'TAMPERED' : 'VALIDATED'}
                    </span>
                  </div>

                  <div className="text-xs text-white font-sans font-semibold line-clamp-2">
                    {rep.issue}
                  </div>

                  <div className="text-[10px] text-slate-400">
                    <div>
                      {rep.reporter} · {rep.location}
                    </div>
                  </div>

                  {/* Hash readouts */}
                  <div className="text-[10px] space-y-1 pt-1 border-t border-cyan-400/10">
                    <div className="truncate text-slate-500">
                      <span className="text-slate-400">prev:</span> {rep.prevHash.slice(0, 16)}...
                    </div>
                    <div
                      className={`truncate ${isCorrupt ? 'text-rose-400 font-bold' : 'text-cyan-300'}`}
                    >
                      <span className="text-slate-400">hash:</span> {rep.hash.slice(0, 16)}...
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg bg-[#030712] p-3 border border-cyan-400/10 flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="truncate max-w-[60%]">
              Merkle Root: 0x{computeMerkleRoot(citizenReports.map((r) => r.hash)).slice(0, 32)}...
            </span>
            <span className="text-emerald-400 flex items-center gap-1 shrink-0">
              <CheckCircle2 className="h-3.5 w-3.5" /> Immutable Audit Ledger Online
            </span>
          </div>
        </div>
      </div>

      {/* Recent Citizen Reports Table */}
      <div className="panel p-5 space-y-3">
        <div className="border-b border-cyan-400/10 pb-3 flex items-center justify-between">
          <div>
            <span className="label text-cyan-300">Workflow Tracker</span>
            <h2 className="text-lg font-bold text-white">Active Community Air Reports</h2>
          </div>
          <span className="font-mono text-xs text-slate-400">
            Total Reports: {citizenReports.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-cyan-400/10 text-slate-500">
                <th className="pb-2 font-normal">Report ID</th>
                <th className="pb-2 font-normal">Issue Description</th>
                <th className="pb-2 font-normal">Ward Location</th>
                <th className="pb-2 font-normal">Reporter</th>
                <th className="pb-2 font-normal">SHA-256 Hash</th>
                <th className="pb-2 font-normal">Stage Workflow</th>
                <th className="pb-2 font-normal">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-400/5">
              {citizenReports
                .slice()
                .reverse()
                .map((rep) => (
                  <tr key={rep.id} className="hover:bg-white/5 transition">
                    <td className="py-3 text-cyan-300 font-bold">{rep.id}</td>
                    <td className="py-3 text-white font-sans max-w-xs truncate">{rep.issue}</td>
                    <td className="py-3 text-slate-300">{rep.location}</td>
                    <td className="py-3 text-slate-400">{rep.reporter}</td>
                    <td className="py-3 text-slate-500 font-mono text-[10px]">
                      {rep.hash.slice(0, 12)}...
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`h-2 w-5 rounded-sm ${
                              step <= rep.stage ? 'bg-cyan-400' : 'bg-slate-700'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-[10px] text-slate-300 font-sans">
                          {rep.statusText}
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      {rep.stage < 4 ? (
                        <button
                          onClick={() => advanceReportStage(rep.id)}
                          aria-label={`Advance triage stage for report ${rep.id}`}
                          className="text-cyan-300 hover:underline font-mono text-[11px] cursor-pointer flex items-center gap-1"
                        >
                          Advance &rarr;
                        </button>
                      ) : (
                        <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Resolved
                        </span>
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
