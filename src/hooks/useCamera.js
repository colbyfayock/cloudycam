import { useState, createContext, useContext, useRef } from 'react';
import { createHashFromString } from '@lib/util';

export const CameraContext = createContext();

export const CameraProvider = ({ children }) => {
  const camera = useCameraState();
  return <CameraContext.Provider value={camera}>{children}</CameraContext.Provider>;
};

export function useCameraState() {
  const ref = useRef();
  const [image, setImage] = useState();
  const [hash, setHash] = useState();
  const [isActive, setIsActive] = useState(false);

  /**
   * capture
   */

  async function capture() {
    const imageSrc = await ref.current.getScreenshot();

    if (!imageSrc) return null;

    const imageHash = await createHashFromString(imageSrc);

    setImage(imageSrc);
    setHash(imageHash);
    setIsActive(false);
  }

  /**
   * capture
   */

  function reset() {
    setImage(undefined);
    setHash(undefined);
  }

  /**
   * onUserMedia
   */

  function onUserMedia() {
    setIsActive(true);
  }

  return {
    ref,
    image,
    hash,
    isActive,
    capture,
    reset,
    onUserMedia,
  };
}

export function useCamera() {
  const camera = useContext(CameraContext);
  return camera;
}
