import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Users } from 'lucide-react';
import { AGE_GROUPS, guidanceForAgeGroup } from '../../services/ageGuidance';

/**
 * Age-wise guidance for the live air: the same PM2.5 reading means
 * different things for an infant, a schoolchild, a teenager, a healthy
 * adult and an older adult, so the user picks who the advice is for and
 * the panel answers from the live snapshot already loaded. Every value
 * comes from the snapshot — nothing here is a guess about the user's
 * household. Pregnancy and asthma / heart / lung condition are separate
 * toggles that each make the advice one step stricter. Outdoor-time
 * minutes are AURA guidance, not EPA numbers, and the panel says so.
 * Fully keyboard-usable: native buttons and checkbox, pressed state
 * announced, results in a polite live region, meaning carried by text
 * as well as colour.
 */
export default function AgeGuidance({ snapshot }) {
  const [groupId, setGroupId] = useState('adult');
  const [hasCondition, setHasCondition] = useState(false);
  const [isPregnant, setIsPregnant] = useState(false);
  const guidance = guidanceForAgeGroup(groupId, snapshot, { hasCondition, isPregnant });
  if (!guidance) return null;

  return (
    <div
      className="rounded-lg border border-cyan-400/15 bg-[#030712] p-4"
      aria-label="Age-wise air quality guidance"
    >
      <h3 className="flex items-center gap-2 text-xs font-bold text-cyan-300">
        <Users className="h-4 w-4" /> Who is this advice for?
      </h3>

      <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label="Choose age group">
        {AGE_GROUPS.map((group) => (
          <button
            key={group.id}
            type="button"
            aria-pressed={groupId === group.id}
            onClick={() => setGroupId(group.id)}
            className={`cursor-pointer rounded-lg border px-3 py-1.5 text-left font-mono text-xs transition ${
              groupId === group.id
                ? 'border-cyan-400 bg-cyan-400/20 font-bold text-cyan-200'
                : 'border-cyan-400/15 text-slate-300 hover:bg-white/5'
            }`}
          >
            {group.label}
            <span className="block text-[10px] font-normal text-slate-400">{group.ageRange}</span>
          </button>
        ))}
      </div>

      <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs text-slate-300">
        <input
          type="checkbox"
          checked={hasCondition}
          onChange={(event) => setHasCondition(event.target.checked)}
          className="h-4 w-4 accent-cyan-400"
        />
        Asthma, heart or lung condition in this group (advice gets one step stricter)
      </label>

      <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-slate-300">
        <input
          type="checkbox"
          checked={isPregnant}
          onChange={(event) => setIsPregnant(event.target.checked)}
          className="h-4 w-4 accent-cyan-400"
        />
        Pregnant (advice gets one step stricter)
      </label>

      <div aria-live="polite" className="mt-3 space-y-1 border-t border-cyan-400/10 pt-3">
        <div className="text-sm font-bold text-white">
          <span style={{ color: guidance.color }}>{guidance.levelLabel}</span>
          {' — '}
          {guidance.groupLabel} ({guidance.ageRange})
        </div>
        <p className="text-xs leading-relaxed text-slate-300">{guidance.detail}</p>
        <dl className="grid gap-2 pt-1 text-xs sm:grid-cols-2">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
              Outdoor time
            </dt>
            <dd className="font-bold text-white">{guidance.outdoorMinutes}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-slate-400">Mask</dt>
            <dd className="font-bold text-white">{guidance.mask}</dd>
          </div>
        </dl>
        <p className="pt-1 font-mono text-[10px] text-slate-400">
          Why this group: {guidance.why} Guidance, not medical advice — based on the US EPA
          sensitive-groups framework and the WHO 2021 PM2.5 target. Outdoor-time minutes are AURA
          guidance (EPA advises shorter, less intense activity with more breaks, without fixed
          minutes). Outdoor workers: treat as sensitive — use a stricter toggle if you work
          outdoors.
        </p>
      </div>
    </div>
  );
}

AgeGuidance.propTypes = { snapshot: PropTypes.object.isRequired };
