// Comprehensive Environmental Data for AURA Command Center

export const DATA_PROVENANCE_TIERS = {
  STATUTORY_BASELINE: {
    id: 'STATUTORY_BASELINE',
    label: 'Statutory CAAQMS Baseline',
    badgeColor: '#22d3ee',
    source: 'Central Pollution Control Board (CPCB) & Delhi DPCC Monitoring Network',
    method: 'Statutory Continuous Ambient Air Quality Monitoring (Beta-Attenuation Monitors)',
    freshness: 'Statutory Hourly Benchmark Baseline',
    isSimulation: false
  },
  SIMULATED_MICRO_MESH: {
    id: 'SIMULATED_MICRO_MESH',
    label: 'Simulated IoT Micro-Sensor Mesh',
    badgeColor: '#fbbf24',
    source: 'Demonstration 3,420-Node IoT Particulate Mesh Emulation',
    method: 'Mathematical Gaussian Plume Interpolation & Street Canyon Dispersion Model',
    freshness: 'Simulated Real-Time Telemetry',
    isSimulation: true
  },
  METEOROLOGICAL_FORECAST: {
    id: 'METEOROLOGICAL_FORECAST',
    label: 'Meteorological Dispersion Simulation',
    badgeColor: '#a855f7',
    source: 'WRF-Chem (Weather Research & Forecasting with Chemistry) Baseline',
    method: 'Boundary Layer Nocturnal Inversion & Wind Vector Simulation',
    freshness: '30-Day Outlook Projection',
    isSimulation: true
  }
};

export const DEFAULT_FIRMWARE = 'v4.1.8-SHA256';

/**
 * Factory helper for ward telemetry records with standard firmware and attestation defaults.
 * @param {Object} data - Ward sensor metrics and geographic location.
 * @returns {Object} Structured ward telemetry object.
 */
const createWard = (data) => ({
  firmware: DEFAULT_FIRMWARE,
  attested: true,
  ...data
});

/**
 * Factory helper for Continuous Emission Monitoring System (CEMS) stack stations.
 */
const createCemsStation = (
  id,
  name,
  ward,
  pollutant,
  actual,
  limit,
  status,
  tamperRisk,
  fine,
  lastReported
) => ({
  id,
  name,
  ward,
  pollutant,
  actual,
  limit,
  status,
  tamperRisk,
  fine,
  lastReported
});

/**
 * Factory helper for live network packet ingestion streams.
 */
const createIngestionPacket = (id, time, source, target, protocol, pollutant, action, tone) => ({
  id,
  time,
  source,
  target,
  protocol,
  pollutant,
  action,
  tone
});

/**
 * Factory helper for immutable audit logs with timestamp offsets.
 */
const createAuditLog = (id, offsetMs, actor, action, target, type, hash) => ({
  id,
  ts: Date.now() - offsetMs,
  actor,
  action,
  target,
  type,
  hash
});

