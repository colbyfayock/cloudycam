import { useEffect, useState } from 'react';
import { CldImage as NextCldImage } from 'next-cloudinary';

import { CLOUDINARY_ASSETS_FOLDER } from '@data/cloudinary';

import styles from './CldImage.module.scss';

const DEFAULT_STATE = {
  loading: true,
};

const CldImage = ({ className, onLoadingComplete, loading = false, ...props }) => {
  let componentClassName = styles.cldImage;

  if (className) {
    componentClassName = `${componentClassName} ${className}`;
  }

  const [state, setState] = useState(DEFAULT_STATE);
  const key = `${props.src}/${props.rawTransformations?.map((transform) => transform).join('/')}`;

  useEffect(() => {
    setState({
      loading,
    });
  }, [loading]);

  useEffect(() => {
    if (!props.src) return;
    setState({
      loading: true,
    });
  }, [props.src, key, loading]);

  const stateProps = {};

  Object.keys(state).forEach((stateKey) => {
    stateProps[`data-image-${stateKey}`] = state[stateKey];
  });

  if (!props.src) {
    props.src = `${CLOUDINARY_ASSETS_FOLDER}/transparent-1x1`;
    props.rawTransformations = [];
  }

  /**
   * handleOnLoadingComplete
   */

  function handleOnLoadingComplete(data) {
    if (loading) return;

    setState({
      loading: false,
    });

    if (typeof onLoadingComplete === 'function') {
      onLoadingComplete(data);
    }
  }

  return (
    <span className={componentClassName} {...stateProps}>
      <NextCldImage key={key} {...props} onLoadingComplete={handleOnLoadingComplete} />
    </span>
  );
};

export default CldImage;
