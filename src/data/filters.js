export const FILTER_TYPES = [
  {
    id: 'effects',
    title: 'Effects'
  },
  {
    id: 'styles',
    title: 'Styles'
  }
];

export const FILTERS_EFFECTS = [
  {
    id: 'vader',
    title: 'Vader',
    type: 'effects',
    transformations: [
      'l_vader-helmet_oxjh4x,g_faces,h_1.0,fl_region_relative'
    ]
  },
  {
    id: 'deal-with-it',
    title: 'Deal With It',
    type: 'effects',
    transformations: [
      'l_deal-with-it_s5jd3v,g_faces,w_0.7,y_-0.05,fl_region_relative'
    ]
  },
]

export const FILTERS_STYLES = [
  { type: 'styles', id: 'al_dente', title: 'Al Dente', effects: [ 'e_art:al_dente' ] },
  { type: 'styles', id: 'athena', title: 'Athena', effects: [ 'e_art:athena' ] },
  { type: 'styles', id: 'audrey', title: 'Audrey', effects: [ 'e_art:audrey' ] },
  { type: 'styles', id: 'aurora', title: 'Aurora', effects: [ 'e_art:aurora' ] },
  { type: 'styles', id: 'daguerre', title: 'Daguerre', effects: [ 'e_art:daguerre' ] },
  { type: 'styles', id: 'eucalyptus', title: 'Eucalyptus', effects: [ 'e_art:eucalyptus' ] },
  { type: 'styles', id: 'fes', title: 'Fes', effects: [ 'e_art:fes' ] },
  { type: 'styles', id: 'frost', title: 'Frost', effects: [ 'e_art:frost' ] },
  { type: 'styles', id: 'hairspray', title: 'Hairspray', effects: [ 'e_art:hairspray' ] },
  { type: 'styles', id: 'hokusai', title: 'Hokusai', effects: [ 'e_art:hokusai' ] },
  { type: 'styles', id: 'incognito', title: 'Incognito', effects: [ 'e_art:incognito' ] },
  { type: 'styles', id: 'linen', title: 'Linen', effects: [ 'e_art:linen' ] },
  { type: 'styles', id: 'peacock', title: 'Peacock', effects: [ 'e_art:peacock' ] },
  { type: 'styles', id: 'primavera', title: 'Primavera', effects: [ 'e_art:primavera' ] },
  { type: 'styles', id: 'quartz', title: 'Quartz', effects: [ 'e_art:quartz' ] },
  { type: 'styles', id: 'red_rock', title: 'Red Rock', effects: [ 'e_art:red_rock' ] },
  { type: 'styles', id: 'refresh', title: 'Refresh', effects: [ 'e_art:refresh' ] },
  { type: 'styles', id: 'sizzle', title: 'Sizzle', effects: [ 'e_art:sizzle' ] },
  { type: 'styles', id: 'sonnet', title: 'Sonnet', effects: [ 'e_art:sonnet' ] },
  { type: 'styles', id: 'ukulele', title: 'Ukulele', effects: [ 'e_art:ukulele' ] },
  { type: 'styles', id: 'zorro', title: 'Zorro', effects: [ 'e_art:zorro' ] },
];

export const ALL_FILTERS = [...FILTERS_STYLES, ...FILTERS_EFFECTS];