import { useEffect, useState } from 'react';

const DEFAULT_IMG_STATE = {
  loading: false,
  loaded: false,
  error: false,
};

export function useImageEvents({ src, ref }) {
  const [state, setState] = useState(DEFAULT_IMG_STATE);

  useEffect(() => {
    if (!ref.current) {
      setState(DEFAULT_IMG_STATE);
      return;
    }

    setState({
      loading: true,
      loaded: false,
      error: false,
    });

    ref.current.onload = function () {
      setState({
        loading: false,
        loaded: true,
        error: false,
      });
    };
  }, [src, ref]);

  return { ...state };
}