const RAW_WARDS_TELEMETRY = [
  {
    id: 'wazirpur',
    name: 'Wazirpur Industrial Sector',
    lat: 28.698,
    lng: 77.165,
    aqi: 415,
    pm25: 298,
    pm10: 442,
    no2: 84,
    so2: 42,
    co: 3.4,
    o3: 24,
    temp: 18.2,
    humidity: 78,
    wind: 3.2,
    windDir: 'NW',
    inversion: 'Severe (80m ceiling)',
    status: 'Critical',
    sensorId: 'AURA-WZP-08',
    sources: [
      'Electroplating & Smelting Stacks',
      'Unpaved Truck Corridors',
      'Diesel Generator Clusters'
    ],
    alertsCount: 8
  },
  {
    id: 'anand_vihar',
    name: 'Anand Vihar Transit Terminal',
    lat: 28.647,
    lng: 77.315,
    aqi: 385,
    pm25: 265,
    pm10: 410,
    no2: 92,
    so2: 28,
    co: 4.1,
    o3: 31,
    temp: 19.0,
    humidity: 74,
    wind: 4.1,
    windDir: 'NW',
    inversion: 'High (110m)',
    status: 'Critical',
    sensorId: 'AURA-AV-03',
    sources: ['Interstate Diesel Bus Fleet', 'Border Toll Congestion', 'Open Waste Transfer'],
    alertsCount: 7
  },
  {
    id: 'okhla',
    name: 'Okhla Phase-III & Incinerator',
    lat: 28.53,
    lng: 77.271,
    aqi: 340,
    pm25: 228,
    pm10: 368,
    no2: 76,
    so2: 38,
    co: 2.8,
    o3: 38,
    temp: 19.4,
    humidity: 71,
    wind: 5.0,
    windDir: 'WNW',
    inversion: 'High (130m)',
    status: 'Critical',
    sensorId: 'AURA-OKH-12',
    sources: ['Waste-to-Energy Incineration', 'Container Depot Traffic', 'Fabrication Units'],
    alertsCount: 5
  },
  {
    id: 'mayapuri',
    name: 'Mayapuri Metal & Scrap Hub',
    lat: 28.632,
    lng: 77.112,
    aqi: 362,
    pm25: 242,
    pm10: 380,
    no2: 68,
    so2: 34,
    co: 3.1,
    o3: 29,
    temp: 18.8,
    humidity: 75,
    wind: 3.8,
    windDir: 'NW',
    inversion: 'High (100m)',
    status: 'Critical',
    sensorId: 'AURA-MYP-04',
    sources: ['Metal Torch Cutting', 'Heavy Freight Trucks', 'Industrial Resuspension'],
    alertsCount: 6
  },
  {
    id: 'jahangirpuri',
    name: 'Jahangirpuri Logistics Corridor',
    lat: 28.726,
    lng: 77.169,
    aqi: 378,
    pm25: 254,
    pm10: 395,
    no2: 81,
    so2: 31,
    co: 3.6,
    o3: 26,
    temp: 18.0,
    humidity: 80,
    wind: 3.0,
    windDir: 'NNW',
    inversion: 'Severe (70m)',
    status: 'Critical',
    sensorId: 'AURA-JGP-01',
    sources: ['Warehouse Diesel Gensets', 'Highway Ingress Freight', 'Unpaved Shoulders'],
    alertsCount: 5
  },
  {
    id: 'rohini',
    name: 'Rohini Sector 16 Transit Grid',
    lat: 28.734,
    lng: 77.121,
    aqi: 295,
    pm25: 182,
    pm10: 298,
    no2: 58,
    so2: 19,
    co: 2.1,
    o3: 42,
    temp: 18.5,
    humidity: 73,
    wind: 6.2,
    windDir: 'NW',
    inversion: 'Moderate (180m)',
    status: 'High',
    sensorId: 'AURA-ROH-07',
    sources: ['Arterial Vehicular Congestion', 'Construction Demolition Zones'],
    alertsCount: 3
  },
  {
    id: 'punjabi_bagh',
    name: 'Punjabi Bagh Ring Road Junction',
    lat: 28.668,
    lng: 77.124,
    aqi: 280,
    pm25: 174,
    pm10: 284,
    no2: 64,
    so2: 21,
    co: 2.4,
    o3: 45,
    temp: 19.1,
    humidity: 69,
    wind: 5.8,
    windDir: 'WNW',
    inversion: 'Moderate (210m)',
    status: 'High',
    sensorId: 'AURA-PB-02',
    sources: ['Stop-and-Go Ring Road Traffic', 'Commercial Bakery Ovens'],
    alertsCount: 2
  },
  {
    id: 'igi_airport',
    name: 'IGI Airport & Expressway Corridor',
    lat: 28.556,
    lng: 77.099,
    aqi: 245,
    pm25: 148,
    pm10: 245,
    no2: 72,
    so2: 26,
    co: 2.5,
    o3: 49,
    temp: 20.2,
    humidity: 66,
    wind: 7.4,
    windDir: 'W',
    inversion: 'Moderate (260m)',
    status: 'High',
    sensorId: 'AURA-IGI-09',
    sources: ['Aviation Ground Support Equipment', 'Expressway Toll Queues'],
    alertsCount: 3
  },
  {
    id: 'noida_sec62',
    name: 'Sector 62 Institutional Zone',
    lat: 28.628,
    lng: 77.365,
    aqi: 232,
    pm25: 139,
    pm10: 228,
    no2: 52,
    so2: 17,
    co: 1.8,
    o3: 51,
    temp: 20.0,
    humidity: 68,
    wind: 6.9,
    windDir: 'NW',
    inversion: 'Moderate (240m)',
    status: 'High',
    sensorId: 'AURA-ND-62',
    sources: ['Campus Backup Generators', 'Peripheral Ring Road Freight'],
    alertsCount: 2
  },
  {
    id: 'dwarka',
    name: 'Dwarka Sector 12 Residential',
    lat: 28.592,
    lng: 77.046,
    aqi: 210,
    pm25: 124,
    pm10: 212,
    no2: 44,
    so2: 14,
    co: 1.5,
    o3: 56,
    temp: 20.4,
    humidity: 65,
    wind: 8.1,
    windDir: 'W',
    inversion: 'Low (310m)',
    status: 'Moderate',
    sensorId: 'AURA-DWK-14',
    sources: ['Local Commercial Traffic', 'Road Dust Suspension'],
    alertsCount: 1
  },
  {
    id: 'connaught_place',
    name: 'Connaught Place Central Hub',
    lat: 28.631,
    lng: 77.219,
    aqi: 168,
    pm25: 92,
    pm10: 170,
    no2: 49,
    so2: 12,
    co: 1.3,
    o3: 62,
    temp: 20.8,
    humidity: 62,
    wind: 8.5,
    windDir: 'W',
    inversion: 'Low (340m)',
    status: 'Moderate',
    sensorId: 'AURA-CP-01',
    sources: ['Central Commuter Taxis & Autos', 'Restaurant Kitchen Exhausts'],
    alertsCount: 1
  },
  {
    id: 'cyber_city',
    name: 'Cyber City Metro Gateway',
    lat: 28.495,
    lng: 77.089,
    aqi: 182,
    pm25: 104,
    pm10: 185,
    no2: 55,
    so2: 15,
    co: 1.6,
    o3: 58,
    temp: 21.0,
    humidity: 61,
    wind: 7.9,
    windDir: 'WNW',
    inversion: 'Low (330m)',
    status: 'Moderate',
    sensorId: 'AURA-CC-05',
    sources: ['Commercial Office HVAC Plumes', 'Peak Hour Feeder Shuttles'],
    alertsCount: 1
  },
  {
    id: 'nehru_stadium',
    name: 'JLN Stadium & School Belt',
    lat: 28.582,
    lng: 77.234,
    aqi: 155,
    pm25: 84,
    pm10: 152,
    no2: 38,
    so2: 10,
    co: 1.1,
    o3: 65,
    temp: 21.2,
    humidity: 60,
    wind: 8.8,
    windDir: 'W',
    inversion: 'Low (380m)',
    status: 'Moderate',
    sensorId: 'AURA-JLN-02',
    sources: ['School Bus Fleets', 'Light Recreational Traffic'],
    alertsCount: 0
  },
  {
    id: 'riverfront_east',
    name: 'Yamuna Floodplain Eco-Grid',
    lat: 28.615,
    lng: 77.262,
    aqi: 220,
    pm25: 132,
    pm10: 218,
    no2: 46,
    so2: 16,
    co: 1.7,
    o3: 48,
    temp: 19.8,
    humidity: 76,
    wind: 6.0,
    windDir: 'NW',
    inversion: 'Moderate (220m)',
    status: 'High',
    sensorId: 'AURA-YMN-01',
    sources: ['Riparian Agricultural Residue', 'Bridge Construction Works'],
    alertsCount: 2
  },
  {
    id: 'vasant_kunj',
    name: 'Vasant Kunj South Ridge Fringe',
    lat: 28.524,
    lng: 77.156,
    aqi: 115,
    pm25: 58,
    pm10: 112,
    no2: 28,
    so2: 8,
    co: 0.9,
    o3: 69,
    temp: 21.5,
    humidity: 58,
    wind: 9.4,
    windDir: 'WSW',
    inversion: 'Clear (450m)',
    status: 'Safe',
    sensorId: 'AURA-VK-06',
    sources: ['Residential Neighborhood Traffic'],
    alertsCount: 0
  },
  {
    id: 'lodhi_green',
    name: 'Lodhi Botanical Ecological Sanctuary',
    lat: 28.593,
    lng: 77.219,
    aqi: 88,
    pm25: 42,
    pm10: 86,
    no2: 22,
    so2: 6,
    co: 0.7,
    o3: 74,
    temp: 21.8,
    humidity: 55,
    wind: 9.8,
    windDir: 'W',
    inversion: 'Clear (520m)',
    status: 'Safe',
    sensorId: 'AURA-LOD-01',
    sources: ['Natural Flora Canopy Filtration'],
    alertsCount: 0
  }
];

