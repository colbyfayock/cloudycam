import { v2 as cloudinary } from 'cloudinary';

import { CLOUDINARY_UPLOADS_FOLDER } from '@data/cloudinary';
import {
  ValidationError,
  isAllowedImageSource,
  parseJsonBody,
  sanitizeContext,
  sanitizeTags,
  sanitizeTransformation,
  sanitizeUploadOptions,
} from '@lib/api';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  let uploadOptions;
  let image;

  try {
    const body = parseJsonBody(req.body);

    image = body.image;

    if (!isAllowedImageSource(image)) {
      throw new ValidationError('Invalid image');
    }

    uploadOptions = {
      ...sanitizeUploadOptions(body.options),
      // Always upload into the uploads folder, regardless of what the client asks for
      folder: CLOUDINARY_UPLOADS_FOLDER,
      upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    };

    const transformation = sanitizeTransformation(body.transformation);
    const context = sanitizeContext(body.context);
    const tags = sanitizeTags(body.tags);

    if (transformation) uploadOptions.transformation = transformation;
    if (context) uploadOptions.context = context;
    if (tags) uploadOptions.tags = tags;
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(400).json({ message: e.message });
      return;
    }
    throw e;
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

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '2mb',
    },
  },
};
