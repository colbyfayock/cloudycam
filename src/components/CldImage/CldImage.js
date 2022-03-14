import { Cloudinary } from '@cloudinary/url-gen';

const cld = new Cloudinary({
  cloud: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  },
  url: {
    secure: true
  }
});

const CldImage = ({ src, format = 'auto', quality = 'auto', resize, transformations, effects, ...props }) => {
  const cldImage = cld.image(src).format(format).quality(quality);

  if ( resize ) {
    cldImage.resize(`w_${resize.width},h_${resize.height}`);
  }

  transformations?.forEach(transformation => {
    cldImage.addTransformation(transformation);
  });

  effects?.forEach(effect => {
    cldImage.effect(effect);
  });

  return (
    <img
      src={cldImage.toURL()}
      loading="lazy"
      {...props}
    />
  );
}

export default CldImage;