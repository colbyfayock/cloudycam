import { CAMERA_WIDTH, CAMERA_HEIGHT, CAMERA_CAPTURE_TYPE, CAMERA_CAPTURE_QUALITY } from '@data/camera';

/**
 * VIDEO_CONSTRAINT_FALLBACKS
 * @description Constraints are attempted in order. Only `ideal` values are used so browsers
 * pick the closest supported mode instead of rejecting the request. Some devices (older iOS,
 * virtual cameras, some Firefox builds) still throw OverconstrainedError for perfectly valid
 * ideal constraints, so we progressively relax down to "any camera".
 */

export const VIDEO_CONSTRAINT_FALLBACKS = [
  {
    facingMode: 'user',
    width: { ideal: CAMERA_WIDTH },
    height: { ideal: CAMERA_HEIGHT },
    aspectRatio: { ideal: CAMERA_WIDTH / CAMERA_HEIGHT },
  },
  {
    facingMode: 'user',
  },
  true,
];

const CONSTRAINT_ERRORS = ['OverconstrainedError', 'ConstraintNotSatisfiedError'];

export const MEDIA_ERROR_MESSAGES = {
  NotAllowedError: 'Camera access was blocked. Allow camera permissions for this site in your browser settings.',
  PermissionDeniedError: 'Camera access was blocked. Allow camera permissions for this site in your browser settings.',
  NotFoundError: "We couldn't find a camera on this device.",
  DevicesNotFoundError: "We couldn't find a camera on this device.",
  NotReadableError: 'Your camera is being used by another app or tab. Close it and try again.',
  TrackStartError: 'Your camera is being used by another app or tab. Close it and try again.',
  OverconstrainedError: "Your camera doesn't support the required video settings.",
  AbortError: 'The camera stopped unexpectedly. Try again.',
  TrackEndedError: 'The camera was disconnected. Try again.',
  InsecureContextError: 'Camera access requires a secure connection. Open this page over https or on localhost.',
  NotSupportedError:
    "This browser doesn't support camera access. Try a recent version of Chrome, Safari, Firefox, or Edge.",
};

const DEFAULT_ERROR_MESSAGE =
  "Uh oh, we're having trouble loading your camera. Try seeing if your browser is blocking it otherwise try another browser.";

/**
 * getMediaSupportError
 * @description Returns an error name if the current environment can't access the camera
 */

export function getMediaSupportError() {
  if (typeof window === 'undefined') return null;
  if (window.isSecureContext === false) return 'InsecureContextError';
  if (typeof navigator.mediaDevices?.getUserMedia !== 'function') return 'NotSupportedError';
  return null;
}

/**
 * normalizeMediaError
 * @description getUserMedia rejects with DOMExceptions in modern browsers, but older engines
 * and our own code can produce strings or plain Errors. Normalize to { name, message }.
 */

export function normalizeMediaError(error) {
  const name = (typeof error === 'string' ? error : error?.name) || 'Error';
  return {
    name,
    message: MEDIA_ERROR_MESSAGES[name] || DEFAULT_ERROR_MESSAGE,
  };
}

/**
 * requestVideoStream
 */

export async function requestVideoStream(fallbacks = VIDEO_CONSTRAINT_FALLBACKS) {
  let lastError;

  for (const video of fallbacks) {
    try {
      return await navigator.mediaDevices.getUserMedia({ video, audio: false });
    } catch (error) {
      lastError = error;
      if (!CONSTRAINT_ERRORS.includes(error?.name)) throw error;
    }
  }

  throw lastError;
}

/**
 * stopMediaStream
 */

export function stopMediaStream(stream) {
  stream?.getTracks().forEach((track) => track.stop());
}

/**
 * captureVideoFrame
 * @description Draws the current video frame to a canvas, center-cropping to the target aspect
 * ratio so the capture matches the `object-fit: cover` preview regardless of the camera's
 * native resolution (most webcams are 16:9 or 4:3, not square).
 */

export function captureVideoFrame(
  video,
  { width = CAMERA_WIDTH, height = CAMERA_HEIGHT, type = CAMERA_CAPTURE_TYPE, quality = CAMERA_CAPTURE_QUALITY } = {},
) {
  if (!video || video.readyState < 2 || !video.videoWidth || !video.videoHeight) return null;

  const targetRatio = width / height;
  const sourceRatio = video.videoWidth / video.videoHeight;

  let sourceWidth = video.videoWidth;
  let sourceHeight = video.videoHeight;

  if (sourceRatio > targetRatio) {
    sourceWidth = video.videoHeight * targetRatio;
  } else {
    sourceHeight = video.videoWidth / targetRatio;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) return null;

  context.drawImage(
    video,
    (video.videoWidth - sourceWidth) / 2,
    (video.videoHeight - sourceHeight) / 2,
    sourceWidth,
    sourceHeight,
    0,
    0,
    width,
    height,
  );

  return canvas.toDataURL(type, quality);
}
