import { useState, useEffect, useEffectEvent, useRef, useCallback } from 'react';

import { uploadToCloudinary, checkStatus, getInfoStateFromResource } from '@lib/cloudinary';
import { CLOUDINARY_ADV_FACE_ENABLED } from '@data/cloudinary';

const DEFAULT_STATE = {
  loading: false,
  loaded: false,
  error: false,
};

// Advanced Facial Attribute Detection is a paid add-on. Without it, uploads requesting
// detection fail outright, so only ask for it when the account has it enabled.

const DEFAULT_OPTIONS = CLOUDINARY_ADV_FACE_ENABLED
  ? {
      detection: 'adv_face',
    }
  : {};

export function useCloudinaryUpload(options) {
  const { image, publicId } = options;

  const [data, setData] = useState();
  const [error, setError] = useState();
  const [state, setState] = useState(DEFAULT_STATE);

  // Each upload gets its own controller so that a reset, a new upload, or unmounting can
  // cancel in-flight requests and the background removal status polling. Without this, a
  // slow response could land after "Start Over" and repopulate the old photo.

  const controllerRef = useRef();

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = undefined;
  }, []);

  /**
   * reset
   */

  const reset = useCallback(() => {
    cancel();
    setData(undefined);
    setError(undefined);
    setState(DEFAULT_STATE);
  }, [cancel]);

  /**
   * upload
   */

  async function upload({ image: uploadImage, publicId: uploadPublicId, context: uploadContext }) {
    reset();

    const controller = new AbortController();
    const { signal } = controller;
    controllerRef.current = controller;

    setState({
      loading: true,
      loaded: false,
      error: false,
    });

    try {
      let results = await uploadToCloudinary(
        uploadImage,
        {
          tags: options.tags,
          context: {
            ...options.context,
            ...uploadContext,
          },
          options: {
            ...DEFAULT_OPTIONS,
            public_id: uploadPublicId,
            ...options.options,
          },
          transformation: options.transformation,
        },
        { signal },
      );

      const infoState = getInfoStateFromResource(results);

      if (Array.isArray(infoState) && infoState.includes('pending')) {
        const resource = await checkStatus(results, { signal });
        const finishedInfoState = getInfoStateFromResource(resource);

        if (!Array.isArray(finishedInfoState) || !finishedInfoState.includes('complete')) {
          throw new Error('Failed to complete update job');
        }

        results = resource;
      }

      if (signal.aborted) return;

      setData(results);

      setState({
        loading: false,
        loaded: true,
        error: false,
      });

      return results;
    } catch (e) {
      if (signal.aborted) return;

      setError(e.message);

      setState({
        loading: false,
        loaded: false,
        error: true,
      });

      throw e;
    }
  }

  const uploadFromOptions = useEffectEvent(() => {
    upload({ image, publicId }).catch(() => {
      // Error state is already captured above
    });
  });

  // Kicking off an upload synchronizes with an external system (the upload API), which
  // is what effects are for, even though it sets loading state synchronously

  useEffect(() => {
    if (!image || !publicId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    uploadFromOptions();
    return cancel;
  }, [image, publicId, cancel]);

  useEffect(() => cancel, [cancel]);

  return {
    image,
    publicId,
    data,
    error,
    state,
    reset,
    upload,
  };
}
