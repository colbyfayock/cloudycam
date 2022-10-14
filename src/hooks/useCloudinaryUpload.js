import { useState, useEffect } from 'react';

import { uploadToCloudinary, checkStatus, getInfoStateFromResource } from '@lib/cloudinary';

const DEFAULT_STATE = {
  loading: false,
  loaded: false,
  error: false,
};

const DEFAULT_OPTIONS = {
  detection: 'adv_face',
};

// TODO: make status check cancellable to trigger from outside

export function useCloudinaryUpload(options) {
  const { image, publicId } = options;

  const [data, setData] = useState();
  const [error, setError] = useState();
  const [state, setState] = useState(DEFAULT_STATE);

  /**
   * reset
   */

  function reset() {
    setData(undefined);
    setError(undefined);
    setState(DEFAULT_STATE);
  }

  /**
   * upload
   */

  async function upload({ image: uploadImage, publicId: uploadPublicId, context: uploadContext }) {
    reset();

    setState({
      loading: true,
      loaded: false,
      error: false,
    });

    try {
      let results = await uploadToCloudinary(uploadImage, {
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
      });

      const infoState = getInfoStateFromResource(results);

      if (Array.isArray(infoState) && infoState.includes('pending')) {
        const resource = await checkStatus(results);
        const finishedInfoState = getInfoStateFromResource(resource);

        if (!Array.isArray(finishedInfoState) || !finishedInfoState.includes('complete')) {
          throw new Error('Failed to complete update job');
        }

        results = resource;
      }

      setData(results);

      setState({
        loading: false,
        loaded: true,
        error: false,
      });

      return results;
    } catch (e) {
      setError(e.message);

      setState({
        loading: false,
        loaded: false,
        error: true,
      });

      throw e;
    }
  }

  useEffect(() => {
    if (!image || !publicId) {
      setState(DEFAULT_STATE);
      return;
    }
    upload({ image, publicId });
  }, [image, publicId]);

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
