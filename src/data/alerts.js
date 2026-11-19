/**
 * Priority Incident Alerts for Emergency Smog Command & Playbook Action.
 */

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