export const WARDS_DATA = RAW_WARDS_TELEMETRY.map(createWard);

export const TOP_STAT_METRICS = [
  {
    label: 'Active Air Alerts',
    value: '19 Active',
    change: '+18.4%',
    up: true,
    good: false,
    color: '#f43f5e',
    sub: '6 Stage-IV Emergency Wards'
  },
  {
    label: 'Pollution Spikes Quelled',
    value: '1,482',
    change: '+22.1%',
    up: true,
    good: true,
    color: '#34d399',
    sub: 'Anti-smog guns & diversions'
  },
  {
    label: 'IoT Sensors Online',
    value: '3,420',
    change: '99.6%',
    up: true,
    good: true,
    color: '#22d3ee',
    sub: 'of 3,435 attested via TPM'
  },
  {
    label: 'CEMS Stacks Monitored',
    value: '412 Units',
    change: '100%',
    up: true,
    good: true,
    color: '#a855f7',
    sub: 'Zero-bypass telemetry'
  },
  {
    label: 'Night Inversion Trapping',
    value: '84% Index',
    change: '+8 pts',
    up: true,
    good: false,
    color: '#f59e0b',
    sub: 'Thermal ceiling 80m'
  },
  {
    label: 'Clean Air Compliance',
    value: '76/100',
    change: '+4 pts',
    up: true,
    good: true,
    color: '#38bdf8',
    sub: 'Municipal GRAP Stage IV'
  }
];

export const HOURLY_TRENDS = [
  { time: '00:00', pm25: 280, pm10: 410, no2: 85, o3: 20 },
  { time: '02:00', pm25: 310, pm10: 440, no2: 90, o3: 18 },
  { time: '04:00', pm25: 345, pm10: 485, no2: 96, o3: 15 },
  { time: '06:00', pm25: 380, pm10: 512, no2: 104, o3: 14 },
  { time: '08:00', pm25: 340, pm10: 470, no2: 98, o3: 25 },
  { time: '10:00', pm25: 290, pm10: 395, no2: 82, o3: 42 },
  { time: '12:00', pm25: 220, pm10: 310, no2: 64, o3: 65 },
  { time: '14:00', pm25: 185, pm10: 260, no2: 52, o3: 78 },
  { time: '16:00', pm25: 205, pm10: 295, no2: 61, o3: 72 },
  { time: '18:00', pm25: 260, pm10: 380, no2: 78, o3: 48 },
  { time: '20:00', pm25: 315, pm10: 430, no2: 89, o3: 32 },
  { time: '22:00', pm25: 335, pm10: 460, no2: 94, o3: 24 }
];

