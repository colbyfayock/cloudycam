const cloudinary = require('cloudinary').v2;

import { CLOUDINARY_UPLOADS_FOLDER } from '@data/cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export default async function handler(req, res) {
  const { image, folder = CLOUDINARY_UPLOADS_FOLDER, options } = JSON.parse(req.body);

  let results;

  try {
    results = await cloudinary.uploader.upload(image, {
      folder,
      ...options
    });
  } catch(e) {
    console.log('e', e);
    res.status(500).json({
      message: 'Failed to upload image'
    });
    return;
  }

  const { info } = results || {};

  if ( options?.background_removal ) {
    try {
      const { status } = info.background_removal[options.background_removal];

      function checkStatus() {
        return new Promise(async (resolve, reject) => {
          const resource = await cloudinary.api.resource(`${folder}/${options.public_id}`);
          if ( resource.info.background_removal.cloudinary_ai.status === 'pending' ) {
            setTimeout(async () => resolve(await checkStatus()), 100);
            return;
          }
          resolve(resource);
        })
      }

      const backgroundRemovalResource = await checkStatus();

      if ( backgroundRemovalResource.info.background_removal.cloudinary_ai.status !== 'complete' ) {
        throw new Error('Failed to remove background');
      }

      results = backgroundRemovalResource;
    } catch(e) {
      console.log('e', e);
      res.status(500).json({
        message: 'Failed to upload image'
      });
      return;
    }
  }

  res.status(200).json({
    ...results
  });
}