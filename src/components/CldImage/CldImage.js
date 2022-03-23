import { constructCldUrl } from '@lib/cloudinary';

import { CLOUDINARY_ASSETS_FOLDER, CLOUDINARY_UPLOADS_FOLDER } from '@data/cloudinary';
import { CAMERA_WIDTH, CAMERA_HEIGHT, FILTER_THUMB_WIDTH, FILTER_THUMB_HEIGHT } from '@data/camera';

const CldImage = ({ src, width, height, resize, transformations, effects, watermark, ...props }) => {
  const cldImageUrl = constructCldUrl({
    publicId: src,
    width: resize?.width || width,
    height: resize?.height || height,
    filters: [
      {
        transformations,
        effects
      }
    ],
    applyWatermark: watermark
  });

  return (
    <img
      width={width}
      height={height}
      src={cldImageUrl}
      loading="lazy"
      {...props}
    />
  );
}

export default CldImage;