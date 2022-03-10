const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export default async function handler(req, res) {
  const { image } = JSON.parse(req.body);

  const results = await cloudinary.uploader.upload(image, {
    folder: 'cloudinary-camera-filters'
  });

  res.status(200).json({
    ...results
  });
}