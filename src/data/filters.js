import { CLOUDINARY_ASSETS_FOLDER } from '@data/cloudinary';

export const FILTER_ID_NONE = 'NONE';

// Ideas
// https://cloudinary.com/product_updates/outline_effect

export const FILTER_TYPES = [
  {
    id: 'effects',
    title: 'Effects',
    applyOrder: 2,
  },
  {
    id: 'styles',
    title: 'Styles',
    applyOrder: 3,
  },
  {
    id: 'backgrounds',
    title: 'Backgrounds',
    checkActive: ({ transparent }) => !!transparent?.public_id,
    applyOrder: 1,
  },
  // {
  //   id: 'more',
  //   title: 'More',
  //   applyOrder: 4,
  // },
  // {
  //   id: 'crops',
  //   title: 'Crops',
  // },
];

export const FILTERS_EFFECTS = [
  {
    id: 'unicorn-mask',
    title: 'Unicorn',
    type: 'effects',
    transformations: [
      `l_${CLOUDINARY_ASSETS_FOLDER}:unicorn-mask,c_scale,h_3.3,fl_region_relative/fl_layer_apply,fl_no_overflow,g_adv_faces,x_0.03,y_-0.14,a_-15`,
    ],
  },
  {
    id: 'vader',
    title: 'Darth Vader',
    type: 'effects',
    transformations: [
      `l_${CLOUDINARY_ASSETS_FOLDER}:vader-helmet,c_scale,h_2.0,fl_region_relative/fl_layer_apply,fl_no_overflow,g_adv_faces,x_0.01,y_-0.05`,
    ],
  },
  {
    id: 'guy-fawkes',
    title: 'Guy Fawkes',
    type: 'effects',
    transformations: [
      `l_${CLOUDINARY_ASSETS_FOLDER}:guy-fawkes,c_scale,h_1.35,fl_region_relative/fl_layer_apply,fl_no_overflow,g_adv_faces`,
    ],
  },
  {
    id: 'dali',
    title: 'Dali',
    type: 'effects',
    transformations: [
      `l_${CLOUDINARY_ASSETS_FOLDER}:dali,c_scale,w_1.65,fl_region_relative/fl_layer_apply,fl_no_overflow,g_adv_faces`,
    ],
  },
  {
    id: 'deal-with-it',
    title: 'Deal With It',
    type: 'effects',
    transformations: [
      `l_${CLOUDINARY_ASSETS_FOLDER}:deal-with-it,c_scale,w_1.0,fl_region_relative/fl_layer_apply,fl_no_overflow,g_adv_faces,y_-0.07`,
    ],
  },
  {
    id: 'pixelate',
    title: 'Pixelate',
    type: 'effects',
    transformations: [`e_pixelate_faces`],
  },
];

