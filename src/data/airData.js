// Comprehensive Environmental Data for AURA Command Center

export const WARDS_DATA = [
  {
    id: "wazirpur",
    name: "Wazirpur Industrial Sector",
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
    windDir: "NW",
    inversion: "Severe (80m ceiling)",
    status: "Critical",
    sensorId: "AURA-WZP-08",
    firmware: "v4.1.8-Ed25519",
    attested: true,
    sources: ["Electroplating & Smelting Stacks", "Unpaved Truck Corridors", "Diesel Generator Clusters"],
    alertsCount: 8
  },
  {
    id: "anand_vihar",
    name: "Anand Vihar Transit Terminal",
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
    windDir: "NW",
    inversion: "High (110m)",
    status: "Critical",
    sensorId: "AURA-AV-03",
    firmware: "v4.1.8-Ed25519",
    attested: true,
    sources: ["Interstate Diesel Bus Fleet", "Border Toll Congestion", "Open Waste Transfer"],
    alertsCount: 7
  },
  {
    id: "okhla",
    name: "Okhla Phase-III & Incinerator",
    lat: 28.530,
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
    windDir: "WNW",
    inversion: "High (130m)",
    status: "Critical",
    sensorId: "AURA-OKH-12",
    firmware: "v4.1.8-Ed25519",
    attested: true,
    sources: ["Waste-to-Energy Incineration", "Container Depot Traffic", "Fabrication Units"],
    alertsCount: 5
  },
  {
    id: "mayapuri",
    name: "Mayapuri Metal & Scrap Hub",
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
    windDir: "NW",
    inversion: "High (100m)",
    status: "Critical",
    sensorId: "AURA-MYP-04",
    firmware: "v4.1.8-Ed25519",
    attested: true,
    sources: ["Metal Torch Cutting", "Heavy Freight Trucks", "Industrial Resuspension"],
    alertsCount: 6
  },
  {
    id: "jahangirpuri",
    name: "Jahangirpuri Logistics Corridor",
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
    windDir: "NNW",
    inversion: "Severe (70m)",
    status: "Critical",
    sensorId: "AURA-JGP-01",
    firmware: "v4.1.8-Ed25519",
    attested: true,
    sources: ["Warehouse Diesel Gensets", "Highway Ingress Freight", "Unpaved Shoulders"],
    alertsCount: 5
  },
  {
    id: "rohini",
    name: "Rohini Sector 16 Transit Grid",
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
    windDir: "NW",
    inversion: "Moderate (180m)",
    status: "High",
    sensorId: "AURA-ROH-07",
    firmware: "v4.1.8-Ed25519",
    attested: true,
    sources: ["Arterial Vehicular Congestion", "Construction Demolition Zones"],
    alertsCount: 3
  },
  {
    id: "punjabi_bagh",
    name: "Punjabi Bagh Ring Road Junction",
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
    windDir: "WNW",
    inversion: "Moderate (210m)",
    status: "High",
    sensorId: "AURA-PB-02",
    firmware: "v4.1.8-Ed25519",
    attested: true,
    sources: ["Stop-and-Go Ring Road Traffic", "Commercial Bakery Ovens"],
    alertsCount: 2
  },
  {
    id: "igi_airport",
    name: "IGI Airport & Expressway Corridor",
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
    windDir: "W",
    inversion: "Moderate (260m)",
    status: "High",
    sensorId: "AURA-IGI-09",
    firmware: "v4.1.8-Ed25519",
    attested: true,
    sources: ["Aviation Ground Support Equipment", "Expressway Toll Queues"],
    alertsCount: 3
  },
  {
    id: "noida_sec62",
    name: "Sector 62 Institutional Zone",
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
    windDir: "NW",
    inversion: "Moderate (240m)",
    status: "High",
    sensorId: "AURA-ND-62",
    firmware: "v4.1.8-Ed25519",
    attested: true,
    sources: ["Campus Backup Generators", "Peripheral Ring Road Freight"],
    alertsCount: 2
  },
  {
    id: "dwarka",
    name: "Dwarka Sector 12 Residential",
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
    windDir: "W",
    inversion: "Low (310m)",
    status: "Moderate",
    sensorId: "AURA-DWK-14",
    firmware: "v4.1.8-Ed25519",
    attested: true,
    sources: ["Local Commercial Traffic", "Road Dust Suspension"],
    alertsCount: 1
  },
  {
    id: "connaught_place",
    name: "Connaught Place Central Hub",
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
    windDir: "W",
    inversion: "Low (340m)",
    status: "Moderate",
    sensorId: "AURA-CP-01",
    firmware: "v4.1.8-Ed25519",
    attested: true,
    sources: ["Central Commuter Taxis & Autos", "Restaurant Kitchen Exhausts"],
    alertsCount: 1
  },
  {
    id: "cyber_city",
    name: "Cyber City Metro Gateway",
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
    windDir: "WNW",
    inversion: "Low (330m)",
    status: "Moderate",
    sensorId: "AURA-CC-05",
    firmware: "v4.1.8-Ed25519",
    attested: true,
    sources: ["Commercial Office HVAC Plumes", "Peak Hour Feeder Shuttles"],
    alertsCount: 1
  },
  {
    id: "nehru_stadium",
    name: "JLN Stadium & School Belt",
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
    windDir: "W",
    inversion: "Low (380m)",
    status: "Moderate",
    sensorId: "AURA-JLN-02",
    firmware: "v4.1.8-Ed25519",
    attested: true,
    sources: ["School Bus Fleets", "Light Recreational Traffic"],
    alertsCount: 0
  },
  {
    id: "riverfront_east",
    name: "Yamuna Floodplain Eco-Grid",
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
    windDir: "NW",
    inversion: "Moderate (220m)",
    status: "High",
    sensorId: "AURA-YMN-01",
    firmware: "v4.1.8-Ed25519",
    attested: true,
    sources: ["Riparian Agricultural Residue", "Bridge Construction Works"],
    alertsCount: 2
  },
  {
    id: "vasant_kunj",
    name: "Vasant Kunj South Ridge Fringe",
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
    windDir: "WSW",
    inversion: "Clear (450m)",
    status: "Safe",
    sensorId: "AURA-VK-06",
    firmware: "v4.1.8-Ed25519",
    attested: true,
    sources: ["Residential Neighborhood Traffic"],
    alertsCount: 0
  },
  {
    id: "lodhi_green",
    name: "Lodhi Botanical Ecological Sanctuary",
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
    windDir: "W",
    inversion: "Clear (520m)",
    status: "Safe",
    sensorId: "AURA-LOD-01",
    firmware: "v4.1.8-Ed25519",
    attested: true,
    sources: ["Natural Flora Canopy Filtration"],
    alertsCount: 0
  }
];