export const SYSTEM_HEALTH_METRICS = [
  { name: 'Laser Spectrometer Ingestion', status: 'NORMAL', latency: '14ms', load: '78%' },
  { name: 'Satellite AOD Downlink (INSAT-3DR)', status: 'NORMAL', latency: '112ms', load: '42%' },
  {
    name: 'Atmospheric WRF-Chem Dispersion Engine',
    status: 'NORMAL',
    latency: '210ms',
    load: '89%'
  },
  { name: 'Municipal CEMS Stack Gateway', status: 'NORMAL', latency: '28ms', load: '54%' },
  { name: 'Encrypted Zero-Trust IoT Mesh', status: 'NORMAL', latency: '6ms', load: '99.6%' }
];

export const PRIORITY_ALERTS = [
  {
    id: 'ALR-DEL-901',
    title: 'Severe PM2.5 Exceedance · Wazirpur Smelting Belt',
    ward: 'Wazirpur Industrial Sector',
    source: 'Uncontrolled Electroplating & Cupola Furnace Stacks',
    type: 'industrial',
    severity: 'critical',
    score: 9.8,
    exceedance: '+380% above CPCB National Ambient standard',
    affected: '142,000 residents · 18 primary schools in downwind plume',
    timestamp: '12 mins ago',
    activeAction: null,
    escalated: true,
    playbook: [
      { id: 'smog_gun', label: 'Dispatch Anti-Smog Water Cannons', icon: 'Droplets', done: false },
      {
        id: 'school_advisory',
        label: 'Trigger Emergency School Indoor Notice',
        icon: 'Bell',
        done: false
      },
      { id: 'stack_cutoff', label: 'Enforce Stack SCR Bypass Cutoff', icon: 'Power', done: false },
      {
        id: 'truck_reroute',
        label: 'Reroute Non-Essential Heavy Trucks',
        icon: 'Truck',
        done: false
      }
    ]
  },
  {
    id: 'ALR-DEL-894',
    title: 'Toxic NO2 & Carbon Monoxide Inversion Stagnation',
    ward: 'Anand Vihar Transit Terminal',
    source: 'Heavy Diesel Freight Ingress + Low Boundary Layer (90m)',
    type: 'vehicular',
    severity: 'critical',
    score: 9.4,
    exceedance: '+290% above WHO 24h limit',
    affected: 'Toll plaza operators, transit workers, interstate bus commuters',
    timestamp: '24 mins ago',
    activeAction: null,
    escalated: true,
    playbook: [
      {
        id: 'diversion',
        label: 'Activate Border Toll Truck Diversion',
        icon: 'Navigation',
        done: false
      },
      {
        id: 'mist_sprinklers',
        label: 'Deploy High-Pressure Road Mist Sprinklers',
        icon: 'CloudRain',
        done: false
      },
      {
        id: 'ev_priority',
        label: 'Restrict Terminal to Electric/CNG Fleets',
        icon: 'Zap',
        done: false
      }
    ]
  },
  {
    id: 'ALR-DEL-887',
    title: 'CEMS Stack Telemetry Tamper & SO2 Spike',
    ward: 'Okhla Phase-III Industrial Zone',
    source: 'Waste-to-Energy Incineration Line 2 Optical Sensor Disconnect',
    type: 'cyber_tamper',
    severity: 'high',
    score: 8.7,
    exceedance: 'Sensor bypass flagged · SO2 predicted 185 µg/m³',
    affected: 'South-East ward residential colonies',
    timestamp: '45 mins ago',
    activeAction: null,
    escalated: false,
    playbook: [
      {
        id: 'isolate_unit',
        label: 'Trigger Automated Remote Valve Trip',
        icon: 'ShieldAlert',
        done: false
      },
      {
        id: 'audit_squad',
        label: 'Dispatch State Pollution Control Inspection Squad',
        icon: 'FileCheck',
        done: false
      },
      {
        id: 'penalize',
        label: 'Issue Section 31A Environmental Penalty Notice',
        icon: 'DollarSign',
        done: false
      }
    ]
  },
  {
    id: 'ALR-DEL-872',
    title: 'Open Biomass & Municipal Plastic Burning Cluster',
    ward: 'Riverfront East (Yamuna Floodplain)',
    source: 'Illegal Night Agricultural Residue & Open Plastic Smoldering',
    type: 'biomass',
    severity: 'high',
    score: 8.1,
    exceedance: 'Concentrated Black Carbon & Dioxin plume',
    affected: 'Trans-Yamuna residential zone downwind',
    timestamp: '1 hour ago',
    activeAction: null,
    escalated: false,
    playbook: [
      {
        id: 'drone_dispatch',
        label: 'Dispatch Drone Sentinel-Air-01 with FLIR',
        icon: 'Plane',
        done: false
      },
      {
        id: 'patrol_team',
        label: 'Alert Municipal Flying Squad Patrol 4',
        icon: 'Users',
        done: false
      },
      { id: 'douse', label: 'Coordinate Quick-Response Dousing Tender', icon: 'Flame', done: false }
    ]
  },
  {
    id: 'ALR-DEL-865',
    title: 'Uncovered Construction & Demolition Dust Cloud',
    ward: 'Rohini Sector 16 Transit Grid',
    source: 'Multi-Storey Flyover Excavation without Dust Curtains',
    type: 'dust',
    severity: 'medium',
    score: 6.8,
    exceedance: 'PM10 instantaneous spike 610 µg/m³',
    affected: 'Local transit intersections and shopkeepers',
    timestamp: '2 hours ago',
    activeAction: null,
    escalated: false,
    playbook: [
      {
        id: 'stop_work',
        label: 'Issue Instant 48-Hour Stop-Work Notice',
        icon: 'Ban',
        done: false
      },
      {
        id: 'sprinkle_dust',
        label: 'Mandate Continuous Water Foggers',
        icon: 'CloudDrizzle',
        done: false
      }
    ]
  }
];

