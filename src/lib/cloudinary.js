import { Cloudinary } from '@cloudinary/url-gen';

import { timeout } from '@lib/util';
import { imageLayer, textLayer, baseImageLayer } from '@lib/layers';

import { CLOUDINARY_ASSETS_FOLDER, CLOUDINARY_EFFECT_PROPERTIES, CLOUDINARY_PROPERTIES } from '@data/cloudinary';

const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },
  url: {
    analytics: false,
  },
});

/**
 * constructCloudinaryUrl
 */

export function constructCloudinaryUrl({ publicId, transformations = [], format = 'auto', quality = 'auto' }) {
  const image = cld.image(publicId);

  transformations?.forEach((transformation) => {
    image.addTransformation(transformation);
  });

  image.format(format).quality(quality);

  return image.toURL();
}

/**
 * uploadToCloudinary
 */

export async function uploadToCloudinary(image, options = {}, { signal } = {}) {
  const response = await fetch('/api/cloudinary/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image,
      ...options,
    }),
    signal,
  });

  const results = await response.json();

  if (!response.ok) {
    throw new Error(results?.message || `Failed to upload image (${response.status})`);
  }

  return results;
}

/**
 * checkStatus
 */

export async function checkStatus(results, { signal, interval = 500, maxAttempts = 120 } = {}) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    signal?.throwIfAborted();

    const response = await fetch(`/api/cloudinary/resource?publicId=${encodeURIComponent(results.public_id)}`, {
      signal,
    });
    const resource = await response.json();

    if (!response.ok) {
      throw new Error(resource?.message || `Failed to get resource (${response.status})`);
    }

    const infoState = getInfoStateFromResource(resource);

    if (!Array.isArray(infoState) || !infoState.includes('pending')) {
      return resource;
    }

    await timeout(interval);
  }

  throw new Error('Timed out waiting for resource processing to complete');
}

/**
 * getInfoStateFromResource
 */

export function getInfoStateFromResource(results) {
  return (
    results?.info &&
    Object.keys(results.info).flatMap((jobKey) => {
      return Object.keys(results.info[jobKey]).map((toolKey) => results.info[jobKey][toolKey].status);
    })
  );
}

/**
 * createBaseImageTransformations
 * @description Layers the photo over itself at full size so that background underlays
 * and effects stack in a predictable order
 */

export function createBaseImageTransformations(publicId) {
  if (!publicId) return [];
  return [baseImageLayer(publicId)];
}

/**
 * createHashtagBadgeTransformations
 */

export function createHashtagBadgeTransformations(hashtags) {
  if (!Array.isArray(hashtags) || hashtags.length === 0) return [];

  const hashtagsText = hashtags.map((tag) => `#${tag}`).join('   ');

  const font = {
    text: hashtagsText,
    fontFamily: 'Source Sans Pro',
    fontSize: 28,
    fontStyles: ['bold'],
  };

  return [
    // Add the text overlay first as transparent text, this will help us create the dynamic
    // sizing of the box. The color block and visible text are nested inside of it so that
    // they can take advantage of sizing relative to the text.

    textLayer(
      {
        ...font,
        params: ['co_white', 'o_0'],
      },
      {
        nested: [
          imageLayer(`${CLOUDINARY_ASSETS_FOLDER}/white-1x1`, {
            transformations: ['e_colorize', 'co_rgb:F05354', 'w_1.2', 'h_2.0', 'fl_region_relative'],
            apply: ['g_north_west', 'x_0', 'y_0'],
          }),
          textLayer({
            ...font,
            params: ['co_white', 'c_fit', 'w_1.0', 'fl_region_relative'],
          }),
        ],
        apply: ['g_north_west', 'x_0', 'y_23'],
      },
    ),
  ];
}

/**
 * createLogoBadgeTransformations
 */

export function createLogoBadgeTransformations() {
  return [
    imageLayer(`${CLOUDINARY_ASSETS_FOLDER}/white-1x1`, {
      transformations: ['e_colorize', 'co_rgb:3448C5', 'w_243', 'h_63'],
      apply: ['g_south_east', 'x_0', 'y_10'],
    }),
    imageLayer(`${CLOUDINARY_ASSETS_FOLDER}/cloudycam-logo-white`, {
      transformations: ['w_220', 'h_47'],
      apply: ['g_south_east', 'x_10', 'y_18'],
    }),
  ];
}

/**
 * createEventLogoTransformations
 */

export function createEventLogoTransformations(options) {
  if (typeof options === 'string') {
    options = {
      publicId: options,
      height: 60,
    };
  }
  return [
    imageLayer(`${CLOUDINARY_ASSETS_FOLDER}/${options.publicId}`, {
      transformations: [`h_${options.height}`],
      apply: ['g_south_west', 'x_14', 'y_18'],
    }),
  ];
}

/**
 * parseTransformationStringToReadable
 */

export function parseTransformationStringToReadable(transformation) {
  // Layers span multiple components (l_id/params/fl_layer_apply), so split on both
  // component (/) and parameter (,) separators

  const segments = transformation.split(/[/,]/).filter(Boolean);
  return segments.map((segment, index) => {
    const matches = segment.match(/([a-zA-Z]+)_([a-zA-Z0-9_:\-.]+)/);

    if (!matches) {
      return {
        key: `${segment}-${index}`,
        id: segment,
        name: 'Other',
        value: segment,
      };
    }

    const [, id, value] = matches;
    const property = CLOUDINARY_PROPERTIES.find((prop) => prop.id === id);

    return {
      name: id,
      ...property,
      key: `${id}_${value}-${index}`,
      id,
      value,
    };
  });
}

/**
 * parseEffectsStringToReadable
 */

export function parseEffectsStringToReadable(transformation) {
  const matches = transformation.match(/([a-zA-Z]+):([a-zA-Z0-9_:\-.]+)/);

  if (!matches) {
    return {
      id: transformation,
      name: 'Other',
      value: transformation,
    };
  }

  const [, id, value] = matches;
  const property = CLOUDINARY_EFFECT_PROPERTIES.find((prop) => prop.id === id);

  return {
    ...property,
    value,
  };
}