export const TOP_STAT_METRICS = [
  {
    label: "Active Air Alerts",
    value: "19 Active",
    change: "+18.4%",
    up: true,
    good: false,
    color: "#f43f5e",
    sub: "6 Stage-IV Emergency Wards"
  },
  {
    label: "Pollution Spikes Quelled",
    value: "1,482",
    change: "+22.1%",
    up: true,
    good: true,
    color: "#34d399",
    sub: "Anti-smog guns & diversions"
  },
  {
    label: "IoT Sensors Online",
    value: "3,420",
    change: "99.6%",
    up: true,
    good: true,
    color: "#22d3ee",
    sub: "of 3,435 attested via TPM"
  },
  {
    label: "CEMS Stacks Monitored",
    value: "412 Units",
    change: "100%",
    up: true,
    good: true,
    color: "#a855f7",
    sub: "Zero-bypass telemetry"
  },
  {
    label: "Night Inversion Trapping",
    value: "84% Index",
    change: "+8 pts",
    up: true,
    good: false,
    color: "#f59e0b",
    sub: "Thermal ceiling 80m"
  },
  {
    label: "Clean Air Compliance",
    value: "76/100",
    change: "+4 pts",
    up: true,
    good: true,
    color: "#38bdf8",
    sub: "Municipal GRAP Stage IV"
  }
];