export const INDUSTRIAL_CEMS_STATIONS = [
  createCemsStation(
    'CEMS-WZP-01',
    'Apex Galvanizing & Metal Works',
    'Wazirpur Industrial Sector',
    'SO2 & Acid Mist',
    '192 mg/Nm³',
    '50 mg/Nm³',
    'CRITICAL VIOLATION',
    'LOW',
    '₹ 5,00,000',
    '30s ago'
  ),
  createCemsStation(
    'CEMS-OKH-04',
    'Timarpur-Okhla Waste Energy Stack 2',
    'Okhla Phase-III',
    'Particulate Matter (PM)',
    '148 mg/Nm³',
    '30 mg/Nm³',
    'TAMPER DETECTED',
    'HIGH',
    '₹ 15,00,000',
    '2m ago'
  ),
  createCemsStation(
    'CEMS-MYP-09',
    'Capital Heavy Alloy Castings',
    'Mayapuri Sector',
    'NOx & Lead Fumes',
    '410 mg/Nm³',
    '200 mg/Nm³',
    'EXCEEDING',
    'MEDIUM',
    '₹ 2,50,000',
    '4m ago'
  ),
  createCemsStation(
    'CEMS-BAD-03',
    'NTPC Gas Turbine Backup Unit B',
    'Badarpur Border',
    'NOx',
    '85 mg/Nm³',
    '150 mg/Nm³',
    'COMPLIANT',
    'NONE',
    '₹ 0',
    '15s ago'
  ),
  createCemsStation(
    'CEMS-ND-11',
    'Sahibabad Distilleries & Biofuel Unit',
    'East Border Fringe',
    'VOC & Carbon',
    '64 mg/Nm³',
    '100 mg/Nm³',
    'COMPLIANT',
    'NONE',
    '₹ 0',
    '45s ago'
  )
];

export const LIVE_INGESTION_STREAM = [
  createIngestionPacket(
    'PKT-84192',
    '20:38:12',
    'AURA-WZP-08:LaserOptic',
    'ingest.aura:8883',
    'TLS 1.3 / SHA-256',
    'PM2.5: 298 µg/m³',
    'ALLOW',
    'emerald'
  ),
  createIngestionPacket(
    'PKT-84193',
    '20:38:14',
    '185.220.101.47:9001',
    'cems.gw.delhi:443',
    'RAW-TCP',
    'CEMS False Packet Injection',
    'DROP',
    'rose'
  ),
  createIngestionPacket(
    'PKT-84194',
    '20:38:15',
    'CEMS-OKH-04:GasChroma',
    'scada.aura:502',
    'Modbus/TLS',
    'SO2: 192 mg/Nm³',
    'FLAG',
    'amber'
  ),
  createIngestionPacket(
    'PKT-84195',
    '20:38:18',
    'AURA-AV-03:Particulate',
    'ingest.aura:8883',
    'mTLS / AES-256',
    'NO2: 92 ppb (Spike)',
    'FLAG',
    'amber'
  ),
  createIngestionPacket(
    'PKT-84196',
    '20:38:21',
    'DRONE-UAV-01:FLIR-Sniff',
    'mesh.aura:8443',
    'ChaCha20',
    'VOC Plume 440ppm',
    'ALLOW',
    'emerald'
  ),
  createIngestionPacket(
    'PKT-84197',
    '20:38:24',
    '45.95.147.236:44321',
    'api.aura:22',
    'SSH-Brute',
    'Sensor Root Compromise Attempt',
    'DROP',
    'rose'
  )
];

