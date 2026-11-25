import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CloudSun, RefreshCw, Search, Wind } from 'lucide-react';
import { useLiveAirQuality } from '../../hooks/useLiveAirQuality';
import { deriveVentilationAdvice, explainImpact } from '../../services/liveAirQuality';
import AgeGuidance from './AgeGuidance';

function Metric({ label, value, unit }) {
  return (
    <div className="rounded-lg border border-cyan-400/15 bg-[#030712] p-3">
      <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-1 font-mono text-lg font-bold text-white">
        {value === null || value === undefined ? '—' : value}
        {value !== null && value !== undefined && unit ? (
          <span className="ml-1 text-[10px] font-normal text-slate-400">{unit}</span>
        ) : null}
      </div>
    </div>
  );
}

Metric.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  unit: PropTypes.string
};
Metric.defaultProps = { value: null, unit: '' };

function CitySearch({ live }) {
  const [query, setQuery] = useState('');
  const onSubmit = (event) => {
    event.preventDefault();
    live.search(query);
  };
  return (
    <div className="space-y-2">
      <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-2">
        <div className="min-w-52 flex-1">
          <label htmlFor="live-city-search" className="mb-1 block text-xs text-slate-300">
            Search your city
          </label>
          <input
            id="live-city-search"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="e.g. Mumbai, London, New York"
            autoComplete="off"
            className="w-full rounded-lg border border-cyan-400/20 bg-[#0c182c] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
        <button
          type="submit"
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-cyan-400 px-3 py-2 font-mono text-xs font-bold text-black transition hover:bg-cyan-300"
        >
          <Search className="h-3.5 w-3.5" /> Search city
        </button>
      </form>
      {live.searching ? (
        <p className="text-xs text-slate-400" role="status">
          Searching free geocoding…
        </p>
      ) : null}
      {live.searchResults.length > 0 ? (
        <ul className="space-y-1" aria-label="City search results">
          {live.searchResults.map((result) => {
            const label = [result.name, result.admin1, result.country].filter(Boolean).join(', ');
            return (
              <li key={`${result.latitude},${result.longitude},${label}`}>
                <button
                  type="button"
                  onClick={() => live.selectPlace(result)}
                  className="w-full cursor-pointer rounded-lg border border-cyan-400/15 bg-[#030712] px-3 py-2 text-left text-xs text-slate-200 transition hover:bg-cyan-400/10"
                >
                  {label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

CitySearch.propTypes = { live: PropTypes.object.isRequired };

function SnapshotView({ snapshot }) {
  const advice = deriveVentilationAdvice(snapshot);
  const impact = explainImpact(snapshot);
  const category = snapshot.category;
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-slate-400">
            US AQI · {snapshot.placeName}
            {snapshot.country ? `, ${snapshot.country}` : ''}
          </div>
          <div
            className="font-display text-5xl font-black"
            style={{ color: category?.color || '#f1f5f9' }}
          >
            {snapshot.usAqi ?? '—'}
          </div>
        </div>
        <div className="min-w-56 flex-1">
          <div className="text-sm font-bold text-white">{category?.label || 'Unknown'}</div>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">{category?.guidance || ''}</p>
          <p className="mt-1 font-mono text-[10px] text-slate-400">
            Observed {snapshot.observedAt} · {snapshot.timezone} · Source: {snapshot.sourceLabel}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <Metric label="PM2.5" value={snapshot.pm25} unit="µg/m³" />
        <Metric label="PM10" value={snapshot.pm10} unit="µg/m³" />
        <Metric label="NO₂" value={snapshot.no2} unit="µg/m³" />
        <Metric label="Ozone" value={snapshot.o3} unit="µg/m³" />
        <Metric label="CO" value={snapshot.coMgM3} unit="mg/m³" />
        <Metric label="Boundary layer" value={snapshot.boundaryLayerHeightM} unit="m" />
        <Metric label="Wind" value={snapshot.windSpeedKmh} unit="km/h" />
        <Metric label="Temperature" value={snapshot.temperatureC} unit="°C" />
      </div>

      <div
        className="rounded-lg border border-cyan-400/15 bg-[#030712] p-3"
        aria-label="Ventilation advice"
      >
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
          <Wind className="h-4 w-4" /> {advice.headline}
        </div>
        <p className="mt-1 text-xs leading-relaxed text-slate-300">{advice.detail}</p>
      </div>

      <AgeGuidance snapshot={snapshot} />

      {impact ? (
        <p className="text-xs leading-relaxed text-slate-300">
          <strong className="text-white">Direct impact, explained:</strong> breathing this air
          unprotected for a day inhales about {impact.unprotectedUg} µg of PM2.5 (
          {impact.whoMultiple}× the WHO 24-hour target). Sealing the home and running filtration
          cuts that to about {impact.protectedUg} µg — avoiding roughly {impact.avoidedUg} µg every
          day for each adult.
        </p>
      ) : null}
    </div>
  );
}

SnapshotView.propTypes = { snapshot: PropTypes.object.isRequired };

const STATUS_BADGES = {
  live: { text: 'LIVE', className: 'bg-emerald-400/15 text-emerald-300' },
  loading: { text: 'LOADING', className: 'bg-amber-400/15 text-amber-300' },
  error: { text: 'OFFLINE — SHOWING BASELINE', className: 'bg-rose-400/15 text-rose-300' },
  idle: { text: 'READY', className: 'bg-slate-400/15 text-slate-300' }
};

/**
 * Live air-quality panel: real data for the user's own city from free,
 * key-less Open-Meteo/CAMS APIs, with a clear fallback message when the
 * network is unavailable. `liveOverride` exists for tests and previews.
 * @param {{ liveOverride?: object }} props
 */
export default function LiveAirQualityPanel({ liveOverride }) {
  const hookLive = useLiveAirQuality();
  /** @type {any} */
  const live = liveOverride || hookLive;
  const badge = STATUS_BADGES[live.status] || STATUS_BADGES.idle;
  return (
    <section
      aria-labelledby="live-air-quality-heading"
      className="panel space-y-4 border border-cyan-400/20 bg-[#08101e]/80 p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2
          id="live-air-quality-heading"
          className="flex items-center gap-2 text-sm font-bold tracking-wide text-cyan-300 uppercase"
        >
          <CloudSun className="h-4 w-4" /> Live air quality for your city
        </h2>
        <div className="flex items-center gap-2">
          <span
            className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${badge.className}`}
            role="status"
          >
            {badge.text}
          </span>
          <button
            type="button"
            onClick={live.refresh}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-cyan-400/20 px-2.5 py-1 font-mono text-[11px] text-cyan-300 transition hover:bg-cyan-400/10"
          >
            <RefreshCw className="h-3 w-3" /> Refresh live data
          </button>
        </div>
      </div>

      <CitySearch live={live} />

      {live.status === 'error' ? (
        <p className="text-xs leading-relaxed text-rose-200" role="alert">
          Live data could not be loaded ({live.error || 'network unavailable'}). AURA is showing its
          statutory CPCB baseline wards below instead — nothing here is presented as live.
        </p>
      ) : null}
      {live.status === 'loading' && !live.snapshot ? (
        <p className="text-xs text-slate-400" role="status">
          Loading live air quality from the free Open-Meteo / CAMS APIs…
        </p>
      ) : null}
      {live.snapshot ? <SnapshotView snapshot={live.snapshot} /> : null}
    </section>
  );
}

LiveAirQualityPanel.propTypes = { liveOverride: PropTypes.object };
LiveAirQualityPanel.defaultProps = { liveOverride: null };