export const HOURLY_TRENDS = [
  { time: "00:00", pm25: 280, pm10: 410, no2: 85, o3: 20 },
  { time: "02:00", pm25: 310, pm10: 440, no2: 90, o3: 18 },
  { time: "04:00", pm25: 345, pm10: 485, no2: 96, o3: 15 },
  { time: "06:00", pm25: 380, pm10: 512, no2: 104, o3: 14 },
  { time: "08:00", pm25: 340, pm10: 470, no2: 98, o3: 25 },
  { time: "10:00", pm25: 290, pm10: 395, no2: 82, o3: 42 },
  { time: "12:00", pm25: 220, pm10: 310, no2: 64, o3: 65 },
  { time: "14:00", pm25: 185, pm10: 260, no2: 52, o3: 78 },
  { time: "16:00", pm25: 205, pm10: 295, no2: 61, o3: 72 },
  { time: "18:00", pm25: 260, pm10: 380, no2: 78, o3: 48 },
  { time: "20:00", pm25: 315, pm10: 430, no2: 89, o3: 32 },
  { time: "22:00", pm25: 335, pm10: 460, no2: 94, o3: 24 }
];

export const SYSTEM_HEALTH_METRICS = [
  { name: "Laser Spectrometer Ingestion", status: "NORMAL", latency: "14ms", load: "78%" },
  { name: "Satellite AOD Downlink (INSAT-3DR)", status: "NORMAL", latency: "112ms", load: "42%" },
  { name: "Atmospheric WRF-Chem Dispersion Engine", status: "NORMAL", latency: "210ms", load: "89%" },
  { name: "Municipal CEMS Stack Gateway", status: "NORMAL", latency: "28ms", load: "54%" },
  { name: "Encrypted Zero-Trust IoT Mesh", status: "NORMAL", latency: "6ms", load: "99.6%" }
];