export const FILTERS_STYLES = [
  { type: 'styles', id: 'grayscale', title: 'Grayscale', transformations: ['e_grayscale'] },
  { type: 'styles', id: 'negative', title: 'Negative', transformations: ['e_negate'] },
  { type: 'styles', id: 'sepia', title: 'Sepia', transformations: ['e_sepia'] },
  { type: 'styles', id: 'vibe', title: 'Vibe', transformations: ['e_tint:100:0000FF:0p:FF1493:100p'] },
  { type: 'styles', id: 'vectorize', title: 'Vectorize', transformations: ['e_vectorize:3:0.5:0.1'] },
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
  // {
  //   id: 'jsdaycanarias-stage',
  //   title: 'JSDay Canarias',
  //   type: 'backgrounds',
  //   transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:jsdaycanarias-stage,c_fill,w_1.0,h_1.0,fl_relative`],
  // },
  // {
  //   id: 'jsdaycanarias-audience',
  //   title: 'JSDay Canarias',
  //   type: 'backgrounds',
  //   transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:jsdaycanarias-audience,c_fill,w_1.0,h_1.0,fl_relative`],
  // },
  // {
  //   id: 'tenerife',
  //   title: 'Tenerife',
  //   type: 'backgrounds',
  //   transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:tenerife,c_fill,w_1.0,h_1.0,fl_relative`],
  // },
  // {
  //   id: 'vueconf-beach',
  //   title: 'VueConf Beach',
  //   type: 'backgrounds',
  //   transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:vueconf-beach,c_fill,w_1.0,h_1.0,fl_relative`],
  // },
  // {
  //   id: 'vueconf-stage',
  //   title: 'VueConf Stage',
  //   type: 'backgrounds',
  //   transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:vueconf-stage,c_fill,w_1.0,h_1.0,fl_relative`],
  // },
  // {
  //   id: 'reactnorway-stage',
  //   title: 'React Norway',
  //   type: 'backgrounds',
  //   transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:reactnorway-stage,c_fill,w_1.0,h_1.0,fl_relative`],
  // },
  // {
  //   id: 'reactnorway-larvik',
  //   title: 'Larvik',
  //   type: 'backgrounds',
  //   transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:reactnorway-larvik,c_fill,w_1.0,h_1.0,fl_relative`],
  // },
  // {
  //   id: 'cityjssg-singapore',
  //   title: 'Singapore',
  //   type: 'backgrounds',
  //   transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:singapore-towers,c_fill,w_1.0,h_1.0,fl_relative`],
  // },
  // {
  //   id: 'cascadiajs',
  //   title: 'CascadiaJS',
  //   type: 'backgrounds',
  //   transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:cascadiajs,c_fill,w_1.0,h_1.0,fl_relative`],
  // },
  // {
  //   id: 'bend-or',
  //   title: 'Bend, OR',
  //   type: 'backgrounds',
  //   transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:bend-or,c_fill,w_1.0,h_1.0,fl_relative`],
  // },
  // {
  //   id: 'mississippi-capitol',
  //   title: 'Mississippi Capitol',
  //   type: 'backgrounds',
  //   transformations: [
  //     `u_${CLOUDINARY_ASSETS_FOLDER}:mississippi-capitol,c_fill,w_1.0,h_1.0,fl_relative/fl_layer_apply`,
  //   ],
  // },
  // {
  //   id: 'ato-earth',
  //   title: 'ATO Earth',
  //   type: 'backgrounds',
  //   transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:ato-earth,c_fill,w_1.0,h_1.0,fl_relative/fl_layer_apply`],
  // },
  // {
  //   id: 'ato-astronaut',
  //   title: 'ATO Astronaut',
  //   type: 'backgrounds',
  //   transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:ato-astronaut,c_fill,w_1.0,h_1.0,fl_relative/fl_layer_apply`],
  // },
  // {
  //   id: 'jamstack-conf',
  //   title: 'Jamstack Conf',
  //   type: 'backgrounds',
  //   transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:jamstack-conf,c_fill,w_1.0,h_1.0,fl_relative/fl_layer_apply`],
  // },
  {
    id: 'hanukkah-menorah',
    title: 'Hanukkah Menorah',
    type: 'backgrounds',
    transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:hanukkah-menorah,c_fill,w_1.0,h_1.0,fl_relative/fl_layer_apply`],
  },
  {
    id: 'snowy-night',
    title: 'Snowy Night',
    type: 'backgrounds',
    transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:snowy-night,c_fill,w_1.0,h_1.0,fl_relative/fl_layer_apply`],
  },
  {
    id: 'holiday-lights',
    title: 'Holiday Lights',
    type: 'backgrounds',
    transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:holiday-lights,c_fill,w_1.0,h_1.0,fl_relative/fl_layer_apply`],
  },
  {
    id: 'moon',
    title: 'Moon',
    type: 'backgrounds',
    transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:moon-earth,c_fill,w_1.0,h_1.0,fl_relative/fl_layer_apply`],
  },
  {
    id: 'this-is-fine',
    title: 'This Is Fine',
    type: 'backgrounds',
    transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:this_is_fine,c_fill,w_1.0,h_1.0,fl_relative/fl_layer_apply`],
  },
  {
    id: 'mario',
    title: 'Mario',
    type: 'backgrounds',
    transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:mario,c_fill,w_1.0,h_1.0,fl_relative/fl_layer_apply`],
  },
  {
    id: 'the-office',
    title: 'The Office',
    type: 'backgrounds',
    transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:the_office,c_fill,w_1.0,h_1.0,fl_relative/fl_layer_apply`],
  },
  {
    id: 'whats-going-on',
    title: "What's going on?",
    type: 'backgrounds',
    transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:whats-going-on,c_fill,w_1.0,h_1.0,fl_relative/fl_layer_apply`],
  },
  {
    id: 'beach',
    title: 'Beach',
    type: 'backgrounds',
    transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:beach,c_fill,w_1.0,h_1.0,fl_relative/fl_layer_apply`],
  },
  {
    id: 'pixel-canvas',
    title: 'Pixel Canvas',
    type: 'backgrounds',
    transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:pixel-canvas,c_fill,w_1.0,h_1.0,fl_relative/fl_layer_apply`],
  },
  {
    id: 'matrix',
    title: 'Matrix',
    type: 'backgrounds',
    transformations: [`u_${CLOUDINARY_ASSETS_FOLDER}:matrix,c_fill,w_1.0,h_1.0,fl_relative/fl_layer_apply`],
  },
];

export const FILTERS_MORE = [
  {
    id: 'friends',
    title: 'Friends',
    type: 'more',
    baseTransformations: {
      base: 'c_thumb,g_faces,h_480,w_360',
      applied: 'g_north_west,x_170,y_130',
    },
    finalTransformations: [`l_${CLOUDINARY_ASSETS_FOLDER}:friends_frame,w_1.0,h_1.0,fl_region_relative/fl_layer_apply`],
  },
  // {
  //   id: 'pop',
  //   title: 'Pop',
  //   type: 'more',
  //   transformations: [
  //     ({ options }) => {
  //       let publicId = options.publicIdTransparent || options.publicId;

  //       publicId = publicId.replaceAll('/', ':');

  //       const w = options.width / 2;
  //       const h = options.width / 2;

  //       const variations = [
  //         {
  //           hue: 90,
  //           x: 0,
  //           y: 0,
  //           g: 'north_west',
  //           b: 'red'
  //         },
  //         {
  //           hue: -40,
  //           x: 0,
  //           y: 0,
  //           g: 'north_east',
  //           b: 'red'
  //         },
  //         {
  //           hue: 40,
  //           x: 0,
  //           y: 0,
  //           g: 'south_west',
  //           b: 'red'
  //         },
  //         {
  //           hue: 20,
  //           x: 0,
  //           y: 0,
  //           g: 'south_east',
  //           b: 'red'
  //         },
  //       ];

  //       return variations.flatMap(variation => {
  //         const { hue, x, y, g, b } = variation;
  //         return [
  //           `l_${publicId},w_${w},h_${h},c_thumb,g_faces,e_hue:${hue},b_${b}`,
  //           `fl_layer_apply,x_${x},y_${y},g_${g}`,
  //         ];
  //       }).join('/')
  //     },
  //   ],
  // },
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
  ...FILTERS_MORE,
  ...FILTERS_CROPS,
];
