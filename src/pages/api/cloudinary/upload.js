const cloudinary = require('cloudinary').v2;

import { CLOUDINARY_UPLOADS_FOLDER } from '@data/cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default async function handler(req, res) {
  const { image, folder = CLOUDINARY_UPLOADS_FOLDER, context, tags, uploadPreset, options } = JSON.parse(req.body);

  const uploadOptions = {
    folder,
    ...options,
    upload_preset: uploadPreset,
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

  res.status(200).json({
    ...results,
  });
}
