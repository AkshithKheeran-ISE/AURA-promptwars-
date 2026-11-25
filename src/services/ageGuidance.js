/**
 * @file ageGuidance.js
 * Age-wise air-quality guidance, driven by the live snapshot already in
 * the app (PM2.5, US AQI, boundary-layer height).
 *
 * Honest basis — there are NO official per-age AQI breakpoints published
 * by any authority. This module does not invent any. It applies the
 * published frameworks, transparently:
 *
 * - US EPA (2024 AQI, effective 6 May 2024): children, older adults and
 *   people with heart/lung disease are "sensitive groups" — they feel
 *   effects one band earlier than healthy adults. EPA AirNow also lists
 *   children and teenagers (under 18) and pregnant people among the
 *   groups at greater risk, so teenagers 13–17 and pregnant people are
 *   treated as sensitive here too.
 *   EPA PM2.5 24-h band lower bounds: Good 0, Moderate 9.1, USG 35.5, Unhealthy 55.5, Very
 *   Unhealthy 125.5, Hazardous 225.5 µg/m³.
 *   Source: https://nepis.epa.gov/Exe/ZyPURL.cgi?Dockey=P101AP0Q.TXT
 * - WHO 2021 air-quality guideline: PM2.5 24-hour target 15 µg/m³.
 *   Source: https://www.who.int/teams/environment-climate-change-and-health/air-quality-and-health/health-impacts/types-of-pollutants
 * - CPCB India AQI bands are shown alongside for the Indian context
 *   (PM2.5 Good 0–30, Satisfactory 31–60, Moderately polluted 61–90,
 *   Poor 91–120, Very Poor 121–250, Severe 250+).
 *   Source: https://cpcb.gov.in (National Air Quality Index — About AQI)
 *
 * Model: each age group gets an "action ladder" of PM2.5 cut-offs taken
 * from the EPA band lower bounds. Sensitive groups (infants, children,
 * teenagers, older adults, pregnant people, and anyone with
 * asthma/heart/lung disease) climb the ladder one band earlier than
 * healthy adults. The result is guidance, not a medical diagnosis —
 * the UI says so. Outdoor-time minutes in the ladder are AURA's own
 * guidance, not EPA or WHO numbers: EPA advises shorter, less intense
 * activity with more breaks, without fixed minutes. The live PM2.5 is
 * an hourly reading, compared here with 24-hour EPA bands and the
 * WHO 24-hour target — the UI says "hourly reading" so that gap is
 * explicit.
 */

import { WHO_PM25_24H_TARGET } from '../constants';

/**
 * @typedef {object} AgeGuidance - Age-wise guidance for one live snapshot
 * @property {string} groupId
 * @property {string} groupLabel
 * @property {string} ageRange
 * @property {string} why
 * @property {boolean} sensitive
 * @property {string} level
 * @property {string} levelLabel
 * @property {string} color
 * @property {string} outdoorMinutes
 * @property {string} mask
 * @property {string} headline
 * @property {string} detail
 * @property {number} pm25
 * @property {number} whoMultiple
 */

/** EPA PM2.5 24-h band lower bounds (µg/m³), 2024 revision. */
export const EPA_PM25_BANDS = Object.freeze({
  MODERATE: 9.1,
  USG: 35.5,
  UNHEALTHY: 55.5,
  VERY_UNHEALTHY: 125.5,
  HAZARDOUS: 225.5
});

export const AGE_GROUPS = Object.freeze([
  {
    id: 'infant',
    label: 'Infants & toddlers',
    ageRange: '0–5 years',
    sensitivity: 'high',
    why: 'Immature lungs and a higher breathing rate per body weight.'
  },
  {
    id: 'child',
    label: 'Schoolchildren',
    ageRange: '6–12 years',
    sensitivity: 'high',
    why: 'Lungs still developing; more time outdoors and more active play.'
  },
  {
    id: 'teen',
    label: 'Teenagers',
    ageRange: '13–17 years',
    sensitivity: 'high',
    why: 'EPA lists children and teenagers among the sensitive groups; lungs are still developing.'
  },
  {
    id: 'adult',
    label: 'Healthy adults',
    ageRange: '18–59 years',
    sensitivity: 'standard',
    why: 'Standard EPA thresholds apply when no heart or lung condition exists.'
  },
  {
    id: 'senior',
    label: 'Older adults',
    ageRange: '60+ years',
    sensitivity: 'high',
    why: 'Ageing lungs and higher rates of heart and lung disease.'
  }
]);

const LEVELS = Object.freeze({
  safe: {
    id: 'safe',
    label: 'Safe for this age group',
    color: '#34d399',
    outdoorMinutes: 'No limit — normal outdoor activity',
    mask: 'No mask needed'
  },
  caution: {
    id: 'caution',
    label: 'Caution for this age group',
    color: '#fbbf24',
    outdoorMinutes: 'Up to 60 minutes outdoors; avoid heavy exertion',
    mask: 'No mask needed, keep one handy'
  },
  reduce: {
    id: 'reduce',
    label: 'Reduce outdoor time',
    color: '#fb923c',
    outdoorMinutes: 'Up to 30 minutes outdoors, light activity only',
    mask: 'Fitted N95 recommended outdoors'
  },
  avoid: {
    id: 'avoid',
    label: 'Avoid outdoor exertion',
    color: '#f87171',
    outdoorMinutes: 'Stay indoors; essential trips only',
    mask: 'Fitted N95 required for any time outdoors'
  },
  sealed: {
    id: 'sealed',
    label: 'Stay sealed indoors',
    color: '#f43f5e',
    outdoorMinutes: 'Do not go outdoors except in an emergency',
    mask: 'Fitted N95 required, even for a short trip'
  }
});

