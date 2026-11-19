/**
 * @file iaqHacks.js
 * Database of scientifically proven, low-cost Indoor Air Quality (IAQ) hacks
 * for families, with CADR ratings, cost breakdowns, and step-by-step instructions.
 */

export const IAQ_HACKS = [
  {
    id: 'corsi_rosenthal',
    title: 'DIY Corsi-Rosenthal Box Air Purifier',
    category: 'High-Efficiency Filtration',
    costInr: 1450,
    commercialAlternativeInr: 18500,
    cadrRating: '450 m³/hr (Equal to 3 commercial units)',
    pm25ReductionPct: 92,
    difficulty: 'Easy (30 mins setup)',
    materials: [
      '1x 20-inch Domestic Box Fan (or Exhaust Fan)',
      '4x MERV-13 (or HEPA H11) pleated AC filters (20" x 20")',
      '1x Cardboard bottom shroud',
      '1x Roll of heavy-duty duct tape'
    ],
    steps: [
      'Arrange the 4 filters into a cube with airflow arrows pointing inward towards center.',
      'Tape the filter corners together firmly with duct tape ensuring zero air leakage gaps.',
      'Tape cardboard square to bottom of the cube to seal the base.',
      'Mount the box fan on top facing upward, pulling air through the 4 filters and blowing clean air up.',
      'Add a circular cardboard shroud around fan blades to eliminate corner air turbulence.'
    ],
    scientificExplanation:
      'By using 4 filters simultaneously, the surface area increases 4x. This lowers resistance, allowing the fan to move massive air volumes silently while trapping 92% of sub-micron soot particles.',
    badge: 'TOP FAMILY HACK · 92% PM2.5 REDUCTION',
    badgeColor: '#34d399'
  },
  {
    id: 'wet_mopping_protocol',
    title: 'Damp Microfiber Wet-Mopping (Broom Elimination)',
    category: 'Dust Resuspension Control',
    costInr: 250,
    commercialAlternativeInr: 4500,
    cadrRating: 'Eliminates 75% surface resuspension',
    pm25ReductionPct: 75,
    difficulty: 'Immediate Habit',
    materials: [
      '2x Microfiber electrostatic flat mops',
      'Warm water bucket with 1 tsp vegetable glycerin or mild soap',
      'Strict ban on traditional dry straw brooms during smog season'
    ],
    steps: [
      'Straw brooms pulverize settled toxic heavy metals and fling PM10 back into breathing zone for 2 hours.',
      'Use damp microfiber mop moving in an S-pattern across the floor.',
      'Rinse microfiber pad after every single room to permanently trap soot.',
      'Clean horizontal surfaces (shelves, TV consoles, bed frames) with damp cloth before mopping floors.'
    ],
    scientificExplanation:
      'Particulates settled overnight have aerodynamic diameters of 2.5–10 µm. Wet mopping uses capillary action to bind particles to water droplets, preventing respiratory re-inhalation.',
    badge: 'ZERO RESUSPENSION · INSTANT RELIEF',
    badgeColor: '#22d3ee'
  },
  {
    id: 'weatherstrip_seals',
    title: 'Acoustic & Foam Window Weatherstripping',
    category: 'Building Envelope Infiltration',
    costInr: 350,
    commercialAlternativeInr: 12000,
    cadrRating: 'Reduces outdoor infiltration by 65%',
    pm25ReductionPct: 65,
    difficulty: 'Moderate (1 hour for full apartment)',
    materials: [
      'Self-adhesive EPDM rubber or closed-cell foam tape (10m roll)',
      'Silicone door sweep for bottom of front entry door',
      'Heavy blackout thermal curtains over glass balconies'
    ],
    steps: [
      'Clean window aluminum/wood frame tracks with rubbing alcohol to remove grease.',
      'Apply foam weatherstrip along inner mating edges where sliding windows meet.',
      'Install silicone sweep on main entryway door to block hallway dust drafts.',
      'Keep heavy thermal curtains drawn during night inversion to create insulating air buffer.'
    ],
    scientificExplanation:
      'Urban apartments leak 0.8–1.5 air changes per hour through micro-cracks. Sealing drafts reduces outdoor smoke infiltration from 70% down to under 25%.',
    badge: 'INFILTRATION BARRIER · 65% SHIELD',
    badgeColor: '#fbbf24'
  },
  {
    id: 'kitchen_pressure_hack',
    title: 'Kitchen Negative-Pressure Cooking Protocol',
    category: 'Indoor VOC & Combustion Control',
    costInr: 0,
    commercialAlternativeInr: 8000,
    cadrRating: 'Prevents 180 µg/m³ indoor VOC spikes',
    pm25ReductionPct: 80,
    difficulty: 'Zero Cost Habit',
    materials: [
      'Existing kitchen exhaust fan / chimney hood',
      'Kitchen door or curtain seal',
      'Cracked utility balcony window'
    ],
    steps: [
      'Turn on exhaust fan 3 minutes BEFORE turning on stove to establish directional draft.',
      'Close kitchen door to living/sleeping rooms to isolate ultrafine oil droplets.',
      'Slightly crack the external kitchen utility balcony window by 2 inches to supply makeup air.',
      'Switch frying to boiling/steaming during Stage-IV smog emergency days.'
    ],
    scientificExplanation:
      'Cooking without makeup air creates positive indoor pressure, forcing toxic acrolein and ultrafine oil particulates into children bedrooms where they linger for 6+ hours.',
    badge: 'ZERO COST · PEDIATRIC COUGH SHIELD',
    badgeColor: '#fb923c'
  },
  {
    id: 'plant_biofiltration',
    title: 'NASA Phytoremediation Indoor Bio-Wall',
    category: 'Biological Air Purification',
    costInr: 800,
    commercialAlternativeInr: 6500,
    cadrRating: 'Absorbs formaldehyde & produces night O2',
    pm25ReductionPct: 35,
    difficulty: 'Low Maintenance',
    materials: [
      '3x Sansevieria Trifasciata (Snake Plant / Mother-in-Law Tongue)',
      '2x Areca Palms (Chrysalidocarpus lutescens)',
      '2x Money Plants (Epipremnum aureum)',
      'Clay pots with gravel drainage'
    ],
    steps: [
      'Place Snake Plants directly beside bedroom beds: they perform CAM photosynthesis, releasing fresh O2 during night sleep.',
      'Position Areca Palms in living areas: they act as natural humidifiers, transpiring 1 liter of moisture per 24 hours.',
      'Wipe plant leaves weekly with damp cotton cloth to remove dust blocking stomata pores.'
    ],
    scientificExplanation:
      'Rhizosphere microbes in plant roots break down benzene, formaldehyde, and carbon monoxide, while transpiration maintains healthy 50% relative mucosal humidity.',
    badge: 'NATURAL OXYGEN & HUMIDITY',
    badgeColor: '#c084fc'
  },
  {
    id: 'respirator_fit_hack',
    title: 'Pediatric & Senior N95 Mask Fit Optimization',
    category: 'Personal Protective Equipment',
    costInr: 120,
    commercialAlternativeInr: 2500,
    cadrRating: 'Upgrades mask efficiency from 50% to 95%',
    pm25ReductionPct: 95,
    difficulty: 'Quick 2-minute check',
    materials: [
      'Certified ISI / NIOSH N95 / FFP2 respirators',
      'Hypoallergenic medical paper tape for nose bridge',
      'Adjustable elastic cord ear-saver headband'
    ],
    steps: [
      'Never use surgical masks or cloth handkerchiefs: their leak rate exceeds 65% for sub-micron winter smog particles.',
      'Use paper tape over nasal metal strip to eliminate glasses fogging (which indicates leakage).',
      'Use an ear-saver strap behind neck to ensure snug perimeter seal against cheeks and chin.',
      'Perform user seal check: exhale gently; mask should puff slightly without air escaping edges.'
    ],
    scientificExplanation:
      'A loose mask with a 2% perimeter gap lets in over 50% of unfiltered ambient air via the path of least resistance. Perfect seal guarantees 95% particle capture.',
    badge: 'CLINICAL GRADE PERSONAL SEAL',
    badgeColor: '#fb7185'
  }
];
