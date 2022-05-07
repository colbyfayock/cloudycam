import { CLOUDINARY_ASSETS_FOLDER } from '@data/cloudinary';

export const FILTER_TYPES = [
  {
    id: 'effects',
    title: 'Effects',
  },
  {
    id: 'styles',
    title: 'Styles',
  },
  {
    id: 'backgrounds',
    title: 'Backgrounds',
    checkActive: (cldData) => !!cldData.transparent?.public_id,
  },
  // {
  //   id: 'crops',
  //   title: 'Crops',
  // },
  {
    id: 'frames',
    title: 'Frames',
  },
];

export const FILTERS_EFFECTS = [
  {
    id: 'vader',
    title: 'Vader',
    type: 'effects',
    transformations: [`l_${CLOUDINARY_ASSETS_FOLDER}:vader-helmet,g_faces,h_1.0,fl_region_relative`],
  },
  {
    id: 'guy-fawkes',
    title: 'Guy Fawkes',
    type: 'effects',
    transformations: [`l_${CLOUDINARY_ASSETS_FOLDER}:guy-fawkes,g_faces,h_0.8,fl_region_relative`],
  },
  {
    id: 'dali',
    title: 'Dali',
    type: 'effects',
    transformations: [`l_${CLOUDINARY_ASSETS_FOLDER}:dali,g_faces,h_1.0,fl_region_relative`],
  },
  {
    id: 'deal-with-it',
    title: 'Deal With It',
    type: 'effects',
    transformations: [`l_${CLOUDINARY_ASSETS_FOLDER}:deal-with-it,g_faces,w_0.7,y_-0.05,fl_region_relative`],
  },
  {
    id: 'pixelate',
    title: 'Pixelate',
    type: 'effects',
    transformations: [`e_pixelate_faces`],
  },
];

export const FILTERS_STYLES = [
  { type: 'styles', id: 'al_dente', title: 'Al Dente', effects: ['e_art:al_dente'] },
  { type: 'styles', id: 'athena', title: 'Athena', effects: ['e_art:athena'] },
  { type: 'styles', id: 'audrey', title: 'Audrey', effects: ['e_art:audrey'] },
  { type: 'styles', id: 'aurora', title: 'Aurora', effects: ['e_art:aurora'] },
  { type: 'styles', id: 'daguerre', title: 'Daguerre', effects: ['e_art:daguerre'] },
  { type: 'styles', id: 'eucalyptus', title: 'Eucalyptus', effects: ['e_art:eucalyptus'] },
  { type: 'styles', id: 'fes', title: 'Fes', effects: ['e_art:fes'] },
  { type: 'styles', id: 'frost', title: 'Frost', effects: ['e_art:frost'] },
  { type: 'styles', id: 'hairspray', title: 'Hairspray', effects: ['e_art:hairspray'] },
  { type: 'styles', id: 'hokusai', title: 'Hokusai', effects: ['e_art:hokusai'] },
  { type: 'styles', id: 'incognito', title: 'Incognito', effects: ['e_art:incognito'] },
  { type: 'styles', id: 'linen', title: 'Linen', effects: ['e_art:linen'] },
  { type: 'styles', id: 'peacock', title: 'Peacock', effects: ['e_art:peacock'] },
  { type: 'styles', id: 'primavera', title: 'Primavera', effects: ['e_art:primavera'] },
  { type: 'styles', id: 'quartz', title: 'Quartz', effects: ['e_art:quartz'] },
  { type: 'styles', id: 'red_rock', title: 'Red Rock', effects: ['e_art:red_rock'] },
  { type: 'styles', id: 'refresh', title: 'Refresh', effects: ['e_art:refresh'] },
  { type: 'styles', id: 'sizzle', title: 'Sizzle', effects: ['e_art:sizzle'] },
  { type: 'styles', id: 'sonnet', title: 'Sonnet', effects: ['e_art:sonnet'] },
  { type: 'styles', id: 'ukulele', title: 'Ukulele', effects: ['e_art:ukulele'] },
  { type: 'styles', id: 'zorro', title: 'Zorro', effects: ['e_art:zorro'] },
];

export const FILTERS_BACKGROUNDS = [
  // {
  //   id: 'cityjs',
  //   title: 'City JS',
  //   type: 'backgrounds',
  //   transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:cityjs,c_fill,w_1.0,h_1.0,fl_relative`],
  //   allowedEvents: [
  //     'cityjsbrazil'
  //   ]
  // },
  {
    id: 'jsdaycanarias-stage',
    title: 'JSDay Canarias',
    type: 'backgrounds',
    transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:jsdaycanarias-stage,c_fill,w_1.0,h_1.0,fl_relative`],
  },
  // {
  //   id: 'jsdaycanarias-audience',
  //   title: 'JSDay Canarias',
  //   type: 'backgrounds',
  //   transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:jsdaycanarias-audience,c_fill,w_1.0,h_1.0,fl_relative`],
  // },
  {
    id: 'moon',
    title: 'Moon',
    type: 'backgrounds',
    transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:moon-earth,c_fill,w_1.0,h_1.0,fl_relative`],
  },
  {
    id: 'this-is-fine',
    title: 'This Is Fine',
    type: 'backgrounds',
    transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:this_is_fine,c_fill,w_1.0,h_1.0,fl_relative`],
  },
  {
    id: 'mario',
    title: 'Mario',
    type: 'backgrounds',
    transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:mario,c_fill,w_1.0,h_1.0,fl_relative`],
  },
  {
    id: 'the-office',
    title: 'The Office',
    type: 'backgrounds',
    transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:the_office,c_fill,w_1.0,h_1.0,fl_relative`],
  },
  {
    id: 'whats-going-on',
    title: "What's going on?",
    type: 'backgrounds',
    transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:whats-going-on,c_fill,w_1.0,h_1.0,fl_relative`],
  },
  {
    id: 'beach',
    title: 'Beach',
    type: 'backgrounds',
    transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:beach,c_fill,w_1.0,h_1.0,fl_relative`],
  },
];

export const FILTERS_FRAMES = [
  {
    id: 'border',
    title: 'Solid Border',
    type: 'frames',
    transformations: ['bo_40px_solid_rgb:eebd41'],
    thumb: {
      transformations: ['bo_5px_solid_rgb:eebd41'],
    },
  },
  {
    id: 'friends',
    title: 'Friends',
    type: 'frames',
    baseTransformations: ['c_thumb,g_faces,h_480,w_360', 'fl_layer_apply,g_north_west,x_170,y_130'],
    transformations: [`l_${CLOUDINARY_ASSETS_FOLDER}:friends_frame,w_1.0,h_1.0,fl_region_relative`],
  },
];

export const FILTERS_CROPS = [
  {
    id: 'rounded',
    title: 'Rounded',
    type: 'crops',
    transformations: ['r_20'],
  },
  {
    id: 'circle',
    title: 'Circle',
    type: 'crops',
    transformations: ['r_max'],
  },
];

export const ALL_FILTERS = [
  ...FILTERS_STYLES,
  ...FILTERS_EFFECTS,
  ...FILTERS_BACKGROUNDS,
  ...FILTERS_FRAMES,
  ...FILTERS_CROPS,
];
