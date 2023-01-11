import { Cloudinary } from '@cloudinary/url-gen';

import { timeout } from '@lib/util';

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

  image.format(format).delivery(`q_${quality}`);

  return image.toURL();
}

/**
 * uploadToCloudinary
 */

export async function uploadToCloudinary(image, options = {}) {
  return await fetch('/api/cloudinary/upload', {
    method: 'POST',
    body: JSON.stringify({
      image,
      uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      ...options,
    }),
  }).then((r) => r.json());
}

/**
 * checkStatus
 */

export async function checkStatus(results) {
  const resource = await fetch(`/api/cloudinary/resource/?publicId=${results.public_id}`).then((r) => r.json());

  const infoState = getInfoStateFromResource(resource);

  if (Array.isArray(infoState) && infoState.includes('pending')) {
    await timeout(500);
    return await checkStatus(results);
  }

  return resource;
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
 * createHashtagBadgeTransformations
 */

export function createHashtagBadgeTransformations(hashtags) {
  if (!Array.isArray(hashtags) || hashtags.length === 0) return [];

  const hashtagsString = hashtags.map((tag) => `%23${tag}`).join('   ');

  return [
    // Add the text overlay first as transparent text, this will help us
    // create the dynamic sizing of the box

    `l_text:Source Sans Pro_28_bold:${hashtagsString},co_white,o_0`,

    // Add the color block behind "nested" so that it can take advantage of relative sizing

    `l_${CLOUDINARY_ASSETS_FOLDER}:white-1x1,e_colorize,co_rgb:F05354,w_1.2,h_2.0,fl_region_relative/fl_layer_apply,g_north_west,x_0,y_0`,

    // Add the actual text

    `l_text:Source Sans Pro_28_bold:${hashtagsString},co_white,c_fit,w_1.0,fl_region_relative/fl_layer_apply`,

    // "Close" the transparent text transformation and apply positioning

    'fl_layer_apply,g_north_west,x_0,y_23',
  ];
}

/**
 * createLogoBadgeTransformations
 */

export function createLogoBadgeTransformations() {
  return [
    `l_${CLOUDINARY_ASSETS_FOLDER}:white-1x1,e_colorize,co_rgb:3448C5,w_243,h_63/fl_layer_apply,g_south_east,x_0,y_10`,
    `l_${CLOUDINARY_ASSETS_FOLDER}:cloudycam-logo-white,w_220,h_47/fl_layer_apply,x_10,y_18,g_south_east`,
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
    `l_${CLOUDINARY_ASSETS_FOLDER}:${options.publicId},h_${options.height}/fl_layer_apply,x_14,y_18,g_south_west`,
  ];
}

/**
 * parseTransformationStringToReadable
 */

export function parseTransformationStringToReadable(transformation) {
  const segments = transformation.split(',');
  return segments.map((segment, index) => {
    const matches = segment.match(/([a-zA-Z]+)_([a-zA-Z0-9_:\-.]+)/);

    if (!matches) {
      return {
        id: `${segment}-${index}`,
        name: 'Other',
        value: segment,
      };
    }

    const [, id, value] = matches;
    const property = CLOUDINARY_PROPERTIES.find((prop) => prop.id === id);

    return {
      ...property,
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