/**
 * The PM2.5 cut-offs (µg/m³) at which advice escalates, per sensitivity.
 * Sensitive groups use the EPA band lower bounds one step earlier.
 */
function cutoffsFor(sensitive) {
  return sensitive
    ? [
        WHO_PM25_24H_TARGET,
        EPA_PM25_BANDS.USG,
        EPA_PM25_BANDS.UNHEALTHY,
        EPA_PM25_BANDS.VERY_UNHEALTHY
      ]
    : [
        EPA_PM25_BANDS.USG,
        EPA_PM25_BANDS.UNHEALTHY,
        EPA_PM25_BANDS.VERY_UNHEALTHY,
        EPA_PM25_BANDS.HAZARDOUS
      ];
}

function levelFor(pm25, sensitive) {
  if (pm25 === null || pm25 === undefined || !Number.isFinite(Number(pm25))) return null;
  const value = Number(pm25);
  const [cautionAt, reduceAt, avoidAt, sealedAt] = cutoffsFor(sensitive);
  if (value < cautionAt) return LEVELS.safe;
  if (value < reduceAt) return LEVELS.caution;
  if (value < avoidAt) return LEVELS.reduce;
  if (value < sealedAt) return LEVELS.avoid;
  return LEVELS.sealed;
}

function detailFor(group, level, pm25, hasCondition, isPregnant) {
  const whoMultiple = Math.round((Number(pm25) / WHO_PM25_24H_TARGET) * 10) / 10;
  const base = `PM2.5 is ${pm25} µg/m³ in the latest hourly reading — ${whoMultiple}× the WHO 24-hour target of ${WHO_PM25_24H_TARGET} µg/m³. `;
  const conditionNote = hasCondition
    ? 'With asthma or a heart/lung condition, this group is treated as sensitive, so the advice is one step stricter. '
    : '';
  const pregnancyNote = isPregnant
    ? 'Pregnancy is treated as sensitive, so the advice is one step stricter. '
    : '';
  switch (level.id) {
    case 'safe':
      return `${base}Air is within the safe range for ${group.label.toLowerCase()} (${group.ageRange}). ${conditionNote}${pregnancyNote}Normal outdoor plans are fine.`;
    case 'caution':
      return `${base}Above the WHO target for ${group.label.toLowerCase()} (${group.ageRange}). ${conditionNote}${pregnancyNote}Shorter outdoor play and errands; watch for coughing or breathlessness.`;
    case 'reduce':
      return `${base}High enough that ${group.label.toLowerCase()} (${group.ageRange}) should cut outdoor time. ${conditionNote}${pregnancyNote}Keep exertion light and indoors where possible.`;
    case 'avoid':
      return `${base}At this level the US EPA classes the air unhealthy for sensitive groups. ${group.label} (${group.ageRange}) should avoid outdoor exertion. ${conditionNote}${pregnancyNote}If anyone must go out, a fitted N95 is required.`;
    default:
      return `${base}Severe air for ${group.label.toLowerCase()} (${group.ageRange}). ${conditionNote}${pregnancyNote}Stay sealed indoors with filtration running; go out only in an emergency.`;
  }
}

/**
 * Age-wise guidance for one live snapshot.
 * @param {string} groupId - One of AGE_GROUPS ids
 * @param {{ pm25?: number|string|null }|null} snapshot - Normalised live snapshot (needs pm25)
 * @param {{ hasCondition?: boolean, isPregnant?: boolean }} [options] - Asthma / heart / lung condition, and pregnancy (both make advice one step stricter)
 * @returns {AgeGuidance|null} Guidance, or null when there is no usable PM2.5
 */
export function guidanceForAgeGroup(groupId, snapshot, options = {}) {
  const group = AGE_GROUPS.find((g) => g.id === groupId) || AGE_GROUPS[3]; // AGE_GROUPS[3] is the adult group
  const pm25 = snapshot?.pm25 ?? null;
  const sensitive =
    group.sensitivity === 'high' || options.hasCondition === true || options.isPregnant === true;
  const level = levelFor(pm25, sensitive);
  if (!level) return null;
  return {
    groupId: group.id,
    groupLabel: group.label,
    ageRange: group.ageRange,
    why: group.why,
    sensitive,
    level: level.id,
    levelLabel: level.label,
    color: level.color,
    outdoorMinutes: level.outdoorMinutes,
    mask: level.mask,
    headline: `${level.label} — ${group.label} (${group.ageRange})`,
    detail: detailFor(
      group,
      level,
      pm25,
      options.hasCondition === true,
      options.isPregnant === true
    ),
    pm25: Number(pm25),
    whoMultiple: Math.round((Number(pm25) / WHO_PM25_24H_TARGET) * 10) / 10
  };
}

/**
 * Guidance for every age group at once, for comparison views.
 * @param {{ pm25?: number|string|null }|null} snapshot
 * @param {{ hasCondition?: boolean, isPregnant?: boolean }} [options]
 * @returns {Array<AgeGuidance>} One entry per age group (entries with no PM2.5 are omitted)
 */
export function guidanceForAllAges(snapshot, options = {}) {
  const out = [];
  for (const group of AGE_GROUPS) {
    const guidance = guidanceForAgeGroup(group.id, snapshot, options);
    if (guidance) out.push(guidance);
  }
  return out;
}
