import type { DataSource } from '@/types'

export const dataSources: DataSource[] = [
  {
    id: 'src-demo-composite',
    name: 'Demonstration composite (platform teaching model)',
    kind: 'demonstration',
    citation:
      'Internal demonstration dataset assembled for interface development. Not a verified record of a named monument.',
    notes:
      'All geometry, climate values, and condition scores on the demonstration site are labeled simulation unless a later verified dataset is connected.',
  },
  {
    id: 'src-literature-earthen',
    name: 'Literature-derived earthen architecture properties',
    kind: 'literature',
    citation:
      'Generic published ranges for laterite, adobe/banco, and lime mortars in tropical/Sahelian contexts. Not site-specific measurements.',
    notes: 'Use only as material-class priors until laboratory or field tests exist.',
  },
  {
    id: 'src-expert-placeholder',
    name: 'Expert-estimate placeholder',
    kind: 'expert_estimate',
    citation: 'Illustrative conservation ranking for the prototype planning module.',
    notes: 'Requires qualified conservation review before any field action.',
  },
  {
    id: 'src-cyark',
    name: 'CyArk',
    kind: 'literature',
    citation: 'Potential future source for 3D heritage documentation and collaboration.',
    url: 'https://www.cyark.org/',
    notes: 'Not ingested in this prototype. Reserved for later GLB/glTF or survey alignment.',
  },
  {
    id: 'src-zamani',
    name: 'Zamani Project',
    kind: 'literature',
    citation: 'Potential future source for African heritage spatial documentation and 3D models.',
    url: 'https://zamaniproject.org/',
    notes: 'Not ingested. Intended connection for documented African site geometry.',
  },
  {
    id: 'src-maeasam',
    name: 'MAEASaM',
    kind: 'literature',
    citation: 'Potential future source for archaeological site records and threat documentation.',
    url: 'https://maeasam.org/',
    notes: 'Not ingested. Intended connection for threat registers and site records.',
  },
  {
    id: 'src-copernicus',
    name: 'Copernicus Climate Change Service',
    kind: 'literature',
    citation: 'Potential future source for climate observations and projections.',
    url: 'https://climate.copernicus.eu/',
    notes: 'Climate charts currently use labeled demonstration series, not C3S extracts.',
  },
  {
    id: 'src-nasa',
    name: 'NASA Earthdata',
    kind: 'literature',
    citation: 'Potential future source for environmental and remote-sensing datasets.',
    url: 'https://www.earthdata.nasa.gov/',
    notes: 'Not ingested. Intended for later rainfall, flood, and terrain layers.',
  },
]

export function sourceById(id: string): DataSource {
  const found = dataSources.find((s) => s.id === id)
  if (!found) {
    throw new Error(`Unknown data source: ${id}`)
  }
  return found
}
