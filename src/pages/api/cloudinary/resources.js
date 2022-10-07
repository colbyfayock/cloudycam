const cloudinary = require('cloudinary').v2;

import { CLOUDINARY_UPLOADS_FOLDER } from '@data/cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default async function handler(req, res) {
  const { maxResults, folder = CLOUDINARY_UPLOADS_FOLDER, tags } = req.body ? JSON.parse(req.body) : {};

  let expression = '';

  if (folder) {
    expression = `${expression} folder=${folder}`;
  }

  if (tags) {
    if (Array.isArray(tags)) {
      expression = `${expression} AND ${tags.map((tag) => 'tags=' + tag).join(' AND ')}`;
    } else {
      expression = `${expression} AND tags=${tags}`;
    }
  }

  let results;

  try {
    results = await cloudinary.search.expression(expression).max_results(maxResults).execute();
  } catch (e) {
    console.log('Failed to search for resources', e);
    res.status(500).json({
      message: 'Failed to search resources',
    });
    return;
  }

  res.status(200).json({
    ...results,
  });
}
