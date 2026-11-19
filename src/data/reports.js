/**
 * Immutable Citizen Smog Reports Initial Ledger Baseline.
 */

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
