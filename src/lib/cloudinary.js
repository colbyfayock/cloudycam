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

export function constructCldUrl({ publicId: userPublicId, width, height, filters, applyWatermark = true } = {}) {
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
        cloudImage.addTransformation(transformation);
      });

      filter.effects?.forEach((effect) => {
        cloudImage.effect(effect);
      });
    });
  }

  if (applyWatermark) {
    cloudImage.addTransformation(`l_${CLOUDINARY_ASSETS_FOLDER}:cloudinary_white,h_20,o_40,g_south_east,x_10,y_10`);
  }

  return cloudImage.toURL();
}
