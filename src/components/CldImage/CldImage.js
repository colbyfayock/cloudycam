import { constructCldUrl } from '@lib/cloudinary';

const CldImage = ({ src, width, height, resize, transformations, effects, watermark, alt, ...props }) => {
  const cldImageUrl = constructCldUrl({
    publicId: src,
    width: resize?.width || width,
    height: resize?.height || height,
    filters: [
      {
        transformations,
        effects,
      },
    ],
    applyWatermark: watermark,
  });

  return <img width={width} height={height} src={cldImageUrl} loading="lazy" alt={alt} {...props} />;
};

export default CldImage;
