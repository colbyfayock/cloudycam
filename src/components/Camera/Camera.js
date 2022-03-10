import { useState, useRef } from 'react';
import Webcam from 'react-webcam';

import Button from '@components/Button';

import { useCamera } from '@hooks/useCamera';

import styles from './Camera.module.scss';


const Camera = ({ className, src: defaultSrc }) => {
  const webcamRef = useRef(null);

  const { image, updateCapture, resetCapture } = useCamera();

  const src = defaultSrc || image;

  const cameraClassName = [styles.camera, className].filter(c => !!c).join(' ');

  /**
   * handleOnCapture
   */

  function handleOnCapture() {
    const imageSrc = webcamRef.current.getScreenshot();
    updateCapture(imageSrc);
  }

  return (
    <div className={cameraClassName}>

      <div className={styles.stageContainer}>
        <div className={styles.stage}>
          { src && (
            <img src={src} />
          )}
          {!src && (
            <Webcam ref={webcamRef} />
          )}
        </div>
      </div>

      {/* <div className={styles.controls}>
        <ul>
          <li>
            <Button onClick={handleOnCapture}>
              Capture photo
            </Button>
          </li>
          <li>
            <Button onClick={resetCapture} color="red">
              Reset
            </Button>
          </li>
        </ul>
      </div> */}
    </div>
  )
}

export default Camera;