export const INITIAL_CITIZEN_REPORTS = [
  {
    id: 'REP-AURA-8101',
    issue: 'Massive Open Waste & Rubber Burning behind Metro Yard',
    location: 'Anand Vihar Ward (Sector 4)',
    reporter: 'Citizen Suresh V.',
    urgency: 'Critical',
    lat: 28.651,
    lng: 77.319,
    timestamp: 'Today, 19:15',
    prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
    hash: '1cf2e977fb0f5dac70722bbdadd593144a6b9ef1934227712fc4c03bcfe28e5c',
    stage: 4,
    statusText: 'Fire Doused & Violator Fined'
  },
  {
    id: 'REP-AURA-8102',
    issue: 'Dense Chemical Fumes & Black Smoke from Fabrication Chimney',
    location: 'Wazirpur Industrial Area',
    reporter: 'Shopkeeper Association',
    urgency: 'High',
    lat: 28.701,
    lng: 77.162,
    timestamp: 'Today, 19:42',
    prevHash: '1cf2e977fb0f5dac70722bbdadd593144a6b9ef1934227712fc4c03bcfe28e5c',
    hash: '2a6467957919a910f60f52a98cef9bdb1bbfc99576df045f71135c0f58212506',
    stage: 3,
    statusText: 'Inspection Team On-Site'
  },
  {
    id: 'REP-AURA-8103',
    issue: 'Heavy Uncovered Cement Trucks creating white dust storm',
    location: 'Rohini Outer Ring Road',
    reporter: 'Cyclist Commuter Neha',
    urgency: 'Medium',
    lat: 28.73,
    lng: 77.126,
    timestamp: 'Today, 20:05',
    prevHash: '2a6467957919a910f60f52a98cef9bdb1bbfc99576df045f71135c0f58212506',
    hash: 'f783c0856a6d966e26b709d3e1d1b0c910db46d54cfa0d536194713c08adac6e',
    stage: 2,
    statusText: 'Traffic Interceptor Alerted'
  },
  {
    id: 'REP-AURA-8104',
    issue: 'Illegal Unmuffled 250kVA Diesel Generator Running Continuously',
    location: 'Mayapuri Scrap Market',
    reporter: 'Local Resident Welfare',
    urgency: 'Medium',
    lat: 28.635,
    lng: 77.11,
    timestamp: 'Today, 20:20',
    prevHash: 'f783c0856a6d966e26b709d3e1d1b0c910db46d54cfa0d536194713c08adac6e',
    hash: 'fa94053a0a34f35781498d364b309d17c316e9b05d640b68bed49567dc242484',
    stage: 1,
    statusText: 'Report Validated on Ledger'
  }
];

export const AI_AGENTS_ROSTER = [
  {
    id: 'aerosol_net',
    name: 'AerosolNet',
    role: 'Satellite AOD & Optical Spectrometry',
    tasksHandled: '42,890',
    latency: '34ms',
    status: 'WORKING',
    avatarColor: '#22d3ee',
    desc: 'Ingests INSAT-3DR and Sentinel-5P TROPOMI satellite rasters, computing optical depth and aerosol vertical distribution.'
  },
  {
    id: 'sentinel_air',
    name: 'Sentinel-Air',
    role: 'Real-Time Threshold & Plume Anomaly Detector',
    tasksHandled: '184,210',
    latency: '8ms',
    status: 'WORKING',
    avatarColor: '#f43f5e',
    desc: 'Performs sub-second statistical outlier detection across 3,420 IoT micro-sensors, isolating sudden chemical plumes.'
  },
  {
    id: 'bio_validator',
    name: 'BioValidator',
    role: 'Sensor Physics & Condensation Bias Filter',
    tasksHandled: '96,140',
    latency: '19ms',
    status: 'WORKING',
    avatarColor: '#34d399',
    desc: 'Cross-references optical particle counters against hygroscopic growth curves to prevent false fog/dew alarms.'
  },
  {
    id: 'meteo_forecaster',
    name: 'MeteoForecaster',
    role: 'Atmospheric Dispersion & Inversion Engine',
    tasksHandled: '14,500',
    latency: '140ms',
    status: 'WORKING',
    avatarColor: '#a855f7',
    desc: 'Solves Eulerian grid atmospheric dispersion equations using boundary layer height, wind turbulence and solar flux.'
  },
  {
    id: 'emergency_responder',
    name: 'EmergencyResponder',
    role: 'Municipal GRAP Playbook & Resource Allocator',
    tasksHandled: '8,920',
    latency: '45ms',
    status: 'WORKING',
    avatarColor: '#fbbf24',
    desc: 'Generates precision municipal dispatch directives: anti-smog water cannons, truck diversions, and school alerts.'
  },
  {
    id: 'policy_auditor',
    name: 'PolicyAuditor',
    role: 'Clean Air Regulatory & CEMS Fine Assessor',
    tasksHandled: '3,110',
    latency: '28ms',
    status: 'WORKING',
    avatarColor: '#38bdf8',
    desc: 'Verifies industrial factory telemetry compliance against National Ambient Air Quality Standards and auto-generates fines.'
  }
];

export const SAMPLE_AI_QUERIES = [
  'Explain why PM2.5 is spiking in Wazirpur and Anand Vihar tonight',
  'Simulate the atmospheric impact of shutting down 80 industrial diesel gensets',
  'Which schools in downwind corridors need immediate indoor air advisory?',
  'What is the thermal inversion ceiling height and dispersion forecast for tomorrow morning?',
  'Has any factory CEMS unit attempted optical sensor spoofing this week?'
];

