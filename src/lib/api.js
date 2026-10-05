import { CLOUDINARY_UPLOADS_FOLDER } from '@data/cloudinary';

// Request validation for the Cloudinary API routes. These routes use the account's API secret,
// so anything a browser sends is untrusted: only accept the shapes the app actually sends.

const SAFE_ID = /^[a-zA-Z0-9_-]{1,128}$/;
const SAFE_TAG = /^[a-zA-Z0-9_-]{1,64}$/;
const MAX_CONTEXT_VALUE_LENGTH = 4000;

const ALLOWED_DETECTION = ['adv_face'];
const ALLOWED_BACKGROUND_REMOVAL = ['cloudinary_ai'];
const ALLOWED_CROPS = ['scale', 'limit'];

export class ValidationError extends Error {}

/**
 * isAllowedImageSource
 * @description Accept captured photos (data URIs) or images already delivered from this
 * Cloudinary account (the background removal and share uploads re-upload those)
 */

export function isAllowedImageSource(image) {
  if (typeof image !== 'string') return false;

  if (/^data:image\/(jpeg|png|webp);base64,/.test(image)) return true;

  try {
    const url = new URL(image);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    return (
      url.protocol === 'https:' && url.hostname === 'res.cloudinary.com' && url.pathname.startsWith(`/${cloudName}/`)
    );
  } catch {
    return false;
  }
}

/**
 * sanitizeTags
 */

export function sanitizeTags(tags) {
  if (tags === undefined) return undefined;
  const list = Array.isArray(tags) ? tags : [tags];
  if (!list.every((tag) => typeof tag === 'string' && SAFE_TAG.test(tag))) {
    throw new ValidationError('Invalid tags');
  }
  return list;
}

/**
 * sanitizeContext
 */

export function sanitizeContext(context) {
  if (context === undefined) return undefined;
  if (typeof context !== 'object' || context === null || Array.isArray(context)) {
    throw new ValidationError('Invalid context');
  }

  const sanitized = {};

  Object.entries(context).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (!SAFE_TAG.test(key) || typeof value !== 'string' || value.length > MAX_CONTEXT_VALUE_LENGTH) {
      throw new ValidationError('Invalid context');
    }
    sanitized[key] = value;
  });

  return sanitized;
}

/**
 * sanitizeUploadOptions
 * @description Only the upload options CloudyCam uses. Notably the folder is fixed server side,
 * so a client can't write into (or overwrite) the filter assets folder.
 */

export function sanitizeUploadOptions(options = {}) {
  if (typeof options !== 'object' || options === null) throw new ValidationError('Invalid options');

  const { public_id: publicId, detection, background_removal: backgroundRemoval } = options;
  const sanitized = {};

  if (publicId !== undefined) {
    if (typeof publicId !== 'string' || !SAFE_ID.test(publicId)) throw new ValidationError('Invalid public ID');
    sanitized.public_id = publicId;
  }

  if (detection !== undefined) {
    if (!ALLOWED_DETECTION.includes(detection)) throw new ValidationError('Invalid detection');
    sanitized.detection = detection;
  }

  if (backgroundRemoval !== undefined) {
    if (!ALLOWED_BACKGROUND_REMOVAL.includes(backgroundRemoval))
      throw new ValidationError('Invalid background removal');
    sanitized.background_removal = backgroundRemoval;
  }

  return sanitized;
}

/**
 * sanitizeTransformation
 * @description Incoming transformation used to normalize upload size, e.g. [{ width: 1024, crop: 'scale' }]
 */

export function sanitizeTransformation(transformation) {
  if (transformation === undefined) return undefined;
  if (!Array.isArray(transformation)) throw new ValidationError('Invalid transformation');

  return transformation.map(({ width, crop } = {}) => {
    if (!Number.isInteger(width) || width < 1 || width > 4096 || !ALLOWED_CROPS.includes(crop)) {
      throw new ValidationError('Invalid transformation');
    }
    return { width, crop };
  });
}

/**
 * sanitizeUploadPublicId
 * @description Resource lookups are limited to the uploads folder
 */

export function sanitizeUploadPublicId(publicId) {
  const prefix = `${CLOUDINARY_UPLOADS_FOLDER}/`;
  if (typeof publicId !== 'string' || !publicId.startsWith(prefix) || !SAFE_ID.test(publicId.slice(prefix.length))) {
    throw new ValidationError('Invalid public ID');
  }
  return publicId;
}

/**
 * parseJsonBody
 * @description Body may arrive parsed (application/json) or as a string from older clients
 */

export function parseJsonBody(body) {
  if (!body) return {};
  if (typeof body === 'object') return body;
  try {
    return JSON.parse(body);
  } catch {
    throw new ValidationError('Invalid JSON body');
  }
}
