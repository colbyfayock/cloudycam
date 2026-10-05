export const CAMERA_WIDTH = 720;
export const CAMERA_HEIGHT = 720;

// JPEG keeps captures well under the upload API's 2mb body limit and is encoded
// consistently across browsers (Safari < 14 silently ignores image/webp)

export const CAMERA_CAPTURE_TYPE = 'image/jpeg';
export const CAMERA_CAPTURE_QUALITY = 0.92;
