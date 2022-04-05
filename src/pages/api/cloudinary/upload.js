const cloudinary = require('cloudinary').v2;

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

  console.log('<<< Begin Upload Options');
  console.log(uploadOptions);
  console.log('>>> End Upload Options');

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

  console.log('<<< Begin Results');
  console.log(results);
  console.log('>>> End Results');

  res.status(200).json({
    ...results,
  });
}
