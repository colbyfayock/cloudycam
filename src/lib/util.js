/**
 * createHashFromString
 * @description Uses the Web Crypto API (available in all modern browsers and Node 20+)
 * so we don't rely on a bundler polyfill for Node's `crypto` module. Truncated to
 * 32 hex characters to keep public IDs the same length as the previous MD5 hashes.
 */

export async function createHashFromString(data) {
  if (!data) throw new Error('Failed to create hash. Data undefined.');
  const buffer = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32);
}

/**
 * timeout
 */

export function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * sortByKey
 * @description Sort the given array by the object key
 */

export function sortByKey(array = [], key, type = 'asc') {
  function compare(a, b) {
    let keyA = a[key];
    let keyB = b[key];

    if (typeof keyA === 'string') {
      keyA = keyA.toLowerCase();
    }

    if (typeof keyB === 'string') {
      keyB = keyB.toLowerCase();
    }

    if (keyA < keyB) {
      return -1;
    }

    if (keyA > keyB) {
      return 1;
    }

    return 0;
  }

  let newArray = [...array];

  if (typeof key !== 'string') return newArray;

  newArray = newArray.sort(compare);

  if (type === 'desc') {
    return newArray.reverse();
  }

  return newArray;
}
