const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default async function handler(req, res) {
  const { publicId } = req.query || {};

  let results;

  try {
    results = await cloudinary.api.resource(publicId);
  } catch (e) {
    console.log('Failed to get resource', e);
    res.status(500).json({
      message: 'Failed to get resource',
    });
    return;
  }

  res.status(200).json({
    ...results,
  });
}
