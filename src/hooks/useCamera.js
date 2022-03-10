import { useState, createContext, useContext, useEffect, useRef } from 'react';

export const CameraContext = createContext();

export const CameraProvider = ({ children }) => {
  const camera = useCameraState();
  return (
    <CameraContext.Provider value={camera}>
      { children }
    </CameraContext.Provider>
  )
}

export function useCameraState() {
  const ref = useRef();
  const [image, setImage] = useState();

  /**
   * capture
   */

  function capture() {
    const imageSrc = ref.current.getScreenshot();
    setImage(imageSrc);
  }

  /**
   * capture
   */

  function reset() {
    setImage(undefined);
  }

  return {
    ref,
    image,
    capture,
    reset,
  }
}

export function useCamera() {
  const camera = useContext(CameraContext);
  return camera;
}