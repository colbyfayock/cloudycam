import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';

import Button from '@components/Button';

import { useCamera } from '@hooks/useCamera';

import { CAMERA_WIDTH, CAMERA_HEIGHT } from '@data/camera';

import styles from './Camera.module.scss';

const videoConstraints = {
  width: {
    min: CAMERA_WIDTH,
  },
  height: {
    min: CAMERA_HEIGHT,
  },
  aspectRatio: CAMERA_WIDTH / CAMERA_HEIGHT,
};

const DEFAULT_IMG_STATE = {
  loading: false,
  loaded: false,
  error: false,
};

const Camera = ({ className, src: defaultSrc, controls = true }) => {
  const imgRef = useRef();
  const [imgState, setImgState] = useState(DEFAULT_IMG_STATE);

  const { ref, image, state, error, capture, reset, onUserMedia, onUserMediaError } = useCamera();

  const src = defaultSrc || image;

  const cameraClassName = [styles.camera, className].filter((c) => !!c).join(' ');

  useEffect(() => {
    if (!imgRef.current || !defaultSrc) {
      setImgState(DEFAULT_IMG_STATE);
      return;
    }

    setImgState({
      loading: true,
      loaded: false,
      error: false,
    });

    imgRef.current.onload = function () {
      setImgState({
        loading: false,
        loaded: true,
        error: false,
      });
    };
  }, [defaultSrc]);

  // Construct props to use as data attributes that allow the ability to target different
  // loading states with styling

  const imgStateProps = {};

  Object.keys(imgState).forEach((stateKey) => {
    imgStateProps[`data-img-${stateKey}`] = imgState[stateKey];
  });

  return (
    <div className={cameraClassName}>
      <div
        className={styles.stageContainer}
        style={{
          aspectRatio: `${CAMERA_WIDTH} / ${CAMERA_HEIGHT}`,
        }}
      >
        <div
          className={styles.stage}
          data-is-active-webcam={state.active}
          data-is-error-webcam={state.error}
          {...imgStateProps}
        >
          {src && <img ref={imgRef} src={src} alt="Webcam Photo" />}
          {!src && !state.error && (
            <Webcam
              ref={ref}
              videoConstraints={videoConstraints}
              width={CAMERA_WIDTH}
              height={CAMERA_HEIGHT}
              onUserMedia={onUserMedia}
              onUserMediaError={onUserMediaError}
            />
          )}
          {state.error && error && (
            <div className={styles.stageError}>
              <p className={styles.stageErrorName}>
                <strong>{error}</strong>
              </p>
              <p className={styles.stageErrorMessage}>
                Uh oh, we&apos;re having trouble loading your camera. Try seeing if your browser is blocking it
                otherwise try another browser.
              </p>
            </div>
          )}
        </div>
      </div>

      {controls && (
        <div className={styles.controls}>
          <ul>
            <li>
              <Button onClick={capture}>Capture photo</Button>
            </li>
            <li>
              <Button onClick={reset} color="red">
                Reset
              </Button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Camera;