const FORECAST_PHASES = [
  {
    maxDay: 3,
    baseAqi: 360,
    wave: 'sin',
    waveAmp: 30,
    risk: 'Critical',
    windSpeed: 3.5,
    temp: 18,
    rainChance: 0,
    inversionHeight: 85
  },
  {
    maxDay: 8,
    baseAqi: 280,
    wave: 'cos',
    waveAmp: 35,
    risk: 'High',
    windSpeed: 6.2,
    temp: 19,
    rainChance: 5,
    inversionHeight: 160
  },
  {
    maxDay: 13,
    baseAqi: 190,
    wave: 'sin',
    waveAmp: 25,
    risk: 'Moderate',
    windSpeed: 9.8,
    temp: 21,
    rainChance: 15,
    inversionHeight: 320
  },
  {
    maxDay: 18,
    baseAqi: 340,
    wave: 'sin',
    waveAmp: 40,
    risk: 'Critical',
    windSpeed: 4.0,
    temp: 17,
    rainChance: 0,
    inversionHeight: 90
  },
  {
    maxDay: 24,
    baseAqi: 240,
    wave: 'cos',
    waveAmp: 30,
    risk: 'High',
    windSpeed: 7.5,
    temp: 20,
    rainChance: 10,
    inversionHeight: 210
  },
  {
    maxDay: Infinity,
    baseAqi: 145,
    wave: 'sin',
    waveAmp: 30,
    risk: 'Moderate',
    windSpeed: 11.2,
    temp: 22,
    rainChance: 40,
    inversionHeight: 420
  }
];

function getForecastPhaseMetrics(index) {
  const phase = FORECAST_PHASES.find((p) => index < p.maxDay);
  const waveVal = phase.wave === 'cos' ? Math.cos(index) : Math.sin(index);
  return {
    aqi: phase.baseAqi + Math.floor(waveVal * phase.waveAmp),
    risk: phase.risk,
    windSpeed: phase.windSpeed,
    temp: phase.temp,
    rainChance: phase.rainChance,
    inversionHeight: phase.inversionHeight
  };
}

export const AQI_THRESHOLDS = {
  STAGE_IV_EMERGENCY: 350,
  STAGE_III_SEVERE: 280,
  STAGE_II_VERY_POOR: 200,
  PM25_CUTOFF: 250,
  PM10_CUTOFF: 180,
  BRIEFING_CRITICAL: 300,
  BRIEFING_MODERATE: 200
};

/**
 * Determines primary aerosol pollutant based on AQI threshold.
 * @param {number} aqi - Air Quality Index.
 * @returns {string} Pollutant label.
 */
function getPollutantByAqi(aqi) {
  if (aqi > AQI_THRESHOLDS.PM25_CUTOFF) return 'PM2.5 (Fine Combustion Particles)';
  if (aqi > AQI_THRESHOLDS.PM10_CUTOFF) return 'PM10 (Resuspended Road Dust)';
  return 'O3 (Photochemical Ozone)';
}

/**
 * Resolves Graded Response Action Plan (GRAP) enforcement stage.
 * @param {number} aqi - Air Quality Index.
 * @returns {string} GRAP enforcement stage.
 */
function getGrapStage(aqi) {
  if (aqi > AQI_THRESHOLDS.STAGE_IV_EMERGENCY) return 'Stage IV (Severe+ Emergency)';
  if (aqi > AQI_THRESHOLDS.STAGE_III_SEVERE) return 'Stage III (Severe Action)';
  if (aqi > AQI_THRESHOLDS.STAGE_II_VERY_POOR) return 'Stage II (Very Poor)';
  return 'Stage I (Moderate Watch)';
}

/**
 * Generates meteorological dispersal and health briefing based on AQI.
 * @param {number} aqi - Air Quality Index.
 * @returns {string} Detailed meteorological briefing text.
 */
function getAqiBriefing(aqi) {
  if (aqi > AQI_THRESHOLDS.BRIEFING_CRITICAL) {
    return 'Severe thermal boundary inversion trapping high-density vehicular and industrial exhaust. Unfavourable dispersion conditions. Anti-smog measures strictly enforced.';
  }
  if (aqi > AQI_THRESHOLDS.BRIEFING_MODERATE) {
    return 'Moderate wind ventilation clearing afternoon surface boundary layer, with evening particulate buildup expected. Vulnerable groups advised to wear N95.';
  }
  return 'Strong convective mixing and elevated wind currents creating favourable dispersion. Ambient air quality within tolerable municipal thresholds.';
}

export const THIRTY_DAY_FORECAST = Array.from({ length: 30 }, (_, i) => {
  const dayNum = i + 1;
  const date = new Date();
  date.setDate(date.getDate() + i);

  const { aqi, risk, windSpeed, temp, rainChance, inversionHeight } = getForecastPhaseMetrics(i);

  return {
    day: dayNum,
    dateStr: date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
    fullDate: date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    aqi,
    risk,
    windSpeed,
    temp,
    rainChance,
    inversionHeight,
    peakPollutant: getPollutantByAqi(aqi),
    grapStage: getGrapStage(aqi),
    briefing: getAqiBriefing(aqi)
  };
});

