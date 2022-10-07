import { Cloudinary } from '@cloudinary/url-gen';

import { timeout } from '@lib/util';

import { CLOUDINARY_ASSETS_FOLDER } from '@data/cloudinary';

const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },
  url: {
    secure: true,
  },
});

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
 * constructCldUrl
 */

export function constructCldUrl(options = {}) {
  const { publicId: userPublicId, width, height, filters, event, applyWatermark = true } = options;
  const publicId = userPublicId.replace('/', ':');
  const hasFilters = filters && Object.keys(filters).length > 0;

  const cloudImage = cld.image(`${CLOUDINARY_ASSETS_FOLDER}/transparent-1x1`);

  cloudImage.addVariable(`$imgWidth_${width}`);
  cloudImage.addVariable(`$imgHeight_${height}`);

  // Add the photo as an overlay giving us more flexibility with how we arrange it on the canvas
  // particularly for crops and framing

  const baseTransformations =
    hasFilters &&
    Object.keys(filters)
      .map((key) => filters[key])
      .filter(({ baseTransformations }) => !!baseTransformations)
      .flatMap(({ baseTransformations }) => baseTransformations);

  let baseLayer = `l_${publicId},w_$imgWidth,h_$imgHeight`;

  if (baseTransformations.length > 0) {
    baseTransformations.forEach(({ base }) => {
      if (base) {
        baseLayer = `${baseLayer},${base}`;
      }
    });
  }

  baseLayer = `${baseLayer}/fl_layer_apply`;

  if (baseTransformations.length > 0) {
    baseTransformations.forEach(({ applied }) => {
      if (applied) {
        baseLayer = `${baseLayer},${applied}`;
      }
    });
  }

  cloudImage.addTransformation(baseLayer);

  // If filters are applied, work through them and add each one

  if (hasFilters) {
    Object.keys(filters).forEach((filterKey) => {
      const filter = filters[filterKey];

      filter.transformations?.forEach((transformation) => {
        if (typeof transformation === 'function') {
          transformation = transformation({ cld, cloudImage, options });
        }
        cloudImage.addTransformation(transformation);
      });

      filter.effects?.forEach((effect) => {
        cloudImage.effect(effect);
      });
    });
  }

  // Cloudycam Logo

  if (applyWatermark) {
    cloudImage.addTransformation(
      `l_${CLOUDINARY_ASSETS_FOLDER}:white-1x1,e_colorize,co_rgb:3448C5,w_243,h_63/fl_layer_apply,g_south_east,x_0,y_10`
    );
    cloudImage.addTransformation(
      `l_${CLOUDINARY_ASSETS_FOLDER}:cloudycam-logo-white,w_220,h_47/fl_layer_apply,x_10,y_18,g_south_east`
    );
  }

  if (event?.hashtags?.[0]) {
    const hashtags = [];

    if (Array.isArray(event.hashtags) && event.hashtags.length > 0) {
      event.hashtags.forEach((tag) => hashtags.push(tag));
    }

    const hashtagsString = hashtags.map((tag) => `%23${tag}`).join('   ');

    // Add the text overlay first as transparent text, this will help us
    // create the dynamic sizing of the box

    cloudImage.addTransformation(`l_text:Source Sans Pro_28_bold:${hashtagsString},co_white,o_0`);

    console.log('hashtagsString', hashtagsString);

    // Add the color block behind "nested" so that it can take advantage of relative sizing

    cloudImage.addTransformation(
      `l_${CLOUDINARY_ASSETS_FOLDER}:white-1x1,e_colorize,co_rgb:F05354,w_1.2,h_2.0,fl_region_relative/fl_layer_apply,g_north_west,x_0,y_0`
    );

    // Add the actual text

    cloudImage.addTransformation(
      `l_text:Source Sans Pro_28_bold:${hashtagsString},co_white,c_fit,w_1.0,fl_region_relative/fl_layer_apply`
    );

    // "Close" the transparent text transformation and apply positioning

    cloudImage.addTransformation('fl_layer_apply,g_north_west,x_0,y_23');
  }

  cloudImage.addTransformation('w_$imgWidth,h_$imgHeight,q_auto,f_auto');

  return cloudImage.toURL();
}
