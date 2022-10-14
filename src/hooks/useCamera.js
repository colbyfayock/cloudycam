import { useState, createContext, useContext, useRef } from 'react';
import { createHashFromString } from '@lib/util';

const DEFAULT_STATE = {
  active: false,
  error: false,
};

export const CameraContext = createContext();

export const CameraProvider = ({ children }) => {
  const camera = useCameraState();
  return <CameraContext.Provider value={camera}>{children}</CameraContext.Provider>;
};

export function useCameraState() {
  const ref = useRef();
  const [image, setImage] = useState();
  const [hash, setHash] = useState();
  const [state, setState] = useState(DEFAULT_STATE);
  const [error, setError] = useState();

  /**
   * capture
   */

  async function capture() {
    const imageData = await ref.current.getScreenshot();

    if (!imageData) return null;

    const imageHash = await createHashFromString(imageData);

    setImage(imageData);
    setHash(imageHash);
    setState((prev) => ({
      ...prev,
      active: false,
    }));

    return {
      data: imageData,
      hash: imageHash,
    };
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
    setState((prev) => ({
      ...prev,
      active: true,
      error: false,
    }));
  }

  /**
   * onUserMediaError
   */

  function onUserMediaError(error) {
    setState((prev) => ({
      ...prev,
      active: false,
      error: true,
    }));
    setError(error.name);
  }

  return {
    ref,
    image,
    hash,
    state,
    error,
    capture,
    reset,
    onUserMedia,
    onUserMediaError,
  };
}

export function useCamera() {
  const camera = useContext(CameraContext);
  return camera;
}
