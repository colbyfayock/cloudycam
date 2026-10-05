import { v2 as cloudinary } from 'cloudinary';

import { CLOUDINARY_UPLOADS_FOLDER } from '@data/cloudinary';
import { ValidationError, parseJsonBody, sanitizeTags } from '@lib/api';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const DEFAULT_MAX_RESULTS = 50;
const MAX_RESULTS_LIMIT = 100;

export default async function handler(req, res) {
  let expression;
  let maxResults;

  try {
    const body = parseJsonBody(req.body);
    const tags = sanitizeTags(body.tags);

    // Searches are limited to the uploads folder and tags are validated before being
    // interpolated, so clients can't widen the search expression

    expression = [`folder=${CLOUDINARY_UPLOADS_FOLDER}`, ...(tags || []).map((tag) => `tags=${tag}`)].join(' AND ');

    maxResults = Number.parseInt(body.maxResults, 10);
    maxResults = Number.isNaN(maxResults) ? DEFAULT_MAX_RESULTS : Math.min(Math.max(maxResults, 1), MAX_RESULTS_LIMIT);
  } catch (e) {
    if (e instanceof ValidationError) {
      res.status(400).json({ message: e.message });
      return;
    }
    throw e;
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
