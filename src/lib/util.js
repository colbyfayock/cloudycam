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
