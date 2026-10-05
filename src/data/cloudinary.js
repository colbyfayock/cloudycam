export const CLOUDINARY_ASSETS_FOLDER = 'cloudycam-assets';
export const CLOUDINARY_UPLOADS_FOLDER = 'cloudycam-uploads';
export const CLOUDINARY_TAG_ASSET = 'cloudycam-asset';
export const CLOUDINARY_TAG_ASSET_ORIGINAL = 'cloudycam-asset-original';
export const CLOUDINARY_TAG_ASSET_TRANSPARENT = 'cloudycam-asset-transparent';
export const CLOUDINARY_TAG_ASSET_TRANSFORMATION = 'cloudycam-asset-transformation';

// Face-anchored filters use Advanced Facial Attribute Detection (g_adv_face/g_adv_faces) for
// accurate placement, which requires that add-on on the Cloudinary account. Set
// NEXT_PUBLIC_CLOUDINARY_ADV_FACE="false" to fall back to built-in face detection (g_face/g_faces).

export const CLOUDINARY_ADV_FACE_ENABLED = process.env.NEXT_PUBLIC_CLOUDINARY_ADV_FACE !== 'false';

export const CLOUDINARY_PROPERTIES = [
  {
    id: 'a',
    name: 'Angle',
    description: 'Rotates an asset or layer by the specified degrees.',
  },
  {
    id: 'co',
    name: 'Color',
    description: 'Sets the color for text layers and effects like colorize.',
  },
  {
    id: 'c',
    name: 'Crop / Resize',
    description: 'Changes the size of the delivered asset according to the requested width & height dimensions.',
  },
  {
    id: 'e',
    name: 'Effect',
    description: 'Applies the specified effect to an asset.',
  },
  {
    id: 'fl',
    name: 'Flag',
    description: 'Alters the regular behavior of another transformation or the overall delivery behavior.',
  },
  {
    id: 'g',
    name: 'Gravity',
    description: 'Determines which part of an asset to focus on.',
  },
  {
    id: 'h',
    name: 'Height',
    description: 'Determines the height of a transformed asset or an overlay.',
  },
  {
    id: 'l',
    name: 'Layer',
    description: 'Applies a layer over the base asset, also known as an overlay.',
  },
  {
    id: 'o',
    name: 'Opacity',
    description: 'Adjusts the opacity of an asset or layer.',
  },
  {
    id: 'r',
    name: 'Round Corners',
    description: 'Rounds the corners of an image or video.',
  },
  {
    id: 'u',
    name: 'Underlay',
    description: 'Applies an image layer under the base image or video.',
  },
  {
    id: 'w',
    name: 'Width',
    description: 'Determines the width of a transformed asset or an overlay.',
  },
  {
    id: 'x',
    name: 'X Coordinate',
    description: 'Adjusts the starting location or offset of the corresponding transformation action on the X axis.',
  },
  {
    id: 'y',
    name: 'Y Coordinate',
    description: 'Adjusts the starting location or offset of the corresponding transformation action on the Y axis.',
  },
];

export const CLOUDINARY_EFFECT_PROPERTIES = [
  {
    id: 'art',
    name: 'Art',
    description: 'Applies the selected artistic filter.',
  },
];
