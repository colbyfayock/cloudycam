import { Cloudinary } from '@cloudinary/url-gen';

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
      ...options,
    }),
  }).then((r) => r.json());
}

/**
 * constructCldUrl
 */

export function constructCldUrl(options = {}) {
  const { publicId: userPublicId, width, height, filters, event, applyWatermark = true } = options;
  const publicId = userPublicId.replace('/', ':');
  const hasFilters = Object.keys(filters).length > 0;

  const cloudImage = cld.image(`${CLOUDINARY_ASSETS_FOLDER}/transparent-1x1`);

  cloudImage.addVariable(`$imgWidth_${width}`);
  cloudImage.addVariable(`$imgHeight_${height}`);

  // Resized image with base auto optimization settings

  cloudImage.resize('w_$imgWidth,h_$imgHeight').format('auto').quality('auto');

  // Add the photo as an overlay giving us more flexibility with how we arrange it on the canvas
  // particularly for crops and framing

  const baseTransformations =
    hasFilters &&
    Object.keys(filters)
      .map((key) => filters[key])
      .filter(({ baseTransformations }) => !!baseTransformations)
      .flatMap(({ baseTransformations }) => baseTransformations);

  const baseTransformationsString = baseTransformations.length > 0 && `,${baseTransformations.join('/')}`;

  cloudImage.addTransformation(`l_${publicId},w_$imgWidth,h_$imgHeight${baseTransformationsString || ''}`);

  // If filters are applied, work through them and add each one

  if (hasFilters) {
    Object.keys(filters).forEach((filterKey) => {
      const filter = filters[filterKey];

      filter.transformations?.forEach((transformation) => {
        if (typeof transformation === 'function') {
          transformation = transformation({ options });
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
      `l_${CLOUDINARY_ASSETS_FOLDER}:white-1x1,e_colorize,co_rgb:3448C5,w_243,h_63,g_south_east,x_0,y_10`
    );
    cloudImage.addTransformation(
      `l_${CLOUDINARY_ASSETS_FOLDER}:cloudycam-logo-white,w_220,h_47,g_south_east,x_10,y_18,b_red`
    );
  }

  if (event) {
    const hashtags = ['CloudyCam'];

    if (Array.isArray(event.hashtags) && event.hashtags.length > 0) {
      event.hashtags.forEach((tag) => hashtags.push(tag));
    }

    cloudImage.addTransformation(
      `l_${CLOUDINARY_ASSETS_FOLDER}:white-1x1,e_colorize,co_rgb:F05354,${
        event.hashtags ? 'w_310' : 'w_160'
      },h_42,g_north_west,x_0,y_10`
    );
    cloudImage.addTransformation(
      `l_text:Source Sans Pro_22_bold:${hashtags.map((tag) => '%23' + tag).join('  ')},g_north_west,x_10,y_23,co_white`
    );
  }

  return cloudImage.toURL();
}
