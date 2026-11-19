import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { WARDS_DATA } from '../../data/airData';

const HAZARD_CATEGORIES = [
  'Open Waste & Garbage Burning',
  'Visible Black Factory Chimney Smoke',
  'Uncovered Demolition & Construction Dust',
  'Noxious Chemical / Acidic Odor',
  'Illegal High-Capacity Diesel Genset'
];

function HazardCategorySelect({ value, onChange }) {
  return (
    <div>
      <label htmlFor="rep-issue-type" className="text-slate-400 block mb-1">
        Hazard Category:
      </label>
      <select
        id="rep-issue-type"
        aria-label="Select hazard category"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-cyan-400/20 bg-[#0c182c] px-3 py-2 text-white focus:outline-none"
      >
        {HAZARD_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}

HazardCategorySelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

function ReporterUrgencyInputs({ reporter, urgency, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label htmlFor="rep-reporter" className="text-slate-400 block mb-1">
          Reporter Name/Role:
        </label>
        <input
          id="rep-reporter"
          type="text"
          placeholder="e.g. Resident Welfare"
          value={reporter}
          onChange={(e) => onChange('reporter', e.target.value)}
          className="w-full rounded-lg border border-cyan-400/20 bg-[#0c182c] px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="rep-urgency" className="text-slate-400 block mb-1">
          Urgency:
        </label>
        <select
          id="rep-urgency"
          aria-label="Select report urgency"
          value={urgency}
          onChange={(e) => onChange('urgency', e.target.value)}
          className="w-full rounded-lg border border-cyan-400/20 bg-[#0c182c] px-3 py-2 text-white focus:outline-none"
        >
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
    </div>
  );
}

ReporterUrgencyInputs.propTypes = {
  reporter: PropTypes.string.isRequired,
  urgency: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

function ReportDetailsInput({ description, onChange }) {
  return (
    <>
      <div>
        <label htmlFor="rep-description" className="text-slate-400 block mb-1">
          Observations & Specifics:
        </label>
        <textarea
          id="rep-description"
          rows={3}
          placeholder="What did you observe? e.g. Thick rubber fumes smoldering near railway underpass..."
          value={description}
          onChange={(e) => onChange('description', e.target.value)}
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
    </>
  );
}

ReportDetailsInput.propTypes = {
  description: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

/**
 * Form for submitting and cryptographically signing citizen air hazard reports.
 */
export default function ReportForm({ onSubmitReport, merkleRootHex }) {
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

    onSubmitReport({
      location: formData.location,
      issue: `${formData.issueType} — ${formData.description}`,
      reporter: formData.reporter || 'Anonymous Resident',
      urgency: formData.urgency
    });

    setFormData({
      location: 'Wazirpur Industrial Sector',
      issueType: 'Open Waste & Garbage Burning',
      reporter: '',
      urgency: 'High',
      description: ''
    });
  };

  const handleFieldChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <div className="panel p-5 space-y-4">
      <div className="border-b border-cyan-400/10 pb-2">
        <span className="label text-cyan-300">File Community Hazard</span>
        <h2 className="text-lg font-bold text-white">Cryptographic Citizen Report</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 font-mono text-xs">
        <div>
          <label htmlFor="rep-ward-select" className="text-slate-400 block mb-1">
            Ward Location:
          </label>
          <select
            id="rep-ward-select"
            aria-label="Select ward location"
            value={formData.location}
            onChange={(e) => handleFieldChange('location', e.target.value)}
            className="w-full rounded-lg border border-cyan-400/20 bg-[#0c182c] px-3 py-2 text-white focus:outline-none"
          >
            {WARDS_DATA.map((w) => (
              <option key={w.id} value={w.name}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        <HazardCategorySelect
          value={formData.issueType}
          onChange={(val) => handleFieldChange('issueType', val)}
        />

        <ReporterUrgencyInputs
          reporter={formData.reporter}
          urgency={formData.urgency}
          onChange={handleFieldChange}
        />

        <ReportDetailsInput description={formData.description} onChange={handleFieldChange} />
      </form>

      <div className="pt-2 border-t border-cyan-400/10 font-mono text-[10px] text-slate-400 truncate">
        Merkle Root: 0x{merkleRootHex.slice(0, 16)}...
      </div>
    </div>
  );
}

ReportForm.propTypes = {
  onSubmitReport: PropTypes.func.isRequired,
  merkleRootHex: PropTypes.string.isRequired
};
