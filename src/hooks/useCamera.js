import { useState, createContext, useContext, useEffect } from 'react';

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
  const [image, setImage] = useState();

  function updateCapture(src) {
    setImage(src);
  }

  function resetCapture() {
    setImage(undefined);
  }

  return {
    updateCapture,
    resetCapture,
    image
  }
}

export function useCamera() {
  const camera = useContext(CameraContext);
  return camera;
}