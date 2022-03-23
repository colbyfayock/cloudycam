const cloudinary = require('cloudinary').v2;

import { timeout } from '@lib/util';

import { CLOUDINARY_UPLOADS_FOLDER } from '@data/cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default async function handler(req, res) {
  const { image, folder = CLOUDINARY_UPLOADS_FOLDER, context, tags, options } = JSON.parse(req.body);

  const uploadOptions = {
    folder,
    ...options,
  };

  if (context) {
    uploadOptions.context = context;
  }

  if (Array.isArray(tags)) {
    uploadOptions.tags = tags;
  }

  let results;

  try {
    results = await cloudinary.uploader.upload(image, uploadOptions);
  } catch (e) {
    console.log('Failed to upload to Cloudinary', e);
    res.status(500).json({
      message: 'Failed to upload image',
    });
    return;
  }

  if (options?.background_removal) {
    try {
      const backgroundRemovalResource = await checkStatus();

      if (backgroundRemovalResource.info.background_removal.cloudinary_ai.status !== 'complete') {
        throw new Error('Failed to remove background');
      }

      results = backgroundRemovalResource;
    } catch (e) {
      console.log('Failed to check status.', e);
      res.status(500).json({
        message: 'Failed to upload image',
      });
      return;
    }
  }

  res.status(200).json({
    ...results,
  });

  async function checkStatus() {
    const resource = await cloudinary.api.resource(`${folder}/${options.public_id}`);

    if (resource.info.background_removal.cloudinary_ai.status === 'pending') {
      await timeout(100);
      return await checkStatus();
    }

    return resource;
  }
}
