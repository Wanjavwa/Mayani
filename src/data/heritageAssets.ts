export interface HeritageFeature {
  id: string
  name: string
  anchor: [number, number, number]
  description: string
  condition: string
  confidence: 'illustrative' | 'documented'
  source: string
}

export interface HeritageAsset {
  id: string
  name: string
  country: string
  historicalContext: string
  description: string
  siteType: string
  creator: string
  source: string
  sourceUrl: string
  modelStatus: string
  fileFormat: string
  license: string
  intendedUse: string
  fileSizeApprox: string
  browserSuitability: string
  accessMode: string
  sourceNote: string
  embedUrl?: string
  modelPath?: string
  features: HeritageFeature[]
}

export const heritageAssets: HeritageAsset[] = [
  {
    id: 'beta-giorgis-lalibela',
    name: 'Beta Giorgis (textured), Lalibela',
    country: 'Ethiopia',
    historicalContext:
      'Beta Giorgis is one of the 13 rock-hewn churches at Lalibela, a UNESCO World Heritage site associated with the late Aksumite and early medieval Ethiopian Christian kingdom.',
    description:
      'This real-world heritage model was captured by the Zamani Project using terrestrial laser scanning and photographic documentation of the church interior and approach geometry. It is being tested in the Mayani viewer as a live Sub-Saharan heritage asset reference.',
    siteType: 'Rock-hewn church and carved subterranean chamber complex',
    creator: 'Zamani Project-UCT',
    source: 'Sketchfab: Beta Giorgis (textured), Lalibela, Ethiopia',
    sourceUrl: 'https://sketchfab.com/3d-models/beta-giorgis-textured-lalibela-ethiopia-bbd290c2a74e46af9f0671573251034d',
    modelStatus: 'Real public heritage asset for browser testing',
    fileFormat: 'Textured 3D mesh / Sketchfab downloadable model',
    license: 'Public asset credited to Zamani Project-UCT; retain attribution and the relevant public license notice for reuse.',
    intendedUse: 'Prototype digital twin demonstration and heritage viewer testing for a public, attribution-based presentation.',
    fileSizeApprox: 'Approx. 245 MB download size',
    browserSuitability: 'High, when displayed through the Sketchfab embed viewer in-browser',
    accessMode: 'Embedded live model via Sketchfab viewer; credit remains required',
    sourceNote:
      'This asset is a public Sketchfab model by Zamani Project-UCT and is being tested as the first real Sub-Saharan heritage asset in the Mayani prototype. Attribution should remain visible in the viewer and related project text.',
    embedUrl: 'https://sketchfab.com/models/bbd290c2a74e46af9f0671573251034d/embed?autostart=1&ui_infos=0&ui_controls=1&ui_animations=0&ui_stop=0&ui_inspector=0&ui_watermark=1&ui_watermark_link=1',
    features: [
      {
        id: 'entry-court',
        name: 'Entry court',
        anchor: [0, 1.1, 3.2],
        description: 'Approach and entrance zone for the carved church complex.',
        condition: 'Surface erosion and accumulated stone dust are expected in exposed carved passages.',
        confidence: 'documented',
        source: 'Public Zamani model metadata and heritage description.',
      },
      {
        id: 'church-shell',
        name: 'Church shell',
        anchor: [0, 2.7, 0],
        description: 'Main monolithic shell and carved chamber body.',
        condition: 'Stone weathering and joint degradation are present in the public heritage record.',
        confidence: 'documented',
        source: 'Public Zamani Project documentation.',
      },
      {
        id: 'niche-passage',
        name: 'Niche passage',
        anchor: [-2.5, 1.4, -1.2],
        description: 'Carved trench and passage elements linking the broader monolith complex.',
        condition: 'Micro-surface loss and moisture-driven detrition are likely in exposed passages.',
        confidence: 'illustrative',
        source: 'Illustrative heritage interpretation for UI testing.',
      },
    ],
  },
]

export const heritageAsset = heritageAssets[0]
