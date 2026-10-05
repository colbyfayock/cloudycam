import { CLOUDINARY_ASSETS_FOLDER } from '@data/cloudinary';
import { imageLayer, faceOverlay, backgroundUnderlay } from '@lib/layers';

const asset = (publicId) => `${CLOUDINARY_ASSETS_FOLDER}/${publicId}`;

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
      faceOverlay(asset('unicorn-mask'), {
        transformations: ['c_scale', 'h_3.3'],
        apply: ['x_0.03', 'y_-0.14', 'a_-15'],
      }),
    ],
  },
  {
    id: 'unicorn-horn',
    title: 'Unicorn Horn',
    type: 'effects',
    transformations: [
      faceOverlay(asset('unicorn-horn'), {
        transformations: ['c_scale', 'h_3.5'],
        multiple: false,
      }),
    ],
  },
  {
    id: 'vader',
    title: 'Darth Vader',
    type: 'effects',
    transformations: [
      faceOverlay(asset('vader-helmet'), {
        transformations: ['c_scale', 'h_2.0'],
        apply: ['x_0.01', 'y_-0.05'],
      }),
    ],
  },
  {
    id: 'guy-fawkes',
    title: 'Guy Fawkes',
    type: 'effects',
    transformations: [
      faceOverlay(asset('guy-fawkes'), {
        transformations: ['c_scale', 'h_1.35'],
      }),
    ],
  },
  {
    id: 'dali',
    title: 'Dali',
    type: 'effects',
    transformations: [
      faceOverlay(asset('dali'), {
        transformations: ['c_scale', 'w_1.65'],
      }),
    ],
  },
  {
    id: 'deal-with-it',
    title: 'Deal With It',
    type: 'effects',
    transformations: [
      faceOverlay(asset('deal-with-it'), {
        transformations: ['c_scale', 'w_1.0'],
        apply: ['y_-0.07'],
      }),
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

/**
 * background
 * @description Background filters fill the frame behind the background-removed photo
 */

function background({ id, title, publicId = id, ...rest }) {
  return {
    id,
    title,
    type: 'backgrounds',
    transformations: [backgroundUnderlay(asset(publicId))],
    ...rest,
  };
}

export const FILTERS_BACKGROUNDS = [
  // Past event backgrounds, uncomment to bring one back
  // background({ id: 'cityjs', title: 'City JS', allowedEvents: ['cityjsbrazil'] }),
  // background({ id: 'jsdaycanarias-stage', title: 'JSDay Canarias' }),
  // background({ id: 'jsdaycanarias-audience', title: 'JSDay Canarias' }),
  // background({ id: 'tenerife', title: 'Tenerife' }),
  // background({ id: 'vueconf-beach', title: 'VueConf Beach' }),
  // background({ id: 'vueconf-stage', title: 'VueConf Stage' }),
  // background({ id: 'reactnorway-stage', title: 'React Norway' }),
  // background({ id: 'reactnorway-larvik', title: 'Larvik' }),
  // background({ id: 'cityjssg-singapore', title: 'Singapore', publicId: 'singapore-towers' }),
  // background({ id: 'cascadiajs', title: 'CascadiaJS' }),
  // background({ id: 'bend-or', title: 'Bend, OR' }),
  // background({ id: 'mississippi-capitol', title: 'Mississippi Capitol' }),
  // background({ id: 'ato-earth', title: 'ATO Earth' }),
  // background({ id: 'ato-astronaut', title: 'ATO Astronaut' }),
  // background({ id: 'jamstack-conf', title: 'Jamstack Conf' }),
  // background({ id: 'hanukkah-menorah', title: 'Hanukkah Menorah' }),
  // background({ id: 'snowy-night', title: 'Snowy Night' }),
  // background({ id: 'holiday-lights', title: 'Holiday Lights' }),
  // background({ id: 'codemash-stage', title: 'CodeMash Stage' }),
  // background({ id: 'kalahari-ohio-water-park', title: 'Kalahari Water Park' }),
  // background({ id: 'chile-santiago', title: 'Chile Santiago' }),
  // background({ id: 'chile-easter-island', title: 'Easter Island' }),
  // background({ id: 'india-gate', title: 'India Gate' }),
  // background({ id: 'india-flag', title: 'India Flag' }),
  // background({ id: 'london-clock', title: 'London Clock' }),
  // background({ id: 'london-flags', title: 'London Flags' }),
  // background({ id: 'london-bridge', title: 'London Bridge' }),
  // background({ id: 'singapore-gardens', title: 'Singapore Gardens' }),
  // background({ id: 'singapore-merlion', title: 'Singapore Merlion' }),
  background({ id: 'araujo-braziljs', title: 'Araújo Vianna' }),
  background({ id: 'moon', title: 'Moon', publicId: 'moon-earth' }),
  background({ id: 'this-is-fine', title: 'This Is Fine', publicId: 'this_is_fine' }),
  background({ id: 'mario', title: 'Mario' }),
  background({ id: 'the-office', title: 'The Office', publicId: 'the_office' }),
  background({ id: 'whats-going-on', title: "What's going on?" }),
  background({ id: 'beach', title: 'Beach' }),
  background({ id: 'pixel-canvas', title: 'Pixel Canvas' }),
  background({ id: 'matrix', title: 'Matrix' }),
  background({ id: 'psychedelic', title: 'Psychedelic' }),
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
    finalTransformations: [
      imageLayer(asset('friends_frame'), { transformations: ['fl_region_relative', 'h_1.0', 'w_1.0'] }),
    ],
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
  // ...FILTERS_MORE,
  ...FILTERS_CROPS,
];