export const PRIORITY_ALERTS = [
  {
    id: "ALR-DEL-901",
    title: "Severe PM2.5 Exceedance · Wazirpur Smelting Belt",
    ward: "Wazirpur Industrial Sector",
    source: "Uncontrolled Electroplating & Cupola Furnace Stacks",
    type: "industrial",
    severity: "critical",
    score: 9.8,
    exceedance: "+380% above CPCB National Ambient standard",
    affected: "142,000 residents · 18 primary schools in downwind plume",
    timestamp: "12 mins ago",
    activeAction: null,
    escalated: true,
    playbook: [
      { id: "smog_gun", label: "Dispatch Anti-Smog Water Cannons", icon: "Droplets", done: false },
      { id: "school_advisory", label: "Trigger Emergency School Indoor Notice", icon: "Bell", done: false },
      { id: "stack_cutoff", label: "Enforce Stack SCR Bypass Cutoff", icon: "Power", done: false },
      { id: "truck_reroute", label: "Reroute Non-Essential Heavy Trucks", icon: "Truck", done: false }
    ]
  },
  {
    id: "ALR-DEL-894",
    title: "Toxic NO2 & Carbon Monoxide Inversion Stagnation",
    ward: "Anand Vihar Transit Terminal",
    source: "Heavy Diesel Freight Ingress + Low Boundary Layer (90m)",
    type: "vehicular",
    severity: "critical",
    score: 9.4,
    exceedance: "+290% above WHO 24h limit",
    affected: "Toll plaza operators, transit workers, interstate bus commuters",
    timestamp: "24 mins ago",
    activeAction: null,
    escalated: true,
    playbook: [
      { id: "diversion", label: "Activate Border Toll Truck Diversion", icon: "Navigation", done: false },
      { id: "mist_sprinklers", label: "Deploy High-Pressure Road Mist Sprinklers", icon: "CloudRain", done: false },
      { id: "ev_priority", label: "Restrict Terminal to Electric/CNG Fleets", icon: "Zap", done: false }
    ]
  },
  {
    id: "ALR-DEL-887",
    title: "CEMS Stack Telemetry Tamper & SO2 Spike",
    ward: "Okhla Phase-III Industrial Zone",
    source: "Waste-to-Energy Incineration Line 2 Optical Sensor Disconnect",
    type: "cyber_tamper",
    severity: "high",
    score: 8.7,
    exceedance: "Sensor bypass flagged · SO2 predicted 185 µg/m³",
    affected: "South-East ward residential colonies",
    timestamp: "45 mins ago",
    activeAction: null,
    escalated: false,
    playbook: [
      { id: "isolate_unit", label: "Trigger Automated Remote Valve Trip", icon: "ShieldAlert", done: false },
      { id: "audit_squad", label: "Dispatch State Pollution Control Inspection Squad", icon: "FileCheck", done: false },
      { id: "penalize", label: "Issue Section 31A Environmental Penalty Notice", icon: "DollarSign", done: false }
    ]
  },
  {
    id: "ALR-DEL-872",
    title: "Open Biomass & Municipal Plastic Burning Cluster",
    ward: "Riverfront East (Yamuna Floodplain)",
    source: "Illegal Night Agricultural Residue & Open Plastic Smoldering",
    type: "biomass",
    severity: "high",
    score: 8.1,
    exceedance: "Concentrated Black Carbon & Dioxin plume",
    affected: "Trans-Yamuna residential zone downwind",
    timestamp: "1 hour ago",
    activeAction: null,
    escalated: false,
    playbook: [
      { id: "drone_dispatch", label: "Dispatch Drone Sentinel-Air-01 with FLIR", icon: "Plane", done: false },
      { id: "patrol_team", label: "Alert Municipal Flying Squad Patrol 4", icon: "Users", done: false },
      { id: "douse", label: "Coordinate Quick-Response Dousing Tender", icon: "Flame", done: false }
    ]
  },
  {
    id: "ALR-DEL-865",
    title: "Uncovered Construction & Demolition Dust Cloud",
    ward: "Rohini Sector 16 Transit Grid",
    source: "Multi-Storey Flyover Excavation without Dust Curtains",
    type: "dust",
    severity: "medium",
    score: 6.8,
    exceedance: "PM10 instantaneous spike 610 µg/m³",
    affected: "Local transit intersections and shopkeepers",
    timestamp: "2 hours ago",
    activeAction: null,
    escalated: false,
    playbook: [
      { id: "stop_work", label: "Issue Instant 48-Hour Stop-Work Notice", icon: "Ban", done: false },
      { id: "sprinkle_dust", label: "Mandate Continuous Water Foggers", icon: "CloudDrizzle", done: false }
    ]
  }
];

