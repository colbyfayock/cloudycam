import crypto from 'crypto';

/**
 * createHashFromString
 */

export async function createHashFromString(data) {
  if (!data) throw new Error('Failed to create hash. Data undefined.');
  return await crypto.createHash('md5').update(data).digest('hex');
}

/**
 * timeout
 */

export function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
