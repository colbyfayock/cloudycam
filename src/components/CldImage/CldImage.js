import { useState } from 'react';
import { CldImage as NextCldImage } from 'next-cloudinary';

import { CLOUDINARY_ASSETS_FOLDER } from '@data/cloudinary';

import styles from './CldImage.module.scss';

const PLACEHOLDER_PUBLIC_ID = `${CLOUDINARY_ASSETS_FOLDER}/transparent-1x1`;

const CldImage = ({ className, onLoad, onError, loading = false, src, rawTransformations, alt = '', ...props }) => {
  let componentClassName = styles.cldImage;

  if (className) {
    componentClassName = `${componentClassName} ${className}`;
  }

  const imageSrc = src || PLACEHOLDER_PUBLIC_ID;
  const imageRawTransformations = src ? rawTransformations : [];

  // Remounting on URL changes resets the underlying image. Loading state is derived from which
  // URL last finished loading rather than toggled in effects, so the shimmer animation can't get
  // stuck on when a cached image loads, or when `loading` flips after the image is already done.

  const key = [imageSrc, ...(imageRawTransformations || [])].join('/');
  const [loadedKey, setLoadedKey] = useState();
  const isLoading = loading || loadedKey !== key;

  /**
   * handleOnLoad
   */

  function handleOnLoad(event) {
    setLoadedKey(key);

    if (typeof onLoad === 'function') {
      onLoad(event);
    }
  }

  /**
   * handleOnError
   * @description Stop the loading animation for broken images. Returning nothing lets
   * next-cloudinary keep polling if Cloudinary is still processing the image.
   */

  function handleOnError(event) {
    setLoadedKey(key);

    if (typeof onError === 'function') {
      return onError(event);
    }
  }

  return (
    <span className={componentClassName} data-image-loading={isLoading}>
      <NextCldImage
        key={key}
        src={imageSrc}
        rawTransformations={imageRawTransformations}
        alt={alt}
        {...props}
        onLoad={handleOnLoad}
        onError={handleOnError}
      />
    </span>
  );
};

export default CldImage;