export const INDUSTRIAL_CEMS_STATIONS = [
  {
    id: "CEMS-WZP-01",
    name: "Apex Galvanizing & Metal Works",
    ward: "Wazirpur Industrial Sector",
    pollutant: "SO2 & Acid Mist",
    actual: "192 mg/Nm³",
    limit: "50 mg/Nm³",
    status: "CRITICAL VIOLATION",
    tamperRisk: "LOW",
    fine: "₹ 5,00,000",
    lastReported: "30s ago"
  },
  {
    id: "CEMS-OKH-04",
    name: "Timarpur-Okhla Waste Energy Stack 2",
    ward: "Okhla Phase-III",
    pollutant: "Particulate Matter (PM)",
    actual: "148 mg/Nm³",
    limit: "30 mg/Nm³",
    status: "TAMPER DETECTED",
    tamperRisk: "HIGH",
    fine: "₹ 15,00,000",
    lastReported: "2m ago"
  },
  {
    id: "CEMS-MYP-09",
    name: "Capital Heavy Alloy Castings",
    ward: "Mayapuri Sector",
    pollutant: "NOx & Lead Fumes",
    actual: "410 mg/Nm³",
    limit: "200 mg/Nm³",
    status: "EXCEEDING",
    tamperRisk: "MEDIUM",
    fine: "₹ 2,50,000",
    lastReported: "4m ago"
  },
  {
    id: "CEMS-BAD-03",
    name: "NTPC Gas Turbine Backup Unit B",
    ward: "Badarpur Border",
    pollutant: "NOx",
    actual: "85 mg/Nm³",
    limit: "150 mg/Nm³",
    status: "COMPLIANT",
    tamperRisk: "NONE",
    fine: "₹ 0",
    lastReported: "15s ago"
  },
  {
    id: "CEMS-ND-11",
    name: "Sahibabad Distilleries & Biofuel Unit",
    ward: "East Border Fringe",
    pollutant: "VOC & Carbon",
    actual: "64 mg/Nm³",
    limit: "100 mg/Nm³",
    status: "COMPLIANT",
    tamperRisk: "NONE",
    fine: "₹ 0",
    lastReported: "45s ago"
  }
];

export const LIVE_INGESTION_STREAM = [
  { id: "PKT-84192", time: "20:38:12", source: "AURA-WZP-08:LaserOptic", target: "ingest.aura:8883", protocol: "mTLS / Ed25519", pollutant: "PM2.5: 298 µg/m³", action: "ALLOW", tone: "emerald" },
  { id: "PKT-84193", time: "20:38:14", source: "185.220.101.47:9001", target: "cems.gw.delhi:443", protocol: "RAW-TCP", pollutant: "CEMS False Packet Injection", action: "DROP", tone: "rose" },
  { id: "PKT-84194", time: "20:38:15", source: "CEMS-OKH-04:GasChroma", target: "scada.aura:502", protocol: "Modbus/TLS", pollutant: "SO2: 192 mg/Nm³", action: "FLAG", tone: "amber" },
  { id: "PKT-84195", time: "20:38:18", source: "AURA-AV-03:Particulate", target: "ingest.aura:8883", protocol: "mTLS / AES-256", pollutant: "NO2: 92 ppb (Spike)", action: "FLAG", tone: "amber" },
  { id: "PKT-84196", time: "20:38:21", source: "DRONE-UAV-01:FLIR-Sniff", target: "mesh.aura:8443", protocol: "ChaCha20", pollutant: "VOC Plume 440ppm", action: "ALLOW", tone: "emerald" },
  { id: "PKT-84197", time: "20:38:24", source: "45.95.147.236:44321", target: "api.aura:22", protocol: "SSH-Brute", pollutant: "Sensor Root Compromise Attempt", action: "DROP", tone: "rose" }
];

