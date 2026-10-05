import { useState, useCallback } from 'react';

import Button from '@components/Button';

import { useCamera, useCameraStream } from '@hooks/useCamera';

import { CAMERA_WIDTH, CAMERA_HEIGHT } from '@data/camera';

import styles from './Camera.module.scss';

const Camera = ({ className, src: defaultSrc, controls = true }) => {
  const { ref, image, state, error: streamError, capture, reset, onUserMedia } = useCamera();

  const src = defaultSrc || image;

  // Only hold the camera open while we're actually showing the live preview

  const { supportError, retry } = useCameraStream({ enabled: !src });

  const error = supportError || (state.error && streamError);

  // Track which src has finished loading rather than toggling a boolean in an effect, so a
  // cached image that loads before hydration can't leave the loading animation stuck on

  const [loadedSrc, setLoadedSrc] = useState();
  const imgLoading = !!src && loadedSrc !== src;

  const imgRef = useCallback((img) => {
    if (img?.complete && img.naturalWidth > 0) setLoadedSrc(img.getAttribute('src'));
  }, []);

  const cameraClassName = [styles.camera, className].filter((c) => !!c).join(' ');

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
          data-is-error-webcam={!!error}
          data-img-loading={imgLoading}
          data-img-loaded={!!src && !imgLoading}
        >
          {src && (
            <img
              ref={imgRef}
              src={src}
              alt="Webcam Photo"
              onLoad={(e) => setLoadedSrc(e.currentTarget.getAttribute('src'))}
              onError={(e) => setLoadedSrc(e.currentTarget.getAttribute('src'))}
            />
          )}
          {!src && (
            <video
              ref={ref}
              className={styles.video}
              width={CAMERA_WIDTH}
              height={CAMERA_HEIGHT}
              onLoadedData={onUserMedia}
              autoPlay
              muted
              playsInline
              disablePictureInPicture
            />
          )}
          {!src && error && (
            <div className={styles.stageError} role="alert">
              <p className={styles.stageErrorName}>
                <strong>{error.name}</strong>
              </p>
              <p className={styles.stageErrorMessage}>{error.message}</p>
              {!supportError && (
                <p>
                  <Button onClick={retry} color="cloudinary-blue" shape="capsule">
                    Try again
                  </Button>
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {controls && (
        <div className={styles.controls}>
          <ul>
            <li>
              <Button onClick={capture} disabled={!state.active}>
                Capture photo
              </Button>
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
