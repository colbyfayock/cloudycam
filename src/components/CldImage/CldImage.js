import { useLayoutEffect, useState } from 'react';
import { CldImage as NextCldImage } from 'next-cloudinary';

import styles from './CldImage.module.scss';

const DEFAULT_STATE = {
  loading: true,
};

const CldImage = ({ onLoadingComplete, loading = false, ...props }) => {
  const [state, setState] = useState(DEFAULT_STATE);
  const key = `${props.src}/${props.rawTransformations?.map(({ id }) => id).join('/')}`;

  useLayoutEffect(() => {
    setState({
      loading,
    });
  }, [loading]);

  useLayoutEffect(() => {
    if (!props.src) return;
    setState({
      loading: true,
    });
  }, [props.src, key, loading]);

  const stateProps = {};

  Object.keys(state).forEach((stateKey) => {
    stateProps[`data-image-${stateKey}`] = state[stateKey];
  });

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
    <span className={styles.cldImage} {...stateProps}>
      <NextCldImage key={key} {...props} onLoadingComplete={handleOnLoadingComplete} />
    </span>
  );
};

export default CldImage;