export const INITIAL_CITIZEN_REPORTS = [
  {
    id: "REP-AURA-8101",
    issue: "Massive Open Waste & Rubber Burning behind Metro Yard",
    location: "Anand Vihar Ward (Sector 4)",
    reporter: "Citizen Suresh V.",
    urgency: "Critical",
    lat: 28.651,
    lng: 77.319,
    timestamp: "Today, 19:15",
    prevHash: "0000000000000000",
    hash: "a4f78c2e91b5d381c002fa8839210084bce4381023a",
    stage: 4,
    statusText: "Fire Doused & Violator Fined"
  },
  {
    id: "REP-AURA-8102",
    issue: "Dense Chemical Fumes & Black Smoke from Fabrication Chimney",
    location: "Wazirpur Industrial Area",
    reporter: "Shopkeeper Association",
    urgency: "High",
    lat: 28.701,
    lng: 77.162,
    timestamp: "Today, 19:42",
    prevHash: "a4f78c2e91b5d381c002fa8839210084bce4381023a",
    hash: "b189cc5f410298ea329188bf01923abdf8374829104",
    stage: 3,
    statusText: "Inspection Team On-Site"
  },
  {
    id: "REP-AURA-8103",
    issue: "Heavy Uncovered Cement Trucks creating white dust storm",
    location: "Rohini Outer Ring Road",
    reporter: "Cyclist Commuter Neha",
    urgency: "Medium",
    lat: 28.730,
    lng: 77.126,
    timestamp: "Today, 20:05",
    prevHash: "b189cc5f410298ea329188bf01923abdf8374829104",
    hash: "c7291a0f839281726354890123984029bcda9283746",
    stage: 2,
    statusText: "Traffic Interceptor Alerted"
  },
  {
    id: "REP-AURA-8104",
    issue: "Illegal Unmuffled 250kVA Diesel Generator Running Continuously",
    location: "Mayapuri Scrap Market",
    reporter: "Local Resident Welfare",
    urgency: "Medium",
    lat: 28.635,
    lng: 77.110,
    timestamp: "Today, 20:20",
    prevHash: "c7291a0f839281726354890123984029bcda9283746",
    hash: "d9382103948572019483726154839201bcde8392019",
    stage: 1,
    statusText: "Report Validated on Ledger"
  }
];

export const AI_AGENTS_ROSTER = [
  {
    id: "aerosol_net",
    name: "AerosolNet",
    role: "Satellite AOD & Optical Spectrometry",
    tasksHandled: "42,890",
    latency: "34ms",
    status: "WORKING",
    avatarColor: "#22d3ee",
    desc: "Ingests INSAT-3DR and Sentinel-5P TROPOMI satellite rasters, computing optical depth and aerosol vertical distribution."
  },
  {
    id: "sentinel_air",
    name: "Sentinel-Air",
    role: "Real-Time Threshold & Plume Anomaly Detector",
    tasksHandled: "184,210",
    latency: "8ms",
    status: "WORKING",
    avatarColor: "#f43f5e",
    desc: "Performs sub-second statistical outlier detection across 3,420 IoT micro-sensors, isolating sudden chemical plumes."
  },
  {
    id: "bio_validator",
    name: "BioValidator",
    role: "Sensor Physics & Condensation Bias Filter",
    tasksHandled: "96,140",
    latency: "19ms",
    status: "WORKING",
    avatarColor: "#34d399",
    desc: "Cross-references optical particle counters against hygroscopic growth curves to prevent false fog/dew alarms."
  },
  {
    id: "meteo_forecaster",
    name: "MeteoForecaster",
    role: "Atmospheric Dispersion & Inversion Engine",
    tasksHandled: "14,500",
    latency: "140ms",
    status: "WORKING",
    avatarColor: "#a855f7",
    desc: "Solves Eulerian grid atmospheric dispersion equations using boundary layer height, wind turbulence and solar flux."
  },
  {
    id: "emergency_responder",
    name: "EmergencyResponder",
    role: "Municipal GRAP Playbook & Resource Allocator",
    tasksHandled: "8,920",
    latency: "45ms",
    status: "WORKING",
    avatarColor: "#fbbf24",
    desc: "Generates precision municipal dispatch directives: anti-smog water cannons, truck diversions, and school alerts."
  },
  {
    id: "policy_auditor",
    name: "PolicyAuditor",
    role: "Clean Air Regulatory & CEMS Fine Assessor",
    tasksHandled: "3,110",
    latency: "28ms",
    status: "WORKING",
    avatarColor: "#38bdf8",
    desc: "Verifies industrial factory telemetry compliance against National Ambient Air Quality Standards and auto-generates fines."
  }
];

