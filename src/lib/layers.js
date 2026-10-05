/**
 * Cloudinary layer (overlay / underlay) transformation builders
 * @description Generates layer strings in the current layers syntax used by Cloudinary's docs and
 * SDKs: the layer source in its own component, any transformations applied to the layer in a
 * separate component, then `fl_layer_apply` with placement (gravity, offsets, flags). Parameters
 * within a component are sorted so equivalent layers always produce the same URL (better CDN
 * cache hits). Values are passed through verbatim (e.g. `w_1.0` stays relative, it isn't
 * rewritten to `w_1`).
 *
 * https://cloudinary.com/documentation/layers
 */

import { CLOUDINARY_ADV_FACE_ENABLED } from '@data/cloudinary';

/**
 * toLayerPublicId
 * @description Layer public IDs use colons in place of folder slashes
 */

export function toLayerPublicId(publicId) {
  if (typeof publicId !== 'string' || publicId.length === 0) {
    throw new Error('Failed to create layer. Public ID must be a non-empty string.');
  }
  return publicId.replaceAll('/', ':');
}

/**
 * encodeLayerText
 * @description Text layers need URL encoding, and commas, slashes, and percent signs must be
 * double-escaped so they aren't parsed as transformation syntax
 */

export function encodeLayerText(text) {
  return encodeURIComponent(text).replace(/%(2C|2F|25)/gi, '%25$1');
}

function joinParams(params = []) {
  return [...params]
    .filter((param) => typeof param === 'string' && param.length > 0)
    .sort()
    .join(',');
}

function joinComponents(components = []) {
  return components.filter((component) => typeof component === 'string' && component.length > 0).join('/');
}

/**
 * layerApply
 */

export function layerApply(params = []) {
  return joinComponents([joinParams(['fl_layer_apply', ...params])]);
}

/**
 * imageLayer
 * @param {string} publicId Public ID of the image to layer, with or without folders
 * @param {object} options
 * @param {string[]} options.transformations Params applied to the layer image (size, effects)
 * @param {string[]} options.apply Params for placing the layer (gravity, offsets, flags, angle)
 * @param {boolean} options.underlay Place the image under the base image rather than over it
 * @param {string[]} options.nested Complete layer strings nested inside this layer (rendered before apply)
 */

export function imageLayer(publicId, { transformations = [], apply = [], underlay = false, nested = [] } = {}) {
  return joinComponents([
    `${underlay ? 'u' : 'l'}_${toLayerPublicId(publicId)}`,
    joinParams(transformations),
    ...nested,
    layerApply(apply),
  ]);
}

/**
 * imageUnderlay
 */

export function imageUnderlay(publicId, options = {}) {
  return imageLayer(publicId, { ...options, underlay: true });
}

/**
 * textLayer
 * @description Text styling and text box sizing (c_fit with w_/h_) must stay in the same
 * component as the text source, otherwise they scale the rendered text instead of wrapping it
 */

export function textLayer(
  { text, fontFamily, fontSize, fontStyles = [], params = [] },
  { apply = [], nested = [] } = {},
) {
  const font = [encodeURIComponent(fontFamily), fontSize, ...fontStyles].join('_');
  return joinComponents([
    [`l_text:${font}:${encodeLayerText(text)}`, joinParams(params)].filter(Boolean).join(','),
    ...nested,
    layerApply(apply),
  ]);
}

/**
 * faceGravity
 * @description Advanced face detection (eye and landmark aware) gives the most accurate
 * placement but requires the Advanced Facial Attribute Detection add-on. Fall back to the
 * built-in face detection when it isn't enabled for the account.
 */

export function faceGravity({ multiple = true } = {}) {
  if (CLOUDINARY_ADV_FACE_ENABLED) {
    return multiple ? 'g_adv_faces' : 'g_adv_face';
  }
  return multiple ? 'g_faces' : 'g_face';
}

/**
 * faceOverlay
 * @description Overlays an image on every detected face, sized relative to each face region
 */

export function faceOverlay(publicId, { transformations = [], apply = [], multiple = true } = {}) {
  return imageLayer(publicId, {
    transformations: ['fl_region_relative', ...transformations],
    apply: ['fl_no_overflow', faceGravity({ multiple }), ...apply],
  });
}

/**
 * backgroundUnderlay
 * @description Fills the full frame behind a background-removed image
 */

export function backgroundUnderlay(publicId) {
  return imageUnderlay(publicId, {
    transformations: ['c_fill', 'fl_relative', 'h_1.0', 'w_1.0'],
  });
}

/**
 * baseImageLayer
 * @description Places an image as a full-size layer, used to stack a photo on top of itself
 * or a transparent version so that following underlays and effects have something to target
 */

export function baseImageLayer(publicId) {
  return imageLayer(publicId, {
    transformations: ['fl_relative', 'h_1.0', 'w_1.0'],
  });
}
