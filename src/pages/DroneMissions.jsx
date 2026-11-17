import React from 'react';
import { 
  Radio, 
  Plane, 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldCheck, 
  Battery, 
  Compass, 
  Wind, 
  Layers, 
  CheckCircle2, 
  Eye, 
  Target
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { useApp } from '../context/AppContext';
import { DRONE_MISSION_DATA } from '../data/airData';

export default function DroneMissions() {
  const { 
    droneMissionStatus, 
    setDroneMissionStatus, 
    addToast, 
    logAudit 
  } = useApp();

  const handlePause = () => {
    setDroneMissionStatus('PAUSED');
    addToast('Mission Paused', 'UAV Sentinel-Air-01 holding stationary hover at 85m', 'amber');
    logAudit('Drone Controller', 'Issued mission hover hold to UAV Sentinel-Air-01', 'UAV-01', 'human');
  };

  const handleResume = () => {
    setDroneMissionStatus('IN FLIGHT');
    addToast('Mission Resumed', 'UAV Sentinel-Air-01 continuing waypoint corridor sweep', 'cyan');
    logAudit('Drone Controller', 'Resumed waypoint patrol flight for UAV Sentinel-Air-01', 'UAV-01', 'human');
  };

  const handleReturn = () => {
    setDroneMissionStatus('RETURNING TO DOCK');
    addToast('RTH Initiated', 'UAV Sentinel-Air-01 returning to Civil Lines automated dock', 'green');
    logAudit('Drone Controller', 'Ordered Return-to-Home (RTH) for UAV Sentinel-Air-01', 'UAV-01', 'human');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <SectionHeader
        eyebrow="09 · Autonomous Ops"
        title="Autonomous Air Quality Drone Mission Control"
        desc="Uncrewed aerial vehicles patrolling the metropolitan sky over an encrypted, authenticated command link — commands are signed so tampering or hijacking is impossible."
        right={
          <div className="flex items-center gap-2">
            {droneMissionStatus === 'IN FLIGHT' ? (
              <button
                onClick={handlePause}
                className="flex items-center gap-1.5 rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 font-mono text-xs text-amber-300 hover:bg-amber-400/20 transition cursor-pointer"
              >
                <Pause className="h-3.5 w-3.5" /> Pause Patrol
              </button>
            ) : (
              <button
                onClick={handleResume}
                className="flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-3 py-1.5 font-mono text-xs text-cyan-300 hover:bg-cyan-400/20 transition cursor-pointer"
              >
                <Play className="h-3.5 w-3.5" /> Resume Patrol
              </button>
            )}

            <button
              onClick={handleReturn}
              className="flex items-center gap-1.5 rounded-lg border border-cyan-400/20 bg-[#0c182c] px-3 py-1.5 font-mono text-xs text-slate-300 hover:text-white transition cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Return to Dock
            </button>
          </div>
        }
      />

      {/* UAV Flight Status Banner */}
      <div className="panel p-5 flex flex-wrap items-center justify-between gap-4 border-l-4 border-l-cyan-400">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-cyan-400/15 border border-cyan-400/30 text-cyan-300">
            <Radio className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
              <span>{DRONE_MISSION_DATA.callsign}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              <span>{DRONE_MISSION_DATA.model}</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-0.5">{DRONE_MISSION_DATA.droneId}</h2>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="rounded-lg bg-[#030712] p-2.5 border border-cyan-400/15 text-right">
            <div className="text-[10px] text-slate-500">OPERATIONAL STATUS</div>
            <div className="font-bold text-emerald-400 mt-0.5">{droneMissionStatus}</div>
          </div>
        </div>
      </div>

      {/* Flight Telemetry Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 font-mono">
        <div className="panel p-4 space-y-1">
          <div className="label text-slate-400">Battery Level</div>
          <div className="font-display text-2xl font-bold text-emerald-400 flex items-center gap-2">
            <Battery className="h-5 w-5 text-emerald-400" /> {DRONE_MISSION_DATA.battery}%
          </div>
          <div className="text-[10px] text-slate-500">28 mins flight remaining</div>
        </div>

        <div className="panel p-4 space-y-1">
          <div className="label text-slate-400">Patrol Altitude</div>
          <div className="font-display text-2xl font-bold text-white">
            {DRONE_MISSION_DATA.altitude} m
          </div>
          <div className="text-[10px] text-amber-300">Inversion ceiling boundary</div>
        </div>

        <div className="panel p-4 space-y-1">
          <div className="label text-slate-400">Airspeed</div>
          <div className="font-display text-2xl font-bold text-white">
            {DRONE_MISSION_DATA.speed} km/h
          </div>
          <div className="text-[10px] text-slate-500">Ground tracking mode</div>
        </div>

        <div className="panel p-4 space-y-1">
          <div className="label text-slate-400">Bearing Heading</div>
          <div className="font-display text-2xl font-bold text-cyan-300">
            {DRONE_MISSION_DATA.heading}
          </div>
          <div className="text-[10px] text-slate-500">Waypoint vector lock</div>
        </div>

        <div className="panel p-4 space-y-1">
          <div className="label text-slate-400">Command Uplink</div>
          <div className="font-display text-2xl font-bold text-emerald-400">
            99.8%
          </div>
          <div className="text-[10px] text-slate-500">Encrypted 5G Dual-SIM</div>
        </div>
      </div>

      {/* Middle Row: Drone Camera Feed (Left) + Vertical Stratification Profile (Right) */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Left: Synthetic Optical / Thermal FLIR Camera HUD */}
        <div className="panel p-5 space-y-3">
          <div className="border-b border-cyan-400/10 pb-2 flex items-center justify-between">
            <div>
              <span className="label text-cyan-300">Live Visual Telemetry</span>
              <h3 className="text-base font-bold text-white">Drone Multispectral FLIR Camera Feed</h3>
            </div>
            <span className="flex items-center gap-1 font-mono text-[10px] text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded border border-rose-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" /> LIVE STREAM · 1080p
            </span>
          </div>

          {/* Camera Viewport Screen */}
          <div className="relative h-64 w-full rounded-lg bg-gradient-to-b from-sky-950 via-[#051124] to-[#030712] overflow-hidden border border-cyan-400/20 grid place-items-center font-mono">
            {/* Tactical Grid Crosshairs */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-300/30" />
            <div className="absolute left-1/2 top-0 h-full w-px bg-cyan-300/30" />
            <div className="absolute h-24 w-24 rounded-full border border-cyan-400/20" />
            
            {/* Targeting Reticle & Plume Flag */}
            <div className="absolute z-10 p-2 rounded border border-rose-400 bg-rose-500/20 text-center animate-pulse">
              <Target className="h-6 w-6 text-rose-400 mx-auto" />
              <span className="text-[9px] text-white font-bold block mt-1">
                TARGET IDENTIFIED: INDUSTRIAL SCRUBBER BYPASS
              </span>
              <span className="text-[8px] text-rose-300">VOC CONCENTRATION: 440 ppm</span>
            </div>

            {/* Top HUD readouts */}
            <div className="absolute top-2 left-3 text-[10px] text-cyan-300/80">
              LAT 28.7012° N · LON 77.1648° E
            </div>
            <div className="absolute top-2 right-3 text-[10px] text-cyan-300/80">
              ALT 85.4m · PITCH -12° · ROLL +2°
            </div>

            {/* Bottom HUD readouts */}
            <div className="absolute bottom-2 left-3 text-[10px] text-slate-400">
              SPECTROMETER: LASER SCATTERING 0.3 - 10 µm
            </div>
            <div className="absolute bottom-2 right-3 text-[10px] text-emerald-400">
              AI CLASSIFICATION: 96% CONFIDENCE
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
            <span>FLIR Spectrum: 7.5 - 14 µm (Infrared Aerosol Absorption)</span>
            <span className="text-cyan-300 font-bold">FPS: 30 · Bitrate: 4.8 Mbps</span>
          </div>
        </div>

        {/* Right: Vertical PM2.5 Stratification Profile */}
        <div className="panel p-5 space-y-4">
          <div className="border-b border-cyan-400/10 pb-2 flex items-center justify-between">
            <div>
              <span className="label text-amber-400">Vertical Profiling</span>
              <h3 className="text-base font-bold text-white">Atmospheric Boundary Layer Stratification</h3>
            </div>
            <Layers className="h-4 w-4 text-amber-400" />
          </div>

          <p className="text-xs text-slate-400 font-sans">
            UAV vertical soundings quantify particulate concentration across altitude tiers, pinpointing exactly where the thermal inversion traps pollutants.
          </p>

          <div className="space-y-3 font-mono text-xs">
            {DRONE_MISSION_DATA.verticalProfile.map((tier, idx) => (
              <div 
                key={idx} 
                className="p-3 rounded-lg bg-[#030712] border border-cyan-400/10 space-y-1.5"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{tier.alt}</span>
                  <span className={`font-bold ${tier.pm25 > 300 ? 'text-rose-400' : tier.pm25 > 200 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    PM2.5: {tier.pm25} µg/m³
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 rounded-full"
                    style={{ width: `${Math.min(100, (tier.pm25 / 450) * 100)}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400">{tier.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Waypoint Timeline */}
      <div className="panel p-5 space-y-4">
        <div className="border-b border-cyan-400/10 pb-2 flex items-center justify-between">
          <div>
            <span className="label text-cyan-300">Flight Navigation Plan</span>
            <h3 className="text-lg font-bold text-white">Urban Corridor Waypoint Progression</h3>
          </div>
          <span className="font-mono text-xs text-slate-400">Total Route: 11.3 km</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-5 font-mono text-xs">
          {DRONE_MISSION_DATA.waypoints.map((wp) => {
            const isCompleted = wp.status === 'Completed';
            const isCurrent = wp.status === 'In Progress';

            return (
              <div 
                key={wp.id} 
                className={`p-3 rounded-lg border space-y-1 ${
                  isCurrent 
                    ? 'border-cyan-400 bg-cyan-400/10 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.4)]' 
                    : isCompleted 
                    ? 'border-emerald-400/30 bg-emerald-400/5' 
                    : 'border-slate-800 bg-[#030712] opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">WP 0{wp.id}</span>
                  <span className={`text-[10px] font-bold ${
                    isCurrent ? 'text-cyan-300 animate-pulse' : isCompleted ? 'text-emerald-400' : 'text-slate-500'
                  }`}>
                    {wp.status}
                  </span>
                </div>
                <div className="font-bold text-white text-xs truncate">{wp.name}</div>
                <div className="text-[10px] text-slate-400">{wp.time} · {wp.dist}</div>
                <div className="text-[9px] text-slate-500 truncate pt-1 border-t border-cyan-400/10">
                  {wp.result}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
