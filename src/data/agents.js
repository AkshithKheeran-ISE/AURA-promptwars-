/**
 * Municipal and Household GenAI Agent Roster and Sample Prompts.
 */

const RAW_MUNICIPAL_AGENTS = [
  [
    'meteo_dispersion',
    'Atmospheric Dispersion Agent',
    'WRF-Chem Boundary Inversion Specialist',
    '14,290',
    '38ms',
    '#22d3ee',
    'Simulates boundary layer nocturnal inversion ceilings, street canyon air stagnation, and ventilation dispersion trajectories.'
  ],
  [
    'cems_watchdog',
    'CEMS Stack Auditor',
    'Industrial Emission Compliance Sentinel',
    '8,940',
    '19ms',
    '#f43f5e',
    'Ingests continuous emission monitoring telemetry from 412 industrial stacks to detect opacity bypass tampering in real time.'
  ],
  [
    'drone_surveyor',
    'Aerosol Drone Coordinator',
    'Autonomous UAV Flight Path & FLIR Sentinel',
    '3,410',
    '45ms',
    '#a855f7',
    'Coordinates Hexa-Rotary aerosol sensor drones across vertical atmospheric layers (10m to 140m) to map inversion trapped smog plumes.'
  ],
  [
    'respiratory_shield',
    'Pediatric & Clinical Advisory',
    'Vulnerable Airway Clinical Defense',
    '12,850',
    '24ms',
    '#34d399',
    'Translates fine particulate concentrations into clinical household recommendations for asthmatic children, infants, and seniors.'
  ],
  [
    'ledger_validator',
    'Consensus Ledger Validator',
    'Cryptographic Integrity & Tamper Recovery',
    '5,120',
    '12ms',
    '#fbbf24',
    'Maintains SHA-256 hash chains for all citizen hazard reports, detecting adversarial tampering and preserving consensus evidence.'
  ],
  [
    'industrial_enforcer',
    'Pollution Source Enforcement',
    'DPCC / CPCB GRAP Stage IV Dispatcher',
    '3,110',
    '28ms',
    '#38bdf8',
    'Verifies industrial factory telemetry compliance against National Ambient Air Quality Standards and auto-generates fines.'
  ]
];

export const AI_AGENTS_ROSTER = RAW_MUNICIPAL_AGENTS.map(
  ([id, name, role, tasksHandled, latency, avatarColor, desc]) => ({
    id,
    name,
    role,
    tasksHandled,
    latency,
    status: 'WORKING',
    avatarColor,
    desc
  })
);

export const SAMPLE_AI_QUERIES = [
  'Explain why PM2.5 is spiking in Wazirpur and Anand Vihar tonight',
  'Simulate the atmospheric impact of shutting down 80 industrial diesel gensets',
  'Which schools in downwind corridors need immediate indoor air advisory?',
  'What is the thermal inversion ceiling height and dispersion forecast for tomorrow morning?',
  'Has any factory CEMS unit attempted optical sensor spoofing this week?'
];
