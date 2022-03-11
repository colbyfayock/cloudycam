import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';

import Button from '@components/Button';

import { useCamera } from '@hooks/useCamera';

import styles from './Camera.module.scss';

const minWidth = 720;
const minHeight = 720;
const aspectRatio = minWidth / minHeight;

const videoConstraints = {
  width: {
    min: minWidth
  },
  height: {
    min: minHeight
  },
  aspectRatio
};

const Camera = ({ className, src: defaultSrc, controls = true }) => {
  const { ref, image, isActive, capture, reset, onUserMedia } = useCamera();

  const src = defaultSrc || image;

  const cameraClassName = [styles.camera, className].filter(c => !!c).join(' ');

  return (
    <div className={cameraClassName}>

      <div className={styles.stageContainer} style={{
        aspectRatio: `${minWidth} / ${minHeight}`
      }}>
        <div className={styles.stage} data-is-active-webcam={isActive}>
          { src && (
            <img src={src} />
          )}
          {!src && (
            <Webcam
              ref={ref}
              videoConstraints={videoConstraints}
              width={minWidth}
              height={minHeight}
              onUserMedia={onUserMedia}
            />
          )}
        </div>
      </div>

      {controls && (
        <div className={styles.controls}>
          <ul>
            <li>
              <Button onClick={capture}>
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
  )
}

export default Camera;