export const SAMPLE_AI_QUERIES = [
  "Explain why PM2.5 is spiking in Wazirpur and Anand Vihar tonight",
  "Simulate the atmospheric impact of shutting down 80 industrial diesel gensets",
  "Which schools in downwind corridors need immediate indoor air advisory?",
  "What is the thermal inversion ceiling height and dispersion forecast for tomorrow morning?",
  "Has any factory CEMS unit attempted optical sensor spoofing this week?"
];

export const THIRTY_DAY_FORECAST = Array.from({ length: 30 }, (_, i) => {
  const dayNum = i + 1;
  const date = new Date();
  date.setDate(date.getDate() + i);
  
  // Create realistic winter air quality variation with inversion cycles
  let aqi, risk, windSpeed, temp, rainChance, inversionHeight;
  if (i < 3) {
    aqi = 360 + Math.floor(Math.sin(i) * 30);
    risk = "Critical";
    windSpeed = 3.5;
    temp = 18;
    rainChance = 0;
    inversionHeight = 85;
  } else if (i < 8) {
    aqi = 280 + Math.floor(Math.cos(i) * 35);
    risk = "High";
    windSpeed = 6.2;
    temp = 19;
    rainChance = 5;
    inversionHeight = 160;
  } else if (i < 13) {
    aqi = 190 + Math.floor(Math.sin(i) * 25);
    risk = "Moderate";
    windSpeed = 9.8;
    temp = 21;
    rainChance = 15;
    inversionHeight = 320;
  } else if (i < 18) {
    aqi = 340 + Math.floor(Math.sin(i) * 40);
    risk = "Critical";
    windSpeed = 4.0;
    temp = 17;
    rainChance = 0;
    inversionHeight = 90;
  } else if (i < 24) {
    aqi = 240 + Math.floor(Math.cos(i) * 30);
    risk = "High";
    windSpeed = 7.5;
    temp = 20;
    rainChance = 10;
    inversionHeight = 210;
  } else {
    aqi = 145 + Math.floor(Math.sin(i) * 30);
    risk = "Moderate";
    windSpeed = 11.2;
    temp = 22;
    rainChance = 40;
    inversionHeight = 420;
  }

  return {
    day: dayNum,
    dateStr: date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }),
    fullDate: date.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    aqi,
    risk,
    windSpeed,
    temp,
    rainChance,
    inversionHeight,
    peakPollutant: aqi > 250 ? "PM2.5 (Fine Combustion Particles)" : aqi > 180 ? "PM10 (Resuspended Road Dust)" : "O3 (Photochemical Ozone)",
    grapStage: aqi > 350 ? "Stage IV (Severe+ Emergency)" : aqi > 280 ? "Stage III (Severe Action)" : aqi > 200 ? "Stage II (Very Poor)" : "Stage I (Moderate Watch)",
    briefing: aqi > 300 
      ? "Severe thermal boundary inversion trapping high-density vehicular and industrial exhaust. Unfavourable dispersion conditions. Anti-smog measures strictly enforced."
      : aqi > 200
      ? "Moderate wind ventilation clearing afternoon surface boundary layer, with evening particulate buildup expected. Vulnerable groups advised to wear N95."
      : "Strong convective mixing and elevated wind currents creating favourable dispersion. Ambient air quality within tolerable municipal thresholds."
  };
});

