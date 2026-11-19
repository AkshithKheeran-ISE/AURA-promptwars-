/**
 * Network Ingestion Streams, Drone Surveillance, and Initial Cryptographic Audit Logs.
 */

export const createIngestionPacket = (
  id,
  time,
  source,
  target,
  protocol,
  pollutant,
  action,
  tone
) => ({
  id,
  time,
  source,
  target,
  protocol,
  pollutant,
  action,
  tone
});

export const createAuditLog = (id, offsetMs, actor, action, target, type, hash) => ({
  id,
  ts: Date.now() - offsetMs,
  actor,
  action,
  target,
  type,
  hash
});

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
