
/**
 * uploadToCloudinary
 */

export async function uploadToCloudinary(image, options = {}) {
  return await fetch('/api/cloudinary/upload', {
    method: 'POST',
    body: JSON.stringify({
      image,
      ...options
    })
  }).then(r => r.json());
}