export const DRONE_MISSION_DATA = {
  droneId: 'UAV Sentinel-Air-01',
  model: 'Octocopter Hexa-Rotary Aerosol Profiler',
  callsign: 'AURA-VANGUARD-DELTA',
  status: 'IN FLIGHT - PATROLLING SECTOR NORTH',
  battery: 84,
  altitude: 85,
  speed: 18.4,
  heading: '042° NE',
  linkQuality: '99.8% (Encrypted 5G / LoRa)',
  cipher: 'AES-256-GCM · SHA-256',
  antiSpoof: 'Multi-Band GNSS Carrier Phase Check: OK',
  verticalProfile: [
    { alt: '10m (Ground)', pm25: 312, label: 'Street Resuspension Layer' },
    { alt: '35m (Canopy)', pm25: 278, label: 'Building Wake Zone' },
    { alt: '85m (Inversion Base)', pm25: 395, label: 'Boundary Layer Trapping Peak' },
    { alt: '140m (Free Troposphere)', pm25: 110, label: 'Clean Air Above Inversion' }
  ],
  waypoints: [
    {
      id: 1,
      name: 'Wazirpur Smelting Stacks',
      time: '19:40',
      dist: '1.2 km',
      status: 'Completed',
      result: '3 industrial stack plumes mapped'
    },
    {
      id: 2,
      name: 'Azadpur Mandi Logistics Junction',
      time: '20:05',
      dist: '2.1 km',
      status: 'Completed',
      result: 'High diesel NO2 corridor flagged'
    },
    {
      id: 3,
      name: 'Jahangirpuri Warehouse Cluster',
      time: '20:30',
      dist: '1.8 km',
      status: 'In Progress',
      result: 'Measuring vertical particulate boundary'
    },
    {
      id: 4,
      name: 'GT Karnal Highway Checkpost',
      time: '20:55',
      dist: '3.4 km',
      status: 'Queued',
      result: 'Truck queue emission surveillance'
    },
    {
      id: 5,
      name: 'Civil Lines Riverfront Landing Pad',
      time: '21:20',
      dist: '2.8 km',
      status: 'Queued',
      result: 'Automated battery hot-swap & dock'
    }
  ]
};

export const INITIAL_AUDIT_LOGS = [
  createAuditLog(
    'AUD-9912',
    45000,
    'EmergencyResponder (AI)',
    'Auto-dispatched 4 Anti-Smog Cannons',
    'Wazirpur Sector East',
    'agent',
    '81cfb62733b0b86d2b7d4eb3cbc96291671cbb88887506f2b89b0dd34461bf96'
  ),
  createAuditLog(
    'AUD-9911',
    120000,
    'Analyst Akshith (Human)',
    'Elevated Incident ALR-DEL-901 to Stage-IV',
    'Municipal Control Room',
    'human',
    'ba9068524e6cfa9078c0e3c7c651b1fd1a095a3a51a15ec2648a1db36ff34298'
  ),
  createAuditLog(
    'AUD-9910',
    240000,
    'BioValidator (AI)',
    'Filtered 18 false sensor condensation spikes',
    'Riverfront East Sensors',
    'agent',
    '4bb9aee150580e2c81cfb1156f0a6d794ca8791a5315b1e5372eab6347222195'
  ),
  createAuditLog(
    'AUD-9909',
    360000,
    'CEMS Gateway (System)',
    'Flagged Tamper Alert on Stack 2 Incinerator',
    'Okhla CEMS-OKH-04',
    'system',
    'c27b4203aa006bfcab13134d167e22162097be962f3021f818f113b6a07bf285'
  ),
  createAuditLog(
    'AUD-9908',
    480000,
    'Citizen Suresh (Citizen)',
    'Logged open waste burning report',
    'REP-AURA-8101 / Anand Vihar',
    'human',
    'b9a280171e7f16685f66ee1f1aa4d5b03ca946b0eabfc28e039d504360285c65'
  ),
  createAuditLog(
    'AUD-9907',
    600000,
    'PolicyAuditor (AI)',
    'Calculated ₹15,00,000 environmental violation fine',
    'Okhla Waste Plant',
    'agent',
    '0d3ef6943f286d15010e443159873878aae1b0ca66ab1fa924f65fda500dfbec'
  ),
  createAuditLog(
    'AUD-9906',
    750000,
    'Drone Sentinel-Air-01',
    'Completed FLIR aerial plume scan of Sector 1',
    'Wazirpur Stacks',
    'agent',
    'b6a31c0df1faa91d87900aafccc7307a7bb55cdebaa94c132f191d153015cb9b'
  ),
  createAuditLog(
    'AUD-9905',
    900000,
    'AerosolNet (AI)',
    'Synchronized Sentinel-5P TROPOMI raster tiles',
    'National Ingestion Store',
    'agent',
    'ad391f92238456dde4f73da95ebc855f77610de048469e54e8aeb10d397a08f9'
  ),
  createAuditLog(
    'AUD-9904',
    1200000,
    'MeteoForecaster (AI)',
    'Updated 30-Day WRF-Chem atmospheric forecast',
    'City Dispersion Mesh',
    'agent',
    '415bfee8153083ec9376f29548865c0244a5e91d1a82df0b547a10e3f9713eb1'
  ),
  createAuditLog(
    'AUD-9903',
    1500000,
    'Zero-Trust Mesh (System)',
    'Validated SHA-256 telemetry block checksums',
    '3,420 IoT Nodes',
    'system',
    'b4c3847f9bcebdf591ab9ca377d1e0de13493b1dda7f43579d39eaa083d413d7'
  )
];
