import { useState, createContext, useContext, useRef, useCallback, useEffect, useSyncExternalStore } from 'react';
import { createHashFromString } from '@lib/util';
import {
  captureVideoFrame,
  getMediaSupportError,
  normalizeMediaError,
  requestVideoStream,
  stopMediaStream,
} from '@lib/media';

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
  const ref = useRef(null);
  const [image, setImage] = useState();
  const [hash, setHash] = useState();
  const [state, setState] = useState(DEFAULT_STATE);
  const [error, setError] = useState();

  /**
   * capture
   */

  const capture = useCallback(async () => {
    const imageData = captureVideoFrame(ref.current);

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
  }, []);

  /**
   * reset
   */

  const reset = useCallback(() => {
    setImage(undefined);
    setHash(undefined);
  }, []);

  /**
   * onUserMedia
   * @description The video element has frames available and is ready to capture
   */

  const onUserMedia = useCallback(() => {
    setState({
      active: true,
      error: false,
    });
    setError(undefined);
  }, []);

  /**
   * onUserMediaStop
   */

  const onUserMediaStop = useCallback(() => {
    setState((prev) => ({
      ...prev,
      active: false,
    }));
  }, []);

  /**
   * onUserMediaError
   */

  const onUserMediaError = useCallback((mediaError) => {
    setState({
      active: false,
      error: true,
    });
    setError(normalizeMediaError(mediaError));
  }, []);

  return {
    ref,
    image,
    hash,
    state,
    error,
    capture,
    reset,
    onUserMedia,
    onUserMediaStop,
    onUserMediaError,
  };
}

export function useCamera() {
  const camera = useContext(CameraContext);
  return camera;
}

const subscribeNoop = () => () => {};

/**
 * useCameraStream
 * @description Owns the MediaStream lifecycle for the shared video ref: requests the camera with
 * constraint fallbacks, attaches it to the video element, recovers from ended tracks (device
 * unplugged, iOS Safari backgrounding the page), and always stops every track on unmount so the
 * camera light turns off. Safe under StrictMode's double-invoked effects.
 */

export function useCameraStream({ enabled = true } = {}) {
  const { ref, onUserMediaError, onUserMediaStop } = useCamera();
  const [attempt, setAttempt] = useState(0);

  // Read on the client only so server and hydration renders match

  const supportError = useSyncExternalStore(subscribeNoop, getMediaSupportError, () => null);

  const retry = useCallback(() => setAttempt((prev) => prev + 1), []);

  useEffect(() => {
    if (!enabled || supportError) return;

    const video = ref.current;
    let cancelled = false;
    let stream;

    function handleTrackEnded() {
      if (!cancelled) onUserMediaError('TrackEndedError');
    }

    function handleVisibilityChange() {
      const hasEndedTrack = stream?.getVideoTracks().some((track) => track.readyState === 'ended');
      if (document.visibilityState === 'visible' && hasEndedTrack) retry();
    }

    requestVideoStream()
      .then(async (mediaStream) => {
        if (cancelled) {
          stopMediaStream(mediaStream);
          return;
        }

        stream = mediaStream;
        stream.getVideoTracks().forEach((track) => track.addEventListener('ended', handleTrackEnded));

        if (!video) return;

        video.srcObject = stream;

        // Safari doesn't reliably honor autoplay when srcObject is set after mount

        try {
          await video.play();
        } catch (e) {
          // AbortError fires when a newer stream replaces this one mid-play, which is expected
          if (!cancelled && e?.name !== 'AbortError') onUserMediaError(e);
        }
      })
      .catch((e) => {
        if (!cancelled) onUserMediaError(e);
      });

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stream?.getVideoTracks().forEach((track) => track.removeEventListener('ended', handleTrackEnded));
      stopMediaStream(stream);
      if (video) video.srcObject = null;
      onUserMediaStop();
    };
  }, [enabled, supportError, attempt, ref, retry, onUserMediaError, onUserMediaStop]);

  return {
    supportError: supportError && normalizeMediaError(supportError),
    retry,
  };
}