export const DRONE_MISSION_DATA = {
  droneId: "UAV Sentinel-Air-01",
  model: "Octocopter Hexa-Rotary Aerosol Profiler",
  callsign: "AURA-VANGUARD-DELTA",
  status: "IN FLIGHT - PATROLLING SECTOR NORTH",
  battery: 84,
  altitude: 85,
  speed: 18.4,
  heading: "042° NE",
  linkQuality: "99.8% (Encrypted 5G / LoRa)",
  cipher: "ChaCha20-Poly1305 · Ed25519",
  antiSpoof: "Multi-Band GNSS Carrier Phase Check: OK",
  verticalProfile: [
    { alt: "10m (Ground)", pm25: 312, label: "Street Resuspension Layer" },
    { alt: "35m (Canopy)", pm25: 278, label: "Building Wake Zone" },
    { alt: "85m (Inversion Base)", pm25: 395, label: "Boundary Layer Trapping Peak" },
    { alt: "140m (Free Troposphere)", pm25: 110, label: "Clean Air Above Inversion" }
  ],
  waypoints: [
    { id: 1, name: "Wazirpur Smelting Stacks", time: "19:40", dist: "1.2 km", status: "Completed", result: "3 industrial stack plumes mapped" },
    { id: 2, name: "Azadpur Mandi Logistics Junction", time: "20:05", dist: "2.1 km", status: "Completed", result: "High diesel NO2 corridor flagged" },
    { id: 3, name: "Jahangirpuri Warehouse Cluster", time: "20:30", dist: "1.8 km", status: "In Progress", result: "Measuring vertical particulate boundary" },
    { id: 4, name: "GT Karnal Highway Checkpost", time: "20:55", dist: "3.4 km", status: "Queued", result: "Truck queue emission surveillance" },
    { id: 5, name: "Civil Lines Riverfront Landing Pad", time: "21:20", dist: "2.8 km", status: "Queued", result: "Automated battery hot-swap & dock" }
  ]
};

export const INITIAL_AUDIT_LOGS = [
  { id: "AUD-9912", ts: Date.now() - 45000, actor: "EmergencyResponder (AI)", action: "Auto-dispatched 4 Anti-Smog Cannons", target: "Wazirpur Sector East", type: "agent", hash: "e4f82901a9382b7c610283" },
  { id: "AUD-9911", ts: Date.now() - 120000, actor: "Analyst Akshith (Human)", action: "Elevated Incident ALR-DEL-901 to Stage-IV", target: "Municipal Control Room", type: "human", hash: "d1928374a019283b746192" },
  { id: "AUD-9910", ts: Date.now() - 240000, actor: "BioValidator (AI)", action: "Filtered 18 false sensor condensation spikes", target: "Riverfront East Sensors", type: "agent", hash: "c9018273f019283a847192" },
  { id: "AUD-9909", ts: Date.now() - 360000, actor: "CEMS Gateway (System)", action: "Flagged Tamper Alert on Stack 2 Incinerator", target: "Okhla CEMS-OKH-04", type: "system", hash: "b8102938e9182736450192" },
  { id: "AUD-9908", ts: Date.now() - 480000, actor: "Citizen Suresh (Citizen)", action: "Logged open waste burning report", target: "REP-AURA-8101 / Anand Vihar", type: "human", hash: "a4f78c2e91b5d381c002fa" },
  { id: "AUD-9907", ts: Date.now() - 600000, actor: "PolicyAuditor (AI)", action: "Calculated ₹15,00,000 environmental violation fine", target: "Okhla Waste Plant", type: "agent", hash: "9f810293e8172635401928" },
  { id: "AUD-9906", ts: Date.now() - 750000, actor: "Drone Sentinel-Air-01", action: "Completed FLIR aerial plume scan of Sector 1", target: "Wazirpur Stacks", type: "agent", hash: "8e716253d7162534918273" },
  { id: "AUD-9905", ts: Date.now() - 900000, actor: "AerosolNet (AI)", action: "Synchronized Sentinel-5P TROPOMI raster tiles", target: "National Ingestion Store", type: "agent", hash: "7d615243c6152439182736" },
  { id: "AUD-9904", ts: Date.now() - 1200000, actor: "MeteoForecaster (AI)", action: "Updated 30-Day WRF-Chem atmospheric forecast", target: "City Dispersion Mesh", type: "agent", hash: "6c514233b5142338172635" },
  { id: "AUD-9903", ts: Date.now() - 1500000, actor: "Zero-Trust Mesh (System)", action: "Rotated Ed25519 sensor attestation keys", target: "3,420 IoT Nodes", type: "system", hash: "5b413222a4132227162534" }
];
